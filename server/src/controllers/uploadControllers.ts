import { Request, Response } from "express";
import pool from "../db";

// ── STORE SOLVED PROBLEM ─────────────────────────────────────
export const storeSolved = async (req: Request, res: Response) => {
  try {
    const {
      userId,
      file_name,
      question,
      hints,
      answer,
      full_solution,
      subject,
    } = req.body;

    if (!userId || !question || !hints || !answer) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const result = await pool.query(
      `INSERT INTO solved_problems (user_id, file_name, question, hints, answer, full_solution, subject)
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       RETURNING *;`,
      [
        userId,
        file_name ?? null,
        question,
        JSON.stringify(hints),
        answer,
        full_solution ?? null,
        subject ?? null,
      ],
    );

    // Update user_stats
    await pool.query(
      `INSERT INTO user_stats (user_id, hints_used, streak_days, last_active)
       VALUES ($1, $2, 1, CURRENT_DATE)
       ON CONFLICT (user_id) DO UPDATE SET
         hints_used   = user_stats.hints_used + $2,
         streak_days  = CASE
           WHEN user_stats.last_active = CURRENT_DATE - INTERVAL '1 day' THEN user_stats.streak_days + 1
           WHEN user_stats.last_active = CURRENT_DATE THEN user_stats.streak_days
           ELSE 1
         END,
         last_active  = CURRENT_DATE;`,
      [userId, hints.length],
    );

    res.json(result.rows[0]);
  } catch (error) {
    console.error("Error storing solved problem:", error);
    res.status(500).json({ error: "Failed to store solved problem" });
  }
};

// ── STORE PRACTICE PROBLEMS ──────────────────────────────────
// Accepts an array of problems and inserts each as a separate row
export const storePractice = async (req: Request, res: Response) => {
  try {
    const { userId, file_name, problems, subject, difficulty } = req.body;

    if (
      !userId ||
      !problems ||
      !Array.isArray(problems) ||
      problems.length === 0
    ) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const inserted = [];

    for (const problem of problems) {
      const { question, hints, answer } = problem;

      if (!question || !hints || !answer) continue;

      const result = await pool.query(
        `INSERT INTO practice_problems (user_id, file_name, question, hints, answer, subject, difficulty)
         VALUES ($1, $2, $3, $4, $5, $6, $7)
         RETURNING *;`,
        [
          userId,
          file_name ?? null,
          question,
          JSON.stringify(hints),
          answer,
          subject ?? null,
          difficulty ?? "medium",
        ],
      );

      inserted.push(result.rows[0]);
    }

    // Update user_stats
    const totalHints = problems.reduce(
      (acc: number, p: any) => acc + (p.hints?.length ?? 0),
      0,
    );
    await pool.query(
      `INSERT INTO user_stats (user_id, hints_used, streak_days, last_active)
       VALUES ($1, $2, 1, CURRENT_DATE)
       ON CONFLICT (user_id) DO UPDATE SET
         hints_used   = user_stats.hints_used + $2,
         streak_days  = CASE
           WHEN user_stats.last_active = CURRENT_DATE - INTERVAL '1 day' THEN user_stats.streak_days + 1
           WHEN user_stats.last_active = CURRENT_DATE THEN user_stats.streak_days
           ELSE 1
         END,
         last_active  = CURRENT_DATE;`,
      [userId, totalHints],
    );

    res.json(inserted);
  } catch (error) {
    console.error("Error storing practice problems:", error);
    res.status(500).json({ error: "Failed to store practice problems" });
  }
};

// ── GET SOLVED PROBLEMS ──────────────────────────────────────
export const getSolvedProblems = async (req: Request, res: Response) => {
  try {
    const { userId } = req.query;

    if (!userId || typeof userId !== "string") {
      return res.status(400).json({ error: "Missing userId" });
    }

    const result = await pool.query(
      `SELECT id, file_name, question, hints, answer, full_solution, subject, created_at
       FROM solved_problems
       WHERE user_id = $1
       ORDER BY created_at DESC
       LIMIT 20;`,
      [userId],
    );

    res.json(result.rows);
  } catch (error) {
    console.error("Error fetching solved problems:", error);
    res.status(500).json({ error: "Failed to fetch solved problems" });
  }
};

// ── GET PRACTICE PROBLEMS ────────────────────────────────────
export const getPracticeProblems = async (req: Request, res: Response) => {
  try {
    const { userId } = req.query;

    if (!userId || typeof userId !== "string") {
      return res.status(400).json({ error: "Missing userId" });
    }

    const result = await pool.query(
      `SELECT id, file_name, question, hints, answer, subject, difficulty, created_at
       FROM practice_problems
       WHERE user_id = $1
       ORDER BY created_at DESC
       LIMIT 20;`,
      [userId],
    );

    res.json(result.rows);
  } catch (error) {
    console.error("Error fetching practice problems:", error);
    res.status(500).json({ error: "Failed to fetch practice problems" });
  }
};

// ── GET USER STATS ───────────────────────────────────────────
export const getUserStats = async (req: Request, res: Response) => {
  try {
    const { userId } = req.query;

    if (!userId || typeof userId !== "string") {
      return res.status(400).json({ error: "Missing userId" });
    }

    // Get stats row
    const statsResult = await pool.query(
      `SELECT hints_used, streak_days FROM user_stats WHERE user_id = $1;`,
      [userId],
    );

    // Compute counts from the actual tables
    const solvedCount = await pool.query(
      `SELECT COUNT(*) FROM solved_problems WHERE user_id = $1;`,
      [userId],
    );
    const practiceCount = await pool.query(
      `SELECT COUNT(*) FROM practice_problems WHERE user_id = $1;`,
      [userId],
    );

    const stats = statsResult.rows[0] ?? { hints_used: 0, streak_days: 0 };

    res.json({
      solved: parseInt(solvedCount.rows[0].count),
      practiced: parseInt(practiceCount.rows[0].count),
      hintsUsed: stats.hints_used,
      streak: stats.streak_days,
    });
  } catch (error) {
    console.error("Error fetching user stats:", error);
    res.status(500).json({ error: "Failed to fetch user stats" });
  }
};

// ── DELETE PROBLEM ───────────────────────────────────────────
export const deleteProblem = async (req: Request, res: Response) => {
  try {
    const { id, type, userId } = req.body;

    if (!id || !type || !userId) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const table = type === "solved" ? "solved_problems" : "practice_problems";

    // Make sure the row belongs to the user before deleting
    const result = await pool.query(
      `DELETE FROM ${table} WHERE id = $1 AND user_id = $2 RETURNING id;`,
      [id, userId],
    );

    if (result.rows.length === 0) {
      return res
        .status(404)
        .json({ error: "Problem not found or unauthorized" });
    }

    res.json({ deleted: result.rows[0].id });
  } catch (error) {
    console.error("Error deleting problem:", error);
    res.status(500).json({ error: "Failed to delete problem" });
  }
};
