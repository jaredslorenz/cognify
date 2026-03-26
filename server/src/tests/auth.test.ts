import request from "supertest";

// Mock all controllers before importing app so Jest never loads
// node-fetch or any other ESM-only dependencies
jest.mock("../../src/controllers/ocrControllers", () => ({
  handleOCR: (_req: any, res: any) => res.status(200).json({ ok: true }),
}));

jest.mock("../../src/controllers/chatgptControllers", () => ({
  handleChatGPT: (_req: any, res: any) => res.status(200).json({ ok: true }),
  handleChatGPTProblems: (_req: any, res: any) =>
    res.status(200).json({ ok: true }),
}));

jest.mock("../../src/controllers/uploadControllers", () => ({
  storeSolved: (_req: any, res: any) => res.status(200).json({ ok: true }),
  storePractice: (_req: any, res: any) => res.status(200).json({ ok: true }),
  getSolvedProblems: (_req: any, res: any) => res.status(200).json([]),
  getPracticeProblems: (_req: any, res: any) => res.status(200).json([]),
  getUserStats: (_req: any, res: any) => res.status(200).json({ ok: true }),
  deleteProblem: (_req: any, res: any) => res.status(200).json({ ok: true }),
  deleteUserData: (_req: any, res: any) => res.status(200).json({ ok: true }),
}));

// Mock jwt.verify so tests never need real Cognito tokens
jest.mock("jsonwebtoken", () => ({
  verify: (_token: any, _key: any, _opts: any, callback: any) => {
    if (_token === "valid-token") {
      callback(null, { sub: "test-user-123", email: "test@test.com" });
    } else {
      callback(new Error("Invalid token"));
    }
  },
}));

import app from "../../index";

// ── requireAuth middleware ───────────────────────────────
describe("requireAuth middleware", () => {
  test("rejects request with no authorization header", async () => {
    const res = await request(app).get("/api/uploads/solved");

    expect(res.status).toBe(401);
    expect(res.body.error).toBe("Missing or invalid authorization header");
  });

  test("rejects request with a fake token", async () => {
    const res = await request(app)
      .get("/api/uploads/solved")
      .set("Authorization", "Bearer faketoken123");

    expect(res.status).toBe(401);
  });

  test("rejects request with malformed authorization header", async () => {
    const res = await request(app)
      .get("/api/uploads/solved")
      .set("Authorization", "notbearer token");

    expect(res.status).toBe(401);
  });

  test("allows request with valid token", async () => {
    const res = await request(app)
      .get("/api/uploads/solved")
      .set("Authorization", "Bearer valid-token");

    // Auth passes — controller is mocked so should return 200
    expect(res.status).toBe(200);
  });
});

// ── Unprotected routes ───────────────────────────────────
describe("unprotected routes", () => {
  test("OCR route does not require a token", async () => {
    const res = await request(app).post("/api/ocr");

    expect(res.status).not.toBe(401);
  });

  test("OpenAI solve route does not require a token", async () => {
    const res = await request(app)
      .post("/api/openai/solve")
      .send({ text: "test" });

    expect(res.status).not.toBe(401);
  });

  test("OpenAI problems route does not require a token", async () => {
    const res = await request(app)
      .post("/api/openai/problems")
      .send({ text: "test" });

    expect(res.status).not.toBe(401);
  });
});

// ── Rate limiter ─────────────────────────────────────────
describe("rate limiter", () => {
  test("blocks after 10 requests in a minute", async () => {
    const statuses: number[] = [];

    for (let i = 0; i < 20; i++) {
      const res = await request(app)
        .post("/api/openai/solve")
        .set("x-test-key", "ratelimit-test")
        .send({ text: "test" });

      statuses.push(res.status);
    }

    expect(statuses.slice(0, 10)).not.toContain(429);
    expect(statuses.slice(10)).toContain(429);
  });
});
