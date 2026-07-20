import mongoose from "mongoose";
import Roadmap from "../roadmap/roadmap.model.js";
import CareerProfile from "../careerProfile/careerProfile.model.js";
import * as dashboardRepository from "./dashboard.repository.js";
import * as progressService from "../progress/progress.service.js";
import * as plannerService from "../daily-plan/planner.service.js";
import * as revisionService from "../revision/revision.service.js";
import * as masteryService from "../topic-mastery/mastery.service.js";
import * as learningEngineService from "../learning/learningEngine.service.js";
import * as assessmentRepository from "../assessment/assessment.repository.js";
import * as dailyPlanRepository from "../daily-plan/planner.repository.js";
import * as careerProfileRepository from "../careerProfile/careerProfile.repository.js";
import { mapDashboardResponse } from "./dashboard.dto.js";

export const getDashboardData = async (userId) => {
  // 1. Load Career Profile
  console.log("Dashboard service - userId:", userId);
  const profile = await careerProfileRepository.findCareerProfileByUserId(userId);
  console.log("Dashboard service - profile:", profile);
  if (!profile || !profile.onboardingCompleted) {
    return { action: "ONBOARDING_REQUIRED" };
  }

  // 2. Load Active Roadmap
  let roadmapId = profile.activeRoadmapId;
  if (!roadmapId) {
    // Resolve a default roadmap if none is set
    const defaultRoadmap = await Roadmap.findOne({ isPublished: true, isActive: true, isDeleted: false }).lean();
    if (!defaultRoadmap) {
      return { action: "NO_ROADMAP" };
    }
    roadmapId = defaultRoadmap._id;
    await CareerProfile.findOneAndUpdate({ userId }, { $set: { activeRoadmapId: roadmapId } });
    profile.activeRoadmapId = roadmapId;
  }

  // Concurrently fetch User and Roadmap details
  const [user, roadmap] = await Promise.all([
    dashboardRepository.getUser(userId),
    dashboardRepository.getRoadmap(roadmapId)
  ]);

  if (!roadmap) {
    return { action: "NO_ROADMAP" };
  }

  // 3. Load Progress
  const progress = await progressService.getCurrentProgress(userId);
  if (!progress) {
    return { action: "ROADMAP_COMPLETED" };
  }

  // 4. Handle Pending Entry Assessment
  if (progress.status === "entry_assessment") {
    return { action: "ENTRY_ASSESSMENT" };
  }

  // 5. Load Current Cluster
  const cluster = await dashboardRepository.getCurrentCluster(progress.clusterId);

  // 6. Load Today's Plan
  let todayPlan = await plannerService.getDailyPlans(userId);
  if (!todayPlan && progress.status === "learning") {
    todayPlan = await plannerService.createDailyPlan(userId);
  }

  // Load Task details for remaining estimated minutes compilation
  let tasksData = [];
  if (todayPlan && todayPlan.tasks && todayPlan.tasks.length > 0) {
    const taskIds = todayPlan.tasks.map(t => t.taskId);
    tasksData = await dashboardRepository.getTasksData(taskIds);
  }

  // 7. Load Revision, Assessment, Analytics, and Recommendation Context concurrently
  const [assessmentSummary, revisionSummary, analyticsSummary, recContext] = await Promise.all([
    dashboardRepository.getAssessmentSummary(userId, progress.clusterId),
    dashboardRepository.getRevisionSummary(userId, roadmapId),
    dashboardRepository.getAnalytics(userId),
    learningEngineService.getRecommendationContext(userId, roadmapId, progress)
  ]);

  // 8. Compile and return Dashboard DTO
  return mapDashboardResponse(
    user,
    roadmap,
    cluster,
    progress,
    todayPlan,
    assessmentSummary,
    revisionSummary,
    analyticsSummary,
    profile,
    recContext,
    tasksData
  );
};
