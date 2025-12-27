import ProgressTrack from "../models/ProgressTrack.js";
import { evaluateDailyProgress } from "../utils/DaychangeUtils.js";
import evaluateStreak from "../utils/streakUtils.js";
import express from "express";
const router = express.Router();

router.post("/initProgress", async (req, res) => {
  const { clerkId, domain } = req.body;

  try {
    // Check if progress already exists
    const existingProgress = await ProgressTrack.findOne({ clerkId });
    if (existingProgress) {
      return res
        .status(400)
        .json({ message: "Progress already initialized for this user." });
    }
    const newProgress = new ProgressTrack({
      clerkId,
      domain,
      currentDay: 1,
      completedDays: [],
      progressPercent: 0,
    });
    await newProgress.save();
    return res.status(200).json({
      success: true,
      message: "Progress initialized successfully",
    });
  } catch (err) {
    return res.status(400).json({ message: "Something went wrong (Catch)" });
  }
});

router.get("/getProgress/:clerkId", async (req, res) => {
  const { clerkId } = req.params;

  try {
    const progress = await ProgressTrack.findOne({ clerkId });
    if (!progress) {
      return res.status(404).json({ message: "Progress not found" });
    }      
     await evaluateDailyProgress(progress); // 3 = tasks per day
      
    await progress.save();
    return res.status(200).json(progress);
  } catch (err) {
    return res.status(500).json({ message: "Something went wrong" });
  }
});
router.post("/completeTask", async (req, res) => {
  const { clerkId, taskId } = req.body;

  try {
    const progress = await ProgressTrack.findOne({ clerkId });
    if (!progress) {
      return res
        .status(404)
        .json({ message: "Progress not found for this user." });
    }
    

    if (progress.completedTasks.tasks.includes(taskId)) {
      return res.status(400).json({ message: "Task already completed." });
    }
    progress.completedTasks.tasks.push(taskId);

    const Currdate=new Date().toISOString().split("T")[0];
    let activeDay = progress.ActiveDays.find(d => d.day === progress.currentDay);
    if (!activeDay) {
    progress.ActiveDays.push({
    day: progress.currentDay,
    date: Currdate,
    tasks: [taskId]
  });
} else {
  if (activeDay.tasks.includes(taskId)) {
    return res.status(400).json({ message: "Task already completed." });
  }
  activeDay.tasks.push(taskId);
}

    
    await evaluateStreak(progress, 3); // 3 = tasks per day
      
    if(progress.completedTasks.tasks.length == 3){
        progress.completedDays.push(progress.currentDay);
         progress.todayTasksCompleted = true;
    
    }
    
    
    if(progress.completedTasks.tasks.length <= 3){
      progress.progressPercent = Math.min(100, progress.progressPercent + 2.7);
    }
    

    
    await progress.save();

    return res.status(200).json({
      success: true,
      message: "Task completed successfully.",
      progress:progress,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Something went wrong while completing the task.",
    });
  }
});

export default router;
