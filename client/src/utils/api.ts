import axios, {
  InternalAxiosRequestConfig,
  AxiosResponse,
  AxiosError
} from "axios";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const API = axios.create({
  baseURL: API_URL
});

/* ================= REQUEST INTERCEPTOR ================= */

API.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = localStorage.getItem("daa_token");

    if (token) {
      config.headers.set("Authorization", `Bearer ${token}`);
    }

    return config;
  },
  (error: AxiosError) => Promise.reject(error)
);

/* ================= RESPONSE INTERCEPTOR ================= */

API.interceptors.response.use(
  (response: AxiosResponse) => response,
  (error: AxiosError) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("daa_token");
      localStorage.removeItem("daa_admin");
      window.location.href = "/admin/login";
    }
    return Promise.reject(error);
  }
);

/* ================= PUBLIC APIs ================= */

export const getNotifications = (p?: any) =>
  API.get("/notifications", { params: p });

export const getDownloads = (p?: any) =>
  API.get("/downloads", { params: p });

export const getInstitutions = (p?: any) =>
  API.get("/institutions", { params: p });

export const getDepartments = (p?: any) =>
  API.get("/departments", { params: p });

export const getFaculty = (p?: any) =>
  API.get("/faculty", { params: p });

export const getAcademicCalendar = (p?: any) =>
  API.get("/academic-calendar", { params: p });

export const getExamTimetable = (p?: any) =>
  API.get("/exam-timetable", { params: p });

export const getReports = (p?: any) =>
  API.get("/reports", { params: p });

export const getFees = (p?: any) =>
  API.get("/fees", { params: p });

export const getServices = () =>
  API.get("/services");

export const getMetrics = (p?: any) =>
  API.get("/metrics", { params: p });

export const submitContact = (d: any) =>
  API.post("/contact", d);

/* ================= AUTH ================= */

export const login = (d: any) =>
  API.post("/auth/login", d);

export const getMe = () =>
  API.get("/auth/me");

export const updateProfile = (d: any) =>
  API.put("/auth/profile", d);

export const changePassword = (d: any) =>
  API.put("/auth/change-password", d);

/* ================= DASHBOARD ================= */

export const getDashboardStats = () =>
  API.get("/dashboard/stats");

export const getRecentActivity = () =>
  API.get("/dashboard/recent-activity");

/* ================= ADMIN CRUD ================= */

export const createInstitution = (d: any) =>
  API.post("/institutions", d);

export const updateInstitution = (id: number | string, d: any) =>
  API.put(`/institutions/${id}`, d);

export const deleteInstitution = (id: number | string) =>
  API.delete(`/institutions/${id}`);

/* ---- Departments ---- */

export const createDepartment = (d: any) =>
  API.post("/departments", d);

export const updateDepartment = (id: number | string, d: any) =>
  API.put(`/departments/${id}`, d);

export const deleteDepartment = (id: number | string) =>
  API.delete(`/departments/${id}`);

/* ---- Faculty ---- */

export const createFaculty = (d: any) =>
  API.post("/faculty", d);

export const updateFaculty = (id: number | string, d: any) =>
  API.put(`/faculty/${id}`, d);

export const deleteFaculty = (id: number | string) =>
  API.delete(`/faculty/${id}`);

/* ---- Calendar ---- */

export const createCalendarEvent = (d: any) =>
  API.post("/academic-calendar", d);

export const updateCalendarEvent = (id: number | string, d: any) =>
  API.put(`/academic-calendar/${id}`, d);

export const deleteCalendarEvent = (id: number | string) =>
  API.delete(`/academic-calendar/${id}`);

/* ---- Exams ---- */

export const createExam = (d: any) =>
  API.post("/exam-timetable", d);

export const updateExam = (id: number | string, d: any) =>
  API.put(`/exam-timetable/${id}`, d);

export const deleteExam = (id: number | string) =>
  API.delete(`/exam-timetable/${id}`);

/* ---- Notifications ---- */

export const createNotification = (d: any) =>
  API.post("/notifications", d);

export const updateNotification = (id: number | string, d: any) =>
  API.put(`/notifications/${id}`, d);

export const deleteNotification = (id: number | string) =>
  API.delete(`/notifications/${id}`);

/* ---- Downloads ---- */

export const createDownload = (d: any) =>
  API.post("/downloads", d);

export const updateDownload = (id: number | string, d: any) =>
  API.put(`/downloads/${id}`, d);

export const deleteDownload = (id: number | string) =>
  API.delete(`/downloads/${id}`);

/* ---- Reports ---- */

export const createReport = (d: any) =>
  API.post("/reports", d);

export const updateReport = (id: number | string, d: any) =>
  API.put(`/reports/${id}`, d);

export const deleteReport = (id: number | string) =>
  API.delete(`/reports/${id}`);

/* ---- Fees ---- */

export const createFee = (d: any) =>
  API.post("/fees", d);

export const updateFee = (id: number | string, d: any) =>
  API.put(`/fees/${id}`, d);

export const deleteFee = (id: number | string) =>
  API.delete(`/fees/${id}`);

/* ---- Services ---- */

export const createService = (d: any) =>
  API.post("/services", d);

export const updateService = (id: number | string, d: any) =>
  API.put(`/services/${id}`, d);

export const deleteService = (id: number | string) =>
  API.delete(`/services/${id}`);

/* ---- Metrics ---- */

export const createMetric = (d: any) =>
  API.post("/metrics", d);

export const updateMetric = (id: number | string, d: any) =>
  API.put(`/metrics/${id}`, d);

export const deleteMetric = (id: number | string) =>
  API.delete(`/metrics/${id}`);

/* ---- Contacts ---- */

export const getContacts = (p?: any) =>
  API.get("/contact", { params: p });

export const markContactRead = (id: number | string) =>
  API.put(`/contact/${id}/read`);

export const deleteContact = (id: number | string) =>
  API.delete(`/contact/${id}`);

export default API;