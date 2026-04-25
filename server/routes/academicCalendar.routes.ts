import { Router, Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import auth from '../middleware/auth';

const router = Router();
const prisma = new PrismaClient();

// ✅ GET
router.get('/', async (req: Request, res: Response) => {
  try {
    const { category, year } = req.query as {
      category?: string;
      year?: string;
    };

    const where: any = {};

    if (category) where.category = category;

    if (year) {
      where.startDate = {
        gte: new Date(`${year}-01-01`),
        lte: new Date(`${year}-12-31`)
      };
    }

    const data = await prisma.academicCalendar.findMany({
      where,
      orderBy: { startDate: 'asc' }
    });

    res.json(data);
  } catch (e: any) {
    res.status(500).json({ error: e.message });
  }
});


// ✅ CREATE
router.post('/', auth, async (req: Request, res: Response) => {
  try {
    const created = await prisma.academicCalendar.create({
      data: {
        title: req.body.title,
        description: req.body.description || null,
        startDate: new Date(req.body.startDate),
        endDate: req.body.endDate
          ? new Date(req.body.endDate)
          : null,
        category: req.body.category || 'general',
        isImportant:
          req.body.isImportant === true ||
          req.body.isImportant === 'true'
      }
    });

    res.status(201).json(created);
  } catch (e: any) {
    res.status(500).json({ error: e.message });
  }
});


// ✅ UPDATE
router.put('/:id', auth, async (req: Request, res: Response) => {
  try {
    const updated = await prisma.academicCalendar.update({
      where: { id: Number(req.params.id) },
      data: {
        title: req.body.title,
        description: req.body.description || null,
        startDate: req.body.startDate
          ? new Date(req.body.startDate)
          : undefined,
        endDate: req.body.endDate
          ? new Date(req.body.endDate)
          : null, // ✅ IMPORTANT FIX
        category: req.body.category,
        isImportant:
          req.body.isImportant === true ||
          req.body.isImportant === 'true'
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
    await prisma.academicCalendar.delete({
      where: { id: Number(req.params.id) }
    });

    res.json({ message: 'Deleted' });
  } catch (e: any) {
    res.status(500).json({ error: e.message });
  }
});

export default router;