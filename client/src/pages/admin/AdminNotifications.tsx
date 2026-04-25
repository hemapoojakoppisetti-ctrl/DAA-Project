import React, { useState, useEffect, useCallback, FormEvent } from 'react';
import { getNotifications, createNotification, updateNotification, deleteNotification } from '../../utils/api';
import { Modal, ConfirmDialog, PageHeader, EmptyState, Spinner, Pagination } from '../../components/shared/UI';
import toast from 'react-hot-toast';
import { Plus, Edit2, Trash2, Bell, AlertCircle, Paperclip } from 'lucide-react';
import { format } from 'date-fns';

/* ================= TYPES ================= */

type Category =
  | 'general'
  | 'exam'
  | 'admission'
  | 'fees'
  | 'event'
  | 'result'
  | 'holiday';

interface Notification {
  id: string;
  title: string;
  description?: string;
  category: Category;
  isUrgent: boolean;
  expiresAt?: string;
  publishedAt: string;
  attachment?: string;
}

interface ApiResponse {
  data: {
    data: Notification[];
    total: number;
    totalPages: number;
  };
}

type FormState = {
  title: string;
  description: string;
  category: Category;
  isUrgent: boolean;
  expiresAt: string;
  attachment?: File|string;
};

/* ================= CONSTANTS ================= */

const CATEGORIES: Category[] = [
  'general',
  'exam',
  'admission',
  'fees',
  'event',
  'result',
  'holiday'
];

const emptyForm: FormState = {
  title: '',
  description: '',
  category: 'general',
  isUrgent: false,
  expiresAt: ''
};

const CAT_COLORS: Record<string, string> = {
  exam: 'badge-orange',
  general: 'badge-gray',
  fees: 'badge-red',
  event: 'badge-blue',
  admission: 'badge-green',
  result: 'badge-orange',
  holiday: 'badge-green'
};

/* ================= COMPONENT ================= */

export default function AdminNotifications() {

  const [data, setData] = useState<Notification[]>([]);
  const [total, setTotal] = useState<number>(0);
  const [page, setPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);

  const [loading, setLoading] = useState<boolean>(true);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [showConfirm, setShowConfirm] = useState<boolean>(false);

  const [form, setForm] = useState<FormState>(emptyForm);
  const [editId, setEditId] = useState<string | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const [saving, setSaving] = useState<boolean>(false);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res: ApiResponse = await getNotifications({ page, limit: 10 });
      setData(res.data.data);
      setTotal(res.data.total);
      setTotalPages(res.data.totalPages);
    } finally {
      setLoading(false);
    }
  }, [page]);

  useEffect(() => {
    load();
  }, [load]);

  const openAdd = () => {
    setForm(emptyForm);
    setEditId(null);
    setShowModal(true);
  };

  const openEdit = (item: Notification) => {
    setForm({
      ...item,
      expiresAt: item.expiresAt ? item.expiresAt.slice(0, 10) : '',
      description: item.description || ''
    });
    setEditId(item.id);
    setShowModal(true);
  };

  const handleSave = async (e: FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const fd = new FormData();

      Object.entries(form).forEach(([k, v]) => {
        if (v !== undefined && v !== '') {
          fd.append(k, v as any);
        }
      });

      if (editId) {
        await updateNotification(editId, fd);
      } else {
        await createNotification(fd);
      }

      toast.success(editId ? 'Updated!' : 'Notification posted!');
      setShowModal(false);
      load();

    } catch (err: any) {
      toast.error(err?.response?.data?.error || 'Error');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    try {
      if (deleteId) {
        await deleteNotification(deleteId);
      }
      toast.success('Deleted!');
      setShowConfirm(false);
      load();
    } catch {
      toast.error('Error');
    }
  };

  const set = (k: keyof FormState, v: any) =>
    setForm(f => ({ ...f, [k]: v }));

  return (
    <div className="fade-in">

      <PageHeader
        title="Notifications"
        subtitle={`${total} notifications`}
        action={
          <button onClick={openAdd} className="btn-primary">
            <Plus className="w-4 h-4" />
            Add Notification
          </button>
        }
      />

      <div className="card space-y-3">
        {loading ? (
          <Spinner />
        ) : !data.length ? (
          <EmptyState message="No notifications" />
        ) : (
          <>
            {data.map(item => (
              <div
                key={item.id}
                className="flex items-start gap-4 p-4 rounded-xl border border-gray-100 hover:border-primary-200 hover:bg-primary-50/20 transition-all group"
              >
                <div className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 ${item.isUrgent ? 'bg-red-100' : 'bg-primary-100'}`}>
                  {item.isUrgent
                    ? <AlertCircle className="w-5 h-5 text-red-600" />
                    : <Bell className="w-5 h-5 text-primary-600" />}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h4 className="font-semibold text-sm text-gray-900 line-clamp-1">
                      {item.title}
                    </h4>

                    <span className={CAT_COLORS[item.category] || 'badge-gray'}>
                      {item.category}
                    </span>

                    {item.isUrgent && <span className="badge-red">Urgent</span>}

                    {item.attachment && (
                      <Paperclip className="w-3.5 h-3.5 text-gray-400" />
                    )}
                  </div>

                  <p className="text-xs text-gray-500 mt-0.5 line-clamp-2">
                    {item.description}
                  </p>

                  <p className="text-xs text-gray-400 mt-1">
                    {format(new Date(item.publishedAt), 'dd MMM yyyy, hh:mm a')}
                  </p>
                </div>

                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0">
                  <button
                    onClick={() => openEdit(item)}
                    className="p-1.5 rounded-lg hover:bg-white text-gray-400 hover:text-primary-600 transition-colors"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>

                  <button
                    onClick={() => {
                      setDeleteId(item.id);
                      setShowConfirm(true);
                    }}
                    className="p-1.5 rounded-lg hover:bg-white text-gray-400 hover:text-red-500 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}

            <Pagination
              page={page}
              totalPages={totalPages}
              onPage={setPage}
            />
          </>
        )}
      </div>

      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title={editId ? 'Edit Notification' : 'Post Notification'}
      >
        <form onSubmit={handleSave} className="space-y-4">

          <div>
            <label className="label">Title *</label>
            <input
              className="input"
              value={form.title}
              onChange={e => set('title', e.target.value)}
              required
            />
          </div>

          <div>
            <label className="label">Description</label>
            <textarea
              className="input resize-none"
              rows={3}
              value={form.description}
              onChange={e => set('description', e.target.value)}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="label">Category</label>
              <select
                className="input"
                value={form.category}
                onChange={e => set('category', e.target.value as Category)}
              >
                {CATEGORIES.map(c => (
                  <option key={c}>{c}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="label">Expires At</label>
              <input
                type="date"
                className="input"
                value={form.expiresAt}
                onChange={e => set('expiresAt', e.target.value)}
              />
            </div>
          </div>

          <div>
            <label className="label">Attachment (PDF/Image)</label>
            <input
              type="file"
              className="input"
              onChange={e =>
                set('attachment', e.target.files?.[0])
              }
            />
          </div>

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="urgent"
              checked={form.isUrgent}
              onChange={e => set('isUrgent', e.target.checked)}
              className="rounded"
            />
            <label htmlFor="urgent" className="text-sm font-semibold text-gray-700">
              Mark as Urgent
            </label>
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={() => setShowModal(false)}
              className="btn-secondary"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={saving}
              className="btn-primary"
            >
              {saving ? 'Posting...' : editId ? 'Update' : 'Post'}
            </button>
          </div>

        </form>
      </Modal>

      <ConfirmDialog
        isOpen={showConfirm}
        onClose={() => setShowConfirm(false)}
        onConfirm={handleDelete}
        title="Delete Notification"
        message="Remove this notification?"
      />

    </div>
  );
}