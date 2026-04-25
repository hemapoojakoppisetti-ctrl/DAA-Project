import React, { useState, useEffect, useCallback } from 'react';
import { getDepartments, getInstitutions, createDepartment, updateDepartment, deleteDepartment } from '../../utils/api';
import { Modal, ConfirmDialog, PageHeader, EmptyState, Spinner, SearchInput, Pagination } from '../../components/shared/UI';
import toast from 'react-hot-toast';
import { Plus, Edit2, Trash2, BookOpen } from 'lucide-react';

const emptyForm = { name:'', code:'', description:'', hod:'', hodEmail:'', phone:'', established:'', institutionId:'' };

export default function AdminDepartments() {
  const [data, setData] = useState<any[]>([]); const [total, setTotal] = useState(0); const [page, setPage] = useState(1); const [totalPages, setTotalPages] = useState(1);
  const [institutions, setInstitutions] = useState<any[]>([]); const [search, setSearch] = useState(''); const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false); const [showConfirm, setShowConfirm] = useState(false);
  const [form, setForm] = useState<any>(emptyForm); const [editId, setEditId] = useState<any>(null); const [deleteId, setDeleteId] = useState<any>(null); const [saving, setSaving] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const [d, i] = await Promise.all([getDepartments({ search, page, limit: 15 }), getInstitutions({ limit: 100 })]);
      setData(d.data.data); setTotal(d.data.total); setTotalPages(d.data.totalPages);
      setInstitutions(i.data.data);
    } finally { setLoading(false); }
  }, [search, page]);

  useEffect(() => { load(); }, [load]);

  const openAdd = () => { setForm({...emptyForm, institutionId: institutions[0]?.id || ''}); setEditId(null); setShowModal(true); };
  const openEdit = (item: any) => { setForm({...item, institutionId: item.institutionId, established: item.established || ''}); setEditId(item.id); setShowModal(true); };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault(); setSaving(true);
    try {
      const payload = { ...form, institutionId: +form.institutionId, established: form.established ? +form.established : undefined };
      if (editId) await updateDepartment(editId, payload); else await createDepartment(payload);
      toast.success(editId ? 'Updated!' : 'Created!'); setShowModal(false); load();
    } catch (err: any) { toast.error(err.response?.data?.error || 'Error'); } finally { setSaving(false); }
  };

  const handleDelete = async () => {
    try { await deleteDepartment(deleteId); toast.success('Deleted!'); setShowConfirm(false); load(); }
    catch { toast.error('Error deleting'); }
  };

  const set = (k: string, v: any) => setForm((f: any) => ({...f, [k]: v}));

  return (
    <div className="fade-in">
      <PageHeader title="Departments" subtitle={`${total} departments`} action={<button onClick={openAdd} className="btn-primary"><Plus className="w-4 h-4" />Add Department</button>} />
      <div className="card">
        <div className="mb-4 max-w-xs"><SearchInput value={search} onChange={v => { setSearch(v); setPage(1); }} placeholder="Search departments..." /></div>
        {loading ? <Spinner /> : !data.length ? <EmptyState message="No departments found" /> : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-100">
                <tr>{['Department','Code','Institution','HOD','Faculty','Actions'].map(h => <th key={h} className="table-th">{h}</th>)}</tr>
              </thead>
              <tbody>
                {data.map(item => (
                  <tr key={item.id} className="table-row">
                    <td className="table-td">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center"><BookOpen className="w-4 h-4 text-green-600" /></div>
                        <div><div className="font-semibold text-sm text-gray-900">{item.name}</div><div className="text-xs text-gray-400 line-clamp-1">{item.description}</div></div>
                      </div>
                    </td>
                    <td className="table-td"><span className="font-mono text-xs bg-gray-100 px-2 py-0.5 rounded">{item.code}</span></td>
                    <td className="table-td text-xs text-gray-600">{item.institution?.name}</td>
                    <td className="table-td text-sm">{item.hod || '—'}</td>
                    <td className="table-td"><span className="font-bold text-primary-600">{item._count?.faculty || 0}</span></td>
                    <td className="table-td">
                      <div className="flex items-center gap-1">
                        <button onClick={() => openEdit(item)} className="p-1.5 rounded-lg hover:bg-primary-50 text-gray-400 hover:text-primary-600 transition-colors"><Edit2 className="w-4 h-4" /></button>
                        <button onClick={() => { setDeleteId(item.id); setShowConfirm(true); }} className="p-1.5 rounded-lg hover:bg-red-50 text-gray-400 hover:text-red-500 transition-colors"><Trash2 className="w-4 h-4" /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <Pagination page={page} totalPages={totalPages} onPage={setPage} />
          </div>
        )}
      </div>

      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title={editId ? 'Edit Department' : 'Add Department'} size="lg">
        <form onSubmit={handleSave} className="grid grid-cols-2 gap-4">
          <div className="col-span-2"><label className="label">Department Name *</label><input className="input" value={form.name} onChange={e => set('name', e.target.value)} required /></div>
          <div><label className="label">Code *</label><input className="input" value={form.code} onChange={e => set('code', e.target.value)} required /></div>
          <div><label className="label">Institution *</label>
            <select className="input" value={form.institutionId} onChange={e => set('institutionId', e.target.value)} required>
              <option value="">Select Institution</option>
              {institutions.map(i => <option key={i.id} value={i.id}>{i.name}</option>)}
            </select>
          </div>
          <div className="col-span-2"><label className="label">Description</label><textarea className="input resize-none" rows={2} value={form.description} onChange={e => set('description', e.target.value)} /></div>
          <div><label className="label">HOD Name</label><input className="input" value={form.hod} onChange={e => set('hod', e.target.value)} /></div>
          <div><label className="label">HOD Email</label><input type="email" className="input" value={form.hodEmail} onChange={e => set('hodEmail', e.target.value)} /></div>
          <div><label className="label">Phone</label><input className="input" value={form.phone} onChange={e => set('phone', e.target.value)} /></div>
          <div><label className="label">Established Year</label><input type="number" className="input" value={form.established} onChange={e => set('established', e.target.value)} /></div>
          <div className="col-span-2 flex justify-end gap-3 pt-2">
            <button type="button" onClick={() => setShowModal(false)} className="btn-secondary">Cancel</button>
            <button type="submit" disabled={saving} className="btn-primary">{saving ? 'Saving...' : editId ? 'Update' : 'Create'}</button>
          </div>
        </form>
      </Modal>

      <ConfirmDialog isOpen={showConfirm} onClose={() => setShowConfirm(false)} onConfirm={handleDelete} title="Delete Department" message="Delete this department and all related data?" />
    </div>
  );
}
