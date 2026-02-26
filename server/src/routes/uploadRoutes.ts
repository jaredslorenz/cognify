import express from "express";
import { requireAuth } from "../middleware/authMiddleware";
import {
  storeSolved,
  storePractice,
  getSolvedProblems,
  getPracticeProblems,
  getUserStats,
  deleteProblem,
  deleteUserData,
} from "../controllers/uploadControllers";

const router = express.Router();

// All upload routes require a valid Cognito JWT
router.use(requireAuth);

router.post("/solved", storeSolved);
router.post("/practice", storePractice);
router.get("/solved", getSolvedProblems);
router.get("/practice", getPracticeProblems);
router.get("/stats", getUserStats);
router.delete("/user", deleteUserData);
router.delete("/", deleteProblem);

export default router;
