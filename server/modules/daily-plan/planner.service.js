import * as plannerRepository from "./planner.repository.js";
import UserClusterProgress from "../progress/userClusterProgress.model.js";
import LearningCluster from "../learning/learningCluster.model.js";
import CareerProfile from "../careerProfile/careerProfile.model.js";
import EngineConfig from "../roadmap/engineConfig.model.js";
import * as revisionService from "../revision/revision.service.js";
import Task from "../task/tasks.model.js";
import Topic from "../topics/topics.model.js";

const getUtcStartOfDay = (date = new Date()) => {
  const normalized = new Date(date);
  normalized.setUTCHours(0, 0, 0, 0);
  return normalized;
};

export const createDailyPlan = async (userId) => {
  const profile = await CareerProfile.findOne({ userId, isDeleted: false }).lean();
  if (!profile) {
    throw new Error("User career profile not found.");
  }

  const roadmapId = profile.activeRoadmapId;
  const studyHoursPerDay = profile.studyHoursPerDay || 2;
  const budgetMinutes = Math.round(studyHoursPerDay * 60);
  const planDate = getUtcStartOfDay();

  // Return existing plan if already generated today
  const existingPlan = await plannerRepository.findPlanByDate(userId, planDate);
  if (existingPlan) {
    return existingPlan;
  }

  // Get active progress
  const progress = await UserClusterProgress.findOne({
    userId,
    roadmapId,
    status: "learning"
  }).lean();

  if (!progress) {
    throw new Error("No active learning progress found for this cluster. Complete the Entry Assessment first.");
  }

  // Get admin engine config
  let config = await EngineConfig.findOne({ key: "default" }).lean();
  if (!config) {
    config = await EngineConfig.create({ key: "default" });
  }

  const dailyTasks = [];
  let remainingMinutes = budgetMinutes;

  // 1. Inject Revisions (Highest Priority)
  if (config.features?.revisionEngine !== false) {
    remainingMinutes = await revisionService.injectRevisionTasks(userId, roadmapId, dailyTasks, remainingMinutes);
  }

  // 2. Fetch Learning Cluster and filter topics
  const cluster = await LearningCluster.findById(progress.clusterId).lean();
  if (!cluster || !cluster.topicsIncluded || cluster.topicsIncluded.length === 0) {
    throw new Error("Current cluster contains no topics.");
  }

  // Determine active learning path
  let topicsList = cluster.topicsIncluded;
  if (progress.adaptiveMode === "shortened") {
    // Only study topics that aren't already completed/skipped
    const completedSet = new Set(progress.completedTopics.map(id => id.toString()));
    topicsList = cluster.topicsIncluded.filter(t => !completedSet.has(t.topicId.toString()));
  }

  let currentTopicIdx = progress.currentTopicIndex || 0;
  let currentTaskIdx = progress.currentTaskIndex || 0;
  const completedTaskIds = await plannerRepository.getCompletedTaskIds(userId);
  const completedTaskSet = new Set(completedTaskIds);

  let topicsPlannedThisDay = 0;
  const maxTopics = config.planner?.maxTopicsPerDay || 3;

  while (remainingMinutes > 0 && currentTopicIdx < topicsList.length && topicsPlannedThisDay < maxTopics) {
    const topicItem = topicsList[currentTopicIdx];
    const topicId = topicItem.topicId;

    // Fetch tasks for the topic sorted by order
    let tasks = await Task.find({
      topicId,
      isActive: true,
      isDeprecated: false
    }).sort({ order: 1 }).lean();

    // Filter out tasks already completed
    tasks = tasks.filter(t => !completedTaskSet.has(t._id.toString()));

    if (tasks.length === 0 || currentTaskIdx >= tasks.length) {
      // Topic is completed! Mark it in progress
      if (!progress.completedTopics.some(id => id.toString() === topicId.toString())) {
        await UserClusterProgress.findByIdAndUpdate(progress._id, {
          $addToSet: { completedTopics: topicId }
        });
      }
      currentTopicIdx++;
      currentTaskIdx = 0;
      continue;
    }

    let topicHasPlannedTasks = false;

    // Plan tasks from the topic
    for (let i = currentTaskIdx; i < tasks.length; i++) {
      const task = tasks[i];
      const taskMinutes = task.estimatedMinutes || 15;

      if (remainingMinutes >= taskMinutes) {
        dailyTasks.push({
          taskId: task._id,
          taskSlug: task.slug,
          topicId,
          reason: currentTaskIdx === 0 && !topicHasPlannedTasks ? "new-topic" : "continuation",
          completed: false
        });

        remainingMinutes -= taskMinutes;
        currentTaskIdx = i + 1; // Points to the next task to start with
        topicHasPlannedTasks = true;
      } else {
        // Budget exhausted, stop planning and save pointers
        await UserClusterProgress.findByIdAndUpdate(progress._id, {
          $set: {
            currentTopicIndex: currentTopicIdx,
            currentTaskIndex: i
          }
        });
        remainingMinutes = 0;
        break;
      }
    }

    if (topicHasPlannedTasks) {
      topicsPlannedThisDay++;
    }

    // If all tasks in topic were planned, advance topic index
    if (currentTaskIdx >= tasks.length && remainingMinutes > 0) {
      if (!progress.completedTopics.some(id => id.toString() === topicId.toString())) {
        await UserClusterProgress.findByIdAndUpdate(progress._id, {
          $addToSet: { completedTopics: topicId }
        });
      }
      currentTopicIdx++;
      currentTaskIdx = 0;
    }
  }

  // Check if all topics in the cluster are fully completed
  if (currentTopicIdx >= topicsList.length && dailyTasks.length > 0) {
    await UserClusterProgress.findByIdAndUpdate(progress._id, {
      $set: {
        status: "final_assessment"
      }
    });
  }

  // Save and return DailyPlan
  return plannerRepository.saveDailyPlan({
    userId,
    roadmapId,
    clusterId: progress.clusterId,
    planDate,
    tasks: dailyTasks,
    studyHoursBudget: studyHoursPerDay,
    status: "active",
    completedTaskCount: 0,
    generatedAt: new Date()
  });
};

export const getDailyPlans = async (userId) => {
  const planDate = getUtcStartOfDay();
  return plannerRepository.findPlanByDate(userId, planDate);
};
