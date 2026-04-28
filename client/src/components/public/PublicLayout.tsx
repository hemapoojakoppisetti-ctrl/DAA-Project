import React, { useState, useEffect } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { Menu, X, ChevronDown, Bell, Search, GraduationCap } from 'lucide-react';

const navItems = [
  { label: 'Home', path: '/' },
  { label: 'About', path: '/about' },
  { label: 'Institutions', path: '/institutions' },
  { label: 'Departments', path: '/departments' },
  { label: 'Faculty Directory', path: '/faculty-directory' },
  { label: 'Academic Calendar', path: '/academic-calendar' },
  { label: 'Exam Timetable', path: '/exam-timetable' },
  { label: 'Notifications', path: '/notifications' },
  { label: 'Downloads', path: '/downloads' },
  { label: 'Reports', path: '/reports' },
  { label: 'Fees Structure', path: '/fees-structure' },
  { label: 'Online Services', path: '/online-services' },
  { label: 'Quality Metrics', path: '/quality-metrics' },
  { label: 'Contact', path: '/contact' },
];

export default function PublicLayout() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => { setMobileOpen(false); }, [location]);

  return (
    <div className="min-h-screen flex flex-col">
      {/* Top Bar */}
      <div className="bg-primary-900 text-white text-xs py-1.5 px-4 flex justify-between items-center">
        <span className="font-medium">📍 JNTUK - Jawaharlal Nehru Technological University Kakinada</span>
        <div className="flex items-center gap-4">
          <span>📞 0884-2300800</span>
          <Link to="/admin" className="hover:text-primary-200 transition-colors font-semibold">Admin Login →</Link>
        </div>
      </div>

      {/* Main Header */}
      <header className={`sticky top-0 z-50 bg-white transition-shadow duration-300 ${scrolled ? 'shadow-elevated' : 'shadow-sm'}`}>
        <div className="max-w-screen-xl mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <Link to="/" className="flex items-center gap-3">
              <div className="w-10 h-10 hero-gradient rounded-xl flex items-center justify-center shadow-md">
                <GraduationCap className="w-6 h-6 text-white" />
              </div>
              <div>
                <div className="font-display font-bold text-primary-900 text-lg leading-tight">DAA</div>
                <div className="text-xs text-gray-500 font-medium leading-tight">Dynamic Academic Audits</div>
              </div>
            </Link>

            {/* Desktop Nav */}
            <nav className="hidden xl:flex items-center gap-1 flex-wrap justify-center max-w-4xl">
              {navItems.slice(0, 8).map(item => (
                <Link key={item.path} to={item.path}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${location.pathname === item.path ? 'bg-primary-50 text-primary-700' : 'text-gray-600 hover:text-primary-600 hover:bg-gray-50'}`}>
                  {item.label}
                </Link>
              ))}
              <div className="relative group">
                <button className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold text-gray-600 hover:text-primary-600 hover:bg-gray-50 transition-all">
                  More <ChevronDown className="w-3 h-3" />
                </button>
                <div className="absolute right-0 mt-1 w-48 bg-white rounded-xl shadow-elevated border border-gray-100 py-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-150 z-50">
                  {navItems.slice(8).map(item => (
                    <Link key={item.path} to={item.path}
                      className={`block px-4 py-2 text-sm font-medium transition-colors ${location.pathname === item.path ? 'text-primary-600 bg-primary-50' : 'text-gray-700 hover:bg-gray-50 hover:text-primary-600'}`}>
                      {item.label}
                    </Link>
                  ))}
                </div>
              </div>
            </nav>

            <button onClick={() => setMobileOpen(!mobileOpen)} className="xl:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors">
              {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileOpen && (
          <div className="xl:hidden bg-white border-t border-gray-100 shadow-lg">
            <nav className="max-h-80 overflow-y-auto px-4 py-3 grid grid-cols-2 gap-1">
              {navItems.map(item => (
                <Link key={item.path} to={item.path}
                  className={`px-3 py-2 rounded-lg text-sm font-semibold transition-all ${location.pathname === item.path ? 'bg-primary-50 text-primary-700' : 'text-gray-700 hover:bg-gray-50'}`}>
                  {item.label}
                </Link>
              ))}
            </nav>
          </div>
        )}
      </header>

      <main className="flex-1">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="bg-primary-900 text-white pt-12 pb-6 mt-12">
        <div className="max-w-screen-xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
                  <GraduationCap className="w-5 h-5" />
                </div>
                <span className="font-display font-bold text-lg">DAA</span>
              </div>
              <p className="text-primary-200 text-sm leading-relaxed">Dynamic Academic Audits — Official academic management system for JNTUK affiliated institutions.</p>
            </div>
            <div>
              <h4 className="font-bold text-sm mb-3 text-primary-100 uppercase tracking-wider">Quick Links</h4>
              <ul className="space-y-2">
                {['Notifications', 'Downloads', 'Exam Timetable', 'Academic Calendar'].map(l => (
                  <li key={l}><Link to={`/${l.toLowerCase().replace(/ /g, '-')}`} className="text-primary-300 hover:text-white text-sm transition-colors">{l}</Link></li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-sm mb-3 text-primary-100 uppercase tracking-wider">Academics</h4>
              <ul className="space-y-2">
                {['Institutions', 'Departments', 'Faculty Directory', 'Reports'].map(l => (
                  <li key={l}><Link to={`/${l.toLowerCase().replace(/ /g, '-')}`} className="text-primary-300 hover:text-white text-sm transition-colors">{l}</Link></li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-sm mb-3 text-primary-100 uppercase tracking-wider">Contact</h4>
              <address className="not-italic text-primary-300 text-sm space-y-1">
                <p>Kakinada - 533003</p>
                <p>Andhra Pradesh, India</p>
                <p>📞 0884-2300800</p>
                <p>✉️ info@jntuk.edu.in</p>
              </address>
            </div>
          </div>
          <div className="border-t border-primary-800 pt-4 flex flex-col md:flex-row justify-between items-center gap-2">
            <p className="text-primary-400 text-sm">© {new Date().getFullYear()} JNTUK - Dynamic Academic Audits. All rights reserved.</p>
            <p className="text-primary-500 text-xs">Powered by DAA Platform v1.0</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
