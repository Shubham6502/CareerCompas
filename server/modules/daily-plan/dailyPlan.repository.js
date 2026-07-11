import mongoose from "mongoose";
import CareerProfile from "../careerProfile/careerProfile.model.js";
import Task from "../task/tasks.model.js";
import Topic from "../topics/topics.model.js";
import DailyPlan from "./dailyPlan.model.js";

/* -------------------------------------------------------------------------- */
/* Constants                                                                  */
/* -------------------------------------------------------------------------- */

/**
 * Why a task was included in a daily plan. Kept as an explicit enum so
 * a future AI-driven planner can add new reasons (e.g. "revision",
 * "weak-area") without breaking anything that already reads this field.
 */
const TASK_REASON = Object.freeze({
  NEW_TOPIC: "new-topic",
  CONTINUATION: "continuation",
});

const PLAN_STATUS = Object.freeze({
  ACTIVE: "active",
});

// Mongo duplicate-key error. Requires a unique compound index on
// { userId: 1, planDate: 1 } on the DailyPlan model — add it there:
//   dailyPlanSchema.index({ userId: 1, planDate: 1 }, { unique: true });
const DUPLICATE_KEY_ERROR_CODE = 11000;

/* -------------------------------------------------------------------------- */
/* Helpers                                                                    */
/* -------------------------------------------------------------------------- */

/** Normalizes to midnight UTC so a calendar day always maps to one Date value. */
const getUtcStartOfDay = (date = new Date()) => {
  const normalized = new Date(date);
  normalized.setUTCHours(0, 0, 0, 0);
  return normalized;
};

/**
 * A profile can list several target companies. We plan for the one the
 * user cares about most (lowest `priority` number = highest priority).
 */
const resolvePrimaryCareerTrack = (targetCompanies) => {
  if (!Array.isArray(targetCompanies) || targetCompanies.length === 0) {
    throw new Error(
      "At least one target company is required to generate a daily plan."
    );
  }

  const [primary] = [...targetCompanies].sort(
    (a, b) => (a.priority ?? Infinity) - (b.priority ?? Infinity)
  );

  if (!primary?.tier) {
    throw new Error("Selected target company is missing a career tier.");
  }

  return primary.tier;
};

const buildEligibleTaskFilter = ({ topicId, careerTrack, excludeTaskIds }) => ({
  topicId,
  careerTracks: careerTrack,
  isActive: true,
  isDeprecated: false,
  _id: { $nin: excludeTaskIds },
});

const findEligibleTasks = (filter) =>
  Task.find(filter).sort({ difficultyScore: 1, estimatedMinutes: 1 }).lean();

/**
 * Greedily fills the day's study budget, cheapest tasks first. Falls
 * back to the single smallest task when every task is bigger than the
 * remaining budget, so a plan is never left empty.
 */
const selectTasksWithinBudget = (availableTasks, budgetMinutes) => {
  const selected = [];
  let minutesUsed = 0;

  for (const task of availableTasks) {
    const cost = task.estimatedMinutes ?? 0;
    if (minutesUsed + cost <= budgetMinutes) {
      selected.push(task);
      minutesUsed += cost;
    }
  }

  if (selected.length === 0 && availableTasks.length > 0) {
    selected.push(availableTasks[0]);
    minutesUsed = availableTasks[0].estimatedMinutes ?? 0;
  }

  return { selected, minutesUsed };
};

/** The very first topic a brand-new user should study. */
const resolveStartingTopic = async () => {
  const startingTopic = await Topic.findOne({ prerequisites: { $size: 0 } })
    .sort({ importanceScore: -1, difficultyScore: 1 })
    .lean();

  if (!startingTopic) {
    throw new Error("No starting topic is configured in the topic graph.");
  }

  return startingTopic;
};

/**
 * Walks a topic's `nextTopics` (highest edgeWeight first) until it
 * finds one that still has eligible, unseen tasks for this career track.
 */
const resolveNextTopicWithTasks = async ({ topic, careerTrack, excludeTaskIds }) => {
  if (!topic?.nextTopics?.length) {
    return null;
  }

  const candidates = [...topic.nextTopics].sort(
    (a, b) => (b.edgeWeight ?? 0) - (a.edgeWeight ?? 0)
  );

  for (const candidate of candidates) {
    const tasks = await findEligibleTasks(
      buildEligibleTaskFilter({
        topicId: candidate.topicId,
        careerTrack,
        excludeTaskIds,
      })
    );

    if (tasks.length > 0) {
      return { topicId: candidate.topicId, tasks };
    }
  }

  return null;
};

/**
 * Resolves which topic to study today and its pool of eligible tasks,
 * continuing from where the user left off, moving through the topic
 * graph as topics get exhausted.
 */
const resolveTopicAndTasks = async ({ previousTopicId, careerTrack, excludeTaskIds }) => {
  if (previousTopicId) {
    const tasks = await findEligibleTasks(
      buildEligibleTaskFilter({ topicId: previousTopicId, careerTrack, excludeTaskIds })
    );

    if (tasks.length > 0) {
      return { topicId: previousTopicId, tasks, isNewTopic: false };
    }

    const previousTopic = await Topic.findById(previousTopicId).lean();
    const next = await resolveNextTopicWithTasks({
      topic: previousTopic,
      careerTrack,
      excludeTaskIds,
    });

    if (!next) {
      throw new Error("No more learning topics available.");
    }

    return { topicId: next.topicId, tasks: next.tasks, isNewTopic: true };
  }

  // Brand-new user: start at the root of the topic graph.
  const startingTopic = await resolveStartingTopic();
  const tasks = await findEligibleTasks(
    buildEligibleTaskFilter({ topicId: startingTopic._id, careerTrack, excludeTaskIds })
  );

  if (tasks.length > 0) {
    return { topicId: startingTopic._id, tasks, isNewTopic: true };
  }

  const next = await resolveNextTopicWithTasks({
    topic: startingTopic,
    careerTrack,
    excludeTaskIds,
  });

  if (!next) {
    throw new Error("No tasks are available to start a plan.");
  }

  return { topicId: next.topicId, tasks: next.tasks, isNewTopic: true };
};

/* -------------------------------------------------------------------------- */
/* Public API                                                                 */
/* -------------------------------------------------------------------------- */

export const getProfileData = async (userId) => {
  if (!userId) {
    throw new Error("User ID is required to fetch profile data.");
  }

  const careerProfile = await CareerProfile.findOne({ userId, isDeleted: false })
    .select("targetRole targetCompanies experienceLevel studyHoursPerDay")
    .lean();

  if (!careerProfile) {
    throw new Error("Career profile not found for the given user ID.");
  }

  return careerProfile;
};

export const createDailyPlan = async (userId, profileData) => {
  if (!userId) {
    throw new Error("User ID is required to generate a daily plan.");
  }

  const { targetCompanies, studyHoursPerDay } = profileData ?? {};

  if (!studyHoursPerDay || studyHoursPerDay <= 0) {
    throw new Error("Study hours per day must be greater than 0.");
  }

  const careerTrack = resolvePrimaryCareerTrack(targetCompanies);
  const studyMinutesBudget = studyHoursPerDay * 60;
  const planDate = getUtcStartOfDay();

  // 1. Fast path — today's plan already exists.
  const existingPlan = await DailyPlan.findOne({ userId, planDate }).lean();
  if (existingPlan) {
    return existingPlan;
  }

  // 2. Every task ever assigned to this user, so nothing repeats.
  const previousTaskIds = await DailyPlan.distinct("tasks.taskId", { userId });

  // 3. Where the user left off.
  const latestPlan = await DailyPlan.findOne({ userId })
    .sort({ planDate: -1 })
    .lean();
  const lastTask = latestPlan?.tasks?.[latestPlan.tasks.length - 1];
  const previousTopicId = lastTask?.topicId ?? null;

  const { topicId, tasks: availableTasks, isNewTopic } = await resolveTopicAndTasks({
    previousTopicId,
    careerTrack,
    excludeTaskIds: previousTaskIds,
  });

  const { selected: selectedTasks } = selectTasksWithinBudget(
    availableTasks,
    studyMinutesBudget
  );

  if (selectedTasks.length === 0) {
    throw new Error("No suitable tasks found.");
  }

  const taskReason = isNewTopic ? TASK_REASON.NEW_TOPIC : TASK_REASON.CONTINUATION;

  try {
    return await DailyPlan.create({
      userId,
      planDate,
      tasks: selectedTasks.map((task) => ({
        taskId: task._id,
        topicId: topicId,
        reason: taskReason,
        completed: false,
      })),
      studyHoursBudget: studyHoursPerDay,
      status: PLAN_STATUS.ACTIVE,
      completedTaskCount: 0,
      generatedAt: new Date(),
      schemaVersion: 1,
    });
  } catch (error) {
    // Two concurrent requests raced to create today's plan.
    if (error?.code === DUPLICATE_KEY_ERROR_CODE) {
      const racedPlan = await DailyPlan.findOne({ userId, planDate }).lean();
      if (racedPlan) return racedPlan;
    }
    throw error;
  }
};

export const getDailyPlans = async (userId) => {
  if (!userId) {
    throw new Error("User ID is required to fetch daily plans.");
  }

  const planDate = getUtcStartOfDay();
  return DailyPlan.find({ userId, planDate }).lean();
};

export const getDailyPlanById = async (planId) => {
  if (!mongoose.isValidObjectId(planId)) {
    throw new Error("Invalid daily plan ID.");
  }
  return DailyPlan.findById(planId).lean();
};

export const deleteDailyPlan = async (planId) => {
  if (!mongoose.isValidObjectId(planId)) {
    throw new Error("Invalid daily plan ID.");
  }
  return DailyPlan.deleteOne({ _id: planId });
};