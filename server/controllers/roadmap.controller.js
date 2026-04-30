import Roadmap from "../models/roadmap.js";
import userRoadmap from "../models/user_roadmap.js";
import Task from "../models/tasks.js";
import TaskCompletion from "../models/task_completion.js";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

export async function getUserRoadmap(req, res) {
  const token = req.cookies?.token;
  if (!token) return res.status(401).json({ success: false });

  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  const userId = decoded.userId;

  try {
    const userRoadmapDoc = await userRoadmap
      .findOne({ userId })
      .populate("roadmapIds.roadmapId");

    if (!userRoadmapDoc) {
      return res.status(404).json({ success: false });
    }

    const roadmapData = await Roadmap.findById(
      userRoadmapDoc.roadmapIds[0].roadmapId._id,
    );

    const taskCompletionDoc = await TaskCompletion.findOne({
      userId,
      roadmapId: roadmapData._id,
    });
  
    const allTaskIds = roadmapData.day.flatMap((d) => d.taskIds);

    const tasks = await Task.find({ _id: { $in: allTaskIds } });
    const taskMap = new Map();
    tasks.forEach((task) => taskMap.set(String(task._id), task));

    const getDaysDiff = (startDate) => {
  const start = new Date(startDate);
  const today = new Date();

  // Normalize both to midnight
  start.setHours(0, 0, 0, 0);
  today.setHours(0, 0, 0, 0);

  return Math.floor((today - start) / (1000 * 60 * 60 * 24));
};

const lastCompletedDay = taskCompletionDoc.startedAt
  ? getDaysDiff(taskCompletionDoc.startedAt)+1
  : 0;
 
   
    const finalDays = roadmapData.day.map((day) => {
      const completed =
        taskCompletionDoc?.days.find((d) => d.dayNumber === day.dayNumber)
          ?.completedTaskIds || [];
      const completedSet = new Set(completed.map((id) => String(id)));

      return {
        dayNumber: day.dayNumber,

        tasks: day.taskIds
          .map((taskId) => {
            const task = taskMap.get(String(taskId));

            if (!task) return null;

            return {
              ...task.toObject(),

              isCompleted: completedSet.has(String(taskId)),
              // isCompleted: completed.includes(String(taskId))
            };
          })
          .filter(Boolean),
      };
    });
    res.status(200).json({
      success: true,
      roadmapDetails:{
        domain: roadmapData.domain,
        goalRole: roadmapData.goalRole,
        timelineDays: roadmapData.timelineDays,
        targetType:roadmapData.targetType,
        experienceLevel:roadmapData.experienceLevel
      },
      lastCompletedDay,
      roadmap: {
        days: finalDays,
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false });
  }
}
