import { Router, Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import auth from '../middleware/auth';

const router = Router();
const prisma = new PrismaClient();

router.get('/', async (req: Request, res: Response) => {
  try {
    const data = await prisma.service.findMany({
      where: { isActive: true },
      orderBy: { sortOrder: 'asc' }
    });

    res.json(data);
  } catch (e: any) {
    res.status(500).json({ error: e.message });
  }
});

router.post('/', auth, async (req: Request, res: Response) => {
  try {
    const created = await prisma.service.create({
      data: req.body
    });

    res.status(201).json(created);
  } catch (e: any) {
    res.status(500).json({ error: e.message });
  }
});

router.put('/:id', auth, async (req: Request, res: Response) => {
  try {
    const updated = await prisma.service.update({
      where: { id: Number(req.params.id) },
      data: req.body
    });

    res.json(updated);
  } catch (e: any) {
    res.status(500).json({ error: e.message });
  }
});

router.delete('/:id', auth, async (req: Request, res: Response) => {
  try {
    await prisma.service.update({
      where: { id: Number(req.params.id) },
      data: { isActive: false }
    });

    res.json({ message: 'Deleted' });
  } catch (e: any) {
    res.status(500).json({ error: e.message });
  }
});

export default router;