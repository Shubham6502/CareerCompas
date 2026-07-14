import mongoose from "mongoose";
import CareerProfile from "../careerProfile/careerProfile.model.js";
import Task from "../task/tasks.model.js";
import Topic from "../topics/topics.model.js";
import DailyPlan from "./dailyPlan.model.js";

/* -------------------------------------------------------------------------- */
/* Database Query Helper Functions                                           */
/* -------------------------------------------------------------------------- */

export const getProfileData = async (userId) => {
  if (!userId) {
    throw new Error("User ID is required to fetch profile data.");
  }

  const careerProfile = await CareerProfile.findOne({
    userId,
    isDeleted: false,
  })
    .select("targetRole targetCompanies experienceLevel studyHoursPerDay")
    .lean();

  if (!careerProfile) {
    throw new Error("Career profile not found for the given user ID.");
  }

  return careerProfile;
};

export const getCompletedTaskIds = async (userId) => {
  const plans = await DailyPlan.find({
    userId,
    "tasks.completed": true,
  })
    .select("tasks")
    .lean();

  const completedIds = plans.flatMap((plan) =>
    (plan.tasks ?? [])
      .filter((task) => task.completed === true)
      .map((task) => task.taskId)
  );

  return [
    ...new Map(
      completedIds.map((id) => [id.toString(), id])
    ).values(),
  ];
};

export const getLatestPlan = async (userId) => {
  return DailyPlan.findOne({
    userId,
  })
    .sort({
      planDate: -1,
      generatedAt: -1,
    })
    .lean();
};

export const findEligibleTasks = async ({ topicId, careerTrack, excludeTaskIds = [] }) => {
  if (!topicId) {
    return [];
  }

  const filter = {
    topicId,
    careerTracks: careerTrack,
    isActive: true,
    isDeprecated: false,
  };

  if (excludeTaskIds.length > 0) {
    filter._id = { $nin: excludeTaskIds };
  }

  return Task.find(filter)
    .sort({
      difficultyScore: 1,
      cognitiveLoad: 1,
      estimatedMinutes: 1,
    })
    .lean();
};

export const getTopicWithEligibleTasks = async ({ topicId, careerTrack, excludeTaskIds }) => {
  if (!topicId) {
    return null;
  }

  const topic = await Topic.findById(topicId).lean();
  if (!topic) {
    return null;
  }

  const tasks = await findEligibleTasks({
    topicId: topic._id,
    careerTrack,
    excludeTaskIds,
  });

  if (tasks.length === 0) {
    return null;
  }

  return {
    topic,
    tasks,
  };
};

export const getTopicById = async (topicId) => {
  return Topic.findById(topicId).lean();
};

export const getRootTopics = async () => {
  return Topic.find({
    $or: [
      { prerequisites: { $size: 0 } },
      { prerequisites: { $exists: false } },
    ],
  })
    .sort({
      importanceScore: -1,
      difficultyScore: 1,
    })
    .lean();
};

export const getCandidateTask = async (careerTrack, excludeTaskIds = []) => {
  return Task.findOne({
    careerTracks: careerTrack,
    isActive: true,
    isDeprecated: false,
    ...(excludeTaskIds.length > 0
      ? {
          _id: { $nin: excludeTaskIds },
        }
      : {}),
  })
    .sort({
      difficultyScore: 1,
      cognitiveLoad: 1,
    })
    .lean();
};

export const getEligibleTopicIds = async (careerTrack, excludeTaskIds = []) => {
  return Task.distinct("topicId", {
    careerTracks: careerTrack,
    isActive: true,
    isDeprecated: false,
    ...(excludeTaskIds.length > 0
      ? {
          _id: { $nin: excludeTaskIds },
        }
      : {}),
  });
};

export const getTopicByCategory = async (unvisitedTopicIds, category) => {
  return Topic.findOne({
    _id: { $in: unvisitedTopicIds },
    category,
  })
    .sort({
      difficultyScore: 1,
      importanceScore: -1,
    })
    .lean();
};

export const getTopicByDomain = async (unvisitedTopicIds, domain) => {
  return Topic.findOne({
    _id: { $in: unvisitedTopicIds },
    domain,
  })
    .sort({
      difficultyScore: 1,
      importanceScore: -1,
    })
    .lean();
};

export const getFallbackTopic = async (unvisitedTopicIds) => {
  return Topic.findOne({
    _id: { $in: unvisitedTopicIds },
  })
    .sort({
      difficultyScore: 1,
      importanceScore: -1,
    })
    .lean();
};

export const findPlanByDate = async (userId, planDate) => {
  return DailyPlan.findOne({
    userId,
    planDate,
  }).lean();
};

export const saveDailyPlan = async (planData) => {
  return DailyPlan.create(planData);
};

export const getDailyPlans = async (userId, planDate) => {
  if (!userId) {
    throw new Error("User ID is required to fetch daily plans.");
  }

  return DailyPlan.find({
    userId,
    planDate,
  })
    .populate({
      path: "tasks.taskId",
      select: "slug title description topicId taskType learningStage bloomLevel difficultyLevel difficultyScore estimatedMinutes isInterviewCritical resource",
    })
    .populate({
      path: "tasks.topicId",
      select: "slug displayName domain category difficultyScore importanceScore",
    })
    .lean();
};

export const getDailyPlanById = async (planId) => {
  if (!mongoose.isValidObjectId(planId)) {
    throw new Error("Invalid daily plan ID.");
  }

  return DailyPlan.findById(planId)
    .populate({
      path: "tasks.taskId",
    })
    .populate({
      path: "tasks.topicId",
    })
    .lean();
};

export const updateDailyPlan = async (planId, updateData) => {
  if (!mongoose.isValidObjectId(planId)) {
    throw new Error("Invalid daily plan ID.");
  }

  return DailyPlan.findByIdAndUpdate(
    planId,
    { $set: updateData },
    { new: true }
  )
    .populate({
      path: "tasks.taskId",
    })
    .populate({
      path: "tasks.topicId",
    })
    .lean();
};

export const deleteDailyPlan = async (planId) => {
  if (!mongoose.isValidObjectId(planId)) {
    throw new Error("Invalid daily plan ID.");
  }

  return DailyPlan.deleteOne({
    _id: planId,
  });
};