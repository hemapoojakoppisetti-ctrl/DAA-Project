import React, { useState, useEffect, useCallback, FormEvent } from 'react';
import { getServices, createService, updateService, deleteService } from '../../utils/api';
import { Modal, ConfirmDialog, PageHeader, EmptyState, Spinner } from '../../components/shared/UI';
import toast from 'react-hot-toast';
import { Plus, Edit2, Trash2, Globe } from 'lucide-react';

/* ================= TYPES ================= */

type Category =
  | 'student'
  | 'exam'
  | 'certificate'
  | 'verification'
  | 'payment'
  | 'result';

interface Service {
  id: string;
  name: string;
  description?: string;
  url?: string;
  icon?: string;
  category: Category;
  sortOrder: number;
}

type FormState = {
  name: string;
  description: string;
  url: string;
  icon?: string;
  category: Category;
  sortOrder: number | string;
};

/* ================= CONSTANTS ================= */

const emptyForm: FormState = {
  name: '',
  description: '',
  url: '',
  icon: 'Globe',
  category: 'student',
  sortOrder: 0
};

/* ================= COMPONENT ================= */

export default function AdminServices() {

  const [data, setData] = useState<Service[]>([]);
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
      const res = await getServices();
      setData(res.data);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const openAdd = () => {
    setForm(emptyForm);
    setEditId(null);
    setShowModal(true);
  };

  const openEdit = (item: Service) => {
    setForm({
      ...item,
      description: item.description || '',
      url: item.url || ''
    });
    setEditId(item.id);
    setShowModal(true);
  };

  const handleSave = async (e: FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      const payload = {
        ...form,
        sortOrder: +form.sortOrder
      };

      if (editId) {
        await updateService(editId, payload);
      } else {
        await createService(payload);
      }

      toast.success(editId ? 'Updated!' : 'Service added!');
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
        await deleteService(deleteId);
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
        title="Online Services"
        subtitle={`${data.length} services`}
        action={
          <button onClick={openAdd} className="btn-primary">
            <Plus className="w-4 h-4" />
            Add Service
          </button>
        }
      />

      <div className="card">
        {loading ? (
          <Spinner />
        ) : !data.length ? (
          <EmptyState message="No services configured" />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

            {data.map(item => (
              <div
                key={item.id}
                className="flex items-center gap-3 p-4 rounded-xl border border-gray-100 hover:border-primary-200 transition-all group"
              >

                <div className="w-10 h-10 bg-primary-100 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Globe className="w-5 h-5 text-primary-600" />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="font-semibold text-sm text-gray-900">
                    {item.name}
                  </div>

                  <div className="text-xs text-gray-500 line-clamp-1">
                    {item.description}
                  </div>

                  <div className="text-xs text-primary-600 mt-0.5 truncate">
                    {item.url || 'No URL'}
                  </div>
                </div>

                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">

                  <button
                    onClick={() => openEdit(item)}
                    className="p-1.5 rounded-lg hover:bg-primary-50 text-gray-400 hover:text-primary-600 transition-colors"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>

                  <button
                    onClick={() => {
                      setDeleteId(item.id);
                      setShowConfirm(true);
                    }}
                    className="p-1.5 rounded-lg hover:bg-red-50 text-gray-400 hover:text-red-500 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>

                </div>

              </div>
            ))}

          </div>
        )}
      </div>

      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title={editId ? 'Edit Service' : 'Add Service'}
      >
        <form onSubmit={handleSave} className="space-y-4">

          <div>
            <label className="label">Service Name *</label>
            <input
              className="input"
              value={form.name}
              onChange={e => set('name', e.target.value)}
              required
            />
          </div>

          <div>
            <label className="label">Description</label>
            <textarea
              className="input resize-none"
              rows={2}
              value={form.description}
              onChange={e => set('description', e.target.value)}
            />
          </div>

          <div>
            <label className="label">URL</label>
            <input
              type="url"
              className="input"
              value={form.url}
              onChange={e => set('url', e.target.value)}
              placeholder="https://..."
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
                {['student', 'exam', 'certificate', 'verification', 'payment', 'result'].map(c => (
                  <option key={c}>{c}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="label">Sort Order</label>
              <input
                type="number"
                className="input"
                value={form.sortOrder}
                onChange={e => set('sortOrder', e.target.value)}
              />
            </div>

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
              {saving ? 'Saving...' : editId ? 'Update' : 'Add'}
            </button>
          </div>

        </form>
      </Modal>

      <ConfirmDialog
        isOpen={showConfirm}
        onClose={() => setShowConfirm(false)}
        onConfirm={handleDelete}
        title="Delete Service"
        message="Remove this service?"
      />

    </div>
  );
}