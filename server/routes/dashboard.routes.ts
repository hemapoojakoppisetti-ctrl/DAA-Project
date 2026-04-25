import { Router, Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import auth from '../middleware/auth';

const router = Router();
const prisma = new PrismaClient();

router.get('/stats', auth, async (req: Request, res: Response) => {
  try {
    const [
      institutions,
      departments,
      faculty,
      notifications,
      downloads,
      contacts,
      reports,
      metrics
    ] = await Promise.all([
      prisma.institution.count({ where: { isActive: true } }),
      prisma.department.count(),
      prisma.faculty.count(),
      prisma.notification.count({ where: { isActive: true } }),
      prisma.download.count({ where: { isActive: true } }),
      prisma.contactMessage.count({ where: { isRead: false } }),
      prisma.report.count(),
      prisma.auditMetric.findMany({
        orderBy: { createdAt: 'desc' },
        take: 6
      })
    ]);

    res.json({
      institutions,
      departments,
      faculty,
      notifications,
      downloads,
      unreadContacts: contacts,
      reports,
      metrics
    });
  } catch (e: any) {
    res.status(500).json({ error: e.message });
  }
});

router.get('/recent-activity', auth, async (req: Request, res: Response) => {
  try {
    const [notifications, downloads, contacts, calendar] =
      await Promise.all([
        prisma.notification.findMany({
          take: 5,
          orderBy: { createdAt: 'desc' },
          select: {
            id: true,
            title: true,
            createdAt: true,
            category: true
          }
        }),

        prisma.download.findMany({
          take: 5,
          orderBy: { createdAt: 'desc' },
          select: {
            id: true,
            title: true,
            createdAt: true,
            category: true
          }
        }),

        prisma.contactMessage.findMany({
          take: 5,
          orderBy: { createdAt: 'desc' },
          select: {
            id: true,
            name: true,
            subject: true,
            createdAt: true,
            isRead: true
          }
        }),

        prisma.academicCalendar.findMany({
          take: 5,
          where: { startDate: { gte: new Date() } },
          orderBy: { startDate: 'asc' },
          select: {
            id: true,
            title: true,
            startDate: true,
            category: true
          }
        })
      ]);

    res.json({
      notifications,
      downloads,
      contacts,
      upcomingEvents: calendar
    });
  } catch (e: any) {
    res.status(500).json({ error: e.message });
  }
});

export default router;