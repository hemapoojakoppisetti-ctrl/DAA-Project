import React, { useState, useEffect } from 'react';
import { getFaculty, getDepartments } from '../../utils/api';
import { Mail, Award } from 'lucide-react';

interface Department {
  id: string;
  name: string;
}

interface Faculty {
  id: string;
  name: string;
  designation?: string;
  photo?: string;
  isHOD?: boolean;
  qualification?: string;
  experience?: number;
  specialization?: string;
  email?: string;
  department?: {
    name?: string;
  };
}

export default function FacultyPage() {

  const [data, setData] = useState<Faculty[]>([]);
  const [total, setTotal] = useState<number>(0);

  const [search, setSearch] = useState<string>('');
  const [deptId, setDeptId] = useState<string>('');

  const [departments, setDepartments] = useState<Department[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [page, setPage] = useState<number>(1);

  useEffect(() => {
    getDepartments({ limit: 100 })
      .then((r: any) => setDepartments(r.data.data));
  }, []);

  useEffect(() => {
    setLoading(true);
    getFaculty({
      search,
      departmentId: deptId || undefined,
      page,
      limit: 12
    })
      .then((r: any) => {
        setData(r.data.data);
        setTotal(r.data.total);
      })
      .finally(() => setLoading(false));
  }, [search, deptId, page]);

  return (
    <div className="max-w-screen-xl mx-auto px-4 py-12">

      <div className="mb-8">
        <h1 className="font-display text-3xl font-bold text-gray-900 mb-2">
          Faculty Directory
        </h1>
        <p className="text-gray-500">
          {total} faculty members across all departments
        </p>
      </div>

      <div className="flex flex-wrap gap-3 mb-6">
        <input
          className="px-4 py-2 text-sm bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 flex-1 max-w-sm"
          placeholder="Search by name, specialization..."
          value={search}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
            setSearch(e.target.value);
            setPage(1);
          }}
        />

        <select
          className="px-3 py-2 text-sm bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
          value={deptId}
          onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
            setDeptId(e.target.value);
            setPage(1);
          }}
        >
          <option value="">All Departments</option>
          {departments.map((d: Department) => (
            <option key={d.id} value={d.id}>
              {d.name}
            </option>
          ))}
        </select>
      </div>

      {loading ? (
        <div className="flex justify-center py-16">
          <div className="w-8 h-8 border-4 border-primary-500 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">

          {data.map((f: Faculty) => (
            <div
              key={f.id}
              className="bg-white rounded-2xl border border-gray-100 hover:border-primary-200 hover:shadow-card transition-all overflow-hidden"
            >

              <div className="bg-gradient-to-br from-primary-50 to-primary-100 p-6 flex flex-col items-center">
                {f.photo ? (
                  <img
                    src={f.photo}
                    alt={f.name}
                    className="w-20 h-20 rounded-full object-cover border-4 border-white shadow"
                  />
                ) : (
                  <div className="w-20 h-20 rounded-full bg-primary-600 flex items-center justify-center text-white text-3xl font-bold border-4 border-white shadow">
                    {f.name[0]}
                  </div>
                )}

                <h3 className="font-bold text-gray-900 text-sm mt-3 text-center">
                  {f.name}
                </h3>

                <p className="text-xs text-primary-600 font-semibold text-center">
                  {f.designation}
                </p>

                {f.isHOD && (
                  <span className="mt-1 text-xs bg-orange-100 text-orange-700 font-semibold px-2 py-0.5 rounded-full">
                    HOD
                  </span>
                )}
              </div>

              <div className="p-4 space-y-1.5">
                {f.qualification && (
                  <div className="flex items-center gap-1.5 text-xs text-gray-600">
                    <Award className="w-3.5 h-3.5 text-gray-400 flex-shrink-0" />
                    {f.qualification}
                  </div>
                )}

                {f.experience && (
                  <div className="text-xs text-gray-500">
                    {f.experience} years experience
                  </div>
                )}

                {f.specialization && (
                  <div className="text-xs text-gray-500 italic">
                    {f.specialization}
                  </div>
                )}

                {f.email && (
                  <div className="flex items-center gap-1.5 text-xs">
                    <Mail className="w-3.5 h-3.5 text-gray-400 flex-shrink-0" />
                    <a
                      href={`mailto:${f.email}`}
                      className="text-primary-600 hover:underline truncate"
                    >
                      {f.email}
                    </a>
                  </div>
                )}

                <div className="text-xs text-gray-400 pt-1 border-t border-gray-50">
                  {f.department?.name}
                </div>
              </div>

            </div>
          ))}

          {!data.length && (
            <div className="col-span-4 text-center py-12 text-gray-400">
              No faculty found
            </div>
          )}

        </div>
      )}

    </div>
  );
}