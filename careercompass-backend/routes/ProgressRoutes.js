import { completeTasks, deleteProgress, getProgress, initProgress, taskAssessment } from "../controllers/progressController.js";
import ProgressTrack from "../models/ProgressTrack.js";
import { evaluateDailyProgress } from "../utils/DaychangeUtils.js";
import evaluateStreak from "../utils/streakUtils.js";
import express from "express";
const router = express.Router();

router.post("/initProgress",initProgress);
router.get("/getProgress/:clerkId", getProgress);
router.post("/completeTask",completeTasks);
router.post("/assessment",taskAssessment);
router.delete("/delete/:clerkId",deleteProgress);

export default router;
