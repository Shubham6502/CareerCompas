import Roadmap from "../modules/roadmap/roadmap.model.js";
import UserClusterProgress from "../modules/progress/userClusterProgress.model.js";
import CareerProfile from "../modules/careerProfile/careerProfile.model.js";
import LearningCluster from "../modules/learning/learningCluster.model.js";
import jwt from "jsonwebtoken";

export async function getUserRoadmap(req, res) {
  const token = req.cookies?.token;
  if (!token) return res.status(401).json({ success: false });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.userId;

    const profile = await CareerProfile.findOne({ userId, isDeleted: false }).lean();
    if (!profile || !profile.activeRoadmapId) {
      return res.status(404).json({ success: false, message: "No active roadmap found" });
    }

    const roadmapData = await Roadmap.findById(profile.activeRoadmapId).lean();
    if (!roadmapData) {
      return res.status(404).json({ success: false, message: "Roadmap not found" });
    }

    const progress = await UserClusterProgress.findOne({ userId, roadmapId: roadmapData._id }).lean();
    const cluster = progress ? await LearningCluster.findById(progress.clusterId).lean() : null;

    res.status(200).json({
      success: true,
      roadmapDetails: {
        domain: roadmapData.domain,
        goalRole: roadmapData.title,
        timelineDays: 30,
        targetType: "product",
        experienceLevel: "beginner"
      },
      lastCompletedDay: 1,
      roadmap: {
        days: [
          {
            dayNumber: 1,
            tasks: []
          }
        ]
      }
    });
  } catch (err) {
    console.error("getUserRoadmap error:", err);
    res.status(500).json({ success: false });
  }
}
