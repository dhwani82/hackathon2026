import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { User } from '../models/User';
import { IUser } from '../models/User';

const JWT_SECRET = process.env.JWT_SECRET || '';

export interface AuthRequest extends Request {
  user?: IUser;
}

export async function requireAuth(
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    res.status(401).json({ success: false, error: 'Missing or invalid authorization header' });
    return;
  }
  const token = authHeader.slice(7);
  try {
    // TEMPORARY: app-side demo bypass token (user logged in offline)
    if (token === 'demo-bypass-token') {
      req.user = { _id: 'demo-user', name: 'Dhwani', email: 'dhwani@gmail.com' } as unknown as IUser;
      next();
      return;
    }
    const secret = JWT_SECRET || 'demo-secret-change-in-production';
    const decoded = jwt.verify(token, secret) as { userId: string };
    // TEMPORARY: demo user (no DB lookup)
    if (decoded.userId === 'demo-user') {
      req.user = { _id: 'demo-user', name: 'Dhwani', email: 'dhwani@gmail.com' } as unknown as IUser;
      next();
      return;
    }
    const user = await User.findById(decoded.userId).select('-passwordHash -resetOtpHash -resetOtpExpiry');
    if (!user) {
      res.status(401).json({ success: false, error: 'User not found' });
      return;
    }
    req.user = user;
    next();
  } catch {
    res.status(401).json({ success: false, error: 'Invalid or expired token' });
  }
}
