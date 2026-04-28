import React, { useState, useEffect } from 'react';
import { getFees } from '../../utils/api';
import { FileDown } from 'lucide-react';

interface FeeItem {
  id: string;
  course: string;
  category?: string;
  academicYear?: string;
  totalFee?: number | string;
  tuitionFee?: number | string;
  examFee?: number | string;
  labFee?: number | string;
  otherFee?: number | string;
  pdfFile?: string;
}

export default function FeesPage() {

  const [data, setData] = useState<FeeItem[]>([]);
  const [search, setSearch] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    setLoading(true);
    getFees({ course: search || undefined })
      .then((r: any) => setData(r.data))
      .finally(() => setLoading(false));
  }, [search]);

  const fmt = (n?: number | string) =>
    n ? `₹${Number(n).toLocaleString('en-IN')}` : '—';

  return (
    <div className="max-w-screen-xl mx-auto px-4 py-12">

      <div className="mb-8">
        <h1 className="font-display text-3xl font-bold text-gray-900 mb-2">
          Fees Structure
        </h1>
        <p className="text-gray-500">
          Academic year 2024-25 fee structure for all courses
        </p>
      </div>

      <div className="mb-6 max-w-sm">
        <input
          className="px-4 py-2 text-sm bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 w-full"
          placeholder="Search by course..."
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
        <div className="space-y-4">

          {data.map((fee: FeeItem) => (
            <div
              key={fee.id}
              className="bg-white rounded-2xl border border-gray-100 hover:shadow-card transition-all overflow-hidden"
            >

              <div className="bg-primary-50 px-6 py-4 flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-primary-900 font-display">
                    {fee.course}
                  </h3>

                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-xs bg-primary-100 text-primary-700 font-semibold px-2 py-0.5 rounded-full">
                      {fee.category}
                    </span>

                    {fee.academicYear && (
                      <span className="text-xs text-primary-500">
                        {fee.academicYear}
                      </span>
                    )}
                  </div>
                </div>

                <div className="text-right">
                  <div className="text-2xl font-display font-bold text-primary-700">
                    {fmt(fee.totalFee)}
                  </div>
                  <div className="text-xs text-primary-400">
                    Total per year
                  </div>
                </div>
              </div>

              <div className="px-6 py-4">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {[
                    ['Tuition Fee', fee.tuitionFee],
                    ['Exam Fee', fee.examFee],
                    ['Lab Fee', fee.labFee],
                    ['Other Fee', fee.otherFee]
                  ].map(([label, val]) => (
                    <div
                      key={label as string}
                      className="text-center p-3 bg-gray-50 rounded-xl"
                    >
                      <div className="text-sm font-bold text-gray-700">
                        {fmt(val as number | string)}
                      </div>
                      <div className="text-xs text-gray-400 mt-0.5">
                        {label}
                      </div>
                    </div>
                  ))}
                </div>

                {fee.pdfFile && (
                  <div className="mt-4">
                    <a
                      href={fee.pdfFile}
                      target="_blank"
                      rel="noreferrer"
                      className="flex items-center gap-2 text-sm text-primary-600 font-semibold hover:underline"
                    >
                      <FileDown className="w-4 h-4" />
                      Download Fee Structure PDF
                    </a>
                  </div>
                )}

              </div>

            </div>
          ))}

          {!data.length && (
            <div className="text-center py-12 text-gray-400">
              No fee structures found
            </div>
          )}

        </div>
      )}

    </div>
  );
}