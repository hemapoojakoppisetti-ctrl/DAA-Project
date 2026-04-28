import React, { useState, useEffect } from 'react';
import { getDownloads } from '../../utils/api';
import { Download } from 'lucide-react';

type Category =
  | 'general'
  | 'regulations'
  | 'calendar'
  | 'forms'
  | 'syllabus'
  | 'reports'
  | 'circulars';

interface DownloadItem {
  id: string;
  title: string;
  description?: string;
  fileName: string;
  fileSize?: string;
  category: Category;
  filePath: string;
}

const CATS: Category[] = [
  'general',
  'regulations',
  'calendar',
  'forms',
  'syllabus',
  'reports',
  'circulars'
];

const fileIcons: Record<string, string> = {
  pdf: '📄',
  doc: '📝',
  docx: '📝',
  xls: '📊',
  xlsx: '📊',
  jpg: '🖼️',
  png: '🖼️'
};

const getIcon = (n?: string): string => {
  const ext = n?.split('.').pop()?.toLowerCase() || '';
  return fileIcons[ext] || '📎';
};

export default function DownloadsPage() {
  const [data, setData] = useState<DownloadItem[]>([]);
  const [total, setTotal] = useState<number>(0);
  const [cat, setCat] = useState<string>('');
  const [page, setPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    setLoading(true);
    getDownloads({ category: cat || undefined, page, limit: 12 })
      .then((r: any) => {
        setData(r.data.data);
        setTotal(r.data.total);
        setTotalPages(r.data.totalPages);
      })
      .finally(() => setLoading(false));
  }, [cat, page]);

  return (
    <div className="max-w-screen-xl mx-auto px-4 py-12">

      {/* Header */}
      <div className="mb-8">
        <h1 className="font-display text-3xl font-bold text-gray-900 mb-2">
          Downloads
        </h1>
        <p className="text-gray-500">
          {total} files available for download
        </p>
      </div>

      {/* Categories */}
      <div className="flex gap-2 mb-6 flex-wrap">
        {['', ...CATS].map((c: string) => (
          <button
            key={c}
            onClick={() => {
              setCat(c);
              setPage(1);
            }}
            className={`px-4 py-1.5 rounded-full text-xs font-semibold capitalize transition-all ${
              cat === c
                ? 'bg-primary-600 text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            {c || 'All'}
          </button>
        ))}
      </div>

      {/* Loader */}
      {loading ? (
        <div className="flex justify-center py-16">
          <div className="w-8 h-8 border-4 border-primary-500 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">

          {data.map((d: DownloadItem) => (
            <div
              key={d.id}
              className="bg-white rounded-2xl border border-gray-100 hover:border-primary-200 hover:shadow-card transition-all p-5 flex items-center gap-4"
            >

              {/* Icon */}
              <span className="text-3xl flex-shrink-0">
                {getIcon(d.fileName)}
              </span>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <h3 className="font-bold text-gray-900 text-sm line-clamp-1">
                  {d.title}
                </h3>

                {d.description && (
                  <p className="text-xs text-gray-500 line-clamp-1 mt-0.5">
                    {d.description}
                  </p>
                )}

                <div className="flex items-center gap-2 mt-1">
                  <span className="text-xs text-gray-400">
                    {d.fileSize}
                  </span>

                  <span className="text-xs bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full capitalize">
                    {d.category}
                  </span>
                </div>
              </div>
              {/* ✅ FIXED DOWNLOAD BUTTON */}
              <a
                href={`http://localhost:5000/${d.filePath.replace(/^\/+/, '')}`}
                target="_blank"
                rel="noreferrer"
                download
                className="w-10 h-10 bg-primary-600 rounded-xl flex items-center justify-center text-white hover:bg-primary-700 transition-colors flex-shrink-0"
              >
                <Download className="w-4 h-4" />
              </a>

            </div>
          ))}

          {!data.length && (
            <div className="col-span-3 text-center py-12 text-gray-400">
              No files found
            </div>
          )}

        </div>
      )}

    </div>
  );
}