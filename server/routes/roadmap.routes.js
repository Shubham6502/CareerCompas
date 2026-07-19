import express from "express";
import { getUserRoadmap } from "../controllers/roadmap.controller.js";
import { authenticateToken } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.get("/getUserRoadmap", authenticateToken, getUserRoadmap);

export default router;
