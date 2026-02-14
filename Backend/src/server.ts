import "dotenv/config";
import app from "./app";
import { connectDb } from "./lib/db";

const PORT = Number(process.env.PORT || 8080);

async function start() {
  // Listen on 0.0.0.0 so phones/other devices can reach this machine (e.g. http://172.20.10.4:8080)
  app.listen(PORT, '0.0.0.0', () => {
    console.log(`✅ Server running on http://0.0.0.0:${PORT} (also http://localhost:${PORT})`);
  });

  // ✅ Try DB connection separately
  try {
    await connectDb();
    console.log("✅ MongoDB connected");
  } catch (err) {
    console.error("⚠️ MongoDB connection failed (server still running):", err);
  }
}

start();