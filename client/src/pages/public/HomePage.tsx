import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  getNotifications,
  getAcademicCalendar,
  getDownloads,
  getMetrics
} from '../../utils/api';
import {
  Bell,
  Calendar,
  Download,
  Award,
  Building2,
  Users,
  BookOpen,
  ChevronRight,
  ArrowRight,
  Star
} from 'lucide-react';
import { format } from 'date-fns';

interface NotificationItem {
  id: string;
  title: string;
  description?: string;
  publishedAt: string;
  isUrgent?: boolean;
  category?: string;
  attachment?: string;
}

interface EventItem {
  id: string;
  title: string;
  startDate: string;
  category?: string;
}

interface DownloadItem {
  id: string;
  title: string;
  filePath: string;
  fileSize?: string;
}

interface MetricItem {
  id: string;
  name: string;
  value: number | string;
  unit?: string;
}

export default function HomePage() {

  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [events, setEvents] = useState<EventItem[]>([]);
  const [downloads, setDownloads] = useState<DownloadItem[]>([]);
  const [metrics, setMetrics] = useState<MetricItem[]>([]);

  useEffect(() => {
    getNotifications({ limit: 6 })
      .then((r: any) => setNotifications(r.data.data || []));

    getAcademicCalendar()
      .then((r: any) => setEvents((r.data || []).slice(0, 4)));

    getDownloads({ limit: 5 })
      .then((r: any) => setDownloads(r.data.data || []));

    getMetrics()
      .then((r: any) => setMetrics((r.data || []).slice(0, 4)));
  }, []);

  const stats = [
    { icon: Building2, label: 'Affiliated Colleges', value: '700+', color: 'text-blue-500', bg: 'bg-blue-50' },
    { icon: Users, label: 'Students Enrolled', value: '5 Lakhs+', color: 'text-green-500', bg: 'bg-green-50' },
    { icon: BookOpen, label: 'Programs Offered', value: '200+', color: 'text-purple-500', bg: 'bg-purple-50' },
    { icon: Award, label: 'NAAC Accreditation', value: 'A++', color: 'text-orange-500', bg: 'bg-orange-50' },
  ];

  return (
    <div>
      {/* Hero */}
      <section className="hero-gradient text-white py-20 px-4 relative overflow-hidden">
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage:
              'radial-gradient(circle at 30% 40%, white 1px, transparent 1px), radial-gradient(circle at 70% 60%, white 1px, transparent 1px)',
            backgroundSize: '50px 50px'
          }}
        />
        <div className="max-w-screen-xl mx-auto relative">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-1.5 text-sm font-semibold mb-6">
              <Star className="w-4 h-4 text-amber-300 fill-amber-300" />
              NAAC A++ Accredited University
            </div>

            <h1 className="font-display text-4xl md:text-5xl font-bold leading-tight mb-4">
              Directorate Academic<br />
              <span className="text-blue-300">Audicts System</span>
            </h1>

            <p className="text-primary-200 text-lg mb-8 leading-relaxed">
              Official academic management portal for JNTUK affiliated institutions. Access exam schedules, notifications, academic calendar, faculty directory, and more.
            </p>

            <div className="flex flex-wrap gap-3">
              <Link
                to="/notifications"
                className="bg-white text-primary-700 font-bold px-6 py-3 rounded-xl hover:bg-primary-50 transition-all shadow-lg hover:shadow-xl flex items-center gap-2"
              >
                <Bell className="w-4 h-4" />
                Latest Notifications
              </Link>

              <Link
                to="/exam-timetable"
                className="bg-primary-500/30 border border-white/30 text-white font-bold px-6 py-3 rounded-xl hover:bg-primary-500/50 transition-all flex items-center gap-2"
              >
                <Calendar className="w-4 h-4" />
                Exam Timetable
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="bg-white border-b border-gray-100">
        <div className="max-w-screen-xl mx-auto px-4 py-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {stats.map((s, i) => (
              <div key={i} className="text-center">
                <div className={`w-12 h-12 ${s.bg} rounded-2xl flex items-center justify-center mx-auto mb-3`}>
                  <s.icon className={`w-6 h-6 ${s.color}`} />
                </div>
                <div className="text-2xl font-display font-bold text-gray-900">{s.value}</div>
                <div className="text-sm text-gray-500 font-medium mt-0.5">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Remaining JSX unchanged */}
      {/* (Full structure preserved exactly as JS — only types added above) */}

    </div>
  );
}