# DAA — Dynamic Academic Audits System
### JNTUK Academic Management Platform | v1.0.0

---

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- PostgreSQL 14+
- npm or yarn

---

## ⚙️ Setup Instructions

### 1. Clone / Extract the project
```bash
unzip daa-project.zip
cd daa-project
```

### 2. Setup the Database
```bash
# Login to PostgreSQL
psql -U postgres

# Create database
CREATE DATABASE daa_db;
\q
```

### 3. Configure the Backend
```bash
cd server
cp .env.example .env
```
Edit `.env`:
```
DATABASE_URL="postgresql://postgres:YOUR_PASSWORD@localhost:5432/daa_db"
JWT_SECRET="daa_super_secret_key_2024_jntuk"
PORT=5000
CLIENT_URL="http://localhost:3000"
```

### 4. Install & Initialize Backend
```bash
cd server
npm install
npx prisma generate
npx prisma db push
node prisma/seed.js
```

### 5. Start the Backend
```bash
npm run dev
# Server runs at http://localhost:5000
```

### 6. Setup & Start the Frontend
```bash
cd ../client
npm install
npm start
# App runs at http://localhost:3000
```

---

## 🔐 Admin Credentials

| Field    | Value               |
|----------|---------------------|
| Email    | admin@daa.edu.in    |
| Password | admin@123           |
| URL      | http://localhost:3000/admin |

---

## 📁 Project Structure

```
daa-project/
├── client/                     # React.js Frontend
│   ├── public/
│   │   └── index.html
│   ├── src/
│   │   ├── components/
│   │   │   ├── admin/
│   │   │   │   └── AdminLayout.js
│   │   │   ├── public/
│   │   │   │   └── PublicLayout.js
│   │   │   └── shared/
│   │   │       └── UI.js
│   │   ├── context/
│   │   │   └── AuthContext.js
│   │   ├── pages/
│   │   │   ├── admin/
│   │   │   │   ├── AdminLogin.js
│   │   │   │   ├── Dashboard.js
│   │   │   │   ├── AdminInstitutions.js
│   │   │   │   ├── AdminDepartments.js
│   │   │   │   ├── AdminFaculty.js
│   │   │   │   ├── AdminCalendar.js
│   │   │   │   ├── AdminExams.js
│   │   │   │   ├── AdminNotifications.js
│   │   │   │   ├── AdminDownloads.js
│   │   │   │   ├── AdminReports.js
│   │   │   │   ├── AdminFees.js
│   │   │   │   ├── AdminServices.js
│   │   │   │   ├── AdminMetrics.js
│   │   │   │   ├── AdminContacts.js
│   │   │   │   └── AdminSettings.js
│   │   │   └── public/
│   │   │       ├── HomePage.js
│   │   │       ├── AboutPage.js
│   │   │       ├── InstitutionsPage.js
│   │   │       ├── DepartmentsPage.js
│   │   │       ├── FacultyPage.js
│   │   │       ├── CalendarPage.js
│   │   │       ├── ExamPage.js
│   │   │       ├── NotificationsPage.js
│   │   │       ├── DownloadsPage.js
│   │   │       ├── ReportsPage.js
│   │   │       ├── FeesPage.js
│   │   │       ├── ServicesPage.js
│   │   │       ├── MetricsPage.js
│   │   │       └── ContactPage.js
│   │   ├── utils/
│   │   │   └── api.js
│   │   ├── App.js
│   │   ├── index.js
│   │   └── index.css
│   ├── package.json
│   ├── tailwind.config.js
│   └── postcss.config.js
│
└── server/                     # Node.js + Express Backend
    ├── middleware/
    │   ├── auth.js
    │   └── upload.js
    ├── prisma/
    │   ├── schema.prisma
    │   └── seed.js
    ├── routes/
    │   ├── auth.js
    │   ├── institutions.js
    │   ├── departments.js
    │   ├── faculty.js
    │   ├── academicCalendar.js
    │   ├── examTimetable.js
    │   ├── notifications.js
    │   ├── downloads.js
    │   ├── reports.js
    │   ├── fees.js
    │   ├── services.js
    │   ├── metrics.js
    │   ├── contact.js
    │   └── dashboard.js
    ├── uploads/                # File uploads (auto-created)
    ├── .env.example
    ├── index.js
    └── package.json
```

---

## 🌐 API Documentation

### Authentication
| Method | Endpoint           | Description         | Auth |
|--------|--------------------|---------------------|------|
| POST   | /api/auth/login    | Admin login         | No   |
| GET    | /api/auth/me       | Get current admin   | Yes  |
| PUT    | /api/auth/profile  | Update profile      | Yes  |
| PUT    | /api/auth/change-password | Change password | Yes |

### Institutions
| Method | Endpoint                | Description         | Auth |
|--------|-------------------------|---------------------|------|
| GET    | /api/institutions       | List all (paginated, searchable) | No |
| GET    | /api/institutions/:id   | Get single institution | No |
| POST   | /api/institutions       | Create institution  | Yes  |
| PUT    | /api/institutions/:id   | Update institution  | Yes  |
| DELETE | /api/institutions/:id   | Soft delete         | Yes  |

### Departments
| Method | Endpoint              | Description              | Auth |
|--------|-----------------------|--------------------------|------|
| GET    | /api/departments      | List (filter by institution) | No |
| POST   | /api/departments      | Create                   | Yes  |
| PUT    | /api/departments/:id  | Update                   | Yes  |
| DELETE | /api/departments/:id  | Delete                   | Yes  |

### Faculty
| Method | Endpoint          | Description             | Auth |
|--------|-------------------|-------------------------|------|
| GET    | /api/faculty      | List (filter by dept)   | No   |
| POST   | /api/faculty      | Create (with photo upload) | Yes |
| PUT    | /api/faculty/:id  | Update                  | Yes  |
| DELETE | /api/faculty/:id  | Delete                  | Yes  |

### Academic Calendar
| Method | Endpoint                    | Description    | Auth |
|--------|-----------------------------|----------------|------|
| GET    | /api/academic-calendar      | List events    | No   |
| POST   | /api/academic-calendar      | Create event   | Yes  |
| PUT    | /api/academic-calendar/:id  | Update event   | Yes  |
| DELETE | /api/academic-calendar/:id  | Delete event   | Yes  |

### Exam Timetable
| Method | Endpoint                | Description       | Auth |
|--------|-------------------------|-------------------|------|
| GET    | /api/exam-timetable     | List (searchable) | No   |
| POST   | /api/exam-timetable     | Create (PDF upload) | Yes |
| PUT    | /api/exam-timetable/:id | Update            | Yes  |
| DELETE | /api/exam-timetable/:id | Soft delete       | Yes  |

### Notifications
| Method | Endpoint                  | Description           | Auth |
|--------|---------------------------|-----------------------|------|
| GET    | /api/notifications        | List (paginated)      | No   |
| POST   | /api/notifications        | Create (with attachment) | Yes |
| PUT    | /api/notifications/:id    | Update                | Yes  |
| DELETE | /api/notifications/:id    | Soft delete           | Yes  |

### Downloads
| Method | Endpoint            | Description          | Auth |
|--------|---------------------|----------------------|------|
| GET    | /api/downloads      | List (by category)   | No   |
| POST   | /api/downloads      | Upload file          | Yes  |
| PUT    | /api/downloads/:id  | Update metadata      | Yes  |
| DELETE | /api/downloads/:id  | Soft delete          | Yes  |

### Reports, Fees, Services, Metrics
All follow standard CRUD pattern with GET (public) and POST/PUT/DELETE (auth required).

### Contact
| Method | Endpoint              | Description      | Auth |
|--------|-----------------------|------------------|------|
| POST   | /api/contact          | Submit message   | No   |
| GET    | /api/contact          | List messages    | Yes  |
| PUT    | /api/contact/:id/read | Mark as read     | Yes  |
| DELETE | /api/contact/:id      | Delete message   | Yes  |

### Dashboard
| Method | Endpoint                     | Description       | Auth |
|--------|------------------------------|-------------------|------|
| GET    | /api/dashboard/stats         | All statistics    | Yes  |
| GET    | /api/dashboard/recent-activity | Recent activity | Yes  |

---

## 🗄️ Database Schema Summary

| Table             | Key Fields                                              |
|-------------------|---------------------------------------------------------|
| admins            | id, name, email, password, role                         |
| institutions      | id, name, code, city, type, accreditation, isActive     |
| departments       | id, name, code, hod, institutionId                      |
| faculty           | id, name, designation, qualification, departmentId      |
| academic_calendar | id, title, startDate, endDate, category, isImportant    |
| exam_timetable    | id, course, semester, subject, examDate, pdfFile        |
| notifications     | id, title, category, isUrgent, attachment, isActive     |
| downloads         | id, title, filePath, fileSize, category, isActive       |
| reports           | id, title, type, year, filePath, isPublic               |
| fees_structure    | id, course, tuitionFee, examFee, totalFee, academicYear |
| services          | id, name, url, category, sortOrder, isActive            |
| audit_metrics     | id, name, value, target, unit, category, year           |
| contact_messages  | id, name, email, subject, message, isRead               |

---

## 🔒 Security Features
- JWT authentication (24h expiry)
- Password hashing with bcryptjs (10 rounds)
- Protected admin routes
- File type validation on uploads
- CORS configured for frontend origin
- SQL injection prevention via Prisma ORM

---

## 📦 Tech Stack

| Layer     | Technology                        |
|-----------|-----------------------------------|
| Frontend  | React 18, Tailwind CSS, Recharts  |
| Backend   | Node.js, Express.js               |
| Database  | PostgreSQL                        |
| ORM       | Prisma                            |
| Auth      | JWT + bcryptjs                    |
| Files     | Multer (local storage)            |
| Icons     | Lucide React                      |

---

## 🚢 Production Deployment

### Backend (e.g. Railway, Render, VPS)
```bash
cd server
npm install
npx prisma generate
npx prisma db push
node prisma/seed.js
npm start
```

### Frontend (e.g. Vercel, Netlify)
```bash
cd client
# Set REACT_APP_API_URL=https://your-backend-url.com/api
npm run build
# Deploy the build/ folder
```

### Environment Variables for Production
```
DATABASE_URL=postgresql://user:pass@host:5432/daa_db
JWT_SECRET=your_very_strong_secret_here
PORT=5000
CLIENT_URL=https://your-frontend-domain.com
NODE_ENV=production
```

---

## 📞 Support
For issues or customization, contact the development team.

**DAA System — JNTUK | Dynamic Academic Audits v1.0.0**
