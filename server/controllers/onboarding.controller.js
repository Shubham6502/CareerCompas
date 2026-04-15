import mongoose from "mongoose";
import fetch from "node-fetch";
import Task from "../models/tasks.js";
import Roadmap from "../models/roadmap.js";
import UserRoadmap from "../models/user_roadmap.js";
import UserTaskProgress from "../models/userTaskProgress.js";
import jwt from "jsonwebtoken";
import task_completion from "../models/task_completion.js";
import activity_log from "../models/activity_log.js";




// ─── AUTH ─────────────────────────

function getUser(req) {
  try {
    const token = req.cookies?.token;
    if (!token) return null;
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    return new mongoose.Types.ObjectId(decoded.userId);
  } catch {
    return null;
  }
}


// ─── AI USER TASK ─────────────────

async function generateUserTasks({ userPrompt, timelineDays }) {

  const prompt = `
Generate personalized tasks.

User request: ${userPrompt}

RULES:
- Max 1 task per day
- Include "day"
- Return JSON array

[]
`;

  const res = await fetch("https://openrouter.ai/api/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      model: "mistralai/mistral-7b-instruct",
      messages: [
        { role: "system", content: "Return JSON only" },
        { role: "user", content: prompt }
      ]
    })
  });

  const data = await res.json();
  const text = data.choices[0].message.content.replace(/```/g, "").trim();

  return JSON.parse(text);
}


// ─── CONTROLLER ─────────────────

export const onboardingController = async (req, res) => {

  const userId = getUser(req);
  if (!userId) return res.status(401).json({ success: false });

  const { selections } = req.body;

  const { domain, target, experience } = selections;
  
  const timelineDays = Number(selections.timeline.timeline);
  const userPrompt = selections.timeline.prompt || "";
// activity log
 await activity_log.findOneAndUpdate(
  { userId },
  {
    $push: {
      activity: {
        activityType: "onboarding",
        details: `Domain: ${domain}, Target: ${target}, Experience: ${experience}`,
        createdAt: new Date()
      }
    }
  },
  {
    upsert: true,   // create if not exists
    new: true
  }
);
  try {

    const roadmap = await Roadmap.find({
      domain: domain,
      experienceLevel: experience,
      targetType: target,
      timelineDays: timelineDays
    });

    if (!roadmap) {
      return res.status(404).json({ success: false });
    }
    
     const roadmapId =new mongoose.Types.ObjectId(roadmap[0]._id);;
    
     const isDuplicate = await UserRoadmap.findOne({ userId, "roadmapIds.roadmapId": roadmapId });
     if (isDuplicate) {
       return res.json({ success: true, message: "Roadmap already exists" });
     }
    await UserRoadmap.create({
      userId,
      goalRole: roadmap[0].goalRole,
      roadmapIds: [{ roadmapId, status: 'active' }]
    });
    await task_completion.create({
      userId,
      roadmapId,
      status: 'in_progress',
      days:[{ dayNumber: 1, completedTaskIds: [] }],
      startedAt: new Date(),
      lastActivityAt: new Date(),
      // currentDay: 1

    });
     return res.json({ success: true, roadmap });
    // prevent duplicate
    // const exists = await UserRoadmap.findOne({
    //   userId,
    //   domain: domain,
    //   targetType: target,
    //   experienceLevel: experience,
    //   timelineDays: timelineDays
    // });

    // if (exists) {
    //   return res.json({ success: true, message: "Already exists" });
    // }

    
      // const taskIds = roadmap[0].day.flatMap(d => d.taskIds);
      // await UserRoadmap.create({
      //   userId,
      //   domain: roadmap[0].domain,
      //   targetType: roadmap[0].targetType,
      //   experienceLevel: roadmap[0].experienceLevel,
      //   timelineDays: roadmap[0].timelineDays,
      //   studyHoursPerDay: roadmap[0].studyHoursPerDay,
      //   goalRole: roadmap[0].goalRole,
      //   taskIds: taskIds  
      // });

      // return res.json({ success: true, message: "Roadmap created" });

  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false });
    
  }
    //   const tasksPerDay = timelineDays;
  //   const totalTasks = timelineDays;

  //   // 🔥 GLOBAL TASKS (sorted by priority)
  //   const globalTasks = await Task.find({
  //     domain: domain,
  //     experienceLevel: experience,
  //     targetTypes: target,
  //     userId: "ALL"
  //   })
  //     .sort({ priority: 1 })
  //     .limit(totalTasks);

  //   // 🔥 USER TASKS
  //   let userTasks = [];
  //   if (userPrompt) {
  //     userTasks = await generateUserTasks({ userPrompt, timelineDays });
  //   }

  //   let order = 1;
  //   let index = 0;

  //   const progressDocs = [];

  //   for (let day = 1; day <= timelineDays; day++) {

  //     // global tasks
  //     for (let i = 0; i < tasksPerDay; i++) {
  //       const task = globalTasks[index++];
  //       if (!task) break;

  //       progressDocs.push({
  //         userId,
  //         roadmapId: roadmap._id,
  //         taskId: task._id,
  //         day,
  //         order: order++
  //       });
  //     }

  //     // user task (max 1/day)
  //     const userTask = userTasks.find(t => t.day === day);

  //     if (userTask) {

  //       const created = await Task.create({
  //         roadmapId: roadmap._id,
  //         userId: userId.toString(),
  //         category: domain,
  //         difficulty: experience,
  //         targetTypes: [target],
  //         title: userTask.title,
  //         description: userTask.description || "",
  //         type: "project",
  //         priority: 1
  //       });

  //       progressDocs.push({
  //         userId,
  //         roadmapId: roadmap._id,
  //         taskId: created._id,
  //         day,
  //         order: order++
  //       });
  //     }
  //   }

  //   await UserTaskProgress.insertMany(progressDocs);

  //   await UserRoadmap.create({
  //     userId,
  //     roadmapId: roadmap._id,
  //     domain,
  //     targetType: target,
  //     experienceLevel: experience,
  //     timelineDays
  //   });

  //   return res.json({
  //     success: true,
  //     totalTasks: progressDocs.length
  //   });

  // } catch (err) {
  //   console.error(err);
  //   res.status(500).json({ success: false });
  // }
};