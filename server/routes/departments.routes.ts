import { Router, Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import auth from '../middleware/auth';

const router = Router();
const prisma = new PrismaClient();

router.get('/', async (req: Request, res: Response) => {
  try {
    const { search, institutionId, page = '1', limit = '20' } = req.query as {
      search?: string;
      institutionId?: string;
      page?: string;
      limit?: string;
    };

    const where: any = {};

    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { code: { contains: search, mode: 'insensitive' } }
      ];
    }

    if (institutionId) {
      where.institutionId = Number(institutionId);
    }

    const pageNum = Number(page);
    const limitNum = Number(limit);

    const [data, total] = await Promise.all([
      prisma.department.findMany({
        where,
        skip: (pageNum - 1) * limitNum,
        take: limitNum,
        include: {
          institution: { select: { name: true } },
          _count: { select: { faculty: true } }
        },
        orderBy: { name: 'asc' }
      }),
      prisma.department.count({ where })
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

router.get('/:id', async (req: Request, res: Response) => {
  try {
    const dept = await prisma.department.findUnique({
      where: { id: Number(req.params.id) },
      include: { institution: true, faculty: true }
    });

    res.json(dept);
  } catch (e: any) {
    res.status(500).json({ error: e.message });
  }
});

// ✅ FIXED POST
router.post('/', auth, async (req: Request, res: Response) => {
  try {
    const created = await prisma.department.create({
      data: {
        name: req.body.name,
        code: req.body.code,
        description: req.body.description,
        hod: req.body.hod,
        hodEmail: req.body.hodEmail,
        phone: req.body.phone,
        established: req.body.established
          ? parseInt(req.body.established)
          : null,
        institutionId: Number(req.body.institutionId)
      }
    });

    res.status(201).json(created);
  } catch (e: any) {
    res.status(500).json({ error: e.message });
  }
});

// ✅ FIXED PUT
router.put('/:id', auth, async (req: Request, res: Response) => {
  try {
    const updated = await prisma.department.update({
      where: { id: Number(req.params.id) },
      data: {
        name: req.body.name,
        code: req.body.code,
        description: req.body.description,
        hod: req.body.hod,
        hodEmail: req.body.hodEmail,
        phone: req.body.phone,
        established: req.body.established
          ? parseInt(req.body.established)
          : null,
        institutionId: Number(req.body.institutionId)
      }
    });

    res.json(updated);
  } catch (e: any) {
    res.status(500).json({ error: e.message });
  }
});

router.delete('/:id', auth, async (req: Request, res: Response) => {
  try {
    await prisma.department.delete({
      where: { id: Number(req.params.id) }
    });

    res.json({ message: 'Deleted' });
  } catch (e: any) {
    res.status(500).json({ error: e.message });
  }
});

export default router;