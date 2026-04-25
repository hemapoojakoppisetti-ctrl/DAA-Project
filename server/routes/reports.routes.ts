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
    const { type } = req.query as { type?: string };

    const where: any = { isPublic: true };
    if (type) where.type = type;

    const data = await prisma.report.findMany({
      where,
      orderBy: { createdAt: 'desc' }
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
    req.uploadFolder = 'reports';
    next();
  },
  upload.single('file'),
  async (req: UploadRequest, res: Response) => {
    try {
      const created = await prisma.report.create({
        data: {
          title: req.body.title,
          description: req.body.description || null,
          type: req.body.type || 'audit',
          year: req.body.year || null,
          fileName: req.file?.originalname || null,
          filePath: req.file
            ? `/uploads/reports/${req.file.filename}`
            : null,
          isPublic:
            req.body.isPublic === true ||
            req.body.isPublic === 'true'
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
    req.uploadFolder = 'reports';
    next();
  },
  upload.single('file'),
  async (req: UploadRequest, res: Response) => {
    try {
      const updated = await prisma.report.update({
        where: { id: Number(req.params.id) },
        data: {
          title: req.body.title,
          description: req.body.description || null,
          type: req.body.type,
          year: req.body.year || null,
          fileName: req.file
            ? req.file.originalname
            : undefined,
          filePath: req.file
            ? `/uploads/reports/${req.file.filename}`
            : undefined,
          isPublic:
            req.body.isPublic === true ||
            req.body.isPublic === 'true'
        }
      });

      res.json(updated);
    } catch (e: any) {
      res.status(500).json({ error: e.message });
    }
  }
);


// ✅ DELETE
router.delete('/:id', auth, async (req: Request, res: Response) => {
  try {
    await prisma.report.delete({
      where: { id: Number(req.params.id) }
    });

    res.json({ message: 'Deleted successfully' });
  } catch (e: any) {
    res.status(500).json({ error: e.message });
  }
});

export default router;