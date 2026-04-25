import { Router, Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import auth from '../middleware/auth';

const router = Router();
const prisma = new PrismaClient();

router.post('/', async (req: Request, res: Response) => {
  try {
    const created = await prisma.contactMessage.create({
      data: req.body
    });

    res.status(201).json(created);
  } catch (e: any) {
    res.status(500).json({ error: e.message });
  }
});

router.get('/', auth, async (req: Request, res: Response) => {
  try {
    const { page = '1', limit = '20', isRead } = req.query as {
      page?: string;
      limit?: string;
      isRead?: string;
    };

    const where: any = {};

    if (isRead !== undefined) {
      where.isRead = isRead === 'true';
    }

    const pageNum = Number(page);
    const limitNum = Number(limit);

    const [data, total] = await Promise.all([
      prisma.contactMessage.findMany({
        where,
        skip: (pageNum - 1) * limitNum,
        take: limitNum,
        orderBy: { createdAt: 'desc' }
      }),
      prisma.contactMessage.count({ where })
    ]);

    res.json({ data, total });
  } catch (e: any) {
    res.status(500).json({ error: e.message });
  }
});

router.put('/:id/read', auth, async (req: Request, res: Response) => {
  try {
    const updated = await prisma.contactMessage.update({
      where: { id: Number(req.params.id) },
      data: { isRead: true }
    });

    res.json(updated);
  } catch (e: any) {
    res.status(500).json({ error: e.message });
  }
});

router.delete('/:id', auth, async (req: Request, res: Response) => {
  try {
    await prisma.contactMessage.delete({
      where: { id: Number(req.params.id) }
    });

    res.json({ message: 'Deleted' });
  } catch (e: any) {
    res.status(500).json({ error: e.message });
  }
});

export default router;