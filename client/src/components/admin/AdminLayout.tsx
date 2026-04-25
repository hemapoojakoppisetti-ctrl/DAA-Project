import React, { useState } from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  LayoutDashboard, Building2, BookOpen, Users, CalendarDays,
  ClipboardList, Bell, Download, FileText, DollarSign,
  Globe, BarChart3, MessageSquare, Settings, LogOut,
  Menu, X, GraduationCap, Search, ChevronDown, ExternalLink
} from 'lucide-react';

const navGroups = [
  { label: 'Overview', items: [{ icon: LayoutDashboard, label: 'Dashboard', path: '/admin' }] },
  { label: 'Management', items: [
    { icon: Building2, label: 'Institutions', path: '/admin/institutions' },
    { icon: BookOpen, label: 'Departments', path: '/admin/departments' },
    { icon: Users, label: 'Faculty', path: '/admin/faculty' },
  ]},
  { label: 'Academic', items: [
    { icon: CalendarDays, label: 'Academic Calendar', path: '/admin/calendar' },
    { icon: ClipboardList, label: 'Exam Timetable', path: '/admin/exams' },
    { icon: Bell, label: 'Notifications', path: '/admin/notifications' },
  ]},
  { label: 'Resources', items: [
    { icon: Download, label: 'Downloads', path: '/admin/downloads' },
    { icon: FileText, label: 'Reports', path: '/admin/reports' },
    { icon: DollarSign, label: 'Fees Structure', path: '/admin/fees' },
    { icon: Globe, label: 'Online Services', path: '/admin/services' },
    { icon: BarChart3, label: 'Quality Metrics', path: '/admin/metrics' },
  ]},
  { label: 'Communication', items: [
    { icon: MessageSquare, label: 'Contact Messages', path: '/admin/contacts' },
  ]},
  { label: 'System', items: [
    { icon: Settings, label: 'Settings', path: '/admin/settings' },
  ]},
];

export default function AdminLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [profileOpen, setProfileOpen] = useState(false);
  const { admin, logoutAdmin } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => { logoutAdmin(); navigate('/admin/login'); };

  return (
    <div className="flex h-screen bg-gray-100 overflow-hidden">
      {/* Sidebar */}
      <aside className={`${sidebarOpen ? 'w-64' : 'w-16'} flex-shrink-0 bg-slate-900 flex flex-col transition-all duration-300 overflow-hidden`}>
        {/* Logo */}
        <div className="h-16 flex items-center px-4 border-b border-slate-800">
          <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center flex-shrink-0">
            <GraduationCap className="w-5 h-5 text-white" />
          </div>
          {sidebarOpen && (
            <div className="ml-3 overflow-hidden">
              <div className="font-display font-bold text-white text-sm leading-tight">DAA Admin</div>
              <div className="text-slate-400 text-xs">Management Panel</div>
            </div>
          )}
        </div>

        {/* Nav */}
        <nav className="flex-1 overflow-y-auto py-4 px-2">
          {navGroups.map(group => (
            <div key={group.label} className="mb-4">
              {sidebarOpen && <div className="px-2 mb-1 text-xs font-bold text-slate-500 uppercase tracking-widest">{group.label}</div>}
              {group.items.map(item => (
                <NavLink key={item.path} to={item.path} end={item.path === '/admin'}
                  className={({ isActive }) => `${isActive ? 'sidebar-link-active' : 'sidebar-link-inactive'} mb-0.5 ${!sidebarOpen ? 'justify-center px-2' : ''}`}
                  title={!sidebarOpen ? item.label : ''}>
                  <item.icon className="w-4 h-4 flex-shrink-0" />
                  {sidebarOpen && <span className="truncate">{item.label}</span>}
                </NavLink>
              ))}
            </div>
          ))}
        </nav>

        {/* Sidebar Toggle */}
        <div className="p-3 border-t border-slate-800">
          <button onClick={() => setSidebarOpen(!sidebarOpen)}
            className="w-full flex items-center justify-center gap-2 p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-all text-sm font-medium">
            {sidebarOpen ? <><X className="w-4 h-4" /><span>Collapse</span></> : <Menu className="w-4 h-4" />}
          </button>
        </div>
      </aside>

      {/* Main */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Bar */}
        <header className="h-16 bg-white shadow-sm flex items-center justify-between px-6 flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="relative">
              <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input placeholder="Search..." className="pl-9 pr-4 py-2 text-sm bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 w-64" />
            </div>
          </div>

          <div className="flex items-center gap-3">
            <a href="/" target="_blank" rel="noreferrer"
              className="flex items-center gap-1.5 text-sm text-gray-600 hover:text-primary-600 transition-colors font-medium">
              <ExternalLink className="w-4 h-4" /> View Site
            </a>

            <div className="relative">
              <button onClick={() => setProfileOpen(!profileOpen)}
                className="flex items-center gap-2 pl-3 pr-2 py-1.5 rounded-xl hover:bg-gray-50 transition-all border border-gray-200">
                <div className="w-7 h-7 bg-primary-600 rounded-lg flex items-center justify-center text-white text-sm font-bold">
                  {admin?.name?.[0] || 'A'}
                </div>
                <div className="text-left hidden sm:block">
                  <div className="text-sm font-semibold text-gray-800">{admin?.name || 'Admin'}</div>
                  <div className="text-xs text-gray-400 capitalize">{admin?.role}</div>
                </div>
                <ChevronDown className="w-4 h-4 text-gray-400" />
              </button>

              {profileOpen && (
                <div className="absolute right-0 top-full mt-2 w-44 bg-white rounded-xl shadow-elevated border border-gray-100 py-1 z-50">
                  <NavLink to="/admin/settings" onClick={() => setProfileOpen(false)}
                    className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors">
                    <Settings className="w-4 h-4" /> Settings
                  </NavLink>
                  <button onClick={handleLogout}
                    className="flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors w-full">
                    <LogOut className="w-4 h-4" /> Logout
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 overflow-y-auto p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
