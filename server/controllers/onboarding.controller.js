import mongoose from "mongoose";
import Roadmap from "../modules/roadmap/roadmap.model.js";
import CareerProfile from "../modules/careerProfile/careerProfile.model.js";
import UserClusterProgress from "../modules/progress/userClusterProgress.model.js";
import * as progressService from "../modules/progress/progress.service.js";
import jwt from "jsonwebtoken";

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

export const onboardingController = async (req, res) => {
  const userId = getUser(req);
  if (!userId) return res.status(401).json({ success: false });

  const { selections } = req.body;
  const { domain, target, experience } = selections;
  const timelineDays = Number(selections.timeline?.timeline || 30);

  try {
    const roadmap = await Roadmap.find({
      domain: domain,
      track: experience
    });

    if (!roadmap || roadmap.length === 0) {
      return res.status(404).json({ success: false, message: "Roadmap not found" });
    }
    
    const roadmapId = new mongoose.Types.ObjectId(roadmap[0]._id);

    // Save to CareerProfile
    await CareerProfile.findOneAndUpdate(
      { userId },
      { 
        $set: { 
          activeRoadmapId: roadmapId, 
          targetRole: roadmap[0].title || "Software Engineer",
          experienceLevel: experience === "beginner" ? "student" : "fresher",
          studyHoursPerDay: 2
        } 
      },
      { upsert: true, new: true }
    );

    // Initialize progress for the first cluster
    const progress = await progressService.getCurrentProgress(userId);

    return res.status(200).json({ success: true, roadmap, progress });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false });
  }
};