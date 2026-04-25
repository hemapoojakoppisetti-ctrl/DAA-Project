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
    const { course } = req.query as { course?: string };

    const where: any = { isActive: true };

    if (course) {
      where.course = { contains: course, mode: 'insensitive' };
    }

    const data = await prisma.feesStructure.findMany({
      where,
      orderBy: { course: 'asc' }
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
    req.uploadFolder = 'fees';
    next();
  },
  upload.single('pdfFile'),
  async (req: UploadRequest, res: Response) => {
    try {
      const created = await prisma.feesStructure.create({
        data: {
          course: req.body.course,
          category: req.body.category || null,
          tuitionFee: req.body.tuitionFee
            ? Number(req.body.tuitionFee)
            : null,
          examFee: req.body.examFee
            ? Number(req.body.examFee)
            : null,
          labFee: req.body.labFee
            ? Number(req.body.labFee)
            : null,
          otherFee: req.body.otherFee
            ? Number(req.body.otherFee)
            : null,
          totalFee: req.body.totalFee
            ? Number(req.body.totalFee)
            : null,
          academicYear: req.body.academicYear || null,
          pdfFile: req.file
            ? `/uploads/fees/${req.file.filename}`
            : null,
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
    req.uploadFolder = 'fees';
    next();
  },
  upload.single('pdfFile'),
  async (req: UploadRequest, res: Response) => {
    try {
      const updated = await prisma.feesStructure.update({
        where: { id: Number(req.params.id) },
        data: {
          course: req.body.course,
          category: req.body.category || null,
          tuitionFee: req.body.tuitionFee
            ? Number(req.body.tuitionFee)
            : null,
          examFee: req.body.examFee
            ? Number(req.body.examFee)
            : null,
          labFee: req.body.labFee
            ? Number(req.body.labFee)
            : null,
          otherFee: req.body.otherFee
            ? Number(req.body.otherFee)
            : null,
          totalFee: req.body.totalFee
            ? Number(req.body.totalFee)
            : null,
          academicYear: req.body.academicYear || null,
          pdfFile: req.file
            ? `/uploads/fees/${req.file.filename}`
            : undefined,
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
    await prisma.feesStructure.update({
      where: { id: Number(req.params.id) },
      data: { isActive: false }
    });

    res.json({ message: 'Deleted successfully' });
  } catch (e: any) {
    res.status(500).json({ error: e.message });
  }
});

export default router;