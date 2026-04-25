import React, { useState, useEffect, useCallback, FormEvent } from 'react';
import { getInstitutions, createInstitution, updateInstitution, deleteInstitution } from '../../utils/api';
import { Modal, ConfirmDialog, PageHeader, EmptyState, Spinner, SearchInput, Pagination } from '../../components/shared/UI';
import toast from 'react-hot-toast';
import { Plus, Edit2, Trash2, Building2, MapPin } from 'lucide-react';

/* ================= TYPES ================= */

interface Institution {
  id: string;
  name: string;
  code: string;
  address?: string;
  city?: string;
  state?: string;
  phone?: string;
  email?: string;
  website?: string;
  principal?: string;
  established?: string | number;
  type?: string;
  accreditation?: string;
  isActive?: boolean;
  _count?: {
    departments?: number;
  };
}

interface ApiResponse {
  data: {
    data: Institution[];
    total: number;
    totalPages: number;
  };
}

type FormState = Omit<Institution, 'id' | '_count'>;

/* ================= EMPTY FORM ================= */

const emptyForm: FormState = {
  name: '',
  code: '',
  address: '',
  city: '',
  state: 'Andhra Pradesh',
  phone: '',
  email: '',
  website: '',
  principal: '',
  established: '',
  type: 'Engineering',
  accreditation: '',
  isActive: true
};

/* ================= COMPONENT ================= */

export default function AdminInstitutions() {

  const [data, setData] = useState<Institution[]>([]);
  const [total, setTotal] = useState<number>(0);
  const [page, setPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [search, setSearch] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);

  const [showModal, setShowModal] = useState<boolean>(false);
  const [showConfirm, setShowConfirm] = useState<boolean>(false);

  const [form, setForm] = useState<FormState>(emptyForm);

  const [editId, setEditId] = useState<string | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const [saving, setSaving] = useState<boolean>(false);

  /* ================= LOAD DATA ================= */

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res: ApiResponse = await getInstitutions({ search, page, limit: 10 });
      setData(res.data.data);
      setTotal(res.data.total);
      setTotalPages(res.data.totalPages);
    } finally {
      setLoading(false);
    }
  }, [search, page]);

  useEffect(() => {
    load();
  }, [load]);

  /* ================= ACTIONS ================= */

  const openAdd = () => {
    setForm(emptyForm);
    setEditId(null);
    setShowModal(true);
  };

  const openEdit = (item: Institution) => {
    setForm({ ...item, established: item.established || '' });
    setEditId(item.id);
    setShowModal(true);
  };

  const openDelete = (id: string) => {
    setDeleteId(id);
    setShowConfirm(true);
  };

  const handleSave = async (e: FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (editId) {
        await updateInstitution(editId, form);
      } else {
        await createInstitution(form);
      }
      toast.success(editId ? 'Institution updated!' : 'Institution created!');
      setShowModal(false);
      load();
    } catch (err: any) {
      toast.error(err?.response?.data?.error || 'Error saving');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    try {
      if (deleteId) {
        await deleteInstitution(deleteId);
      }
      toast.success('Deleted!');
      setShowConfirm(false);
      load();
    } catch {
      toast.error('Error deleting');
    }
  };

  const set = (k: keyof FormState, v: any) =>
    setForm((f) => ({ ...f, [k]: v }));

  /* ================= UI ================= */

  return (
    <div className="fade-in">

      <PageHeader
        title="Institutions"
        subtitle={`${total} affiliated institutions`}
        action={
          <button onClick={openAdd} className="btn-primary">
            <Plus className="w-4 h-4" />
            Add Institution
          </button>
        }
      />

      <div className="card">

        <div className="flex items-center gap-3 mb-4">
          <div className="flex-1 max-w-xs">
            <SearchInput
              value={search}
              onChange={(v: string) => {
                setSearch(v);
                setPage(1);
              }}
              placeholder="Search institutions..."
            />
          </div>
        </div>

        {loading ? (
          <Spinner />
        ) : !data.length ? (
          <EmptyState
            message="No institutions found"
            description="Add your first institution to get started"
          />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-100">
                <tr>
                  {[
                    'Institution',
                    'Code',
                    'City',
                    'Type',
                    'Accreditation',
                    'Departments',
                    'Actions'
                  ].map((h) => (
                    <th key={h} className="table-th">{h}</th>
                  ))}
                </tr>
              </thead>

              <tbody>
                {data.map((item) => (
                  <tr key={item.id} className="table-row">

                    <td className="table-td">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-primary-100 rounded-lg flex items-center justify-center">
                          <Building2 className="w-4 h-4 text-primary-600" />
                        </div>
                        <div>
                          <div className="font-semibold text-gray-900 text-sm leading-tight max-w-[200px] truncate">
                            {item.name}
                          </div>
                          <div className="text-xs text-gray-400">
                            {item.principal}
                          </div>
                        </div>
                      </div>
                    </td>

                    <td className="table-td">
                      <span className="font-mono text-xs bg-gray-100 px-2 py-0.5 rounded">
                        {item.code}
                      </span>
                    </td>

                    <td className="table-td">
                      <span className="flex items-center gap-1 text-gray-600">
                        <MapPin className="w-3 h-3" />
                        {item.city}
                      </span>
                    </td>

                    <td className="table-td">
                      <span className="badge-blue">{item.type}</span>
                    </td>

                    <td className="table-td">
                      <span className="text-sm">
                        {item.accreditation || '—'}
                      </span>
                    </td>

                    <td className="table-td">
                      <span className="font-bold text-primary-600">
                        {item._count?.departments || 0}
                      </span>
                    </td>

                    <td className="table-td">
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => openEdit(item)}
                          className="p-1.5 rounded-lg hover:bg-primary-50 text-gray-400 hover:text-primary-600 transition-colors"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>

                        <button
                          onClick={() => openDelete(item.id)}
                          className="p-1.5 rounded-lg hover:bg-red-50 text-gray-400 hover:text-red-500 transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
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

      {/* MODAL */}
      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title={editId ? 'Edit Institution' : 'Add Institution'}
        size="lg"
      >
        <form onSubmit={handleSave} className="grid grid-cols-2 gap-4">

          <div className="col-span-2">
            <label className="label">Institution Name *</label>
            <input
              className="input"
              value={form.name}
              onChange={(e) => set('name', e.target.value)}
              required
            />
          </div>

          <div>
            <label className="label">Code *</label>
            <input
              className="input"
              value={form.code}
              onChange={(e) => set('code', e.target.value)}
              required
            />
          </div>

          <div>
            <label className="label">Type</label>
            <select
              className="input"
              value={form.type}
              onChange={(e) => set('type', e.target.value)}
            >
              {[
                'Engineering',
                'University',
                'Polytechnic',
                'Arts & Science',
                'Management'
              ].map((t) => (
                <option key={t}>{t}</option>
              ))}
            </select>
          </div>

          <div className="col-span-2">
            <label className="label">Address</label>
            <input
              className="input"
              value={form.address}
              onChange={(e) => set('address', e.target.value)}
            />
          </div>

          <div>
            <label className="label">City</label>
            <input
              className="input"
              value={form.city}
              onChange={(e) => set('city', e.target.value)}
            />
          </div>

          <div>
            <label className="label">State</label>
            <input
              className="input"
              value={form.state}
              onChange={(e) => set('state', e.target.value)}
            />
          </div>

          <div>
            <label className="label">Phone</label>
            <input
              className="input"
              value={form.phone}
              onChange={(e) => set('phone', e.target.value)}
            />
          </div>

          <div>
            <label className="label">Email</label>
            <input
              type="email"
              className="input"
              value={form.email}
              onChange={(e) => set('email', e.target.value)}
            />
          </div>

          <div>
            <label className="label">Website</label>
            <input
              className="input"
              value={form.website}
              onChange={(e) => set('website', e.target.value)}
            />
          </div>

          <div>
            <label className="label">Principal</label>
            <input
              className="input"
              value={form.principal}
              onChange={(e) => set('principal', e.target.value)}
            />
          </div>

          <div>
            <label className="label">Established Year</label>
            <input
              type="number"
              className="input"
              value={form.established}
              onChange={(e) => set('established', e.target.value)}
            />
          </div>

          <div>
            <label className="label">Accreditation</label>
            <input
              className="input"
              value={form.accreditation}
              onChange={(e) => set('accreditation', e.target.value)}
            />
          </div>

          <div className="col-span-2 flex justify-end gap-3 pt-2">
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
              {saving ? 'Saving...' : editId ? 'Update' : 'Create'}
            </button>
          </div>

        </form>
      </Modal>

      {/* CONFIRM */}
      <ConfirmDialog
        isOpen={showConfirm}
        onClose={() => setShowConfirm(false)}
        onConfirm={handleDelete}
        title="Delete Institution"
        message="Are you sure you want to delete this institution? This action cannot be undone."
      />

    </div>
  );
}