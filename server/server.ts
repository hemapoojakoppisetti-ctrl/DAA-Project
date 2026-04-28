import dotenv from 'dotenv';
dotenv.config();

import express, { Request, Response } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import morgan from 'morgan';
import path from 'path';

// Middleware & Error Handlers
import { globalErrorHandler } from './middleware/errorHandler';

// Routes
import authRoutes from './routes/auth.routes';
import institutionRoutes from './routes/institutions.routes';
import departmentRoutes from './routes/departments.routes';
import facultyRoutes from './routes/faculty.routes';
import academicCalendarRoutes from './routes/academicCalendar.routes';
import examTimetableRoutes from './routes/examTimetable.routes';
import notificationRoutes from './routes/notifications.routes';
import downloadRoutes from './routes/downloads.routes';
import reportRoutes from './routes/reports.routes';
import feesRoutes from './routes/fees.routes';
import serviceRoutes from './routes/services.routes';
import metricRoutes from './routes/metrics.routes';
import contactRoutes from './routes/contact.routes';
import dashboardRoutes from './routes/dashboard.routes';

const app = express();

// ✅ Security Middleware - Helmet
app.use(helmet());

// ✅ Rate Limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.',
});

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5, // Stricter limit for auth endpoints
  message: 'Too many login attempts, please try again later.',
});

app.use('/api/', limiter);
app.use('/api/auth/login', authLimiter);

// ✅ CORS
app.use(
  cors({
    origin: '*',
    credentials: true,
  })
);

// ✅ Request Logging
app.use(morgan('combined'));

// ✅ Body Parsing
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ✅ FIXED uploads path
const uploadsPath = path.join(__dirname, 'uploads');
app.use('/uploads', express.static(uploadsPath));

console.log('Uploads folder path:', uploadsPath);

// ✅ Routes
app.use('/api/auth', authRoutes);
app.use('/api/institutions', institutionRoutes);
app.use('/api/departments', departmentRoutes);
app.use('/api/faculty', facultyRoutes);
app.use('/api/academic-calendar', academicCalendarRoutes);
app.use('/api/exam-timetable', examTimetableRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/downloads', downloadRoutes);
app.use('/api/reports', reportRoutes);
app.use('/api/fees', feesRoutes);
app.use('/api/services', serviceRoutes);
app.use('/api/metrics', metricRoutes);
app.use('/api/contact', contactRoutes);
app.use('/api/dashboard', dashboardRoutes);

// ✅ Health check
app.get('/api/health', (req: Request, res: Response) => {
  res.json({
    success: true,
    statusCode: 200,
    message: 'Server is running',
    timestamp: new Date(),
  });
});

// ✅ 404 Handler
app.use((req: Request, res: Response) => {
  res.status(404).json({
    success: false,
    statusCode: 404,
    message: 'Route not found',
  });
});

// ✅ Global Error Handler (must be last)
app.use(globalErrorHandler);

// ✅ Server start
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 DAA Server running on port ${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
});
