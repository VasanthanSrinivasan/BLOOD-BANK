import express from "express";
import cors from "cors";
import "dotenv/config";
import mongoose from "mongoose";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import authRoutes from "./routes/authRoutes.js";
import donorRoutes from "./routes/donorRoutes.js";
import resourceRoutes from "./routes/resourceRoutes.js";

const app = express();
app.use(helmet());
app.use(cors({ origin: process.env.CLIENT_URL || "http://localhost:5173" }));
app.use(express.json({ limit: "1mb" }));
app.use(rateLimit({ windowMs: 15 * 60 * 1000, limit: 300 }));
app.get("/", (_req, res) =>
  res.json({ message: "LifeLine Blood Bank API is running" }),
);
app.get("/api/health", (_req, res) =>
  res.json({
    success: true,
    database:
      mongoose.connection.readyState === 1 ? "connected" : "disconnected",
  }),
);
app.use("/api/auth", authRoutes);
app.use("/api/donors", donorRoutes);
app.use("/api/manage", resourceRoutes);
app.use((error, _req, res, _next) => {
  if (error.name === "ValidationError")
    return res.status(400).json({ message: error.message });
  if (error.code === 11000)
    return res
      .status(409)
      .json({ message: "A record with this unique value already exists" });
  console.error(error);
  res.status(500).json({ message: "Internal server error" });
});
const PORT = process.env.PORT || 5001;

async function startServer() {
  try {
    if (!process.env.MONGODB_URI) {
      throw new Error("MONGODB_URI is missing from server/.env");
    }

    await mongoose.connect(process.env.MONGODB_URI);
    console.log("MongoDB connected successfully");

    app.listen(PORT, "0.0.0.0", () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (e) {
    console.error("Server startup failed:", e.message);
    process.exit(1);
  }
}

startServer();
