import express from "express";
import cors from "cors";

import authRoutes from "./routes/auth";
import aiRoutes from "./routes/ai";

const app = express();

app.use(cors());
app.use(express.json());

app.get("/health", (req, res) => res.json({ ok: true }));

// ✅ mount routes
app.use("/auth", authRoutes);
app.use("/ai", aiRoutes);

export default app;