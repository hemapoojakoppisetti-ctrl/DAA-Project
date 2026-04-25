import React, { useEffect, useState } from 'react';
import { getDashboardStats, getRecentActivity } from '../../utils/api';
import { StatCard, SectionCard, Spinner } from '../../components/shared/UI';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Cell
} from 'recharts';
import {
  Building2, BookOpen, Users, Bell,
  Download, MessageSquare, Calendar
} from 'lucide-react';
import { format } from 'date-fns';

/* ================= TYPES ================= */

interface Metric {
  name: string;
  value: number;
  target?: number;
}

interface DashboardStats {
  institutions?: number;
  departments?: number;
  faculty?: number;
  notifications?: number;
  downloads?: number;
  unreadContacts?: number;
  metrics?: Metric[];
}

interface NotificationItem {
  id: string;
  title: string;
  createdAt: string;
}

interface EventItem {
  id: string;
  title: string;
  startDate: string;
}

interface ContactItem {
  id: string;
  name: string;
  subject: string;
  createdAt: string;
  isRead: boolean;
}

interface Activity {
  notifications?: NotificationItem[];
  upcomingEvents?: EventItem[];
  contacts?: ContactItem[];
}

/* ================= COMPONENT ================= */

export default function Dashboard() {

  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [activity, setActivity] = useState<Activity | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    Promise.all([getDashboardStats(), getRecentActivity()])
      .then(([s, a]) => {
        setStats(s.data);
        setActivity(a.data);
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <Spinner />;

  const statCards = [
    { icon: Building2, label: 'Institutions', value: stats?.institutions || 0, color: 'blue' },
    { icon: BookOpen, label: 'Departments', value: stats?.departments || 0, color: 'green' },
    { icon: Users, label: 'Faculty Members', value: stats?.faculty || 0, color: 'purple' },
    { icon: Bell, label: 'Notifications', value: stats?.notifications || 0, color: 'orange' },
    { icon: Download, label: 'Downloads', value: stats?.downloads || 0, color: 'teal' },
    { icon: MessageSquare, label: 'Unread Messages', value: stats?.unreadContacts || 0, color: 'red' }
  ];

  const metricsData = (stats?.metrics || []).map(m => ({
    name: m.name.length > 18 ? m.name.slice(0, 18) + '…' : m.name,
    value: m.value,
    target: m.target || 100
  }));

  const radarData = (stats?.metrics || []).slice(0, 6).map(m => ({
    subject: m.name.split(' ').slice(-1)[0],
    value: m.target
      ? Math.round((m.value / m.target) * 100)
      : m.value
  }));

  const COLORS = ['#3b82f6', '#10b981', '#f97316', '#8b5cf6', '#14b8a6', '#ef4444'];

  return (
    <div className="fade-in space-y-6">

      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold font-display text-gray-900">
          Dashboard Overview
        </h1>
        <p className="text-gray-500 text-sm mt-0.5">
          {format(new Date(), 'EEEE, MMMM d, yyyy')} — Academic Year 2024-25
        </p>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-4">
        {statCards.map((s, i) => (
          <StatCard key={i} {...s} />
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* Bar Chart */}
        <SectionCard title="Quality Metrics vs Target">
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={metricsData} margin={{ top: 5, right: 10, bottom: 30, left: 0 }}>
              <XAxis dataKey="name" tick={{ fontSize: 9 }} angle={-30} textAnchor="end" interval={0} />
              <YAxis tick={{ fontSize: 10 }} />
              <Tooltip contentStyle={{ borderRadius: 8, border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,.1)', fontSize: 12 }} />

              <Bar dataKey="value" radius={[4, 4, 0, 0]} name="Current">
                {metricsData.map((_, i) => (
                  <Cell key={i} fill={COLORS[i % COLORS.length]} />
                ))}
              </Bar>

              <Bar dataKey="target" fill="#e5e7eb" radius={[4, 4, 0, 0]} name="Target" />
            </BarChart>
          </ResponsiveContainer>
        </SectionCard>

        {/* Radar */}
        <SectionCard title="Performance Radar">
          <ResponsiveContainer width="100%" height={240}>
            <RadarChart data={radarData}>
              <PolarGrid stroke="#f0f0f0" />
              <PolarAngleAxis dataKey="subject" tick={{ fontSize: 10 }} />
              <PolarRadiusAxis domain={[0, 100]} tick={{ fontSize: 9 }} />
              <Radar name="Score" dataKey="value" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.15} />
              <Tooltip contentStyle={{ borderRadius: 8, border: 'none', fontSize: 12 }} />
            </RadarChart>
          </ResponsiveContainer>
        </SectionCard>

      </div>

      {/* Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Notifications */}
        <SectionCard title="Recent Notifications">
          <ul className="space-y-3">
            {(activity?.notifications || []).map(n => (
              <li key={n.id} className="flex items-start gap-3">
                <div className="w-2 h-2 bg-primary-500 rounded-full mt-2 flex-shrink-0" />
                <div>
                  <p className="text-sm font-semibold text-gray-800 line-clamp-1">
                    {n.title}
                  </p>
                  <p className="text-xs text-gray-400">
                    {format(new Date(n.createdAt), 'MMM d, yyyy')}
                  </p>
                </div>
              </li>
            ))}
            {!activity?.notifications?.length && (
              <p className="text-sm text-gray-400">No recent notifications</p>
            )}
          </ul>
        </SectionCard>

        {/* Events */}
        <SectionCard title="Upcoming Events">
          <ul className="space-y-3">
            {(activity?.upcomingEvents || []).map(e => (
              <li key={e.id} className="flex items-start gap-3">
                <div className="w-8 h-8 bg-primary-50 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Calendar className="w-4 h-4 text-primary-600" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-800 line-clamp-1">
                    {e.title}
                  </p>
                  <p className="text-xs text-gray-400">
                    {format(new Date(e.startDate), 'MMM d, yyyy')}
                  </p>
                </div>
              </li>
            ))}
            {!activity?.upcomingEvents?.length && (
              <p className="text-sm text-gray-400">No upcoming events</p>
            )}
          </ul>
        </SectionCard>

        {/* Messages */}
        <SectionCard title="Recent Messages">
          <ul className="space-y-3">
            {(activity?.contacts || []).map(c => (
              <li key={c.id} className="flex items-start gap-3">
                <div className={`w-2 h-2 rounded-full mt-2 flex-shrink-0 ${c.isRead ? 'bg-gray-300' : 'bg-orange-500'}`} />
                <div>
                  <p className="text-sm font-semibold text-gray-800">{c.name}</p>
                  <p className="text-xs text-gray-500 line-clamp-1">{c.subject}</p>
                  <p className="text-xs text-gray-400">
                    {format(new Date(c.createdAt), 'MMM d')}
                  </p>
                </div>
              </li>
            ))}
            {!activity?.contacts?.length && (
              <p className="text-sm text-gray-400">No recent messages</p>
            )}
          </ul>
        </SectionCard>

      </div>

    </div>
  );
}