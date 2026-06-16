const express = require("express");
const cors = require("cors");
require("dotenv").config();

const authRoutes = require("./routes/authRoutes");
const aiRoutes = require("./routes/aiRoutes");
const dashboardRoutes = require("./routes/dashboardRoutes");

const app = express();

// ✅ Middleware
app.use(cors());
app.use(express.json());

// ✅ Routes
app.use("/api/auth", authRoutes);
app.use("/api/ai", aiRoutes);
app.use("/api/dashboard", dashboardRoutes);

// ✅ Health check
app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "API is running...",
  });
});

// ✅ 404 handler (important)
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: "Route not found",
  });
});

module.exports = app;