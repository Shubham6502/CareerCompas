import express from "express";
import { authenticateToken } from "../../middlewares/auth.middleware.js";
import { getDashboard } from "./dashboard.controller.js";

const router = express.Router();

router.get("/", authenticateToken, getDashboard);

export default router;
