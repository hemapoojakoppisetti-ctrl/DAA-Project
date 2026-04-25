import React, { useState, useEffect, useCallback } from 'react';
import { getFaculty, getDepartments, createFaculty, updateFaculty, deleteFaculty } from '../../utils/api';
import { Modal, ConfirmDialog, PageHeader, EmptyState, Spinner, SearchInput, Pagination } from '../../components/shared/UI';
import toast from 'react-hot-toast';
import { Plus, Edit2, Trash2, User } from 'lucide-react';

export default function AdminFaculty() {
  const [data, setData] = useState<any[]>([]); const [total, setTotal] = useState(0); const [page, setPage] = useState(1); const [totalPages, setTotalPages] = useState(1);
  const [departments, setDepartments] = useState<any[]>([]); const [search, setSearch] = useState(''); const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false); const [showConfirm, setShowConfirm] = useState(false);
  const [form, setForm] = useState<any>({ name:'', designation:'', qualification:'', experience:'', email:'', phone:'', specialization:'', departmentId:'', isHOD:false }); 
  const [editId, setEditId] = useState<any>(null); const [deleteId, setDeleteId] = useState<any>(null); const [saving, setSaving] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const [d, depts] = await Promise.all([getFaculty({ search, page, limit: 15 }), getDepartments({ limit: 100 })]);
      setData(d.data.data); setTotal(d.data.total); setTotalPages(d.data.totalPages); setDepartments(depts.data.data);
    } finally { setLoading(false); }
  }, [search, page]);

  useEffect(() => { load(); }, [load]);

  const openAdd = () => { setForm({ name:'', designation:'', qualification:'', experience:'', email:'', phone:'', specialization:'', departmentId: departments[0]?.id || '', isHOD: false }); setEditId(null); setShowModal(true); };
  const openEdit = (item: any) => { setForm({...item, experience: item.experience || ''}); setEditId(item.id); setShowModal(true); };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault(); setSaving(true);
    try {
      const fd = new FormData();
      Object.entries(form).forEach(([k, v]) => { if (v !== undefined && v !== '') fd.append(k, v as string); });
      if (editId) await updateFaculty(editId, fd); else await createFaculty(fd);
      toast.success(editId ? 'Updated!' : 'Faculty added!'); setShowModal(false); load();
    } catch (err: any) { toast.error(err.response?.data?.error || 'Error'); } finally { setSaving(false); }
  };

  const handleDelete = async () => {
    try { await deleteFaculty(deleteId); toast.success('Deleted!'); setShowConfirm(false); load(); }
    catch { toast.error('Error'); }
  };

  const set = (k: string, v: any) => setForm((f: any) => ({...f, [k]: v}));

  return (
    <div className="fade-in">
      <PageHeader title="Faculty Directory" subtitle={`${total} faculty members`} action={<button onClick={openAdd} className="btn-primary"><Plus className="w-4 h-4" />Add Faculty</button>} />
      <div className="card">
        <div className="mb-4 max-w-xs"><SearchInput value={search} onChange={v => { setSearch(v); setPage(1); }} placeholder="Search faculty..." /></div>
        {loading ? <Spinner /> : !data.length ? <EmptyState message="No faculty found" /> : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-100">
                <tr>{['Faculty','Designation','Qualification','Exp.','Department','Actions'].map(h => <th key={h} className="table-th">{h}</th>)}</tr>
              </thead>
              <tbody>
                {data.map(item => (
                  <tr key={item.id} className="table-row">
                    <td className="table-td">
                      <div className="flex items-center gap-2">
                        {item.photo ? <img src={item.photo} alt={item.name} className="w-8 h-8 rounded-full object-cover" /> :
                          <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center text-purple-600 font-bold text-sm">{item.name[0]}</div>}
                        <div>
                          <div className="font-semibold text-sm text-gray-900">{item.name} {item.isHOD && <span className="badge-orange ml-1">HOD</span>}</div>
                          <div className="text-xs text-gray-400">{item.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="table-td text-sm">{item.designation}</td>
                    <td className="table-td text-sm">{item.qualification || '—'}</td>
                    <td className="table-td text-sm">{item.experience ? `${item.experience} yrs` : '—'}</td>
                    <td className="table-td text-xs text-gray-600">{item.department?.name}</td>
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

      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title={editId ? 'Edit Faculty' : 'Add Faculty'} size="lg">
        <form onSubmit={handleSave} className="grid grid-cols-2 gap-4">
          <div className="col-span-2"><label className="label">Full Name *</label><input className="input" value={form.name} onChange={e => set('name', e.target.value)} required /></div>
          <div><label className="label">Designation *</label>
            <select className="input" value={form.designation} onChange={e => set('designation', e.target.value)} required>
              <option value="">Select...</option>
              {['Professor','Associate Professor','Assistant Professor','Lecturer','Lab Instructor'].map(d => <option key={d}>{d}</option>)}
            </select>
          </div>
          <div><label className="label">Department *</label>
            <select className="input" value={form.departmentId} onChange={e => set('departmentId', e.target.value)} required>
              <option value="">Select...</option>
              {departments.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
            </select>
          </div>
          <div><label className="label">Qualification</label><input className="input" value={form.qualification} onChange={e => set('qualification', e.target.value)} /></div>
          <div><label className="label">Experience (Years)</label><input type="number" className="input" value={form.experience} onChange={e => set('experience', e.target.value)} /></div>
          <div><label className="label">Email</label><input type="email" className="input" value={form.email} onChange={e => set('email', e.target.value)} /></div>
          <div><label className="label">Phone</label><input className="input" value={form.phone} onChange={e => set('phone', e.target.value)} /></div>
          <div className="col-span-2"><label className="label">Specialization</label><input className="input" value={form.specialization} onChange={e => set('specialization', e.target.value)} /></div>
          <div className="col-span-2 flex items-center gap-2">
            <input type="checkbox" id="isHOD" checked={form.isHOD} onChange={e => set('isHOD', e.target.checked)} className="rounded" />
            <label htmlFor="isHOD" className="text-sm font-semibold text-gray-700">Is Head of Department (HOD)</label>
          </div>
          <div className="col-span-2 flex justify-end gap-3 pt-2">
            <button type="button" onClick={() => setShowModal(false)} className="btn-secondary">Cancel</button>
            <button type="submit" disabled={saving} className="btn-primary">{saving ? 'Saving...' : editId ? 'Update' : 'Add Faculty'}</button>
          </div>
        </form>
      </Modal>

      <ConfirmDialog isOpen={showConfirm} onClose={() => setShowConfirm(false)} onConfirm={handleDelete} title="Delete Faculty" message="Remove this faculty member from the system?" />
    </div>
  );
}
