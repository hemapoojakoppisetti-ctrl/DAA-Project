import { Router, Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import auth from '../middleware/auth';

const router = Router();
const prisma = new PrismaClient();

router.get('/', async (req: Request, res: Response) => {
  try {
    const { category, year } = req.query as {
      category?: string;
      year?: string;
    };

    const where: any = {};

    if (category) where.category = category;
    if (year) where.year = year;

    const data = await prisma.auditMetric.findMany({
      where,
      orderBy: { name: 'asc' }
    });

    res.json(data);
  } catch (e: any) {
    res.status(500).json({ error: e.message });
  }
});

// ✅ FIXED POST
router.post('/', auth, async (req: Request, res: Response) => {
  try {
    const created = await prisma.auditMetric.create({
      data: {
        name: req.body.name,
        value: Number(req.body.value),
        target: req.body.target ? Number(req.body.target) : null,
        unit: req.body.unit,
        category: req.body.category,
        year: req.body.year,
        description: req.body.description
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
    const updated = await prisma.auditMetric.update({
      where: { id: Number(req.params.id) },
      data: {
        name: req.body.name,
        value: Number(req.body.value),
        target: req.body.target ? Number(req.body.target) : null,
        unit: req.body.unit,
        category: req.body.category,
        year: req.body.year,
        description: req.body.description
      }
    });

    res.json(updated);
  } catch (e: any) {
    res.status(500).json({ error: e.message });
  }
});

router.delete('/:id', auth, async (req: Request, res: Response) => {
  try {
    await prisma.auditMetric.delete({
      where: { id: Number(req.params.id) }
    });

    res.json({ message: 'Deleted' });
  } catch (e: any) {
    res.status(500).json({ error: e.message });
  }
});

export default router;