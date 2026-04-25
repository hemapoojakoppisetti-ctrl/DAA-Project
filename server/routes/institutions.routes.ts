import { Router, Request, Response } from 'express';
import { body, param, query } from 'express-validator';
import { PrismaClient } from '@prisma/client';
import auth from '../middleware/auth';
import { handleValidationErrors } from '../utils/validation';
import { sendSuccess, sendError } from '../utils/response';
import { asyncHandler, createError } from '../middleware/errorHandler';

const router = Router();
const prisma = new PrismaClient();

// ✅ GET ALL
router.get(
  '/',
  [
    query('page').optional().isInt({ min: 1 }).toInt(),
    query('limit').optional().isInt({ min: 1, max: 100 }).toInt(),
    query('search').optional().trim(),
    query('type').optional().trim(),
  ],
  handleValidationErrors,
  asyncHandler(async (req: Request, res: Response) => {
    const { search, type, page = 1, limit = 10 } = req.query as {
      search?: string;
      type?: string;
      page?: number;
      limit?: number;
    };

    const where: any = { isActive: true };

    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { city: { contains: search, mode: 'insensitive' } },
        { code: { contains: search, mode: 'insensitive' } },
      ];
    }

    if (type) {
      where.type = type;
    }

    const [data, total] = await Promise.all([
      prisma.institution.findMany({
        where,
        skip: ((page as number) - 1) * (limit as number),
        take: limit as number,
        include: { _count: { select: { departments: true } } },
        orderBy: { name: 'asc' },
      }),
      prisma.institution.count({ where }),
    ]);

    return sendSuccess(res, 'Institutions retrieved', {
      data,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / (limit as number)),
      },
    });
  })
);

// ✅ GET ONE
router.get(
  '/:id',
  [param('id').isInt().toInt()],
  handleValidationErrors,
  asyncHandler(async (req: Request, res: Response) => {
    const inst = await prisma.institution.findUnique({
      where: { id: req.params.id as any },
      include: { departments: { include: { faculty: true } } },
    });

    if (!inst) {
      throw createError('Institution not found', 404);
    }

    return sendSuccess(res, 'Institution retrieved', inst);
  })
);

// ✅ CREATE
router.post(
  '/',
  auth,
  [
    body('name').notEmpty(),
    body('code').notEmpty(),
    body('address').notEmpty(),
    body('city').notEmpty(),
    body('state').notEmpty(),
    body('type').optional().isIn(['Engineering', 'Medical', 'Science']),
  ],
  handleValidationErrors,
  asyncHandler(async (req: Request, res: Response) => {
    const inst = await prisma.institution.create({
      data: {
        name: req.body.name,
        code: req.body.code,
        address: req.body.address,
        city: req.body.city,
        state: req.body.state,
        phone: req.body.phone || null,
        email: req.body.email || null,
        website: req.body.website || null,
        principal: req.body.principal || null,
        established: req.body.established
          ? parseInt(req.body.established)
          : null,
        type: req.body.type || 'Engineering',
        accreditation: req.body.accreditation || null,
        logo: req.body.logo || null,
        isActive: req.body.isActive ?? true,
      },
    });

    return sendSuccess(res, 'Institution created successfully', inst, 201);
  })
);

// ✅ UPDATE
router.put(
  '/:id',
  auth,
  [
    param('id').isInt().toInt(),
    body('name').optional().notEmpty(),
    body('code').optional().notEmpty(),
  ],
  handleValidationErrors,
  asyncHandler(async (req: Request, res: Response) => {
    const inst = await prisma.institution.update({
      where: { id: req.params.id as any },
      data: {
        name: req.body.name,
        code: req.body.code,
        address: req.body.address,
        city: req.body.city,
        state: req.body.state,
        phone: req.body.phone || null,
        email: req.body.email || null,
        website: req.body.website || null,
        principal: req.body.principal || null,
        established: req.body.established
          ? parseInt(req.body.established)
          : null,
        type: req.body.type || 'Engineering',
        accreditation: req.body.accreditation || null,
        logo: req.body.logo || null,
        isActive: req.body.isActive ?? true,
      },
    });

    return sendSuccess(res, 'Institution updated successfully', inst);
  })
);

// ✅ DELETE (SOFT DELETE)
router.delete(
  '/:id',
  auth,
  [param('id').isInt().toInt()],
  handleValidationErrors,
  asyncHandler(async (req: Request, res: Response) => {
    await prisma.institution.update({
      where: { id: req.params.id as any },
      data: { isActive: false },
    });

    return sendSuccess(res, 'Institution deleted successfully');
  })
);

export default router;