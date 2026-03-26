import rateLimit, { ipKeyGenerator } from "express-rate-limit";

export const aiLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,

  keyGenerator: (req: any) =>
    (process.env.NODE_ENV !== "production" && req.headers["x-test-key"]) ||
    req.userId ||
    ipKeyGenerator(req),

  message: {
    error: "Too many requests. Please wait a moment before trying again.",
  },
});
