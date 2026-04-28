import React, { useState, useEffect } from 'react';
import { getInstitutions } from '../../utils/api';
import { Building2, MapPin, Phone, Globe, Search } from 'lucide-react';

interface Institution {
  id: string;
  name: string;
  code: string;
  city?: string;
  state?: string;
  phone?: string;
  website?: string;
  type?: string;
  accreditation?: string;
  _count?: {
    departments?: number;
  };
}

export default function InstitutionsPage() {

  const [data, setData] = useState<Institution[]>([]);
  const [total, setTotal] = useState<number>(0);
  const [page, setPage] = useState<number>(1);

  const [search, setSearch] = useState<string>('');
  const [type, setType] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    setLoading(true);
    getInstitutions({ search, type, page, limit: 12 })
      .then((r: any) => {
        setData(r.data.data);
        setTotal(r.data.total);
      })
      .finally(() => setLoading(false));
  }, [search, type, page]);

  return (
    <div className="max-w-screen-xl mx-auto px-4 py-12">

      <div className="mb-8">
        <h1 className="font-display text-3xl font-bold text-gray-900 mb-2">
          Affiliated Institutions
        </h1>
        <p className="text-gray-500">
          {total} institutions affiliated with JNTUK
        </p>
      </div>

      <div className="flex flex-wrap gap-3 mb-6">
        <div className="relative flex-1 max-w-sm">
          <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            className="pl-9 pr-4 py-2 text-sm bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 w-full"
            placeholder="Search institutions..."
            value={search}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
              setSearch(e.target.value);
              setPage(1);
            }}
          />
        </div>

        <select
          className="px-3 py-2 text-sm bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
          value={type}
          onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
            setType(e.target.value);
            setPage(1);
          }}
        >
          <option value="">All Types</option>
          {['Engineering', 'University', 'Polytechnic', 'Arts & Science', 'Management'].map((t: string) => (
            <option key={t}>{t}</option>
          ))}
        </select>
      </div>

      {loading ? (
        <div className="flex justify-center py-16">
          <div className="w-8 h-8 border-4 border-primary-500 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

          {data.map((inst: Institution) => (
            <div
              key={inst.id}
              className="bg-white rounded-2xl border border-gray-100 hover:border-primary-200 hover:shadow-card transition-all p-6 group"
            >

              <div className="flex items-start gap-3 mb-4">
                <div className="w-12 h-12 bg-primary-100 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:bg-primary-200 transition-colors">
                  <Building2 className="w-6 h-6 text-primary-600" />
                </div>

                <div>
                  <h3 className="font-bold text-gray-900 text-sm leading-tight">
                    {inst.name}
                  </h3>
                  <span className="text-xs font-mono text-gray-400">
                    {inst.code}
                  </span>
                </div>
              </div>

              <div className="space-y-1.5 text-xs text-gray-600">
                <div className="flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-gray-400 flex-shrink-0" />
                  {inst.city}, {inst.state}
                </div>

                {inst.phone && (
                  <div className="flex items-center gap-1.5">
                    <Phone className="w-3.5 h-3.5 text-gray-400 flex-shrink-0" />
                    {inst.phone}
                  </div>
                )}

                {inst.website && (
                  <div className="flex items-center gap-1.5">
                    <Globe className="w-3.5 h-3.5 text-gray-400 flex-shrink-0" />
                    <a
                      href={inst.website}
                      target="_blank"
                      rel="noreferrer"
                      className="text-primary-600 hover:underline truncate"
                    >
                      {inst.website}
                    </a>
                  </div>
                )}
              </div>

              <div className="mt-4 pt-4 border-t border-gray-50 flex items-center justify-between">
                <div className="flex gap-2 flex-wrap">
                  <span className="text-xs bg-primary-50 text-primary-700 font-semibold px-2 py-0.5 rounded-full">
                    {inst.type}
                  </span>

                  {inst.accreditation && (
                    <span className="text-xs bg-green-50 text-green-700 font-semibold px-2 py-0.5 rounded-full">
                      {inst.accreditation}
                    </span>
                  )}
                </div>

                {inst._count && (
                  <span className="text-xs text-gray-400">
                    {inst._count.departments} Depts
                  </span>
                )}
              </div>

            </div>
          ))}

        </div>
      )}

      {!loading && data.length === 0 && (
        <div className="text-center py-16 text-gray-400">
          No institutions found
        </div>
      )}

    </div>
  );
}