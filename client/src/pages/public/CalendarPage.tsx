import React, { useState, useEffect } from 'react';
import { getAcademicCalendar } from '../../utils/api';
import { format } from 'date-fns';
import { Star } from 'lucide-react';

type Category = 'academic' | 'exam' | 'holiday' | 'event' | 'general';

interface CalendarEvent {
  id: string;
  title: string;
  description?: string;
  category: Category;
  startDate: string;
  endDate?: string;
  isImportant?: boolean;
}

const CAT_COLORS: Record<string, string> = {
  academic: 'bg-blue-100 text-blue-700',
  exam: 'bg-orange-100 text-orange-700',
  holiday: 'bg-green-100 text-green-700',
  event: 'bg-purple-100 text-purple-700',
  general: 'bg-gray-100 text-gray-700'
};

const CATS: Category[] = ['academic', 'exam', 'holiday', 'event', 'general'];

export default function CalendarPage() {

  const [data, setData] = useState<CalendarEvent[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [filter, setFilter] = useState<string>('');

  useEffect(() => {
    setLoading(true);
    getAcademicCalendar({ category: filter || undefined })
      .then((r: any) => setData(r.data))
      .finally(() => setLoading(false));
  }, [filter]);

  return (
    <div className="max-w-screen-xl mx-auto px-4 py-12">

      <div className="mb-8">
        <h1 className="font-display text-3xl font-bold text-gray-900 mb-2">
          Academic Calendar
        </h1>
        <p className="text-gray-500">
          Important dates and events for the academic year 2024-25
        </p>
      </div>

      <div className="flex gap-2 mb-6 flex-wrap">
        {['', ...CATS].map((cat: string) => (
          <button
            key={cat}
            onClick={() => setFilter(cat)}
            className={`px-4 py-1.5 rounded-full text-xs font-semibold capitalize transition-all ${
              filter === cat
                ? 'bg-primary-600 text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            {cat || 'All Events'}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="flex justify-center py-16">
          <div className="w-8 h-8 border-4 border-primary-500 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : (
        <div className="space-y-4">

          {data.map((event: CalendarEvent) => (
            <div
              key={event.id}
              className="flex items-start gap-4 p-5 bg-white rounded-2xl border border-gray-100 hover:border-primary-200 hover:shadow-card transition-all"
            >
              <div className="w-16 flex-shrink-0 text-center bg-primary-50 rounded-xl py-2">
                <div className="text-xs font-bold text-primary-500 uppercase">
                  {format(new Date(event.startDate), 'MMM')}
                </div>
                <div className="text-2xl font-display font-bold text-primary-700">
                  {format(new Date(event.startDate), 'd')}
                </div>
                <div className="text-xs text-primary-400">
                  {format(new Date(event.startDate), 'yyyy')}
                </div>
              </div>

              <div className="flex-1">
                <div className="flex items-center gap-2 flex-wrap mb-1">
                  <h3 className="font-bold text-gray-900">
                    {event.title}
                  </h3>

                  {event.isImportant && (
                    <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
                  )}

                  <span
                    className={`text-xs px-2 py-0.5 rounded-full font-semibold capitalize ${
                      CAT_COLORS[event.category] ||
                      'bg-gray-100 text-gray-600'
                    }`}
                  >
                    {event.category}
                  </span>
                </div>

                {event.description && (
                  <p className="text-sm text-gray-500">
                    {event.description}
                  </p>
                )}

                <div className="text-xs text-gray-400 mt-1">
                  {format(new Date(event.startDate), 'EEEE, dd MMMM yyyy')}
                  {event.endDate &&
                    ` — ${format(new Date(event.endDate), 'dd MMMM yyyy')}`}
                </div>
              </div>
            </div>
          ))}

          {!data.length && (
            <div className="text-center py-16 text-gray-400">
              No events found
            </div>
          )}

        </div>
      )}

    </div>
  );
}