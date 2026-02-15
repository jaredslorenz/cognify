import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import ocrRoutes from "./src/routes/ocrRoutes";
import chatgptRoutes from "./src/routes/chatgptRoutes";
import uploadRoutes from "./src/routes/uploadRoutes";

dotenv.config();

const app = express();

app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:3000",
    credentials: true,
  }),
);

app.use(express.json()); // if you want to parse JSON bodies on other routes

app.use("/api/ocr", ocrRoutes);
app.use("/api/openai", chatgptRoutes);
app.use("/api/uploads", uploadRoutes);

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
