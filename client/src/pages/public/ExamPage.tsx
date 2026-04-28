import React, { useState, useEffect } from 'react';
import { getExamTimetable } from '../../utils/api';
import { format } from 'date-fns';
import { FileDown } from 'lucide-react';

interface ExamItem {
  id: string;
  course: string;
  semester: string;
  subject: string;
  subjectCode?: string;
  examDate: string;
  examTime?: string;
  duration?: string;
  venue?: string;
  pdfFile?: string;
}

const COURSES: string[] = ['', 'B.Tech', 'M.Tech', 'MBA', 'MCA', 'B.Pharmacy', 'M.Pharmacy'];
const SEMS: string[] = ['', 'I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII'];

// ✅ IMPORTANT FIX
const BASE_URL = 'http://localhost:5000';

export default function ExamPage() {

  const [data, setData] = useState<ExamItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const [course, setCourse] = useState<string>('');
  const [semester, setSemester] = useState<string>('');
  const [search, setSearch] = useState<string>('');

  useEffect(() => {
    setLoading(true);
    getExamTimetable({
      course: course || undefined,
      semester: semester || undefined,
      search: search || undefined
    })
      .then((r: any) => setData(r.data))
      .finally(() => setLoading(false));
  }, [course, semester, search]);

  return (
    <div className="max-w-screen-xl mx-auto px-4 py-12">

      <div className="mb-8">
        <h1 className="font-display text-3xl font-bold text-gray-900 mb-2">
          Exam Timetable
        </h1>
        <p className="text-gray-500">
          End semester examination schedule
        </p>
      </div>

      <div className="flex flex-wrap gap-3 mb-6">
        <input
          className="px-4 py-2 text-sm bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 flex-1 min-w-[200px]"
          placeholder="Search by subject..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <select
          className="px-3 py-2 text-sm bg-white border border-gray-200 rounded-lg"
          value={course}
          onChange={(e) => setCourse(e.target.value)}
        >
          {COURSES.map((c) => (
            <option key={c} value={c}>
              {c || 'All Courses'}
            </option>
          ))}
        </select>

        <select
          className="px-3 py-2 text-sm bg-white border border-gray-200 rounded-lg"
          value={semester}
          onChange={(e) => setSemester(e.target.value)}
        >
          {SEMS.map((s) => (
            <option key={s} value={s}>
              {s || 'All Semesters'}
            </option>
          ))}
        </select>
      </div>

      {loading ? (
        <div className="flex justify-center py-16">
          <div className="w-8 h-8 border-4 border-primary-500 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-card">
          <table className="w-full">

            <thead className="bg-primary-900 text-white">
              <tr>
                {['Course', 'Sem', 'Subject', 'Code', 'Date', 'Time', 'Duration', 'Venue', ''].map((h) => (
                  <th key={h} className="px-4 py-3 text-left text-xs font-bold uppercase">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>

            <tbody>
              {data.map((item, i) => (
                <tr key={item.id} className={`border-b ${i % 2 ? 'bg-gray-50/50' : ''}`}>

                  <td className="px-4 py-3">
                    <span className="text-xs bg-primary-100 text-primary-700 px-2 py-0.5 rounded-full">
                      {item.course}
                    </span>
                  </td>

                  <td className="px-4 py-3 text-sm">{item.semester}</td>
                  <td className="px-4 py-3 font-semibold text-sm">{item.subject}</td>

                  <td className="px-4 py-3 text-xs text-gray-500">
                    {item.subjectCode || '—'}
                  </td>

                  <td className="px-4 py-3 text-sm">
                    {format(new Date(item.examDate), 'dd MMM yyyy')}
                  </td>

                  <td className="px-4 py-3 text-sm">{item.examTime || '—'}</td>
                  <td className="px-4 py-3 text-sm">{item.duration || '—'}</td>
                  <td className="px-4 py-3 text-sm">{item.venue || '—'}</td>

                  <td className="px-4 py-3">
                    {item.pdfFile && (
                      <a
                        href={`${BASE_URL}${item.pdfFile}`}   // ✅ FIX
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary-600 flex items-center gap-1 text-xs font-semibold"
                      >
                        <FileDown className="w-4 h-4" />
                        PDF
                      </a>
                    )}
                  </td>

                </tr>
              ))}

              {!data.length && (
                <tr>
                  <td colSpan={9} className="text-center py-12 text-gray-400">
                    No exam entries found
                  </td>
                </tr>
              )}
            </tbody>

          </table>
        </div>
      )}

    </div>
  );
}