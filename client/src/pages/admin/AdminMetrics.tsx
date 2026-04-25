import React, { useState, useEffect, useCallback, FormEvent } from 'react';
import { getMetrics, createMetric, updateMetric, deleteMetric } from '../../utils/api';
import { Modal, ConfirmDialog, PageHeader, EmptyState, Spinner } from '../../components/shared/UI';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import toast from 'react-hot-toast';
import { Plus, Edit2, Trash2, TrendingUp } from 'lucide-react';

/* ================= TYPES ================= */

type Category =
  | 'quality'
  | 'accreditation'
  | 'placement'
  | 'faculty'
  | 'research'
  | 'industry'
  | 'infrastructure'
  | 'academic';

interface Metric {
  id: string;
  name: string;
  value: number;
  target?: number;
  unit?: string;
  category: Category;
  year?: string;
  description?: string;
}

type FormState = {
  name: string;
  value: string;
  target: string;
  unit: string;
  category: Category;
  year: string;
  description: string;
};

/* ================= CONSTANTS ================= */

const CATS: Category[] = [
  'quality',
  'accreditation',
  'placement',
  'faculty',
  'research',
  'industry',
  'infrastructure',
  'academic'
];

const emptyForm: FormState = {
  name: '',
  value: '',
  target: '',
  unit: '',
  category: 'quality',
  year: '2024',
  description: ''
};

const COLORS = [
  '#3b82f6',
  '#10b981',
  '#f97316',
  '#8b5cf6',
  '#14b8a6',
  '#ef4444',
  '#f59e0b',
  '#6366f1'
];

/* ================= COMPONENT ================= */

export default function AdminMetrics() {

  const [data, setData] = useState<Metric[]>([]);
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
      const res = await getMetrics();
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

  const openEdit = (item: Metric) => {
    setForm({
      ...item,
      value: String(item.value),
      target: item.target ? String(item.target) : '',
      unit: item.unit || '',
      year: item.year || '',
      description: item.description || ''
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
        value: +form.value,
        target: form.target ? +form.target : undefined
      };

      if (editId) {
        await updateMetric(editId, payload);
      } else {
        await createMetric(payload);
      }

      toast.success(editId ? 'Updated!' : 'Metric added!');
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
        await deleteMetric(deleteId);
      }
      toast.success('Deleted!');
      setShowConfirm(false);
      load();
    } catch {
      toast.error('Error');
    }
  };

  const set = (k: keyof FormState, v: string) =>
    setForm(f => ({ ...f, [k]: v }));

  const getPct = (item: Metric) =>
    item.target
      ? Math.min(100, Math.round((item.value / item.target) * 100))
      : null;

  const chartData = data.map(m => ({
    name: m.name.split(' ').slice(-1)[0],
    value: m.value,
    target: m.target || 0
  }));

  return (
    <div className="fade-in">

      <PageHeader
        title="Quality Metrics"
        subtitle={`${data.length} KPIs tracked`}
        action={
          <button onClick={openAdd} className="btn-primary">
            <Plus className="w-4 h-4" />
            Add Metric
          </button>
        }
      />

      {data.length > 0 && (
        <div className="card mb-6">
          <h3 className="font-bold text-gray-900 mb-4 font-display">
            Metrics vs Target Overview
          </h3>

          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={chartData} margin={{ top: 5, right: 10, bottom: 20, left: 0 }}>
              <XAxis dataKey="name" tick={{ fontSize: 10 }} />
              <YAxis tick={{ fontSize: 10 }} />
              <Tooltip
                contentStyle={{
                  borderRadius: 8,
                  border: 'none',
                  boxShadow: '0 4px 20px rgba(0,0,0,.1)',
                  fontSize: 12
                }}
              />

              <Bar dataKey="value" radius={[4, 4, 0, 0]} name="Current">
                {chartData.map((_, i) => (
                  <Cell key={i} fill={COLORS[i % COLORS.length]} />
                ))}
              </Bar>

              <Bar dataKey="target" fill="#e5e7eb" radius={[4, 4, 0, 0]} name="Target" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {loading ? (
          <Spinner />
        ) : !data.length ? (
          <div className="col-span-3">
            <EmptyState message="No metrics found" />
          </div>
        ) : (
          data.map((item, i) => {
            const pct = getPct(item);
            return (
              <div key={item.id} className="card group">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <div
                      className="w-8 h-8 rounded-lg flex items-center justify-center"
                      style={{ backgroundColor: COLORS[i % COLORS.length] + '20' }}
                    >
                      <TrendingUp
                        className="w-4 h-4"
                        style={{ color: COLORS[i % COLORS.length] }}
                      />
                    </div>
                    <span className="badge-gray capitalize text-xs">
                      {item.category}
                    </span>
                  </div>

                  <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => openEdit(item)}
                      className="p-1 rounded hover:bg-gray-100 text-gray-400 hover:text-primary-600 transition-colors"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>

                    <button
                      onClick={() => {
                        setDeleteId(item.id);
                        setShowConfirm(true);
                      }}
                      className="p-1 rounded hover:bg-gray-100 text-gray-400 hover:text-red-500 transition-colors"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                <div className="text-2xl font-display font-bold text-gray-900">
                  {item.value}
                  {item.unit && (
                    <span className="text-sm font-normal text-gray-400 ml-1">
                      {item.unit}
                    </span>
                  )}
                </div>

                <div className="text-sm font-semibold text-gray-700 mt-0.5">
                  {item.name}
                </div>

                {item.description && (
                  <div className="text-xs text-gray-400 mt-0.5">
                    {item.description}
                  </div>
                )}

                {pct !== null && (
                  <div className="mt-3">
                    <div className="flex justify-between text-xs text-gray-500 mb-1">
                      <span>Progress</span>
                      <span>
                        {pct}% of {item.target}{item.unit}
                      </span>
                    </div>
                    <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all duration-500"
                        style={{
                          width: `${pct}%`,
                          backgroundColor: COLORS[i % COLORS.length]
                        }}
                      />
                    </div>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title={editId ? 'Edit Metric' : 'Add Metric'}
      >
        <form onSubmit={handleSave} className="space-y-4">

          <div>
            <label className="label">Metric Name *</label>
            <input
              className="input"
              value={form.name}
              onChange={e => set('name', e.target.value)}
              required
            />
          </div>

          <div>
            <label className="label">Description</label>
            <input
              className="input"
              value={form.description}
              onChange={e => set('description', e.target.value)}
            />
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="label">Value *</label>
              <input
                type="number"
                step="0.01"
                className="input"
                value={form.value}
                onChange={e => set('value', e.target.value)}
                required
              />
            </div>

            <div>
              <label className="label">Target</label>
              <input
                type="number"
                step="0.01"
                className="input"
                value={form.target}
                onChange={e => set('target', e.target.value)}
              />
            </div>

            <div>
              <label className="label">Unit</label>
              <input
                className="input"
                value={form.unit}
                onChange={e => set('unit', e.target.value)}
                placeholder="%, LPA, etc."
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="label">Category</label>
              <select
                className="input"
                value={form.category}
                onChange={e => set('category', e.target.value as Category)}
              >
                {CATS.map(c => (
                  <option key={c}>{c}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="label">Year</label>
              <input
                className="input"
                value={form.year}
                onChange={e => set('year', e.target.value)}
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
              {saving ? 'Saving...' : editId ? 'Update' : 'Add Metric'}
            </button>
          </div>

        </form>
      </Modal>

      <ConfirmDialog
        isOpen={showConfirm}
        onClose={() => setShowConfirm(false)}
        onConfirm={handleDelete}
        title="Delete Metric"
        message="Remove this metric?"
      />

    </div>
  );
}