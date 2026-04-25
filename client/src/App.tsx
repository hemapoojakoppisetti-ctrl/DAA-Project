import React from "react";
import { BrowserRouter, Routes, Route, Navigate, Outlet } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { AuthProvider, useAuth } from "./context/AuthContext";

/* ================= PUBLIC ================= */

import PublicLayout from "./components/public/PublicLayout";
import HomePage from "./pages/public/HomePage";
import AboutPage from "./pages/public/AboutPage";
import InstitutionsPage from "./pages/public/InstitutionsPage";
import DepartmentsPage from "./pages/public/DepartmentsPage";
import FacultyPage from "./pages/public/FacultyPage";
import CalendarPage from "./pages/public/CalendarPage";
import ExamPage from "./pages/public/ExamPage";
import NotificationsPage from "./pages/public/NotificationsPage";
import DownloadsPage from "./pages/public/DownloadsPage";
import ReportsPage from "./pages/public/ReportsPage";
import FeesPage from "./pages/public/FeesPage";
import ServicesPage from "./pages/public/ServicesPage";
import MetricsPage from "./pages/public/MetricsPage";
import ContactPage from "./pages/public/ContactPage";

/* ================= ADMIN ================= */

import AdminLogin from "./pages/admin/AdminLogin";
import AdminLayout from "./components/admin/AdminLayout";
import Dashboard from "./pages/admin/Dashboard";
import AdminInstitutions from "./pages/admin/AdminInstitutions";
import AdminDepartments from "./pages/admin/AdminDepartments";
import AdminFaculty from "./pages/admin/AdminFaculty";
import AdminCalendar from "./pages/admin/AdminCalendar";
import AdminExams from "./pages/admin/AdminExams";
import AdminNotifications from "./pages/admin/AdminNotifications";
import AdminDownloads from "./pages/admin/AdminDownloads";
import AdminReports from "./pages/admin/AdminReports";
import AdminFees from "./pages/admin/AdminFees";
import AdminServices from "./pages/admin/AdminServices";
import AdminMetrics from "./pages/admin/AdminMetrics";
import AdminContacts from "./pages/admin/AdminContacts";
import AdminSettings from "./pages/admin/AdminSettings";

/* ================= PRIVATE ROUTE (FIXED) ================= */

function PrivateRoute() {
  const { admin, loading } = useAuth();

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-primary-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return admin ? <Outlet /> : <Navigate to="/admin/login" replace />;
}

/* ================= APP ================= */

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Toaster position="top-right" />

        <Routes>
          {/* Public */}
          <Route path="/" element={<PublicLayout />}>
            <Route index element={<HomePage />} />
            <Route path="about" element={<AboutPage />} />
            <Route path="institutions" element={<InstitutionsPage />} />
            <Route path="departments" element={<DepartmentsPage />} />
            <Route path="faculty-directory" element={<FacultyPage />} />
            <Route path="academic-calendar" element={<CalendarPage />} />
            <Route path="exam-timetable" element={<ExamPage />} />
            <Route path="notifications" element={<NotificationsPage />} />
            <Route path="downloads" element={<DownloadsPage />} />
            <Route path="reports" element={<ReportsPage />} />
            <Route path="fees-structure" element={<FeesPage />} />
            <Route path="online-services" element={<ServicesPage />} />
            <Route path="quality-metrics" element={<MetricsPage />} />
            <Route path="contact" element={<ContactPage />} />
          </Route>

          {/* Admin Login */}
          <Route path="/admin/login" element={<AdminLogin />} />

          {/* Protected Admin Routes */}
          <Route element={<PrivateRoute />}>
            <Route path="/admin" element={<AdminLayout />}>
              <Route index element={<Dashboard />} />
              <Route path="institutions" element={<AdminInstitutions />} />
              <Route path="departments" element={<AdminDepartments />} />
              <Route path="faculty" element={<AdminFaculty />} />
              <Route path="calendar" element={<AdminCalendar />} />
              <Route path="exams" element={<AdminExams />} />
              <Route path="notifications" element={<AdminNotifications />} />
              <Route path="downloads" element={<AdminDownloads />} />
              <Route path="reports" element={<AdminReports />} />
              <Route path="fees" element={<AdminFees />} />
              <Route path="services" element={<AdminServices />} />
              <Route path="metrics" element={<AdminMetrics />} />
              <Route path="contacts" element={<AdminContacts />} />
              <Route path="settings" element={<AdminSettings />} />
            </Route>
          </Route>

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>

      </BrowserRouter>
    </AuthProvider>
  );
}