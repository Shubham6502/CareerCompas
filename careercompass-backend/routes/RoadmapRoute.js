import express from "express";
import Roadmap from "../models/Roadmap.js";
import { getRoadmapByDomain ,getRoadmapsByDay} from "../controllers/roadmapController.js";

const router = express.Router();

router.get("/:domain",getRoadmapByDomain);
router.get("/getRoadmap/:domain",getRoadmapsByDay);
export default router;
