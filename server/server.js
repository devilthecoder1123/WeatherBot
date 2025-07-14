import express from "express";
import cors from "cors";
import { Database } from "./database.js";
import dotenv from "dotenv";

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;
const db = new Database();

// Initialize database
await db.init();

// Enhanced CORS configuration
app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "http://localhost:3000",
      "http://127.0.0.1:5173",
    ],
    credentials: true,
  })
);

app.use(express.json());

// Add logging middleware
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// Health check endpoint
app.get("/api/health", (req, res) => {
  res.json({
    status: "ok",
    timestamp: new Date().toISOString(),
    database: "connected",
  });
});

// API Routes

// Get dashboard stats
app.get("/api/stats", async (req, res) => {
  try {
    console.log("📊 Fetching stats...");
    const stats = await db.getStats();
    console.log("📊 Stats result:", stats);
    res.json(stats);
  } catch (error) {
    console.error("❌ Error fetching stats:", error);
    res.status(500).json({ error: error.message });
  }
});

// Get all users
app.get("/api/users", async (req, res) => {
  try {
    console.log("👥 Fetching users...");
    const users = await db.getAllUsers();
    console.log(
      `👥 Found ${users.length} users:`,
      users.map((u) => ({
        chatId: u.chatId,
        firstName: u.firstName,
        isSubscribed: u.isSubscribed,
      }))
    );
    res.json(users);
  } catch (error) {
    console.error("❌ Error fetching users:", error);
    res.status(500).json({ error: error.message });
  }
});

// Block user
app.post("/api/users/:chatId/block", async (req, res) => {
  try {
    console.log(`🚫 Blocking user: ${req.params.chatId}`);
    await db.blockUser(req.params.chatId);
    res.json({ success: true });
  } catch (error) {
    console.error("❌ Error blocking user:", error);
    res.status(500).json({ error: error.message });
  }
});

// Unblock user
app.post("/api/users/:chatId/unblock", async (req, res) => {
  try {
    console.log(`✅ Unblocking user: ${req.params.chatId}`);
    await db.unblockUser(req.params.chatId);
    res.json({ success: true });
  } catch (error) {
    console.error("❌ Error unblocking user:", error);
    res.status(500).json({ error: error.message });
  }
});

// Delete user
app.delete("/api/users/:chatId", async (req, res) => {
  try {
    console.log(`🗑️ Deleting user: ${req.params.chatId}`);
    await db.deleteUser(req.params.chatId);
    res.json({ success: true });
  } catch (error) {
    console.error("❌ Error deleting user:", error);
    res.status(500).json({ error: error.message });
  }
});

// Get bot settings
app.get("/api/settings", async (req, res) => {
  try {
    console.log("⚙️ Fetching bot settings...");
    const settings = await db.getBotSettings();
    console.log("⚙️ Settings result:", settings ? "Found" : "Not found");
    res.json(settings);
  } catch (error) {
    console.error("❌ Error fetching settings:", error);
    res.status(500).json({ error: error.message });
  }
});

// Update bot settings
app.put("/api/settings", async (req, res) => {
  try {
    console.log("⚙️ Updating bot settings...");
    await db.updateBotSettings(req.body);
    console.log("⚙️ Settings updated successfully");
    res.json({ success: true });
  } catch (error) {
    console.error("❌ Error updating settings:", error);
    res.status(500).json({ error: error.message });
  }
});

// Debug endpoint to check database contents
app.get("/api/debug", async (req, res) => {
  try {
    const users = await db.getAllUsers();
    const stats = await db.getStats();
    const settings = await db.getBotSettings();

    res.json({
      users: users,
      stats: stats,
      settings: settings,
      userCount: users.length,
      databasePath: "./weather_bot.db",
    });
  } catch (error) {
    console.error("❌ Debug error:", error);
    res.status(500).json({ error: error.message });
  }
});

// Error handling middleware
app.use((error, req, res, next) => {
  console.error("❌ Server error:", error);
  res.status(500).json({ error: "Internal server error" });
});

app.listen(PORT, () => {
  console.log(`🚀 Admin panel server running on port ${PORT}`);
  console.log(`📊 Dashboard: http://localhost:${PORT}/api/stats`);
  console.log(`👥 Users: http://localhost:${PORT}/api/users`);
  console.log(`🔍 Debug: http://localhost:${PORT}/api/debug`);
  console.log("");
});
