import express from "express";
import {
  storeSolved,
  storePractice,
  getSolvedProblems,
  getPracticeProblems,
  getUserStats,
  deleteProblem,
} from "../controllers/uploadControllers";

const router = express.Router();

// Store
router.post("/solved", storeSolved);
router.post("/practice", storePractice);

// Fetch
router.get("/solved", getSolvedProblems);
router.get("/practice", getPracticeProblems);
router.get("/stats", getUserStats);

// Delete
router.delete("/", deleteProblem);

export default router;
