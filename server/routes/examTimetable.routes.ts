import { Router, Request, Response, NextFunction } from 'express';
import { PrismaClient } from '@prisma/client';
import auth from '../middleware/auth';
import upload from '../middleware/upload';

const router = Router();
const prisma = new PrismaClient();

interface UploadRequest extends Request {
  uploadFolder?: string;
  file?: Express.Multer.File;
}


// ✅ GET
router.get('/', async (req: Request, res: Response) => {
  try {
    const { course, semester, search } = req.query as {
      course?: string;
      semester?: string;
      search?: string;
    };

    const where: any = { isActive: true };

    if (course) {
      where.course = { contains: course, mode: 'insensitive' };
    }

    if (semester) {
      where.semester = semester;
    }

    if (search) {
      where.OR = [
        { subject: { contains: search, mode: 'insensitive' } },
        { course: { contains: search, mode: 'insensitive' } }
      ];
    }

    const data = await prisma.examTimetable.findMany({
      where,
      orderBy: { examDate: 'asc' }
    });

    res.json(data);
  } catch (e: any) {
    res.status(500).json({ error: e.message });
  }
});


// ✅ CREATE
router.post(
  '/',
  auth,
  (req: UploadRequest, res: Response, next: NextFunction) => {
    req.uploadFolder = 'exams';
    next();
  },
  upload.single('pdfFile'),
  async (req: UploadRequest, res: Response) => {
    try {
      const created = await prisma.examTimetable.create({
        data: {
          course: req.body.course,
          semester: req.body.semester,
          subject: req.body.subject,
          subjectCode: req.body.subjectCode || null,
          examDate: new Date(req.body.examDate),
          examTime: req.body.examTime || null,
          venue: req.body.venue || null,
          duration: req.body.duration || null,
          pdfFile: req.file
            ? `/uploads/exams/${req.file.filename}`
            : null,
          academicYear: req.body.academicYear || null,
          isActive:
            req.body.isActive === true ||
            req.body.isActive === 'true'
        }
      });

      res.status(201).json(created);
    } catch (e: any) {
      res.status(500).json({ error: e.message });
    }
  }
);


// ✅ UPDATE
router.put(
  '/:id',
  auth,
  (req: UploadRequest, res: Response, next: NextFunction) => {
    req.uploadFolder = 'exams';
    next();
  },
  upload.single('pdfFile'),
  async (req: UploadRequest, res: Response) => {
    try {
      const updated = await prisma.examTimetable.update({
        where: { id: Number(req.params.id) },
        data: {
          course: req.body.course,
          semester: req.body.semester,
          subject: req.body.subject,
          subjectCode: req.body.subjectCode || null,
          examDate: req.body.examDate
            ? new Date(req.body.examDate)
            : undefined,
          examTime: req.body.examTime || null,
          venue: req.body.venue || null,
          duration: req.body.duration || null,
          pdfFile: req.file
            ? `/uploads/exams/${req.file.filename}`
            : undefined,
          academicYear: req.body.academicYear || null,
          isActive:
            req.body.isActive === true ||
            req.body.isActive === 'true'
        }
      });

      res.json(updated);
    } catch (e: any) {
      res.status(500).json({ error: e.message });
    }
  }
);


// ✅ DELETE (soft delete)
router.delete('/:id', auth, async (req: Request, res: Response) => {
  try {
    await prisma.examTimetable.update({
      where: { id: Number(req.params.id) },
      data: { isActive: false }
    });

    res.json({ message: 'Deleted successfully' });
  } catch (e: any) {
    res.status(500).json({ error: e.message });
  }
});

export default router;