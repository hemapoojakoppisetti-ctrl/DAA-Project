import React, { useState, useEffect, useCallback } from 'react';
import { getFees, createFee, updateFee, deleteFee } from '../../utils/api';
import { Modal, ConfirmDialog, PageHeader, EmptyState, Spinner } from '../../components/shared/UI';
import toast from 'react-hot-toast';
import { Plus, Edit2, Trash2, FileDown } from 'lucide-react';

const emptyForm = {
  course: '',
  category: 'Regular',
  tuitionFee: '',
  examFee: '',
  labFee: '',
  otherFee: '',
  totalFee: '',
  academicYear: '2024-25'
};

// ✅ backend URL
const BASE_URL = 'http://localhost:5000';

export default function AdminFees() {

  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const [showModal, setShowModal] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const [form, setForm] = useState<any>(emptyForm);
  const [editId, setEditId] = useState<any>(null);

  const [deleteId, setDeleteId] = useState<any>(null);
  const [saving, setSaving] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await getFees();
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

  const openEdit = (item: any) => {
    setForm(item);
    setEditId(item.id);
    setShowModal(true);
  };

  const calcTotal = (f: any) => {
    return (
      (+f.tuitionFee || 0) +
      (+f.examFee || 0) +
      (+f.labFee || 0) +
      (+f.otherFee || 0)
    );
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      const payload = {
        ...form,
        totalFee: calcTotal(form)
      };

      const fd = new FormData();

      Object.entries(payload).forEach(([k, v]) => {
        if (v !== undefined && v !== '') {
          fd.append(k, String(v));
        }
      });

      // ✅ IMPORTANT FIX (visibility issue prevent)
      fd.append('isActive', 'true');

      // ✅ file append fix
      if (form.pdfFile instanceof File) {
        fd.append('pdfFile', form.pdfFile);
      }

      if (editId) {
        await updateFee(editId, fd);
      } else {
        await createFee(fd);
      }

      toast.success(editId ? 'Updated!' : 'Fee structure added!');
      setShowModal(false);
      load();

    } catch (err: any) {
      toast.error(err.response?.data?.error || 'Error');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    try {
      await deleteFee(deleteId);
      toast.success('Deleted!');
      setShowConfirm(false);
      load();
    } catch {
      toast.error('Error');
    }
  };

  const set = (k: string, v: any) =>
    setForm((f: any) => ({ ...f, [k]: v }));

  const fmt = (n: any) =>
    n ? `₹${Number(n).toLocaleString('en-IN')}` : '—';

  return (
    <div className="fade-in">

      <PageHeader
        title="Fees Structure"
        subtitle={`${data.length} fee structures`}
        action={
          <button onClick={openAdd} className="btn-primary">
            <Plus className="w-4 h-4" /> Add Fee Structure
          </button>
        }
      />

      <div className="card overflow-x-auto">

        {loading ? (
          <Spinner />
        ) : !data.length ? (
          <EmptyState message="No fee structures" />
        ) : (
          <table className="w-full">

            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                {['Course','Category','Tuition Fee','Exam Fee','Lab Fee','Other','Total','Year','Actions']
                  .map(h => <th key={h} className="table-th">{h}</th>)}
              </tr>
            </thead>

            <tbody>
              {data.map(item => (
                <tr key={item.id} className="table-row">

                  <td className="table-td font-semibold">{item.course}</td>

                  <td className="table-td">
                    <span className="badge-blue">{item.category}</span>
                  </td>

                  <td className="table-td">{fmt(item.tuitionFee)}</td>
                  <td className="table-td">{fmt(item.examFee)}</td>
                  <td className="table-td">{fmt(item.labFee)}</td>
                  <td className="table-td">{fmt(item.otherFee)}</td>

                  <td className="table-td font-bold text-green-600">
                    {fmt(item.totalFee)}
                  </td>

                  <td className="table-td">
                    {item.academicYear || '—'}
                  </td>

                  <td className="table-td">
                    <div className="flex items-center gap-1">

                      {/* ✅ PDF VIEW FIX */}
                      {item.pdfFile && (
                        <a
                          href={`${BASE_URL}${item.pdfFile}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-1.5 hover:bg-green-50 text-gray-400 hover:text-green-600 rounded-lg"
                        >
                          <FileDown className="w-4 h-4" />
                        </a>
                      )}

                      <button
                        onClick={() => openEdit(item)}
                        className="p-1.5 hover:bg-primary-50 text-gray-400 hover:text-primary-600 rounded-lg"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>

                      <button
                        onClick={() => {
                          setDeleteId(item.id);
                          setShowConfirm(true);
                        }}
                        className="p-1.5 hover:bg-red-50 text-gray-400 hover:text-red-500 rounded-lg"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>

                    </div>
                  </td>

                </tr>
              ))}
            </tbody>

          </table>
        )}

      </div>

      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title={editId ? 'Edit Fee Structure' : 'Add Fee Structure'}
        size="lg"
      >
        <form onSubmit={handleSave} className="grid grid-cols-2 gap-4">

          <div className="col-span-2">
            <label className="label">Course *</label>
            <input
              className="input"
              value={form.course}
              onChange={e => set('course', e.target.value)}
              required
            />
          </div>

          <div>
            <label className="label">Category</label>
            <select
              className="input"
              value={form.category}
              onChange={e => set('category', e.target.value)}
            >
              {['Regular','NRI','Management','Lateral Entry'].map(c => (
                <option key={c}>{c}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="label">Academic Year</label>
            <input
              className="input"
              value={form.academicYear}
              onChange={e => set('academicYear', e.target.value)}
            />
          </div>

          {['tuitionFee','examFee','labFee','otherFee'].map(field => (
            <div key={field}>
              <label className="label">{field}</label>
              <input
                type="number"
                className="input"
                value={form[field]}
                onChange={e => set(field, e.target.value)}
              />
            </div>
          ))}

          <div className="col-span-2 bg-green-50 p-3 rounded-lg">
            <b>Total: ₹{calcTotal(form).toLocaleString('en-IN')}</b>
          </div>

          <div className="col-span-2">
            <label className="label">Upload PDF</label>
            <input
              type="file"
              className="input"
              accept=".pdf"
              onChange={e => set('pdfFile', e.target.files?.[0])}
            />
          </div>

          <div className="col-span-2 flex justify-end gap-3">
            <button type="button" onClick={() => setShowModal(false)} className="btn-secondary">
              Cancel
            </button>
            <button type="submit" className="btn-primary">
              {saving ? 'Saving...' : editId ? 'Update' : 'Add'}
            </button>
          </div>

        </form>
      </Modal>

      <ConfirmDialog
        isOpen={showConfirm}
        onClose={() => setShowConfirm(false)}
        onConfirm={handleDelete}
        title="Delete Fee"
        message="Delete this fee structure?"
      />

    </div>
  );
}