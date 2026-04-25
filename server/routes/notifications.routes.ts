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
    const { category, page = '1', limit = '10' } = req.query as {
      category?: string;
      page?: string;
      limit?: string;
    };

    const where: any = { isActive: true };
    if (category) where.category = category;

    const pageNum = Number(page);
    const limitNum = Number(limit);

    const [data, total] = await Promise.all([
      prisma.notification.findMany({
        where,
        skip: (pageNum - 1) * limitNum,
        take: limitNum,
        orderBy: { publishedAt: 'desc' }
      }),
      prisma.notification.count({ where })
    ]);

    res.json({
      data,
      total,
      page: pageNum,
      totalPages: Math.ceil(total / limitNum)
    });
  } catch (e: any) {
    res.status(500).json({ error: e.message });
  }
});


// ✅ CREATE
router.post(
  '/',
  auth,
  (req: UploadRequest, res: Response, next: NextFunction) => {
    req.uploadFolder = 'notifications';
    next();
  },
  upload.single('attachment'),
  async (req: UploadRequest, res: Response) => {
    try {
      const created = await prisma.notification.create({
        data: {
          title: req.body.title,
          description: req.body.description || null,
          category: req.body.category || 'general',
          isUrgent:
            req.body.isUrgent === true ||
            req.body.isUrgent === 'true',   // ✅ FIX
          attachment: req.file
            ? `/uploads/notifications/${req.file.filename}`
            : null,
          expiresAt: req.body.expiresAt
            ? new Date(req.body.expiresAt)
            : null,
          isActive: true
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
    req.uploadFolder = 'notifications';
    next();
  },
  upload.single('attachment'),
  async (req: UploadRequest, res: Response) => {
    try {
      const updated = await prisma.notification.update({
        where: { id: Number(req.params.id) },
        data: {
          title: req.body.title,
          description: req.body.description || null,
          category: req.body.category,
          isUrgent:
            req.body.isUrgent === true ||
            req.body.isUrgent === 'true',   // ✅ FIX
          attachment: req.file
            ? `/uploads/notifications/${req.file.filename}`
            : undefined,
          expiresAt: req.body.expiresAt
            ? new Date(req.body.expiresAt)
            : null
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
    await prisma.notification.update({
      where: { id: Number(req.params.id) },
      data: { isActive: false }
    });

    res.json({ message: 'Deleted successfully' });
  } catch (e: any) {
    res.status(500).json({ error: e.message });
  }
});

export default router;