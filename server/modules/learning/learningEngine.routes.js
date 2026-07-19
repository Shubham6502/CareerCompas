import express from "express";
import { authenticateToken } from "../../middlewares/auth.middleware.js";
import * as learningEngineController from "./learningEngine.controller.js";

const router = express.Router();

router.get("/dashboard", authenticateToken, learningEngineController.getDashboard);
router.get("/start-day", authenticateToken, learningEngineController.startDay);
router.post("/submit-assessment", authenticateToken, learningEngineController.submitAssessment);

export default router;
