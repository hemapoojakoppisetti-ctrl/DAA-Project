import { Router, Request, Response, NextFunction } from 'express';
import { body } from 'express-validator';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';
import auth from '../middleware/auth';
import { handleValidationErrors } from '../utils/validation';
import { sendSuccess, sendError } from '../utils/response';
import { asyncHandler, createError } from '../middleware/errorHandler';

const router = Router();
const prisma = new PrismaClient();
const SECRET = process.env.JWT_SECRET || 'daa_secret_2024';

interface AuthRequest extends Request {
  admin?: any;
}

// ✅ LOGIN with validation and error handling
router.post(
  '/login',
  [
    body('email').isEmail().normalizeEmail(),
    body('password').isLength({ min: 6 }),
  ],
  handleValidationErrors,
  asyncHandler(async (req: Request, res: Response) => {
    const { email, password } = req.body;

    const admin = await prisma.admin.findUnique({ where: { email } });
    if (!admin) {
      throw createError('Invalid email or password', 401);
    }

    const valid = await bcrypt.compare(password, admin.password);
    if (!valid) {
      throw createError('Invalid email or password', 401);
    }

    const token = jwt.sign(
      { id: admin.id, email: admin.email, role: admin.role },
      SECRET,
      { expiresIn: '24h' }
    );

    return sendSuccess(
      res,
      'Login successful',
      {
        token,
        admin: {
          id: admin.id,
          name: admin.name,
          email: admin.email,
          role: admin.role,
          avatar: admin.avatar,
        },
      },
      200
    );
  })
);

// ✅ GET current admin
router.get(
  '/me',
  auth,
  asyncHandler(async (req: AuthRequest, res: Response) => {
    const admin = await prisma.admin.findUnique({
      where: { id: req.admin.id },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        avatar: true,
      },
    });

    if (!admin) {
      throw createError('Admin not found', 404);
    }

    return sendSuccess(res, 'Admin profile retrieved', admin);
  })
);

// ✅ UPDATE profile
router.put(
  '/profile',
  auth,
  [
    body('name').optional().notEmpty(),
    body('email').optional().isEmail().normalizeEmail(),
  ],
  handleValidationErrors,
  asyncHandler(async (req: AuthRequest, res: Response) => {
    const { name, email } = req.body;

    const admin = await prisma.admin.update({
      where: { id: req.admin.id },
      data: { name, email },
      select: { id: true, name: true, email: true, role: true },
    });

    return sendSuccess(res, 'Profile updated successfully', admin);
  })
);

// ✅ CHANGE PASSWORD
router.put(
  '/change-password',
  auth,
  [
    body('currentPassword').notEmpty(),
    body('newPassword').isLength({ min: 6 }),
  ],
  handleValidationErrors,
  asyncHandler(async (req: AuthRequest, res: Response) => {
    const { currentPassword, newPassword } = req.body;

    const admin = await prisma.admin.findUnique({
      where: { id: req.admin.id },
    });

    if (!admin) {
      throw createError('Admin not found', 404);
    }

    const valid = await bcrypt.compare(currentPassword, admin.password);
    if (!valid) {
      throw createError('Current password is incorrect', 400);
    }

    const hashed = await bcrypt.hash(newPassword, 10);

    await prisma.admin.update({
      where: { id: req.admin.id },
      data: { password: hashed },
    });

    return sendSuccess(res, 'Password changed successfully');
  })
);

export default router;