import "dotenv/config";
import os from "os";
import app from "./app";
import { connectDb } from "./lib/db";

const PORT = Number(process.env.PORT || 8080);

function getLocalIP(): string {
  const interfaces = os.networkInterfaces();
  for (const name of Object.keys(interfaces)) {
    const iface = interfaces[name];
    if (!iface) continue;
    for (const config of iface) {
      if (config.family === "IPv4" && !config.internal) {
        return config.address;
      }
    }
  }
  return "?.?.?.?";
}

async function start() {
  const localIP = getLocalIP();
  app.listen(PORT, "0.0.0.0", () => {
    console.log(`✅ Server running on http://0.0.0.0:${PORT} (localhost: http://localhost:${PORT})`);
    console.log(`📱 On your phone use: http://${localIP}:${PORT}`);
    console.log(`   If the app times out, set EXPO_PUBLIC_API_URL=http://${localIP}:${PORT} or update src/config.ts`);
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