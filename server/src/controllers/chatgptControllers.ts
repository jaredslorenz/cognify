import { Request, Response } from "express";
import OpenAI from "openai";
import dotenv from "dotenv";

dotenv.config();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// ── HOMEWORK SOLVER ──────────────────────────────────────────
// Accepts: { text } from OCR
// Returns: { question, hints, answer, fullSolution }
export const handleChatGPT = async (req: Request, res: Response) => {
  try {
    const { text } = req.body;

    const response = await openai.chat.completions.create({
      model: "gpt-5-nano",
      response_format: { type: "json_object" },
      messages: [
        {
          role: "system",
          content: `You are a homework solver and study assistant. 
Given a homework problem, respond with valid JSON in exactly this shape:
{
  "question": "restate the problem clearly and concisely",
  "hints": [
    "hint 1 — a gentle nudge toward the approach, no answer yet",
    "hint 2 — a more specific clue, still not the answer",
    "hint 3 — almost there, one step away from the solution"
  ],
  "answer": "the final concise answer",
  "fullSolution": "step-by-step walkthrough of the complete solution"
}
Rules:
- Hints must be progressive — each reveals a little more without giving away the answer
- Exactly 3 hints always
- fullSolution should show every step clearly with brief explanations`,
        },
        {
          role: "user",
          content: text,
        },
      ],
    });

    const raw = response.choices[0].message.content ?? "{}";

    let parsed;
    try {
      parsed = JSON.parse(raw);
    } catch {
      return res.status(500).json({ error: "Failed to parse AI response" });
    }

    res.json(parsed);
  } catch (err) {
    console.error("OpenAI request failed:", err);
    res.status(500).json({ error: "OpenAI request failed" });
  }
};

// ── PRACTICE PROBLEM GENERATOR ───────────────────────────────
// Accepts: { text, subject?, topic?, difficulty?, amount? }
// Returns: { question, hints, answer }
export const handleChatGPTProblems = async (req: Request, res: Response) => {
  try {
    const {
      text,
      subject,
      topic,
      difficulty = "medium",
      amount = 1,
    } = req.body;

    const safeAmount = Math.min(Math.max(Number(amount) || 1, 1), 10);
    // Build context string from whatever the frontend sends
    const context = subject
      ? `Subject: ${subject}${topic ? `, Topic: ${topic}` : ""}. Difficulty: ${difficulty}.${text ? ` Additional context: ${text}` : ""}`
      : text;

    const response = await openai.chat.completions.create({
      model: "gpt-5-nano",
      response_format: { type: "json_object" },
      messages: [
        {
          role: "system",
          content: `You are a practice problem generator for students.
Generate EXACTLY ${safeAmount} practice problem(s) and respond with valid JSON in exactly this shape:
{
  "problems": [
    {
      "question": "the full problem statement",
      "hints": [
        "hint 1 — point toward the right approach without revealing it",
        "hint 2 — more specific, still not the answer",
        "hint 3 — one step away from the solution"
      ],
      "answer": "the final answer with a brief explanation"
    }
  ]
}
Rules:
- Generate exactly ${safeAmount} problems
- Hints must be progressive — never give the answer in a hint
- Exactly 3 hints always
- The problem should fully test understanding of the topic, not just memorization
- Match the requested difficulty: easy = straightforward application, medium = requires some reasoning, hard = multi-step or conceptual`,
        },
        {
          role: "user",
          content: `Generate ${safeAmount} practice problem(s) for: ${context}`,
        },
      ],
    });

    const raw = response.choices[0].message.content ?? "{}";

    let parsed;
    try {
      parsed = JSON.parse(raw);
    } catch {
      return res.status(500).json({ error: "Failed to parse AI response" });
    }

    res.json(parsed);
  } catch (err) {
    console.error("OpenAI request failed:", err);
    res.status(500).json({ error: "OpenAI request failed" });
  }
};
