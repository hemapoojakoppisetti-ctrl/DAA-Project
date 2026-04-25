import React, { useState, useEffect, useCallback } from 'react';
import { getContacts, markContactRead, deleteContact } from '../../utils/api';
import { ConfirmDialog, PageHeader, EmptyState, Spinner, Pagination } from '../../components/shared/UI';
import toast from 'react-hot-toast';
import { MessageSquare, Trash2, Check, Mail, Phone } from 'lucide-react';
import { format } from 'date-fns';

export default function AdminContacts() {
  const [data, setData] = useState<any[]>([]); const [total, setTotal] = useState(0); const [page, setPage] = useState(1); const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true); const [showConfirm, setShowConfirm] = useState(false);
  const [deleteId, setDeleteId] = useState<any>(null); const [selected, setSelected] = useState<any>(null);

  const load = useCallback(async () => {
    setLoading(true);
    try { const res = await getContacts({ page, limit: 10 }); setData(res.data.data); setTotal(res.data.total); setTotalPages(res.data.totalPages); }
    finally { setLoading(false); }
  }, [page]);

  useEffect(() => { load(); }, [load]);

  const handleRead = async (id: any) => {
    try { await markContactRead(id); toast.success('Marked as read'); load(); } catch { toast.error('Error'); }
  };

  const handleDelete = async () => {
    try { await deleteContact(deleteId); toast.success('Deleted!'); setShowConfirm(false); setSelected(null); load(); }
    catch { toast.error('Error'); }
  };

  return (
    <div className="fade-in">
      <PageHeader title="Contact Messages" subtitle={`${total} messages`} />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="card">
          {loading ? <Spinner /> : !data.length ? <EmptyState message="No messages" /> : (
            <>
              <div className="space-y-2">
                {data.map(item => (
                  <div key={item.id} onClick={() => setSelected(item)}
                    className={`p-4 rounded-xl border cursor-pointer transition-all ${!item.isRead ? 'border-primary-200 bg-primary-50/40' : 'border-gray-100 hover:border-gray-200'} ${selected?.id === item.id ? 'border-primary-400 bg-primary-50' : ''}`}>
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          {!item.isRead && <div className="w-2 h-2 bg-primary-500 rounded-full flex-shrink-0" />}
                          <span className="font-semibold text-sm text-gray-900">{item.name}</span>
                        </div>
                        <p className="text-xs font-medium text-gray-700 mt-0.5 line-clamp-1">{item.subject}</p>
                        <p className="text-xs text-gray-400">{format(new Date(item.createdAt), 'dd MMM yyyy, hh:mm a')}</p>
                      </div>
                      <div className="flex items-center gap-1 flex-shrink-0">
                        {!item.isRead && <button onClick={(e) => { e.stopPropagation(); handleRead(item.id); }} className="p-1.5 rounded-lg hover:bg-green-50 text-gray-400 hover:text-green-600 transition-colors" title="Mark read"><Check className="w-3.5 h-3.5" /></button>}
                        <button onClick={(e) => { e.stopPropagation(); setDeleteId(item.id); setShowConfirm(true); }} className="p-1.5 rounded-lg hover:bg-red-50 text-gray-400 hover:text-red-500 transition-colors"><Trash2 className="w-3.5 h-3.5" /></button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <Pagination page={page} totalPages={totalPages} onPage={setPage} />
            </>
          )}
        </div>

        <div className="card">
          {selected ? (
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center text-primary-700 font-bold">{selected.name[0]}</div>
                <div>
                  <div className="font-bold text-gray-900">{selected.name}</div>
                  <div className="text-xs text-gray-400">{format(new Date(selected.createdAt), 'dd MMMM yyyy, hh:mm a')}</div>
                </div>
              </div>
              <div className="space-y-3 mb-4">
                <div className="flex items-center gap-2 text-sm"><Mail className="w-4 h-4 text-gray-400" /><a href={`mailto:${selected.email}`} className="text-primary-600 hover:underline">{selected.email}</a></div>
                {selected.phone && <div className="flex items-center gap-2 text-sm"><Phone className="w-4 h-4 text-gray-400" /><span>{selected.phone}</span></div>}
              </div>
              <div className="bg-gray-50 rounded-xl p-4">
                <div className="font-semibold text-sm text-gray-700 mb-2">{selected.subject}</div>
                <p className="text-sm text-gray-600 leading-relaxed whitespace-pre-wrap">{selected.message}</p>
              </div>
              <div className="flex gap-3 mt-4">
                <a href={`mailto:${selected.email}?subject=Re: ${selected.subject}`} className="btn-primary flex-1 justify-center">Reply via Email</a>
                <button onClick={() => { setDeleteId(selected.id); setShowConfirm(true); }} className="btn-danger">Delete</button>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-64 text-gray-400">
              <MessageSquare className="w-10 h-10 mb-2" />
              <p className="text-sm font-medium">Select a message to view</p>
            </div>
          )}
        </div>
      </div>
      <ConfirmDialog isOpen={showConfirm} onClose={() => setShowConfirm(false)} onConfirm={handleDelete} title="Delete Message" message="Permanently delete this message?" />
    </div>
  );
}
