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

// ✅ GET DOWNLOADS
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
      prisma.download.findMany({
        where,
        skip: (pageNum - 1) * limitNum,
        take: limitNum,
        orderBy: { createdAt: 'desc' }
      }),
      prisma.download.count({ where })
    ]);

    res.json({ data, total });
  } catch (e: any) {
    res.status(500).json({ error: e.message });
  }
});


// ✅ UPLOAD FILE
router.post(
  '/',
  auth,
  (req: UploadRequest, res: Response, next: NextFunction) => {
    req.uploadFolder = 'downloads';
    next();
  },
  upload.single('file'),
  async (req: UploadRequest, res: Response) => {
    try {
      if (!req.file) {
        return res.status(400).json({ error: 'File required' });
      }

      const created = await prisma.download.create({
        data: {
          title: req.body.title,
          description: req.body.description || null,
          fileName: req.file.originalname,

          // ✅ FIXED (WITH slash)
          filePath: `/uploads/downloads/${req.file.filename}`,

          fileSize: `${(req.file.size / 1024).toFixed(1)} KB`,
          fileType: req.file.mimetype,
          category: req.body.category || 'general',
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
router.put('/:id', auth, async (req: Request, res: Response) => {
  try {
    const updated = await prisma.download.update({
      where: { id: Number(req.params.id) },
      data: {
        title: req.body.title,
        description: req.body.description || null,
        category: req.body.category
      }
    });

    res.json(updated);
  } catch (e: any) {
    res.status(500).json({ error: e.message });
  }
});


// ✅ DELETE
router.delete('/:id', auth, async (req: Request, res: Response) => {
  try {
    await prisma.download.update({
      where: { id: Number(req.params.id) },
      data: { isActive: false }
    });

    res.json({ message: 'Deleted' });
  } catch (e: any) {
    res.status(500).json({ error: e.message });
  }
});

export default router;