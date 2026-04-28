import React, { useState, useEffect } from 'react';
import { getServices } from '../../utils/api';
import {
  ExternalLink,
  Globe,
  Award,
  FileText,
  CreditCard,
  BookOpen,
  Shield,
  RefreshCw
} from 'lucide-react';

interface ServiceItem {
  id: string;
  name: string;
  description?: string;
  url?: string;
  icon?: keyof typeof ICON_MAP;
  category: string;
}

const ICON_MAP = {
  Globe,
  Award,
  FileText,
  CreditCard,
  BookOpen,
  Shield,
  RefreshCw
};

export default function ServicesPage() {

  const [data, setData] = useState<ServiceItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    setLoading(true);
    getServices()
      .then((r: any) => setData(r.data))
      .finally(() => setLoading(false));
  }, []);

  const grouped: Record<string, ServiceItem[]> = data.reduce(
    (acc: Record<string, ServiceItem[]>, s: ServiceItem) => {
      if (!acc[s.category]) acc[s.category] = [];
      acc[s.category].push(s);
      return acc;
    },
    {}
  );

  return (
    <div className="max-w-screen-xl mx-auto px-4 py-12">

      <div className="mb-8">
        <h1 className="font-display text-3xl font-bold text-gray-900 mb-2">
          Online Services
        </h1>
        <p className="text-gray-500">
          Access all student and academic services online
        </p>
      </div>

      {loading ? (
        <div className="flex justify-center py-16">
          <div className="w-8 h-8 border-4 border-primary-500 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : (
        Object.entries(grouped).map(
          ([category, services]: [string, ServiceItem[]]) => (
            <div key={category} className="mb-8">

              <h2 className="font-display text-lg font-bold text-gray-800 capitalize mb-4 flex items-center gap-2">
                <span className="w-6 h-1 bg-primary-500 rounded-full" />
                {category} Services
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">

                {services.map((s: ServiceItem) => {
                  const Icon =
                    ICON_MAP[s.icon as keyof typeof ICON_MAP] || Globe;

                  return (
                    <a
                      key={s.id}
                      href={s.url || '#'}
                      target="_blank"
                      rel="noreferrer"
                      className="bg-white rounded-2xl border border-gray-100 hover:border-primary-300 hover:shadow-card transition-all p-5 group flex items-center gap-4"
                    >

                      <div className="w-12 h-12 bg-primary-100 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:bg-primary-200 transition-colors">
                        <Icon className="w-6 h-6 text-primary-600" />
                      </div>

                      <div className="flex-1 min-w-0">
                        <h3 className="font-bold text-gray-900 text-sm group-hover:text-primary-700 transition-colors">
                          {s.name}
                        </h3>

                        {s.description && (
                          <p className="text-xs text-gray-500 mt-0.5 line-clamp-1">
                            {s.description}
                          </p>
                        )}
                      </div>

                      <ExternalLink className="w-4 h-4 text-gray-300 group-hover:text-primary-500 transition-colors flex-shrink-0" />

                    </a>
                  );
                })}

              </div>

            </div>
          )
        )
      )}

      {!loading && !data.length && (
        <div className="text-center py-12 text-gray-400">
          No services configured
        </div>
      )}

    </div>
  );
}