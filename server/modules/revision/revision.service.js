import RevisionSchedule from "./revisionSchedule.model.js";
import LearningCluster from "../learning/learningCluster.model.js";
import RoadmapCluster from "../roadmap/roadmapCluster.model.js";
import Task from "../task/tasks.model.js";
import * as masteryRepository from "../topic-mastery/mastery.repository.js";

// Helper to add days to a date
const addDays = (date, days) => {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
};

export const scheduleRevision = async (userId, clusterId) => {
  const cluster = await LearningCluster.findById(clusterId).lean();
  if (!cluster || !cluster.topicsIncluded) return [];

  const now = new Date();
  const schedules = [];

  for (const item of cluster.topicsIncluded) {
    // Delete any existing uncompleted revision schedule for this topic
    await RevisionSchedule.deleteMany({ userId, topicId: item.topicId, completed: false });

    // Schedule Day 1 revision
    const schedule = await RevisionSchedule.create({
      userId,
      topicId: item.topicId,
      clusterId: cluster._id,
      revisionNumber: 1,
      dueDate: addDays(now, 1),
      completed: false,
      interval: 1,
      easeFactor: 2.5,
      policy: {
        intervals: [1, 7, 15, 30],
        algorithm: "SM2"
      }
    });
    schedules.push(schedule);
  }
  return schedules;
};

export const getDueRevisions = async (userId, roadmapId) => {
  // Get all active clusters in this roadmap
  const mappings = await RoadmapCluster.find({ roadmapId }).lean();
  const clusterIds = mappings.map(m => m.clusterId);

  const now = new Date();
  return RevisionSchedule.find({
    userId,
    clusterId: { $in: clusterIds },
    completed: false,
    dueDate: { $lte: now }
  }).lean();
};

export const completeRevision = async (userId, topicId, score) => {
  // Find the active schedule
  const current = await RevisionSchedule.findOne({
    userId,
    topicId,
    completed: false
  }).sort({ revisionNumber: 1 });

  if (!current) return null;

  // Mark current completed
  current.completed = true;
  await current.save();

  // If revision stage exceeds the limit (e.g. 4 revisions completed), we don't schedule more
  if (current.revisionNumber >= 4) {
    return current;
  }

  // Calculate next interval using SM2 or fixed
  const policy = current.policy || { intervals: [1, 7, 15, 30], algorithm: "SM2" };
  let nextInterval = 1;
  let nextEase = current.easeFactor || 2.5;

  if (policy.algorithm === "fixed") {
    const idx = current.revisionNumber; // revisionNumber is 1-indexed, so index 1 maps to Stage 2 (intervals[1] which is 7)
    nextInterval = policy.intervals[idx] || policy.intervals[policy.intervals.length - 1] || 1;
  } else {
    // SM2 calculation
    // Map score percentage (0-100) to quality q (0-5)
    let q = 0;
    if (score >= 90) q = 5;
    else if (score >= 80) q = 4;
    else if (score >= 70) q = 3;
    else if (score >= 60) q = 2;
    else if (score >= 40) q = 1;

    if (q < 3) {
      // Repetition failed, restart cycle
      nextInterval = 1;
      nextEase = Math.max(1.3, nextEase - 0.2);
    } else {
      // Pass
      if (current.revisionNumber === 1) {
        nextInterval = 1;
      } else if (current.revisionNumber === 2) {
        nextInterval = 6;
      } else {
        nextInterval = Math.round(current.interval * nextEase);
      }
      nextEase = nextEase + (0.1 - (5 - q) * (0.08 + (5 - q) * 0.02));
      nextEase = Math.max(1.3, nextEase);
    }
  }

  // Create next revision schedule
  const next = await RevisionSchedule.create({
    userId,
    topicId,
    clusterId: current.clusterId,
    revisionNumber: current.revisionNumber + 1,
    dueDate: addDays(new Date(), nextInterval),
    completed: false,
    interval: nextInterval,
    easeFactor: nextEase,
    policy
  });

  // Sync back to TopicMastery
  await masteryRepository.updateTopicMastery(userId, topicId, {
    nextRevision: next.dueDate,
    lastReviewed: new Date(),
    revisionCount: current.revisionNumber
  });

  return next;
};

export const injectRevisionTasks = async (userId, roadmapId, dailyTasks, remainingMinutes) => {
  const due = await getDueRevisions(userId, roadmapId);
  let minutesLeft = remainingMinutes;

  for (const schedule of due) {
    if (minutesLeft <= 0) break;

    // Fetch revision task for this topic
    // Prioritize tasks with stage revision, or order-based tasks
    const task = await Task.findOne({
      topicId: schedule.topicId,
      isActive: true,
      isDeprecated: false,
      // Try to find a revision stage task first, fallback to general tasks
      $or: [
        { learningStage: "revision" },
        { taskType: "quiz" }
      ]
    }).lean() || await Task.findOne({
      topicId: schedule.topicId,
      isActive: true,
      isDeprecated: false
    }).lean();

    if (task) {
      const duration = task.estimatedMinutes || 15;
      if (duration <= minutesLeft) {
        dailyTasks.push({
          taskId: task._id,
          taskSlug: task.slug,
          topicId: schedule.topicId,
          reason: "revision",
          completed: false
        });
        minutesLeft -= duration;
      }
    }
  }

  return minutesLeft;
};
