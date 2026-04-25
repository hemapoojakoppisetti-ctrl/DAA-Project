import React, { useState, useEffect, useCallback } from 'react';
import { getExamTimetable, createExam, updateExam, deleteExam } from '../../utils/api';
import { Modal, ConfirmDialog, PageHeader, EmptyState, Spinner, SearchInput } from '../../components/shared/UI';
import toast from 'react-hot-toast';
import { Plus, Edit2, Trash2, FileDown } from 'lucide-react';
import { format } from 'date-fns';

const COURSES = ['B.Tech','M.Tech','MBA','MCA','B.Pharmacy','M.Pharmacy'];
const SEMESTERS = ['I','II','III','IV','V','VI','VII','VIII'];

const emptyForm = {
  course:'B.Tech',
  semester:'I',
  subject:'',
  subjectCode:'',
  examDate:'',
  examTime:'10:00 AM',
  venue:'',
  duration:'3 Hours',
  academicYear:'2024-25'
};

// ✅ backend URL
const BASE_URL = 'http://localhost:5000';

export default function AdminExams() {

  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState('');
  const [courseFilter, setCourseFilter] = useState('');

  const [showModal, setShowModal] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const [form, setForm] = useState<any>(emptyForm);
  const [editId, setEditId] = useState<any>(null);

  const [deleteId, setDeleteId] = useState<any>(null);
  const [saving, setSaving] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await getExamTimetable({
        search,
        course: courseFilter || undefined
      });
      setData(res.data);
    } finally {
      setLoading(false);
    }
  }, [search, courseFilter]);

  useEffect(() => {
    load();
  }, [load]);

  const openAdd = () => {
    setForm(emptyForm);
    setEditId(null);
    setShowModal(true);
  };

  const openEdit = (item: any) => {
    setForm({
      ...item,
      examDate: item.examDate ? item.examDate.slice(0,10) : ''
    });
    setEditId(item.id);
    setShowModal(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      const fd = new FormData();

      Object.entries(form).forEach(([k, v]) => {
        if (v) fd.append(k, v as string);
      });

      // ✅ IMPORTANT FIX
      fd.append('isActive', 'true');

      if (editId) {
        await updateExam(editId, fd);
      } else {
        await createExam(fd);
      }

      toast.success(editId ? 'Updated!' : 'Exam entry created!');
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
      await deleteExam(deleteId);
      toast.success('Deleted!');
      setShowConfirm(false);
      load();
    } catch {
      toast.error('Error');
    }
  };

  const set = (k: string, v: any) =>
    setForm((f: any) => ({ ...f, [k]: v }));

  return (
    <div className="fade-in">

      <PageHeader
        title="Exam Timetable"
        subtitle={`${data.length} exam entries`}
        action={
          <button onClick={openAdd} className="btn-primary">
            <Plus className="w-4 h-4" /> Add Exam
          </button>
        }
      />

      <div className="card">

        <div className="flex items-center gap-3 mb-4 flex-wrap">
          <div className="flex-1 min-w-[200px] max-w-xs">
            <SearchInput
              value={search}
              onChange={v => setSearch(v)}
              placeholder="Search exams..."
            />
          </div>

          <select
            className="input max-w-[160px]"
            value={courseFilter}
            onChange={e => setCourseFilter(e.target.value)}
          >
            <option value="">All Courses</option>
            {COURSES.map(c => <option key={c}>{c}</option>)}
          </select>
        </div>

        {loading ? (
          <Spinner />
        ) : !data.length ? (
          <EmptyState message="No exam entries found" />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">

              <thead className="bg-gray-50 border-b border-gray-100">
                <tr>
                  {['Course/Sem','Subject','Code','Date','Time','Duration','Venue','Actions']
                    .map(h => (
                      <th key={h} className="table-th">{h}</th>
                    ))}
                </tr>
              </thead>

              <tbody>
                {data.map(item => (
                  <tr key={item.id} className="table-row">

                    <td className="table-td">
                      <div>
                        <span className="badge-blue">{item.course}</span>
                        <div className="text-xs text-gray-500 mt-0.5">
                          Sem: {item.semester}
                        </div>
                      </div>
                    </td>

                    <td className="table-td font-semibold text-sm text-gray-900">
                      {item.subject}
                    </td>

                    <td className="table-td">
                      <span className="font-mono text-xs bg-gray-100 px-2 py-0.5 rounded">
                        {item.subjectCode || '—'}
                      </span>
                    </td>

                    <td className="table-td text-sm">
                      {format(new Date(item.examDate), 'dd MMM yyyy')}
                    </td>

                    <td className="table-td text-sm">
                      {item.examTime || '—'}
                    </td>

                    <td className="table-td text-sm">
                      {item.duration || '—'}
                    </td>

                    <td className="table-td text-sm text-gray-500">
                      {item.venue || '—'}
                    </td>

                    <td className="table-td">
                      <div className="flex items-center gap-1">

                        {/* ✅ FIXED PDF LINK */}
                        {item.pdfFile && (
                          <a
                            href={`${BASE_URL}${item.pdfFile}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-1.5 rounded-lg hover:bg-green-50 text-gray-400 hover:text-green-600"
                          >
                            <FileDown className="w-4 h-4" />
                          </a>
                        )}

                        <button
                          onClick={() => openEdit(item)}
                          className="p-1.5 rounded-lg hover:bg-primary-50 text-gray-400 hover:text-primary-600"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>

                        <button
                          onClick={() => {
                            setDeleteId(item.id);
                            setShowConfirm(true);
                          }}
                          className="p-1.5 rounded-lg hover:bg-red-50 text-gray-400 hover:text-red-500"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>

                      </div>
                    </td>

                  </tr>
                ))}
              </tbody>

            </table>
          </div>
        )}
      </div>

      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title={editId ? 'Edit Exam Entry' : 'Add Exam Entry'}
        size="lg"
      >
        <form onSubmit={handleSave} className="grid grid-cols-2 gap-4">

          <div>
            <label className="label">Course *</label>
            <select
              className="input"
              value={form.course}
              onChange={e => set('course', e.target.value)}
            >
              {COURSES.map(c => <option key={c}>{c}</option>)}
            </select>
          </div>

          <div>
            <label className="label">Semester *</label>
            <select
              className="input"
              value={form.semester}
              onChange={e => set('semester', e.target.value)}
            >
              {SEMESTERS.map(s => <option key={s}>{s}</option>)}
            </select>
          </div>

          <div className="col-span-2">
            <label className="label">Subject Name *</label>
            <input
              className="input"
              value={form.subject}
              onChange={e => set('subject', e.target.value)}
              required
            />
          </div>

          <div>
            <label className="label">Subject Code</label>
            <input
              className="input"
              value={form.subjectCode}
              onChange={e => set('subjectCode', e.target.value)}
            />
          </div>

          <div>
            <label className="label">Academic Year</label>
            <input
              className="input"
              value={form.academicYear}
              onChange={e => set('academicYear', e.target.value)}
            />
          </div>

          <div>
            <label className="label">Exam Date *</label>
            <input
              type="date"
              className="input"
              value={form.examDate}
              onChange={e => set('examDate', e.target.value)}
              required
            />
          </div>

          <div>
            <label className="label">Exam Time</label>
            <input
              className="input"
              value={form.examTime}
              onChange={e => set('examTime', e.target.value)}
            />
          </div>

          <div>
            <label className="label">Duration</label>
            <input
              className="input"
              value={form.duration}
              onChange={e => set('duration', e.target.value)}
            />
          </div>

          <div>
            <label className="label">Venue</label>
            <input
              className="input"
              value={form.venue}
              onChange={e => set('venue', e.target.value)}
            />
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
            <button type="submit" className="btn-primary" disabled={saving}>
              {saving ? 'Saving...' : editId ? 'Update' : 'Add Exam'}
            </button>
          </div>

        </form>
      </Modal>

      <ConfirmDialog
        isOpen={showConfirm}
        onClose={() => setShowConfirm(false)}
        onConfirm={handleDelete}
        title="Delete Exam Entry"
        message="Remove this exam entry?"
      />

    </div>
  );
}