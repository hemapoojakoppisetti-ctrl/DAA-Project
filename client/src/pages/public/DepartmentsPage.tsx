import React, { useState, useEffect } from 'react';
import { getDepartments } from '../../utils/api';
import { BookOpen, Users } from 'lucide-react';

interface Institution {
  name?: string;
}

interface Department {
  id: string;
  name: string;
  code: string;
  description?: string;
  hod?: string;
  institution?: Institution;
  _count?: {
    faculty?: number;
  };
}

export default function DepartmentsPage() {

  const [data, setData] = useState<Department[]>([]);
  const [search, setSearch] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    setLoading(true);
    getDepartments({ search, limit: 50 })
      .then((r: any) => setData(r.data.data))
      .finally(() => setLoading(false));
  }, [search]);

  return (
    <div className="max-w-screen-xl mx-auto px-4 py-12">

      <div className="mb-8">
        <h1 className="font-display text-3xl font-bold text-gray-900 mb-2">
          Departments
        </h1>
        <p className="text-gray-500">
          Academic departments across JNTUK affiliated institutions
        </p>
      </div>

      <div className="mb-6 max-w-sm">
        <input
          className="px-4 py-2 text-sm bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 w-full"
          placeholder="Search departments..."
          value={search}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            setSearch(e.target.value)
          }
        />
      </div>

      {loading ? (
        <div className="flex justify-center py-16">
          <div className="w-8 h-8 border-4 border-primary-500 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">

          {data.map((dept: Department) => (
            <div
              key={dept.id}
              className="bg-white rounded-2xl border border-gray-100 hover:border-primary-200 hover:shadow-card transition-all p-6"
            >

              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center">
                  <BookOpen className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 text-sm">
                    {dept.name}
                  </h3>
                  <span className="font-mono text-xs text-gray-400">
                    {dept.code}
                  </span>
                </div>
              </div>

              {dept.description && (
                <p className="text-xs text-gray-500 mb-3 line-clamp-2">
                  {dept.description}
                </p>
              )}

              {dept.hod && (
                <div className="text-xs text-gray-600 mb-1">
                  <span className="font-semibold">HOD:</span> {dept.hod}
                </div>
              )}

              <div className="mt-3 pt-3 border-t border-gray-50 flex items-center justify-between">
                <span className="text-xs text-gray-400">
                  {dept.institution?.name}
                </span>

                <span className="flex items-center gap-1 text-xs text-primary-600 font-semibold">
                  <Users className="w-3 h-3" />
                  {dept._count?.faculty || 0} Faculty
                </span>
              </div>

            </div>
          ))}

          {!data.length && (
            <div className="col-span-3 text-center py-12 text-gray-400">
              No departments found
            </div>
          )}

        </div>
      )}

    </div>
  );
}