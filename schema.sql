-- DAA Dynamic Academic Audits — PostgreSQL Schema
-- Run this if you prefer SQL over Prisma migrations

CREATE DATABASE daa_db;
\c daa_db;

-- Admins
CREATE TABLE admins (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  role VARCHAR(50) DEFAULT 'admin',
  avatar VARCHAR(500),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Institutions
CREATE TABLE institutions (
  id SERIAL PRIMARY KEY,
  name VARCHAR(500) NOT NULL,
  code VARCHAR(50) UNIQUE NOT NULL,
  address TEXT,
  city VARCHAR(100),
  state VARCHAR(100),
  phone VARCHAR(20),
  email VARCHAR(255),
  website VARCHAR(500),
  principal VARCHAR(255),
  established INTEGER,
  type VARCHAR(100) DEFAULT 'Engineering',
  accreditation VARCHAR(100),
  logo VARCHAR(500),
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Departments
CREATE TABLE departments (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  code VARCHAR(50) NOT NULL,
  description TEXT,
  hod VARCHAR(255),
  hod_email VARCHAR(255),
  phone VARCHAR(20),
  established INTEGER,
  institution_id INTEGER REFERENCES institutions(id) ON DELETE CASCADE,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Faculty
CREATE TABLE faculty (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  designation VARCHAR(100) NOT NULL,
  qualification VARCHAR(255),
  experience INTEGER,
  email VARCHAR(255),
  phone VARCHAR(20),
  specialization VARCHAR(500),
  photo VARCHAR(500),
  department_id INTEGER REFERENCES departments(id) ON DELETE CASCADE,
  is_hod BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Academic Calendar
CREATE TABLE academic_calendar (
  id SERIAL PRIMARY KEY,
  title VARCHAR(500) NOT NULL,
  description TEXT,
  start_date TIMESTAMP NOT NULL,
  end_date TIMESTAMP,
  category VARCHAR(50) DEFAULT 'general',
  is_important BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Exam Timetable
CREATE TABLE exam_timetable (
  id SERIAL PRIMARY KEY,
  course VARCHAR(100) NOT NULL,
  semester VARCHAR(20) NOT NULL,
  subject VARCHAR(255) NOT NULL,
  subject_code VARCHAR(50),
  exam_date TIMESTAMP NOT NULL,
  exam_time VARCHAR(20),
  venue VARCHAR(255),
  duration VARCHAR(50),
  pdf_file VARCHAR(500),
  academic_year VARCHAR(20),
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Notifications
CREATE TABLE notifications (
  id SERIAL PRIMARY KEY,
  title VARCHAR(500) NOT NULL,
  description TEXT,
  category VARCHAR(50) DEFAULT 'general',
  attachment VARCHAR(500),
  is_urgent BOOLEAN DEFAULT FALSE,
  is_active BOOLEAN DEFAULT TRUE,
  published_at TIMESTAMP DEFAULT NOW(),
  expires_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Downloads
CREATE TABLE downloads (
  id SERIAL PRIMARY KEY,
  title VARCHAR(500) NOT NULL,
  description TEXT,
  file_name VARCHAR(500) NOT NULL,
  file_path VARCHAR(500) NOT NULL,
  file_size VARCHAR(50),
  file_type VARCHAR(100),
  category VARCHAR(50) DEFAULT 'general',
  downloads INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Reports
CREATE TABLE reports (
  id SERIAL PRIMARY KEY,
  title VARCHAR(500) NOT NULL,
  description TEXT,
  type VARCHAR(50) DEFAULT 'audit',
  year VARCHAR(20),
  file_name VARCHAR(500),
  file_path VARCHAR(500),
  is_public BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Fees Structure
CREATE TABLE fees_structure (
  id SERIAL PRIMARY KEY,
  course VARCHAR(255) NOT NULL,
  category VARCHAR(100),
  tuition_fee DECIMAL(10,2),
  exam_fee DECIMAL(10,2),
  lab_fee DECIMAL(10,2),
  other_fee DECIMAL(10,2),
  total_fee DECIMAL(10,2),
  academic_year VARCHAR(20),
  pdf_file VARCHAR(500),
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Services
CREATE TABLE services (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  url VARCHAR(500),
  icon VARCHAR(100),
  category VARCHAR(50) DEFAULT 'student',
  is_active BOOLEAN DEFAULT TRUE,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Audit Metrics
CREATE TABLE audit_metrics (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  value DECIMAL(10,2) NOT NULL,
  target DECIMAL(10,2),
  unit VARCHAR(50),
  category VARCHAR(50) DEFAULT 'quality',
  year VARCHAR(20),
  description TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Contact Messages
CREATE TABLE contact_messages (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  phone VARCHAR(20),
  subject VARCHAR(500) NOT NULL,
  message TEXT NOT NULL,
  is_read BOOLEAN DEFAULT FALSE,
  replied BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_institutions_code ON institutions(code);
CREATE INDEX idx_institutions_active ON institutions(is_active);
CREATE INDEX idx_departments_institution ON departments(institution_id);
CREATE INDEX idx_faculty_department ON faculty(department_id);
CREATE INDEX idx_notifications_active ON notifications(is_active);
CREATE INDEX idx_notifications_category ON notifications(category);
CREATE INDEX idx_downloads_category ON downloads(category);
CREATE INDEX idx_exam_course_sem ON exam_timetable(course, semester);
CREATE INDEX idx_calendar_date ON academic_calendar(start_date);
CREATE INDEX idx_contacts_read ON contact_messages(is_read);
