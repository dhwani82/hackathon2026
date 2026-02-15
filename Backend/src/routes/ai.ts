import { Response } from 'express';
import { Router } from 'express';
import { generateResponse } from '../lib/gemini';
import { requireAuth, AuthRequest } from '../middleware/auth';

const router = Router();
const MAX_PROMPT_LENGTH = 4000;
const RATE_LIMIT_WINDOW_MS = 10 * 60 * 1000; // 10 min
const RATE_LIMIT_MAX = 20;

// In-memory rate limit: IP -> { count, resetAt }
const rateLimitMap = new Map<string, { count: number; resetAt: number }>();

function getClientIp(req: AuthRequest): string {
  const forwarded = req.headers['x-forwarded-for'];
  if (typeof forwarded === 'string') {
    return forwarded.split(',')[0].trim();
  }
  return req.socket.remoteAddress ?? 'unknown';
}

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const entry = rateLimitMap.get(ip);
  if (!entry) {
    rateLimitMap.set(ip, { count: 1, resetAt: now + RATE_LIMIT_WINDOW_MS });
    return true;
  }
  if (now > entry.resetAt) {
    rateLimitMap.set(ip, { count: 1, resetAt: now + RATE_LIMIT_WINDOW_MS });
    return true;
  }
  if (entry.count >= RATE_LIMIT_MAX) {
    return false;
  }
  entry.count += 1;
  return true;
}

interface GeminiBody {
  prompt?: string;
}

router.post('/gemini', requireAuth, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const ip = getClientIp(req);
    if (!checkRateLimit(ip)) {
      res.status(429).json({
        success: false,
        error: 'Too many requests. Try again in 10 minutes.',
      });
      return;
    }
    const { prompt } = req.body as GeminiBody;
    if (typeof prompt !== 'string' || !prompt.trim()) {
      res.status(400).json({ success: false, error: 'Prompt is required' });
      return;
    }
    if (prompt.length > MAX_PROMPT_LENGTH) {
      res.status(400).json({
        success: false,
        error: `Prompt must be at most ${MAX_PROMPT_LENGTH} characters`,
      });
      return;
    }
    const text = await generateResponse(prompt.trim());
    res.json({ success: true, text });
  } catch (e) {
    const message = e instanceof Error ? e.message : 'AI request failed';
    const isConfigError = message.toLowerCase().includes('gemini_api_key') || message.toLowerCase().includes('not configured');
    res.status(isConfigError ? 503 : 500).json({
      success: false,
      error: isConfigError
        ? 'Chat AI is not configured on the server. Add GEMINI_API_KEY to Backend .env'
        : message,
    });
  }
});

export default router;
