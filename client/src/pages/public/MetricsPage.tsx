import React, { useState, useEffect } from 'react';
import { getMetrics } from '../../utils/api';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Cell
} from 'recharts';
import { TrendingUp } from 'lucide-react';

interface Metric {
  id: string;
  name: string;
  value: number;
  target?: number;
  unit?: string;
  description?: string;
  category?: string;
}

const COLORS: string[] = ['#3b82f6','#10b981','#f97316','#8b5cf6','#14b8a6','#ef4444','#f59e0b','#6366f1'];

const CAT_COLORS: Record<string, string> = {
  quality:'bg-blue-100 text-blue-700',
  accreditation:'bg-purple-100 text-purple-700',
  placement:'bg-green-100 text-green-700',
  faculty:'bg-orange-100 text-orange-700',
  research:'bg-teal-100 text-teal-700',
  industry:'bg-indigo-100 text-indigo-700',
  infrastructure:'bg-red-100 text-red-700',
  academic:'bg-yellow-100 text-yellow-700'
};

export default function MetricsPage() {

  const [data, setData] = useState<Metric[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    setLoading(true);
    getMetrics()
      .then((r: any) => setData(r.data))
      .finally(() => setLoading(false));
  }, []);

  const chartData = data.map((m: Metric, i: number) => ({
    name: m.name.split(' ').slice(-1)[0],
    value: m.value,
    target: m.target || 0,
    fill: COLORS[i % COLORS.length]
  }));

  const radarData = data.slice(0, 6).map((m: Metric) => ({
    subject: m.name.split(' ').slice(-1)[0],
    value: m.target
      ? Math.round((m.value / m.target) * 100)
      : Math.min(m.value, 100)
  }));

  return (
    <div className="max-w-screen-xl mx-auto px-4 py-12">

      <div className="mb-8">
        <h1 className="font-display text-3xl font-bold text-gray-900 mb-2">
          Quality Metrics
        </h1>
        <p className="text-gray-500">
          Key performance indicators and quality benchmarks for academic year 2024-25
        </p>
      </div>

      {loading ? (
        <div className="flex justify-center py-16">
          <div className="w-8 h-8 border-4 border-primary-500 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : (
        <>
          {/* KPI Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
            {data.map((m: Metric, i: number) => {
              const pct = m.target
                ? Math.min(100, Math.round((m.value / m.target) * 100))
                : null;

              return (
                <div
                  key={m.id}
                  className="bg-white rounded-2xl border border-gray-100 hover:shadow-card transition-all p-5"
                >
                  <div className="flex items-center justify-between mb-2">
                    <div
                      className={`text-xs px-2 py-0.5 rounded-full font-semibold capitalize ${
                        CAT_COLORS[m.category || ''] ||
                        'bg-gray-100 text-gray-600'
                      }`}
                    >
                      {m.category}
                    </div>

                    <TrendingUp
                      className="w-4 h-4"
                      style={{ color: COLORS[i % COLORS.length] }}
                    />
                  </div>

                  <div className="text-3xl font-display font-bold text-gray-900">
                    {m.value}
                    <span className="text-base font-normal text-gray-400 ml-1">
                      {m.unit}
                    </span>
                  </div>

                  <div className="text-sm font-semibold text-gray-700 mt-1">
                    {m.name}
                  </div>

                  {m.description && (
                    <div className="text-xs text-gray-400 mt-0.5">
                      {m.description}
                    </div>
                  )}

                  {pct !== null && (
                    <div className="mt-3">
                      <div className="flex justify-between text-xs text-gray-400 mb-1">
                        <span>
                          vs Target {m.target}{m.unit}
                        </span>
                        <span>{pct}%</span>
                      </div>

                      <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                        <div
                          className="h-full rounded-full"
                          style={{
                            width: `${pct}%`,
                            backgroundColor: COLORS[i % COLORS.length]
                          }}
                        />
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Charts */}
          {data.length > 0 && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

              <div className="bg-white rounded-2xl border border-gray-100 p-6">
                <h3 className="font-display font-bold text-gray-900 mb-4">
                  Metrics vs Target Comparison
                </h3>

                <ResponsiveContainer width="100%" height={280}>
                  <BarChart
                    data={chartData}
                    margin={{ top: 5, right: 10, bottom: 40, left: 0 }}
                  >
                    <XAxis
                      dataKey="name"
                      tick={{ fontSize: 10 }}
                      angle={-35}
                      textAnchor="end"
                      interval={0}
                    />
                    <YAxis tick={{ fontSize: 10 }} />

                    <Tooltip
                      contentStyle={{
                        borderRadius: 8,
                        border: 'none',
                        boxShadow: '0 4px 20px rgba(0,0,0,.1)',
                        fontSize: 12
                      }}
                    />

                    <Bar dataKey="value" radius={[4,4,0,0]} name="Current Value">
                      {chartData.map((entry, i: number) => (
                        <Cell key={i} fill={entry.fill} />
                      ))}
                    </Bar>

                    <Bar
                      dataKey="target"
                      fill="#e5e7eb"
                      radius={[4,4,0,0]}
                      name="Target"
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              <div className="bg-white rounded-2xl border border-gray-100 p-6">
                <h3 className="font-display font-bold text-gray-900 mb-4">
                  Performance Radar (%)
                </h3>

                <ResponsiveContainer width="100%" height={280}>
                  <RadarChart data={radarData}>
                    <PolarGrid stroke="#f0f0f0" />
                    <PolarAngleAxis dataKey="subject" tick={{ fontSize: 11 }} />
                    <PolarRadiusAxis domain={[0, 100]} tick={{ fontSize: 9 }} />

                    <Radar
                      name="Score"
                      dataKey="value"
                      stroke="#3b82f6"
                      fill="#3b82f6"
                      fillOpacity={0.15}
                      strokeWidth={2}
                    />

                    <Tooltip
                      contentStyle={{
                        borderRadius: 8,
                        border: 'none',
                        fontSize: 12
                      }}
                      formatter={(v: any) => [`${v}%`, 'Achievement']}
                    />
                  </RadarChart>
                </ResponsiveContainer>
              </div>

            </div>
          )}

        </>
      )}

    </div>
  );
}