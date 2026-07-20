import mongoose from "mongoose";
import User from "../../models/user.js";
import CareerProfile from "../careerProfile/careerProfile.model.js";
import Roadmap from "../roadmap/roadmap.model.js";
import LearningCluster from "../learning/learningCluster.model.js";
import UserClusterProgress from "../progress/userClusterProgress.model.js";
import DailyPlan from "../daily-plan/dailyPlan.model.js";
import RevisionSchedule from "../revision/revisionSchedule.model.js";
import AssessmentAttempt from "../assessment/assessmentAttempt.model.js";
import TopicMastery from "../topic-mastery/topicMastery.model.js";
import LearningSession from "../roadmap/learningSession.model.js";
import RoadmapCluster from "../roadmap/roadmapCluster.model.js";
import Task from "../task/tasks.model.js";

export const getUser = async (userId) => {
  return User.findById(userId).select("firstName lastName email avatarUrl").lean();
};

export const getCareerProfile = async (userId) => {
  return CareerProfile.findOne({ userId, isDeleted: false }).lean();
};

export const getRoadmap = async (roadmapId) => {
  return Roadmap.findOne({ _id: roadmapId, isDeleted: false }).lean();
};

export const getCurrentCluster = async (clusterId) => {
  return LearningCluster.findOne({ _id: clusterId, isDeleted: false }).lean();
};

export const getProgress = async (userId, roadmapId, clusterId) => {
  return UserClusterProgress.findOne({ userId, roadmapId, clusterId }).lean();
};

export const getTodayPlan = async (userId, roadmapId, clusterId, planDate) => {
  return DailyPlan.findOne({ userId, roadmapId, clusterId, planDate }).lean();
};

export const getRevisionSummary = async (userId, roadmapId) => {
  const mappings = await RoadmapCluster.find({ roadmapId }).lean();
  const clusterIds = mappings.map(m => m.clusterId);
  const now = new Date();

  const dueCount = await RevisionSchedule.countDocuments({
    userId,
    clusterId: { $in: clusterIds },
    completed: false,
    dueDate: { $lte: now }
  });

  const nextRevisionDoc = await RevisionSchedule.findOne({
    userId,
    clusterId: { $in: clusterIds },
    completed: false
  }).sort({ dueDate: 1 }).select("dueDate").lean();

  return {
    dueCount,
    nextRevisionAt: nextRevisionDoc?.dueDate || null
  };
};

export const getAssessmentSummary = async (userId, clusterId) => {
  const lastAttempt = await AssessmentAttempt.findOne({
    userId,
    clusterId
  }).sort({ submittedAt: -1 }).lean();

  return {
    lastAttempt
  };
};

export const getAnalytics = async (userId) => {
  const completedClusters = await UserClusterProgress.countDocuments({
    userId,
    status: "completed"
  });

  const progressDocs = await UserClusterProgress.find({ userId }).select("completedTopics").lean();
  const completedTopicIds = new Set();
  progressDocs.forEach(doc => {
    if (doc.completedTopics) {
      doc.completedTopics.forEach(tid => completedTopicIds.add(tid.toString()));
    }
  });

  let totalStudyHours = 0;
  try {
    const sessionAggregation = await LearningSession.aggregate([
      { $match: { userId: new mongoose.Types.ObjectId(userId) } },
      { $group: { _id: null, totalMinutes: { $sum: "$durationMinutes" } } }
    ]);
    const totalMinutes = sessionAggregation[0]?.totalMinutes || 0;
    totalStudyHours = Math.round((totalMinutes / 60) * 10) / 10;
  } catch (err) {
    console.error("Aggregation error for study hours:", err);
  }

  let averageAccuracy = 0;
  try {
    const masteryAggregation = await TopicMastery.aggregate([
      { $match: { userId: new mongoose.Types.ObjectId(userId) } },
      { $group: { _id: null, avgAccuracy: { $avg: "$accuracy" } } }
    ]);
    averageAccuracy = Math.round(masteryAggregation[0]?.avgAccuracy || 0);
  } catch (err) {
    console.error("Aggregation error for average accuracy:", err);
  }

  return {
    completedClusters,
    completedTopics: completedTopicIds.size,
    totalStudyHours,
    averageAccuracy
  };
};

export const getTasksData = async (taskIds) => {
  return Task.find({ _id: { $in: taskIds } }).select("estimatedMinutes").lean();
};
