import React, { useState, useEffect } from 'react';
import { getNotifications } from '../../utils/api';
import { format } from 'date-fns';
import { Bell, AlertCircle, Paperclip } from 'lucide-react';

type Category =
  | 'general'
  | 'exam'
  | 'admission'
  | 'fees'
  | 'event'
  | 'result'
  | 'holiday';

interface NotificationItem {
  id: string;
  title: string;
  description?: string;
  category: Category;
  isUrgent?: boolean;
  publishedAt: string;
  attachment?: string;
}

const CATS: Category[] = [
  'general',
  'exam',
  'admission',
  'fees',
  'event',
  'result',
  'holiday'
];

const CC: Record<string, string> = {
  exam: 'bg-orange-100 text-orange-700',
  general: 'bg-gray-100 text-gray-600',
  fees: 'bg-red-100 text-red-700',
  event: 'bg-blue-100 text-blue-700',
  admission: 'bg-green-100 text-green-700',
  result: 'bg-purple-100 text-purple-700',
  holiday: 'bg-teal-100 text-teal-700'
};

// ✅ IMPORTANT FIX
const BASE_URL = 'http://localhost:5000';

export default function NotificationsPage() {

  const [data, setData] = useState<NotificationItem[]>([]);
  const [total, setTotal] = useState<number>(0);
  const [page, setPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);

  const [category, setCategory] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    setLoading(true);
    getNotifications({ category: category || undefined, page, limit: 10 })
      .then((r: any) => {
        setData(r.data.data);
        setTotal(r.data.total);
        setTotalPages(r.data.totalPages);
      })
      .finally(() => setLoading(false));
  }, [category, page]);

  return (
    <div className="max-w-screen-xl mx-auto px-4 py-12">

      <div className="mb-8">
        <h1 className="font-display text-3xl font-bold text-gray-900 mb-2">
          Notifications
        </h1>
        <p className="text-gray-500">
          {total} notifications
        </p>
      </div>

      <div className="flex gap-2 mb-6 flex-wrap">
        {['', ...CATS].map((cat: string) => (
          <button
            key={cat}
            onClick={() => {
              setCategory(cat);
              setPage(1);
            }}
            className={`px-4 py-1.5 rounded-full text-xs font-semibold capitalize transition-all ${
              category === cat
                ? 'bg-primary-600 text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            {cat || 'All'}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="flex justify-center py-16">
          <div className="w-8 h-8 border-4 border-primary-500 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : (
        <div className="space-y-4">

          {data.map((n: NotificationItem) => (
            <div
              key={n.id}
              className={`flex items-start gap-4 p-5 bg-white rounded-2xl border transition-all hover:shadow-card ${
                n.isUrgent
                  ? 'border-red-200 bg-red-50/30'
                  : 'border-gray-100 hover:border-primary-200'
              }`}
            >

              <div
                className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${
                  n.isUrgent ? 'bg-red-100' : 'bg-primary-100'
                }`}
              >
                {n.isUrgent ? (
                  <AlertCircle className="w-5 h-5 text-red-600" />
                ) : (
                  <Bell className="w-5 h-5 text-primary-600" />
                )}
              </div>

              <div className="flex-1">
                <div className="flex items-center gap-2 flex-wrap mb-1">
                  <h3 className="font-bold text-gray-900">
                    {n.title}
                  </h3>

                  <span
                    className={`text-xs px-2 py-0.5 rounded-full font-semibold ${
                      CC[n.category] ||
                      'bg-gray-100 text-gray-600'
                    }`}
                  >
                    {n.category}
                  </span>

                  {n.isUrgent && (
                    <span className="text-xs bg-red-100 text-red-600 font-bold px-2 py-0.5 rounded-full">
                      🔴 URGENT
                    </span>
                  )}
                </div>

                {n.description && (
                  <p className="text-sm text-gray-600 leading-relaxed">
                    {n.description}
                  </p>
                )}

                <div className="flex items-center gap-3 mt-2">
                  <span className="text-xs text-gray-400">
                    {format(
                      new Date(n.publishedAt),
                      'dd MMMM yyyy, hh:mm a'
                    )}
                  </span>

                  {/* ✅ FIXED ATTACHMENT LINK */}
                  {n.attachment && (
                    <a
                      href={`${BASE_URL}${n.attachment}`}  // ✅ FIX
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1 text-xs text-primary-600 font-semibold hover:underline"
                    >
                      <Paperclip className="w-3.5 h-3.5" />
                      Attachment
                    </a>
                  )}
                </div>
              </div>

            </div>
          ))}

          {!data.length && (
            <div className="text-center py-16 text-gray-400">
              No notifications
            </div>
          )}

        </div>
      )}

      {totalPages > 1 && (
        <div className="flex justify-center gap-2 mt-8">
          <button
            disabled={page <= 1}
            onClick={() => setPage(p => p - 1)}
            className="px-4 py-2 rounded-lg border border-gray-200 text-sm font-medium disabled:opacity-40 hover:bg-gray-50 transition-colors"
          >
            ← Prev
          </button>

          <span className="px-4 py-2 text-sm text-gray-500">
            Page {page} of {totalPages}
          </span>

          <button
            disabled={page >= totalPages}
            onClick={() => setPage(p => p + 1)}
            className="px-4 py-2 rounded-lg border border-gray-200 text-sm font-medium disabled:opacity-40 hover:bg-gray-50 transition-colors"
          >
            Next →
          </button>
        </div>
      )}

    </div>
  );
}