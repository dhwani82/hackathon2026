import { Router, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { User } from '../models/User';
import { generateOtp } from '../utils/otp';
import { AuthRequest } from '../middleware/auth';

const router = Router();
const JWT_SECRET = process.env.JWT_SECRET || '';
const JWT_EXPIRY = '7d';
const SALT_ROUNDS = 10;
const OTP_EXPIRY_MS = 10 * 60 * 1000; // 10 minutes

// --- Request body types ---
interface RegisterBody {
  name?: string;
  email?: string;
  password?: string;
}

interface LoginBody {
  email?: string;
  password?: string;
}

interface ForgotBody {
  email?: string;
}

interface ResetBody {
  email?: string;
  otp?: string;
  newPassword?: string;
}

// --- Helpers ---
function toUserResponse(user: { _id: unknown; name: string; email: string }) {
  return {
    id: String((user as { _id: unknown })._id),
    name: user.name,
    email: user.email,
  };
}

// --- POST /auth/register ---
router.post('/register', async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { name, email, password } = req.body as RegisterBody;
    if (!name || typeof name !== 'string' || !name.trim()) {
      res.status(400).json({ success: false, error: 'Name is required' });
      return;
    }
    if (!email || typeof email !== 'string' || !email.trim()) {
      res.status(400).json({ success: false, error: 'Email is required' });
      return;
    }
    if (!password || typeof password !== 'string' || password.length < 8) {
      res.status(400).json({ success: false, error: 'Password must be at least 8 characters' });
      return;
    }
    const emailNorm = email.trim().toLowerCase();
    const existing = await User.findOne({ email: emailNorm });
    if (existing) {
      res.status(409).json({ success: false, error: 'Email already registered' });
      return;
    }
    const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);
    const user = await User.create({
      name: name.trim(),
      email: emailNorm,
      passwordHash,
    });
    res.status(201).json({ success: true, user: toUserResponse(user) });
  } catch (e) {
    res.status(500).json({ success: false, error: 'Registration failed' });
  }
});

// --- POST /auth/login ---
router.post('/login', async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body as LoginBody;
    if (!email || typeof email !== 'string' || !email.trim()) {
      res.status(400).json({ success: false, error: 'Email is required' });
      return;
    }
    if (!password || typeof password !== 'string') {
      res.status(400).json({ success: false, error: 'Password is required' });
      return;
    }
    const emailNorm = email.trim().toLowerCase();
    const user = await User.findOne({ email: emailNorm });
    if (!user) {
      res.status(401).json({ success: false, error: 'Invalid email or password' });
      return;
    }
    const match = await bcrypt.compare(password, user.passwordHash);
    if (!match) {
      res.status(401).json({ success: false, error: 'Invalid email or password' });
      return;
    }
    const token = jwt.sign({ userId: String(user._id) }, JWT_SECRET, { expiresIn: JWT_EXPIRY });
    res.json({ success: true, token, user: toUserResponse(user) });
  } catch (e) {
    res.status(500).json({ success: false, error: 'Login failed' });
  }
});

// --- POST /auth/forgot ---
router.post('/forgot', async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { email } = req.body as ForgotBody;
    if (!email || typeof email !== 'string' || !email.trim()) {
      res.status(400).json({ success: false, error: 'Email is required' });
      return;
    }
    const emailNorm = email.trim().toLowerCase();
    const user = await User.findOne({ email: emailNorm });
    if (user) {
      const otp = generateOtp();
      const resetOtpHash = await bcrypt.hash(otp, SALT_ROUNDS);
      const resetOtpExpiry = new Date(Date.now() + OTP_EXPIRY_MS);
      await User.updateOne(
        { _id: user._id },
        { $set: { resetOtpHash, resetOtpExpiry } }
      );
      // TODO: send email when EMAIL_SENDING=true
      const payload: { success: true; otp?: string } = { success: true };
      if (process.env.EMAIL_SENDING === 'false') {
        payload.otp = otp;
      }
      res.json(payload);
      return;
    }
    res.json({ success: true });
  } catch (e) {
    res.status(500).json({ success: false, error: 'Request failed' });
  }
});

// --- POST /auth/reset ---
router.post('/reset', async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { email, otp, newPassword } = req.body as ResetBody;
    if (!email || typeof email !== 'string' || !email.trim()) {
      res.status(400).json({ success: false, error: 'Email is required' });
      return;
    }
    if (!otp || typeof otp !== 'string' || otp.length !== 6) {
      res.status(400).json({ success: false, error: 'Valid 6-digit OTP is required' });
      return;
    }
    if (!newPassword || typeof newPassword !== 'string' || newPassword.length < 8) {
      res.status(400).json({ success: false, error: 'New password must be at least 8 characters' });
      return;
    }
    const emailNorm = email.trim().toLowerCase();
    const user = await User.findOne({ email: emailNorm });
    if (!user || !user.resetOtpHash || !user.resetOtpExpiry) {
      res.status(400).json({ success: false, error: 'Invalid or expired reset request' });
      return;
    }
    if (new Date() > user.resetOtpExpiry) {
      await User.updateOne(
        { _id: user._id },
        { $set: { resetOtpHash: null, resetOtpExpiry: null } }
      );
      res.status(400).json({ success: false, error: 'OTP has expired' });
      return;
    }
    const otpMatch = await bcrypt.compare(otp, user.resetOtpHash);
    if (!otpMatch) {
      res.status(400).json({ success: false, error: 'Invalid OTP' });
      return;
    }
    const passwordHash = await bcrypt.hash(newPassword, SALT_ROUNDS);
    await User.updateOne(
      { _id: user._id },
      { $set: { passwordHash, resetOtpHash: null, resetOtpExpiry: null } }
    );
    res.json({ success: true });
  } catch (e) {
    res.status(500).json({ success: false, error: 'Reset failed' });
  }
});

export default router;
