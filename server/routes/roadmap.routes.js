import express from "express";
import { getUserRoadmap } from "../controllers/roadmap.controller.js";
const router = express.Router();

router.get("/getUserRoadmap", getUserRoadmap);
export default router;