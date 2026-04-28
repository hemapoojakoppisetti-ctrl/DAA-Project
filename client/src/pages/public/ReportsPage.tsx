import React, { useState, useEffect } from 'react';
import { getReports } from '../../utils/api';
import { FileText, ExternalLink } from 'lucide-react';

type ReportType =
  | 'audit'
  | 'naac'
  | 'nba'
  | 'aqar'
  | 'iqac'
  | 'annual';

interface ReportItem {
  id: string;
  title: string;
  type: ReportType;
  year?: string | number;
  description?: string;
  filePath?: string;
}

const TYPES: ReportType[] = [
  'audit',
  'naac',
  'nba',
  'aqar',
  'iqac',
  'annual'
];

const TC: Record<string, string> = {
  naac: 'bg-blue-100 text-blue-700',
  nba: 'bg-green-100 text-green-700',
  aqar: 'bg-orange-100 text-orange-700',
  audit: 'bg-gray-100 text-gray-600',
  iqac: 'bg-purple-100 text-purple-700',
  annual: 'bg-teal-100 text-teal-700'
};

// ✅ Backend base URL
const BASE_URL = 'http://localhost:5000';

export default function ReportsPage() {
  const [data, setData] = useState<ReportItem[]>([]);
  const [type, setType] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    setLoading(true);
    getReports({ type: type || undefined })
      .then((r: any) => setData(r.data))
      .finally(() => setLoading(false));
  }, [type]);

  return (
    <div className="max-w-screen-xl mx-auto px-4 py-12">

      <div className="mb-8">
        <h1 className="font-display text-3xl font-bold text-gray-900 mb-2">
          Audit Reports
        </h1>
        <p className="text-gray-500">
          NAAC, NBA, AQAR and other accreditation reports
        </p>
      </div>

      <div className="flex gap-2 mb-6 flex-wrap">
        {['', ...TYPES].map((t: string) => (
          <button
            key={t}
            onClick={() => setType(t)}
            className={`px-4 py-1.5 rounded-full text-xs font-semibold uppercase transition-all ${
              type === t
                ? 'bg-primary-600 text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            {t || 'All'}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="flex justify-center py-16">
          <div className="w-8 h-8 border-4 border-primary-500 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">

          {data.map((r: ReportItem) => (
            <div
              key={r.id}
              className="bg-white rounded-2xl border border-gray-100 hover:border-primary-200 hover:shadow-card transition-all p-5"
            >

              <div className="flex items-start gap-3 mb-3">
                <div className="w-10 h-10 bg-red-50 rounded-xl flex items-center justify-center flex-shrink-0">
                  <FileText className="w-5 h-5 text-red-500" />
                </div>

                <div>
                  <h3 className="font-bold text-gray-900 text-sm">
                    {r.title}
                  </h3>

                  <div className="flex items-center gap-2 mt-1">
                    <span
                      className={`text-xs px-2 py-0.5 rounded-full font-semibold uppercase ${
                        TC[r.type] ||
                        'bg-gray-100 text-gray-600'
                      }`}
                    >
                      {r.type}
                    </span>

                    {r.year && (
                      <span className="text-xs text-gray-400">
                        {r.year}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {r.description && (
                <p className="text-xs text-gray-500 mb-3">
                  {r.description}
                </p>
              )}

              {/* ✅ FIXED DOWNLOAD LINK */}
              {r.filePath && (
                <a
                  href={`${BASE_URL}${r.filePath}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 text-sm text-primary-600 font-semibold hover:text-primary-700 transition-colors"
                >
                  <ExternalLink className="w-4 h-4" />
                  Download Report
                </a>
              )}

            </div>
          ))}

          {!data.length && (
            <div className="col-span-3 text-center py-12 text-gray-400">
              No reports found
            </div>
          )}

        </div>
      )}

    </div>
  );
}