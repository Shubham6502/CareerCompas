import DailyPlan from "./dailyPlan.model.js";
import Task from "../task/tasks.model.js";
import UserTaskProgress from "../userTaskProgress/userTaskProgress.js";

export const findPlanByDate = async (userId, planDate) => {
  return DailyPlan.findOne({ userId, planDate }).lean();
};

export const saveDailyPlan = async (planData) => {
  return DailyPlan.create(planData);
};

export const getLatestPlan = async (userId) => {
  return DailyPlan.findOne({ userId })
    .sort({ planDate: -1, generatedAt: -1 })
    .lean();
};

export const getCompletedTaskIds = async (userId) => {
  const completed = await UserTaskProgress.find({
    userId,
    status: "completed"
  }).select("taskId").lean();
  return completed.map(t => t.taskId.toString());
};

export const findEligibleTasks = async ({ topicId, careerTrack, excludeTaskIds = [], targetDifficulty = null }) => {
  const query = {
    topicId,
    careerTracks: careerTrack,
    isActive: true,
    isDeprecated: false,
    _id: { $nin: excludeTaskIds }
  };

  if (targetDifficulty) {
    query.difficultyLevel = targetDifficulty;
  }

  return Task.find(query)
    .sort({ order: 1, difficultyScore: 1 })
    .lean();
};
