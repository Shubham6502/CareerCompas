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
  console.log("Onboarding request by user:", userId);
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
    console.log("User roadmap created for user:", userId, "with roadmapId:", roadmapId);

     return res.status(200).json({ success: true, roadmap });
  

  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false });
    
  }

};