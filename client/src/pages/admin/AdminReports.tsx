import React, { useState, useEffect, useCallback, FormEvent } from 'react';
import { getReports, createReport, updateReport, deleteReport } from '../../utils/api';
import { Modal, ConfirmDialog, PageHeader, EmptyState, Spinner } from '../../components/shared/UI';
import toast from 'react-hot-toast';
import { Plus, Edit2, Trash2, FileText, ExternalLink } from 'lucide-react';

/* ================= TYPES ================= */

type ReportType =
  | 'audit'
  | 'naac'
  | 'nba'
  | 'aqar'
  | 'iqac'
  | 'annual';

interface Report {
  id: string;
  title: string;
  description?: string;
  type: ReportType;
  year?: string;
  isPublic: boolean;
  filePath?: string;
}

type FormState = {
  title: string;
  description: string;
  type: ReportType;
  year: string;
  isPublic: boolean;
  file?: File;
};

/* ================= CONSTANTS ================= */

const TYPES: ReportType[] = [
  'audit',
  'naac',
  'nba',
  'aqar',
  'iqac',
  'annual'
];

const emptyForm: FormState = {
  title: '',
  description: '',
  type: 'audit',
  year: '',
  isPublic: true
};

/* ================= COMPONENT ================= */

export default function AdminReports() {

  const [data, setData] = useState<Report[]>([]);
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
      const res = await getReports();
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

  const openEdit = (item: Report) => {
    setForm({
      ...item,
      description: item.description || '',
      year: item.year || ''
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
        await updateReport(editId, fd);
      } else {
        await createReport(fd);
      }

      toast.success(editId ? 'Updated!' : 'Report added!');
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
        await deleteReport(deleteId);
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

  const typeColors: Record<string, string> = {
    naac: 'badge-blue',
    nba: 'badge-green',
    aqar: 'badge-orange',
    audit: 'badge-gray',
    iqac: 'badge-red',
    annual: 'badge-gray'
  };

  return (
    <div className="fade-in">

      <PageHeader
        title="Reports"
        subtitle={`${data.length} reports`}
        action={
          <button onClick={openAdd} className="btn-primary">
            <Plus className="w-4 h-4" />
            Add Report
          </button>
        }
      />

      <div className="card">
        {loading ? (
          <Spinner />
        ) : !data.length ? (
          <EmptyState message="No reports found" />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

            {data.map(item => (
              <div
                key={item.id}
                className="flex items-start gap-3 p-4 rounded-xl border border-gray-100 hover:border-primary-200 hover:bg-primary-50/20 transition-all group"
              >

                <div className="w-10 h-10 bg-red-50 rounded-xl flex items-center justify-center flex-shrink-0">
                  <FileText className="w-5 h-5 text-red-500" />
                </div>

                <div className="flex-1 min-w-0">

                  <div className="flex items-center gap-2 flex-wrap">
                    <h4 className="font-semibold text-sm text-gray-900 line-clamp-1">
                      {item.title}
                    </h4>

                    <span className={typeColors[item.type] || 'badge-gray'}>
                      {item.type?.toUpperCase()}
                    </span>
                  </div>

                  {item.description && (
                    <p className="text-xs text-gray-500 mt-0.5 line-clamp-1">
                      {item.description}
                    </p>
                  )}

                  <div className="flex items-center gap-2 mt-1">
                    {item.year && (
                      <span className="text-xs text-gray-400">
                        {item.year}
                      </span>
                    )}

                    <span className={item.isPublic ? 'badge-green' : 'badge-gray'}>
                      {item.isPublic ? 'Public' : 'Internal'}
                    </span>
                  </div>

                </div>

                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">

                  {item.filePath && (
                    <a
                      href={item.filePath}
                      target="_blank"
                      rel="noreferrer"
                      className="p-1.5 rounded-lg hover:bg-green-50 text-gray-400 hover:text-green-600 transition-colors"
                    >
                      <ExternalLink className="w-4 h-4" />
                    </a>
                  )}

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
        title={editId ? 'Edit Report' : 'Add Report'}
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
              rows={2}
              value={form.description}
              onChange={e => set('description', e.target.value)}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">

            <div>
              <label className="label">Report Type</label>
              <select
                className="input"
                value={form.type}
                onChange={e => set('type', e.target.value as ReportType)}
              >
                {TYPES.map(t => (
                  <option key={t}>{t}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="label">Year</label>
              <input
                className="input"
                value={form.year}
                onChange={e => set('year', e.target.value)}
                placeholder="e.g. 2023-24"
              />
            </div>

          </div>

          <div>
            <label className="label">Upload File (PDF)</label>
            <input
              type="file"
              className="input"
              accept=".pdf,.doc,.docx"
              onChange={e =>
                set('file', e.target.files?.[0])
              }
            />
          </div>

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="isPublic"
              checked={form.isPublic}
              onChange={e => set('isPublic', e.target.checked)}
              className="rounded"
            />
            <label htmlFor="isPublic" className="text-sm font-semibold text-gray-700">
              Visible to Public
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
              {saving ? 'Saving...' : editId ? 'Update' : 'Add Report'}
            </button>
          </div>

        </form>
      </Modal>

      <ConfirmDialog
        isOpen={showConfirm}
        onClose={() => setShowConfirm(false)}
        onConfirm={handleDelete}
        title="Delete Report"
        message="Delete this report?"
      />

    </div>
  );
}