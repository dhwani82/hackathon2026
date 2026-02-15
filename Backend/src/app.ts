import express from "express";
import cors from "cors";

import authRoutes from "./routes/auth";
import aiRoutes from "./routes/ai";
import { requireAuth, AuthRequest } from "./middleware/auth";

const app = express();

app.use(cors());
app.use(express.json());

app.get("/health", (req, res) => res.json({ ok: true }));

app.get("/me", requireAuth, (req: AuthRequest, res) => {
  const user = req.user;
  if (!user) {
    res.status(401).json({ success: false, error: "Unauthorized" });
    return;
  }
  res.json({
    success: true,
    user: { id: String(user._id), name: user.name, email: user.email },
  });
});

app.use("/auth", authRoutes);
app.use("/ai", aiRoutes);

export default app;