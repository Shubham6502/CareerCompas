import userRoadmap from "../models/user_roadmap.js";
import jwt from "jsonwebtoken";
import Roadmap from "../models/roadmap.js";
import dotenv from "dotenv";
import task_completion from "../models/task_completion.js";
import tasks from "../models/tasks.js";
import activity_log from "../models/activity_log.js";

dotenv.config();

const getDateOnly = (date = new Date()) => {
  const d = new Date(date);
  return new Date(d.getFullYear(), d.getMonth(), d.getDate());
};

/*User roadmap API*/
export async function getUserRoadmap(req, res) {
  try {
    const token = req.cookies?.token;
    if (!token) return res.status(401).json({ success: false });

    const { userId } = jwt.verify(token, process.env.JWT_SECRET);

   
    const userRoadmapDoc = await userRoadmap
      .findOne({ userId })
      .populate("roadmapIds.roadmapId")
      .lean();

  

    if (!userRoadmapDoc) {
      return res.status(404).json({
        success: false,
        message: "User roadmap not found",
      });
    }

    const active = userRoadmapDoc.roadmapIds.find(
      (r) => r.status === "active"
    );

    if (!active) {
      return res.status(404).json({
        success: false,
        message: "No active roadmap found",
      });
    }

    const roadmapId = active.roadmapId._id;

    
    const [doc, roadmap] = await Promise.all([
      task_completion.findOne({ userId, roadmapId }).lean(),
      Roadmap.findById(roadmapId)
        .select("timelineDays goalRole day")
        .lean(),
    ]);

    if (!roadmap) {
      return res.status(404).json({
        success: false,
        message: "Roadmap not found",
      });
    }

   
    const today = getDateOnly();
    const start = getDateOnly(doc?.startedAt || today);

    const currentDay =
      Math.floor((today - start) / (1000 * 60 * 60 * 24)) + 1;

    const todayCompletedTasks = doc?.days?.find(
      (d) => d.dayNumber === currentDay
    );

    const progress = {
      completedTasks: todayCompletedTasks?.completedTaskIds || [],
      xp: doc?.xp || 0,
      currentStreak: doc?.currentStreak || 0,
      longestStreak: doc?.longestStreak || 0,
    };

    const todayData = roadmap.day.find(
      (d) => d.dayNumber === currentDay
    );

    if (!todayData) {
      return res.status(404).json({
        success: false,
        message: "No tasks for today",
      });
    }

    
    const tasksData = await tasks
      .find({ _id: { $in: todayData.taskIds } })
      .lean();


    return res.json({
      success: true,
      currentDay,
      tasks: tasksData,
      progress,
      roadmap: {
        timelineDays: roadmap.timelineDays,
        goalRole: roadmap.goalRole,
        roadmapId,
      },
    });
  } catch (error) {
    console.error("Error fetching user roadmap:", error);
    return res.status(500).json({ success: false });
  }
}

/* ================== COMPLETE TASK ================== */
export async function completeTask(req, res) {
  try {
    const token = req.cookies?.token;
    if (!token) return res.status(401).json({ success: false });

    const { userId } = jwt.verify(token, process.env.JWT_SECRET);
    const { taskId, difficulty, roadmapId, totalCount, currentDay } =
      req.body;

    const xp =
      difficulty === "easy" ? 10 : difficulty === "medium" ? 20 : 30;

    const today = new Date();
    const todayDate = getDateOnly(today);

  let doc = await task_completion.findOne({ userId, roadmapId });

// Create if not exists
if (!doc) {
  doc = await task_completion.create({
    userId,
    roadmapId,
    startedAt: today,
    days: [],
    xp: 0,
    currentStreak: 0,
    longestStreak: 0,
    lastActivityAt: today,
  });
}

/* ================== FIND OR CREATE DAY ================== */

let dayIndex = doc.days.findIndex(
  (d) => d.dayNumber === currentDay
);

let day;

// If day not exists create with task directly
if (dayIndex === -1) {
  day = {
    dayNumber: currentDay,
    completedTaskIds: [taskId], 
  };

  doc.days.push(day);
} else {
  day = doc.days[dayIndex];

  // Prevent duplicate
  if (
    day.completedTaskIds.some(
      (id) => id.toString() === taskId.toString()
    )
  ) {
    return res.status(400).json({
      success: false,
      message: "Task already completed",
    });
  }


  doc.days[dayIndex].completedTaskIds.push(taskId);

  day = doc.days[dayIndex]; 
}

/* ================== COMMON UPDATES ================== */

doc.xp += xp;
doc.lastActivityAt = today;

/* ================== STREAK LOGIC ================== */

if (day.completedTaskIds.length === totalCount) {
  const lastDate = doc.lastCompletedDate
    ? getDateOnly(doc.lastCompletedDate)
    : null;

  let newStreak = doc.currentStreak || 0;

  if (!lastDate || todayDate.getTime() !== lastDate.getTime()) {
    if (!lastDate) {
      newStreak = 1;
    } else {
      const diffDays = Math.floor(
        (todayDate - lastDate) / (1000 * 60 * 60 * 24)
      );

      if (diffDays === 1) newStreak += 1;
      else newStreak = 1;
    }

    doc.currentStreak = newStreak;
    doc.longestStreak = Math.max(
      doc.longestStreak || 0,
      newStreak
    );
    doc.lastCompletedDate = todayDate;
  }
}

/* ================== ACTIVITY LOG ================== */

const activityEntries = [
  {
    activityType: "TaskCompletion",
    details: "+1 Task completed",
    createdAt: today,
  },
  {
    activityType: "XPUpdate",
    details: `XP +${xp} (${difficulty})`,
    createdAt: today,
  },
];

if (day.completedTaskIds.length === totalCount) {
  activityEntries.push({
    activityType: "DayCompletion",
    details: `Day ${currentDay} completed`,
    createdAt: today,
  });
}

/* ================== SAVE ================== */

await Promise.all([
  doc.save(),
  activity_log.updateOne(
    { userId },
    { $push: { activity: { $each: activityEntries } } },
    { upsert: true }
  ),
]);

return res.json({
  success: true,
  message: "Task updated successfully",
  data: doc,
})
  } catch (error) {
    console.error("Error updating task completion:", error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
}
  
 
//api for activity log
export async function getActivityLog(req, res) {
  const token = req.cookies?.token; 
  if (!token) return res.status(401).json({ success: false });
  let decoded = jwt.verify(token, process.env.JWT_SECRET);
  const userId = decoded.userId;
  try {
    const log = await activity_log.findOne({ userId });
    if (!log) {
      return res.status(404).json({ success: false, message: "Activity log not found" });
    }
    return res.json({ success: true, activity: log.activity });
  } catch (error) {
    console.error("Error fetching activity log:", error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
}

export async function getTask_completion(req, res) {
  const token = req.cookies?.token; 
  if (!token) return res.status(401).json({ success: false });
  let decoded = jwt.verify(token, process.env.JWT_SECRET);
  const userId = decoded.userId;
  try {    const completions = await task_completion.find({ userId });
    if (!completions) {
      return res.status(404).json({ success: false, message: "Task completion data not found" });
    }
    return res.json({ success: true, completions });
  } catch (error) {
    console.error("Error fetching task completion data:", error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
}