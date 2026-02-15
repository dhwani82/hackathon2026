"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const auth_1 = require("./middleware/auth");
const error_1 = require("./middleware/error");
const auth_2 = __importDefault(require("./routes/auth"));
const ai_1 = __importDefault(require("./routes/ai"));
const app = (0, express_1.default)();
const isDev = process.env.NODE_ENV !== 'production';
app.use((0, cors_1.default)({ origin: isDev ? true : process.env.CORS_ORIGIN || true }));
app.use(express_1.default.json());
app.use('/auth', auth_2.default);
app.use('/ai', ai_1.default);
app.get('/me', auth_1.requireAuth, (req, res) => {
    const user = req.user;
    if (!user) {
        res.status(401).json({ success: false, error: 'Unauthorized' });
        return;
    }
    res.json({
        success: true,
        user: {
            id: String(user._id),
            name: user.name,
            email: user.email,
        },
    });
});
app.use((_req, res) => {
    res.status(404).json({ success: false, error: 'Not found' });
});
app.use(error_1.errorHandler);
exports.default = app;
