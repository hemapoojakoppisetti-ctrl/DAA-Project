const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // Admin
  const adminPass = await bcrypt.hash('admin@123', 10);
  await prisma.admin.upsert({
    where: { email: 'admin@daa.edu.in' },
    update: {},
    create: { name: 'Super Admin', email: 'admin@daa.edu.in', password: adminPass, role: 'superadmin' }
  });

  // Institutions
  const inst1 = await prisma.institution.upsert({
    where: { code: 'JNTUK001' },
    update: {},
    create: {
      name: 'JNTUK University College of Engineering Kakinada',
      code: 'JNTUK001', address: 'Kakinada - 533003', city: 'Kakinada', state: 'Andhra Pradesh',
      phone: '0884-2300800', email: 'principal@jntuk.edu.in', website: 'https://jntuk.edu.in',
      principal: 'Prof. G. Sasibhushana Rao', established: 1946, type: 'University',
      accreditation: 'NAAC A++', isActive: true
    }
  });

  const inst2 = await prisma.institution.upsert({
    where: { code: 'SRKR001' },
    update: {},
    create: {
      name: 'SRKR Engineering College', code: 'SRKR001', address: 'Bhimavaram - 534204',
      city: 'Bhimavaram', state: 'Andhra Pradesh', phone: '08816-223332',
      email: 'principal@srkrec.ac.in', website: 'https://srkrec.ac.in',
      principal: 'Dr. C. Nagaraja Rao', established: 1980, type: 'Engineering',
      accreditation: 'NAAC A', isActive: true
    }
  });

  await prisma.institution.upsert({
    where: { code: 'VRSEC001' },
    update: {},
    create: {
      name: 'V.R. Siddhartha Engineering College', code: 'VRSEC001', address: 'Vijayawada - 520007',
      city: 'Vijayawada', state: 'Andhra Pradesh', phone: '0866-2497777',
      email: 'principal@vrsiddhartha.ac.in', principal: 'Dr. B. Rajendra Naik',
      established: 1976, type: 'Engineering', accreditation: 'NAAC A+', isActive: true
    }
  });

  // Departments
  const dept1 = await prisma.department.upsert({
    where: { id: 1 },
    update: {},
    create: {
      name: 'Computer Science & Engineering', code: 'CSE',
      description: 'Department of Computer Science and Engineering offering B.Tech, M.Tech and Ph.D programs.',
      hod: 'Dr. K. Srinivasa Rao', hodEmail: 'hod.cse@jntuk.edu.in',
      phone: '0884-2300810', established: 1980, institutionId: inst1.id
    }
  });

  const dept2 = await prisma.department.upsert({
    where: { id: 2 },
    update: {},
    create: {
      name: 'Electronics & Communication Engineering', code: 'ECE',
      description: 'Department of ECE with state-of-the-art labs and experienced faculty.',
      hod: 'Dr. P. Venkata Rao', hodEmail: 'hod.ece@jntuk.edu.in',
      phone: '0884-2300820', established: 1978, institutionId: inst1.id
    }
  });

  await prisma.department.upsert({
    where: { id: 3 },
    update: {},
    create: {
      name: 'Mechanical Engineering', code: 'MECH',
      description: 'Department of Mechanical Engineering with strong industry connections.',
      hod: 'Dr. S. Narayana Murthy', established: 1975, institutionId: inst1.id
    }
  });

  await prisma.department.upsert({
    where: { id: 4 },
    update: {},
    create: {
      name: 'Civil Engineering', code: 'CIVIL',
      description: 'Department of Civil Engineering offering comprehensive infrastructure programs.',
      hod: 'Dr. M. Ravi Kumar', established: 1970, institutionId: inst2.id
    }
  });

  // Faculty
  const facultyData = [
    { name: 'Dr. K. Srinivasa Rao', designation: 'Professor & HOD', qualification: 'Ph.D (CSE)', experience: 22, email: 'ksrao@jntuk.edu.in', specialization: 'Machine Learning, Data Mining', departmentId: dept1.id, isHOD: true },
    { name: 'Dr. A. Padmavathi', designation: 'Associate Professor', qualification: 'Ph.D (Computer Science)', experience: 15, email: 'apadma@jntuk.edu.in', specialization: 'Cloud Computing, Big Data', departmentId: dept1.id },
    { name: 'Mr. B. Ravi Teja', designation: 'Assistant Professor', qualification: 'M.Tech (CSE)', experience: 8, email: 'brteja@jntuk.edu.in', specialization: 'Web Technologies, IoT', departmentId: dept1.id },
    { name: 'Dr. P. Venkata Rao', designation: 'Professor & HOD', qualification: 'Ph.D (ECE)', experience: 25, email: 'pvrao@jntuk.edu.in', specialization: 'Signal Processing, VLSI Design', departmentId: dept2.id, isHOD: true },
    { name: 'Dr. G. Lakshmi Prasad', designation: 'Associate Professor', qualification: 'Ph.D (Electronics)', experience: 18, email: 'glprasad@jntuk.edu.in', specialization: 'Embedded Systems', departmentId: dept2.id },
    { name: 'Ms. S. Divya Sree', designation: 'Assistant Professor', qualification: 'M.Tech (ECE)', experience: 5, email: 'sdivya@jntuk.edu.in', specialization: 'Digital Communications', departmentId: dept2.id }
  ];

  for (const f of facultyData) {
    await prisma.faculty.create({ data: f }).catch(() => {});
  }

  // Academic Calendar
  const calendarEvents = [
    { title: 'Commencement of I Year I Semester Classes', startDate: new Date('2024-11-04'), category: 'academic', isImportant: true },
    { title: 'Mid Examination - I', startDate: new Date('2024-12-09'), endDate: new Date('2024-12-14'), category: 'exam', isImportant: true },
    { title: 'Mid Examination - II', startDate: new Date('2025-01-20'), endDate: new Date('2025-01-25'), category: 'exam', isImportant: true },
    { title: 'Last Working Day', startDate: new Date('2025-02-15'), category: 'academic', isImportant: true },
    { title: 'End Semester Examinations', startDate: new Date('2025-03-01'), endDate: new Date('2025-03-20'), category: 'exam', isImportant: true },
    { title: 'Republic Day', startDate: new Date('2025-01-26'), category: 'holiday' },
    { title: 'JNTUK Foundation Day', startDate: new Date('2025-02-02'), category: 'event', description: 'University Foundation Day Celebrations' },
    { title: 'Technical Symposium - TechFest 2025', startDate: new Date('2025-03-15'), endDate: new Date('2025-03-16'), category: 'event', description: 'Annual Technical Festival of JNTUK' }
  ];

  for (const e of calendarEvents) {
    await prisma.academicCalendar.create({ data: e }).catch(() => {});
  }

  // Exam Timetable
  await prisma.examTimetable.createMany({
    data: [
      { course: 'B.Tech', semester: 'III', subject: 'Data Structures', subjectCode: 'CS301', examDate: new Date('2025-03-05'), examTime: '10:00 AM', duration: '3 Hours', academicYear: '2024-25' },
      { course: 'B.Tech', semester: 'III', subject: 'Digital Logic Design', subjectCode: 'EC302', examDate: new Date('2025-03-07'), examTime: '10:00 AM', duration: '3 Hours', academicYear: '2024-25' },
      { course: 'B.Tech', semester: 'V', subject: 'Machine Learning', subjectCode: 'CS501', examDate: new Date('2025-03-10'), examTime: '10:00 AM', duration: '3 Hours', academicYear: '2024-25' },
      { course: 'M.Tech', semester: 'I', subject: 'Advanced Algorithms', subjectCode: 'MCS101', examDate: new Date('2025-03-12'), examTime: '02:00 PM', duration: '3 Hours', academicYear: '2024-25' }
    ],
    skipDuplicates: true
  });

  // Notifications
  await prisma.notification.createMany({
    data: [
      { title: 'B.Tech III Year II Sem End Exams Notification', description: 'End Semester Examinations for B.Tech III Year II Semester will be held from March 2025. Hall tickets can be downloaded from the university portal.', category: 'exam', isUrgent: true },
      { title: 'Admission Notification 2025-26', description: 'Applications are invited for admission to B.Tech, M.Tech and MBA programs for the academic year 2025-26.', category: 'admission', isUrgent: false },
      { title: 'NAAC Peer Team Visit - Preparation Guidelines', description: 'All departments are requested to prepare documentation as per NAAC guidelines for the upcoming peer team visit.', category: 'general', isUrgent: true },
      { title: 'Online Fee Payment Portal Updated', description: 'The online fee payment portal has been updated with new payment options. Students are requested to pay fees before the due date.', category: 'fees' },
      { title: 'Workshop on AI & ML Technologies', description: 'A 3-day national level workshop on Artificial Intelligence and Machine Learning is being organized by the CSE department.', category: 'event' }
    ],
    skipDuplicates: true
  });

  // Downloads
  await prisma.download.createMany({
    data: [
      { title: 'B.Tech R20 Regulations', description: 'Complete regulations for B.Tech R20 batch', fileName: 'btech_r20_regulations.pdf', filePath: '/uploads/downloads/btech_r20_regulations.pdf', category: 'regulations', fileType: 'application/pdf', fileSize: '2.4 MB' },
      { title: 'Academic Calendar 2024-25', description: 'Complete academic calendar for 2024-25', fileName: 'academic_calendar_2024_25.pdf', filePath: '/uploads/downloads/academic_calendar_2024_25.pdf', category: 'calendar', fileType: 'application/pdf', fileSize: '1.1 MB' },
      { title: 'Exam Application Form', description: 'Application form for end semester examinations', fileName: 'exam_application_form.pdf', filePath: '/uploads/downloads/exam_application_form.pdf', category: 'forms', fileType: 'application/pdf', fileSize: '0.5 MB' },
      { title: 'NAAC SSR Report 2023', description: 'Self Study Report submitted to NAAC', fileName: 'naac_ssr_2023.pdf', filePath: '/uploads/downloads/naac_ssr_2023.pdf', category: 'reports', fileType: 'application/pdf', fileSize: '15.2 MB' }
    ],
    skipDuplicates: true
  });

  // Reports
  await prisma.report.createMany({
    data: [
      { title: 'NAAC Self Study Report 2023', type: 'naac', year: '2023', description: 'Comprehensive SSR submitted to NAAC for accreditation', isPublic: true },
      { title: 'Annual Quality Assurance Report 2022-23', type: 'aqar', year: '2022-23', description: 'AQAR submitted to NAAC', isPublic: true },
      { title: 'NBA Accreditation Report - CSE', type: 'nba', year: '2023', description: 'NBA accreditation report for Computer Science & Engineering', isPublic: true },
      { title: 'Internal Audit Report Q1 2024', type: 'audit', year: '2024', description: 'Internal academic audit report for Q1 2024', isPublic: false }
    ],
    skipDuplicates: true
  });

  // Fees Structure
  await prisma.feesStructure.createMany({
    data: [
      { course: 'B.Tech (CSE)', category: 'Regular', tuitionFee: 85000, examFee: 5000, labFee: 8000, otherFee: 5000, totalFee: 103000, academicYear: '2024-25' },
      { course: 'B.Tech (ECE)', category: 'Regular', tuitionFee: 85000, examFee: 5000, labFee: 8000, otherFee: 5000, totalFee: 103000, academicYear: '2024-25' },
      { course: 'B.Tech (MECH)', category: 'Regular', tuitionFee: 80000, examFee: 5000, labFee: 10000, otherFee: 5000, totalFee: 100000, academicYear: '2024-25' },
      { course: 'M.Tech (CSE)', category: 'Regular', tuitionFee: 45000, examFee: 3000, labFee: 5000, otherFee: 3000, totalFee: 56000, academicYear: '2024-25' },
      { course: 'MBA', category: 'Regular', tuitionFee: 60000, examFee: 4000, labFee: 0, otherFee: 6000, totalFee: 70000, academicYear: '2024-25' }
    ],
    skipDuplicates: true
  });

  // Services
  await prisma.service.createMany({
    data: [
      { name: 'Student Results', description: 'Check your semester exam results', url: 'https://results.jntuk.edu.in', icon: 'Award', category: 'student', sortOrder: 1 },
      { name: 'Hall Ticket Download', description: 'Download your examination hall ticket', url: '#', icon: 'FileText', category: 'student', sortOrder: 2 },
      { name: 'Fee Payment', description: 'Pay your tuition and examination fees online', url: '#', icon: 'CreditCard', category: 'student', sortOrder: 3 },
      { name: 'Transcript Request', description: 'Apply for official transcripts', url: '#', icon: 'BookOpen', category: 'student', sortOrder: 4 },
      { name: 'Certificate Verification', description: 'Verify certificates issued by JNTUK', url: '#', icon: 'Shield', category: 'verification', sortOrder: 5 },
      { name: 'Revaluation Application', description: 'Apply for answer sheet revaluation', url: '#', icon: 'RefreshCw', category: 'exam', sortOrder: 6 }
    ],
    skipDuplicates: true
  });

  // Audit Metrics
  await prisma.auditMetric.createMany({
    data: [
      { name: 'NAAC Score', value: 3.62, target: 4.0, unit: '/4.0', category: 'accreditation', year: '2023', description: 'NAAC Accreditation Score' },
      { name: 'Placement Rate', value: 87.5, target: 90, unit: '%', category: 'placement', year: '2024', description: 'Campus placement percentage' },
      { name: 'Faculty Qualification (PhD)', value: 72, target: 80, unit: '%', category: 'faculty', year: '2024', description: 'Percentage of faculty with PhD' },
      { name: 'Student-Faculty Ratio', value: 15.2, target: 15, unit: ':1', category: 'academic', year: '2024', description: 'Student to faculty ratio' },
      { name: 'Research Publications', value: 248, target: 300, unit: 'papers', category: 'research', year: '2024', description: 'Total research publications' },
      { name: 'Industry Collaborations', value: 42, target: 50, unit: 'MoUs', category: 'industry', year: '2024', description: 'Active industry MoUs' },
      { name: 'Average Package (LPA)', value: 6.8, target: 8, unit: 'LPA', category: 'placement', year: '2024', description: 'Average placement package' },
      { name: 'Infrastructure Score', value: 88, target: 95, unit: '%', category: 'infrastructure', year: '2024', description: 'Infrastructure quality score' }
    ],
    skipDuplicates: true
  });

  console.log('✅ Seeding complete!');
  console.log('📧 Admin Login: admin@daa.edu.in');
  console.log('🔑 Password: admin@123');
}

main().catch(console.error).finally(() => prisma.$disconnect());
