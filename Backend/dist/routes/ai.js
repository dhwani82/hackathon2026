"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const gemini_1 = require("../lib/gemini");
const auth_1 = require("../middleware/auth");
const router = (0, express_1.Router)();
const MAX_PROMPT_LENGTH = 4000;
const RATE_LIMIT_WINDOW_MS = 10 * 60 * 1000; // 10 min
const RATE_LIMIT_MAX = 20;
// In-memory rate limit: IP -> { count, resetAt }
const rateLimitMap = new Map();
function getClientIp(req) {
    const forwarded = req.headers['x-forwarded-for'];
    if (typeof forwarded === 'string') {
        return forwarded.split(',')[0].trim();
    }
    return req.socket.remoteAddress ?? 'unknown';
}
function checkRateLimit(ip) {
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
router.post('/gemini', auth_1.requireAuth, async (req, res) => {
    try {
        const ip = getClientIp(req);
        if (!checkRateLimit(ip)) {
            res.status(429).json({
                success: false,
                error: 'Too many requests. Try again in 10 minutes.',
            });
            return;
        }
        const { prompt } = req.body;
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
        const text = await (0, gemini_1.generateResponse)(prompt.trim());
        res.json({ success: true, text });
    }
    catch (e) {
        const message = e instanceof Error ? e.message : 'AI request failed';
        res.status(500).json({ success: false, error: message });
    }
});
exports.default = router;
