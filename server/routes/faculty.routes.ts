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

// ✅ GET ALL
router.get('/', async (req: Request, res: Response) => {
  try {
    const { search, departmentId, page = '1', limit = '20' } = req.query as {
      search?: string;
      departmentId?: string;
      page?: string;
      limit?: string;
    };

    const where: any = {};

    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { designation: { contains: search, mode: 'insensitive' } },
        { specialization: { contains: search, mode: 'insensitive' } }
      ];
    }

    if (departmentId) {
      where.departmentId = Number(departmentId);
    }

    const pageNum = Number(page);
    const limitNum = Number(limit);

    const [data, total] = await Promise.all([
      prisma.faculty.findMany({
        where,
        skip: (pageNum - 1) * limitNum,
        take: limitNum,
        include: {
          department: {
            select: {
              name: true,
              institution: { select: { name: true } }
            }
          }
        },
        orderBy: { name: 'asc' }
      }),
      prisma.faculty.count({ where })
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
    req.uploadFolder = 'faculty';
    next();
  },
  upload.single('photo'),
  async (req: UploadRequest, res: Response) => {
    try {
      const created = await prisma.faculty.create({
        data: {
          name: req.body.name,
          designation: req.body.designation,
          qualification: req.body.qualification || null,
          experience: req.body.experience
            ? Number(req.body.experience)
            : null,
          email: req.body.email || null,
          phone: req.body.phone || null,
          specialization: req.body.specialization || null,
          photo: req.file
            ? `/uploads/faculty/${req.file.filename}`
            : null,
          departmentId: Number(req.body.departmentId),
          isHOD: req.body.isHOD === 'true' // ✅ FIX
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
    req.uploadFolder = 'faculty';
    next();
  },
  upload.single('photo'),
  async (req: UploadRequest, res: Response) => {
    try {
      const updated = await prisma.faculty.update({
        where: { id: Number(req.params.id) },
        data: {
          name: req.body.name,
          designation: req.body.designation,
          qualification: req.body.qualification || null,
          experience: req.body.experience
            ? Number(req.body.experience)
            : null,
          email: req.body.email || null,
          phone: req.body.phone || null,
          specialization: req.body.specialization || null,
          photo: req.file
            ? `/uploads/faculty/${req.file.filename}`
            : undefined,
          departmentId: Number(req.body.departmentId),
          isHOD: req.body.isHOD === 'true' // ✅ FIX
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
    await prisma.faculty.delete({
      where: { id: Number(req.params.id) }
    });

    res.json({ message: 'Deleted' });
  } catch (e: any) {
    res.status(500).json({ error: e.message });
  }
});

export default router;