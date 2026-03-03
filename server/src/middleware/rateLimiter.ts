import rateLimit from "express-rate-limit";

// Applied to /api/ocr and /api/openai
// Limits per authenticated userId (set by requireAuth middleware)
// Falls back to IP if no userId is present
export const aiLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute window
  max: 10, // 10 requests per window per user
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator: (req: any) => req.userId ?? req.ip,
  message: {
    error: "Too many requests. Please wait a moment before trying again.",
  },
});
