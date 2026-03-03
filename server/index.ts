import express from "express";
import pool from "./src/db";
import cors from "cors";
import dotenv from "dotenv";
import ocrRoutes from "./src/routes/ocrRoutes";
import chatgptRoutes from "./src/routes/chatgptRoutes";
import uploadRoutes from "./src/routes/uploadRoutes";
import { requireAuth } from "./src/middleware/authMiddleware";
import { aiLimiter } from "./src/middleware/rateLimiter";

dotenv.config();

const app = express();

app.use(
  cors({
    origin: ["http://localhost:3000", "https://cognify-phi.vercel.app"],
    credentials: true,
  }),
);

app.use(express.json());

// OCR and OpenAI routes — require auth + rate limited per user
app.use("/api/ocr", aiLimiter, ocrRoutes);
app.use("/api/openai", aiLimiter, chatgptRoutes);

// Upload routes — require auth (handled inside uploadRoutes via router.use)
app.use("/api/uploads", uploadRoutes);

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

pool.query("SELECT NOW()", (err, res) => {
  if (err) {
    console.error("Database connection failed:", err);
  } else {
    console.log("Database connected at:", res.rows[0].now);
  }
});
