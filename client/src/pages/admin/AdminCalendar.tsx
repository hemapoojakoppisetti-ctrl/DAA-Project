import React, { useState, useEffect, useCallback } from 'react';
import { getAcademicCalendar, createCalendarEvent, updateCalendarEvent, deleteCalendarEvent } from '../../utils/api';
import { Modal, ConfirmDialog, PageHeader, EmptyState, Spinner } from '../../components/shared/UI';
import toast from 'react-hot-toast';
import { Plus, Edit2, Trash2, CalendarDays, Star } from 'lucide-react';
import { format } from 'date-fns';

const CATEGORIES = ['academic','exam','holiday','event','general'];
const CAT_COLORS: Record<string, string> = { academic:'badge-blue', exam:'badge-orange', holiday:'badge-green', event:'badge-red', general:'badge-gray' };
const emptyForm = { title:'', description:'', startDate:'', endDate:'', category:'academic', isImportant:false };

export default function AdminCalendar() {
  const [data, setData] = useState<any[]>([]); const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false); const [showConfirm, setShowConfirm] = useState(false);
  const [form, setForm] = useState<any>(emptyForm); const [editId, setEditId] = useState<any>(null);
  const [deleteId, setDeleteId] = useState<any>(null); const [saving, setSaving] = useState(false);
  const [filterCat, setFilterCat] = useState('');

  const load = useCallback(async () => {
    setLoading(true);
    try { const res = await getAcademicCalendar({ category: filterCat || undefined }); setData(res.data); }
    finally { setLoading(false); }
  }, [filterCat]);

  useEffect(() => { load(); }, [load]);

  const openAdd = () => { setForm(emptyForm); setEditId(null); setShowModal(true); };
  const openEdit = (item: any) => {
    setForm({ ...item, startDate: item.startDate ? item.startDate.slice(0,10) : '', endDate: item.endDate ? item.endDate.slice(0,10) : '' });
    setEditId(item.id); setShowModal(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault(); setSaving(true);
    try {
      if (editId) await updateCalendarEvent(editId, form); else await createCalendarEvent(form);
      toast.success(editId ? 'Event updated!' : 'Event created!'); setShowModal(false); load();
    } catch (err: any) { toast.error(err.response?.data?.error || 'Error'); } finally { setSaving(false); }
  };

  const handleDelete = async () => {
    try { await deleteCalendarEvent(deleteId); toast.success('Deleted!'); setShowConfirm(false); load(); }
    catch { toast.error('Error deleting'); }
  };

  const set = (k: string, v: any) => setForm((f: any) => ({...f, [k]: v}));

  return (
    <div className="fade-in">
      <PageHeader title="Academic Calendar" subtitle={`${data.length} events`}
        action={<button onClick={openAdd} className="btn-primary"><Plus className="w-4 h-4" />Add Event</button>} />

      <div className="card">
        <div className="flex items-center gap-2 mb-4 flex-wrap">
          <span className="text-sm font-semibold text-gray-600">Filter:</span>
          {['', ...CATEGORIES].map(cat => (
            <button key={cat} onClick={() => setFilterCat(cat)}
              className={`px-3 py-1 rounded-full text-xs font-semibold transition-all capitalize ${filterCat === cat ? 'bg-primary-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>
              {cat || 'All'}
            </button>
          ))}
        </div>

        {loading ? <Spinner /> : !data.length ? <EmptyState message="No events found" description="Add academic events to the calendar" /> : (
          <div className="space-y-3">
            {data.map(item => (
              <div key={item.id} className="flex items-start gap-4 p-4 rounded-xl border border-gray-100 hover:border-primary-200 hover:bg-primary-50/30 transition-all group">
                <div className="w-12 h-12 bg-primary-100 rounded-xl flex flex-col items-center justify-center flex-shrink-0 text-primary-700">
                  <span className="text-xs font-bold">{format(new Date(item.startDate), 'MMM')}</span>
                  <span className="text-lg font-display font-bold leading-tight">{format(new Date(item.startDate), 'd')}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h4 className="font-semibold text-gray-900 text-sm">{item.title}</h4>
                    {item.isImportant && <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />}
                    <span className={CAT_COLORS[item.category] || 'badge-gray'}>{item.category}</span>
                  </div>
                  {item.description && <p className="text-xs text-gray-500 mt-0.5 line-clamp-1">{item.description}</p>}
                  <p className="text-xs text-gray-400 mt-1">
                    {format(new Date(item.startDate), 'dd MMM yyyy')}
                    {item.endDate && ` → ${format(new Date(item.endDate), 'dd MMM yyyy')}`}
                  </p>
                </div>
                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button onClick={() => openEdit(item)} className="p-1.5 rounded-lg hover:bg-white text-gray-400 hover:text-primary-600 transition-colors"><Edit2 className="w-4 h-4" /></button>
                  <button onClick={() => { setDeleteId(item.id); setShowConfirm(true); }} className="p-1.5 rounded-lg hover:bg-white text-gray-400 hover:text-red-500 transition-colors"><Trash2 className="w-4 h-4" /></button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title={editId ? 'Edit Event' : 'Add Calendar Event'}>
        <form onSubmit={handleSave} className="space-y-4">
          <div><label className="label">Event Title *</label><input className="input" value={form.title} onChange={e => set('title', e.target.value)} required /></div>
          <div><label className="label">Description</label><textarea className="input resize-none" rows={2} value={form.description} onChange={e => set('description', e.target.value)} /></div>
          <div className="grid grid-cols-2 gap-4">
            <div><label className="label">Start Date *</label><input type="date" className="input" value={form.startDate} onChange={e => set('startDate', e.target.value)} required /></div>
            <div><label className="label">End Date</label><input type="date" className="input" value={form.endDate} onChange={e => set('endDate', e.target.value)} /></div>
          </div>
          <div><label className="label">Category</label>
            <select className="input" value={form.category} onChange={e => set('category', e.target.value)}>
              {CATEGORIES.map(c => <option key={c} value={c} className="capitalize">{c}</option>)}
            </select>
          </div>
          <div className="flex items-center gap-2">
            <input type="checkbox" id="isImp" checked={form.isImportant} onChange={e => set('isImportant', e.target.checked)} className="rounded" />
            <label htmlFor="isImp" className="text-sm font-semibold text-gray-700">Mark as Important</label>
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <button type="button" onClick={() => setShowModal(false)} className="btn-secondary">Cancel</button>
            <button type="submit" disabled={saving} className="btn-primary">{saving ? 'Saving...' : editId ? 'Update' : 'Create'}</button>
          </div>
        </form>
      </Modal>
      <ConfirmDialog isOpen={showConfirm} onClose={() => setShowConfirm(false)} onConfirm={handleDelete} title="Delete Event" message="Remove this calendar event?" />
    </div>
  );
}
