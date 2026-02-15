"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const User_1 = require("../models/User");
const otp_1 = require("../utils/otp");
const router = (0, express_1.Router)();
const JWT_SECRET = process.env.JWT_SECRET || '';
const JWT_EXPIRY = '7d';
const SALT_ROUNDS = 10;
const OTP_EXPIRY_MS = 10 * 60 * 1000; // 10 minutes
// --- Helpers ---
function toUserResponse(user) {
    return {
        id: String(user._id),
        name: user.name,
        email: user.email,
    };
}
// --- POST /auth/register ---
router.post('/register', async (req, res) => {
    try {
        const { name, email, password } = req.body;
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
        const existing = await User_1.User.findOne({ email: emailNorm });
        if (existing) {
            res.status(409).json({ success: false, error: 'Email already registered' });
            return;
        }
        const passwordHash = await bcrypt_1.default.hash(password, SALT_ROUNDS);
        const user = await User_1.User.create({
            name: name.trim(),
            email: emailNorm,
            passwordHash,
        });
        res.status(201).json({ success: true, user: toUserResponse(user) });
    }
    catch (e) {
        res.status(500).json({ success: false, error: 'Registration failed' });
    }
});
// --- POST /auth/login ---
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || typeof email !== 'string' || !email.trim()) {
            res.status(400).json({ success: false, error: 'Email is required' });
            return;
        }
        if (!password || typeof password !== 'string') {
            res.status(400).json({ success: false, error: 'Password is required' });
            return;
        }
        const emailNorm = email.trim().toLowerCase();
        const user = await User_1.User.findOne({ email: emailNorm });
        if (!user) {
            res.status(401).json({ success: false, error: 'Invalid email or password' });
            return;
        }
        const match = await bcrypt_1.default.compare(password, user.passwordHash);
        if (!match) {
            res.status(401).json({ success: false, error: 'Invalid email or password' });
            return;
        }
        const token = jsonwebtoken_1.default.sign({ userId: String(user._id) }, JWT_SECRET, { expiresIn: JWT_EXPIRY });
        res.json({ success: true, token, user: toUserResponse(user) });
    }
    catch (e) {
        res.status(500).json({ success: false, error: 'Login failed' });
    }
});
// --- POST /auth/forgot ---
router.post('/forgot', async (req, res) => {
    try {
        const { email } = req.body;
        if (!email || typeof email !== 'string' || !email.trim()) {
            res.status(400).json({ success: false, error: 'Email is required' });
            return;
        }
        const emailNorm = email.trim().toLowerCase();
        const user = await User_1.User.findOne({ email: emailNorm });
        if (user) {
            const otp = (0, otp_1.generateOtp)();
            const resetOtpHash = await bcrypt_1.default.hash(otp, SALT_ROUNDS);
            const resetOtpExpiry = new Date(Date.now() + OTP_EXPIRY_MS);
            await User_1.User.updateOne({ _id: user._id }, { $set: { resetOtpHash, resetOtpExpiry } });
            // TODO: send email when EMAIL_SENDING=true
            const payload = { success: true };
            if (process.env.EMAIL_SENDING === 'false') {
                payload.otp = otp;
            }
            res.json(payload);
            return;
        }
        res.json({ success: true });
    }
    catch (e) {
        res.status(500).json({ success: false, error: 'Request failed' });
    }
});
// --- POST /auth/reset ---
router.post('/reset', async (req, res) => {
    try {
        const { email, otp, newPassword } = req.body;
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
        const user = await User_1.User.findOne({ email: emailNorm });
        if (!user || !user.resetOtpHash || !user.resetOtpExpiry) {
            res.status(400).json({ success: false, error: 'Invalid or expired reset request' });
            return;
        }
        if (new Date() > user.resetOtpExpiry) {
            await User_1.User.updateOne({ _id: user._id }, { $set: { resetOtpHash: null, resetOtpExpiry: null } });
            res.status(400).json({ success: false, error: 'OTP has expired' });
            return;
        }
        const otpMatch = await bcrypt_1.default.compare(otp, user.resetOtpHash);
        if (!otpMatch) {
            res.status(400).json({ success: false, error: 'Invalid OTP' });
            return;
        }
        const passwordHash = await bcrypt_1.default.hash(newPassword, SALT_ROUNDS);
        await User_1.User.updateOne({ _id: user._id }, { $set: { passwordHash, resetOtpHash: null, resetOtpExpiry: null } });
        res.json({ success: true });
    }
    catch (e) {
        res.status(500).json({ success: false, error: 'Reset failed' });
    }
});
exports.default = router;
