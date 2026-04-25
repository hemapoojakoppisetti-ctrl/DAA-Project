import React, { useState, useEffect, useCallback } from 'react';
import { getDownloads, createDownload, updateDownload, deleteDownload } from '../../utils/api';
import { Modal, ConfirmDialog, PageHeader, EmptyState, Spinner, Pagination } from '../../components/shared/UI';
import toast from 'react-hot-toast';
import { Plus, Edit2, Trash2, FileDown, ExternalLink } from 'lucide-react';
import { format } from 'date-fns';

const CATS = ['general','regulations','calendar','forms','syllabus','reports','circulars'];
const emptyForm = { title:'', description:'', category:'general' };

export default function AdminDownloads() {
  const [data, setData] = useState<any[]>([]); const [total, setTotal] = useState(0); const [page, setPage] = useState(1); const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true); const [showModal, setShowModal] = useState(false); const [showConfirm, setShowConfirm] = useState(false);
  const [form, setForm] = useState<any>(emptyForm); const [editId, setEditId] = useState<any>(null); const [deleteId, setDeleteId] = useState<any>(null); const [saving, setSaving] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    try { const res = await getDownloads({ page, limit: 10 }); setData(res.data.data); setTotal(res.data.total); setTotalPages(res.data.totalPages); }
    finally { setLoading(false); }
  }, [page]);

  useEffect(() => { load(); }, [load]);

  const openAdd = () => { setForm(emptyForm); setEditId(null); setShowModal(true); };
  const openEdit = (item: any) => { setForm(item); setEditId(item.id); setShowModal(true); };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault(); setSaving(true);
    try {
      const fd = new FormData();
      Object.entries(form).forEach(([k, v]) => { if (v) fd.append(k, v as string); });
      if (!editId && !form.file) { toast.error('Please select a file'); setSaving(false); return; }
      if (editId) await updateDownload(editId, fd); else await createDownload(fd);
      toast.success(editId ? 'Updated!' : 'Download added!'); setShowModal(false); load();
    } catch (err: any) { toast.error(err.response?.data?.error || 'Error'); } finally { setSaving(false); }
  };

  const handleDelete = async () => {
    try { await deleteDownload(deleteId); toast.success('Deleted!'); setShowConfirm(false); load(); }
    catch { toast.error('Error'); }
  };

  const set = (k: string, v: any) => setForm((f: any) => ({...f, [k]: v}));
  const fileIcons: Record<string, string> = { pdf:'📄', doc:'📝', docx:'📝', xls:'📊', xlsx:'📊', ppt:'📊', pptx:'📊', jpg:'🖼️', png:'🖼️' };
  const getIcon = (name: string) => { const ext = name?.split('.').pop()?.toLowerCase(); return fileIcons[ext!] || '📎'; };

  return (
    <div className="fade-in">
      <PageHeader title="Downloads" subtitle={`${total} files available`}
        action={<button onClick={openAdd} className="btn-primary"><Plus className="w-4 h-4" />Add Download</button>} />

      <div className="card">
        <div className="overflow-x-auto">
          {loading ? <Spinner /> : !data.length ? <EmptyState message="No downloads found" /> : (
            <>
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-100">
                  <tr>{['File','Category','Size','Date','Downloads','Actions'].map(h => <th key={h} className="table-th">{h}</th>)}</tr>
                </thead>
                <tbody>
                  {data.map(item => (
                    <tr key={item.id} className="table-row">
                      <td className="table-td">
                        <div className="flex items-center gap-2">
                          <span className="text-2xl">{getIcon(item.fileName)}</span>
                          <div>
                            <div className="font-semibold text-sm text-gray-900">{item.title}</div>
                            <div className="text-xs text-gray-400">{item.fileName}</div>
                          </div>
                        </div>
                      </td>
                      <td className="table-td"><span className="badge-blue capitalize">{item.category}</span></td>
                      <td className="table-td text-xs text-gray-500">{item.fileSize || '—'}</td>
                      <td className="table-td text-xs text-gray-500">{format(new Date(item.createdAt), 'dd MMM yyyy')}</td>
                      <td className="table-td text-sm font-bold text-primary-600">{item.downloads}</td>
                      <td className="table-td">
                        <div className="flex items-center gap-1">
                          <a href={item.filePath} target="_blank" rel="noreferrer" className="p-1.5 rounded-lg hover:bg-green-50 text-gray-400 hover:text-green-600 transition-colors"><ExternalLink className="w-4 h-4" /></a>
                          <button onClick={() => openEdit(item)} className="p-1.5 rounded-lg hover:bg-primary-50 text-gray-400 hover:text-primary-600 transition-colors"><Edit2 className="w-4 h-4" /></button>
                          <button onClick={() => { setDeleteId(item.id); setShowConfirm(true); }} className="p-1.5 rounded-lg hover:bg-red-50 text-gray-400 hover:text-red-500 transition-colors"><Trash2 className="w-4 h-4" /></button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <Pagination page={page} totalPages={totalPages} onPage={setPage} />
            </>
          )}
        </div>
      </div>

      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title={editId ? 'Edit Download' : 'Add Download'}>
        <form onSubmit={handleSave} className="space-y-4">
          <div><label className="label">Title *</label><input className="input" value={form.title} onChange={e => set('title', e.target.value)} required /></div>
          <div><label className="label">Description</label><textarea className="input resize-none" rows={2} value={form.description} onChange={e => set('description', e.target.value)} /></div>
          <div><label className="label">Category</label>
            <select className="input" value={form.category} onChange={e => set('category', e.target.value)}>
              {CATS.map(c => <option key={c} className="capitalize">{c}</option>)}
            </select>
          </div>
          {!editId && <div><label className="label">File * (PDF, DOC, XLS, Images)</label><input type="file" className="input" required onChange={e => set('file', e.target.files![0])} /></div>}
          <div className="flex justify-end gap-3 pt-2">
            <button type="button" onClick={() => setShowModal(false)} className="btn-secondary">Cancel</button>
            <button type="submit" disabled={saving} className="btn-primary">{saving ? 'Uploading...' : editId ? 'Update' : 'Upload'}</button>
          </div>
        </form>
      </Modal>
      <ConfirmDialog isOpen={showConfirm} onClose={() => setShowConfirm(false)} onConfirm={handleDelete} title="Delete Download" message="Remove this download?" />
    </div>
  );
}
