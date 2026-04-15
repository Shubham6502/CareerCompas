import express from 'express';
import {getUserRoadmap,completeTask,getActivityLog,getTask_completion} from "../controllers/dashboard.controller.js"

const router = express.Router();

router.get("/getUserRoadmap", getUserRoadmap);
// router.get("/getUserProgress",getUserProgress);
router.post("/task_completion", completeTask);
router.get("/activityLog", getActivityLog);
router.get("/getTaskCompletion", getTask_completion);
router.get("/getUserTasks", (req, res) => {
  res.json({ success: true, message: "Tasks endpoint hit" });
});
export default router;