import * as dailyPlanRepository from './dailyPlan.repository.js';

const TASK_REASON = Object.freeze({
  CONTINUATION: "continuation",
  NEW_TOPIC: "new-topic",
});

const PLAN_STATUS = Object.freeze({
  ACTIVE: "active",
});

const DUPLICATE_KEY_ERROR_CODE = 11000;

/*
 * Prevents infinite loops if the seeded topic graph contains cycles.
 */
const MAX_TOPIC_HOPS = 50;

const getUtcStartOfDay = (date = new Date()) => {
  const normalized = new Date(date);
  normalized.setUTCHours(0, 0, 0, 0);
  return normalized;
};

const resolvePrimaryCareerTrack = (targetCompanies) => {
  if (!Array.isArray(targetCompanies) || targetCompanies.length === 0) {
    throw new Error(
      "At least one target company is required to generate a daily plan."
    );
  }
  const [primaryCompany] = [...targetCompanies].sort(
    (a, b) => (a.priority ?? Infinity) - (b.priority ?? Infinity)
  );

  if (!primaryCompany?.tier) {
    throw new Error("Primary target company does not have a career tier.");
  }

  return primaryCompany.tier.trim().toLowerCase();
};

const getPreviousTopicId = (latestPlan) => {
  if (!latestPlan?.tasks?.length) {
    return null;
  }

  const lastTask = latestPlan.tasks[latestPlan.tasks.length - 1];
  return lastTask?.topicId ?? null;
};

/* -------------------------------------------------------------------------- */
/* Starting Topic                                                             */
/* -------------------------------------------------------------------------- */

const resolveStartingTopic = async ({ careerTrack, excludeTaskIds }) => {
  /* Strategy 1: Real root topics                                             */
  const rootTopics = await dailyPlanRepository.getRootTopics();

  for (const topic of rootTopics) {
    const result = await dailyPlanRepository.getTopicWithEligibleTasks({
      topicId: topic._id,
      careerTrack,
      excludeTaskIds,
    });

    if (result) {
      return result;
    }
  }

  /* Strategy 2: Find any topic represented by eligible tasks                 */

  const candidateTask = await dailyPlanRepository.getCandidateTask(
    careerTrack,
    excludeTaskIds
  );

  if (!candidateTask) {
    return null;
  }

  return dailyPlanRepository.getTopicWithEligibleTasks({
    topicId: candidateTask.topicId,
    careerTrack,
    excludeTaskIds,
  });
};

/* Graph-Based Next Topic                                                     */
const resolveGraphNextTopic = async ({
  currentTopic,
  careerTrack,
  excludeTaskIds,
  visitedTopicIds,
}) => {
  if (!currentTopic?.nextTopics?.length) {
    return null;
  }

 
  const candidates = [...currentTopic.nextTopics].sort(
    (a, b) => (b.edgeWeight ?? 0) - (a.edgeWeight ?? 0)
  );

  for (const candidate of candidates) {
    if (!candidate?.topicId) {
      continue;
    }

    const candidateId = candidate.topicId.toString();

    if (visitedTopicIds.has(candidateId)) {
      continue;
    }

    const result = await dailyPlanRepository.getTopicWithEligibleTasks({
      topicId: candidate.topicId,
      careerTrack,
      excludeTaskIds,
    });

    if (result) {
      return result;
    }
  }

  return null;
};

/* Fallback Next Topic                                                        */
const resolveFallbackNextTopic = async ({
  currentTopic,
  careerTrack,
  excludeTaskIds,
  visitedTopicIds,
}) => {
  const eligibleTopicIds = await dailyPlanRepository.getEligibleTopicIds(
    careerTrack,
    excludeTaskIds
  );

  if (eligibleTopicIds.length === 0) {
    return null;
  }

  const unvisitedTopicIds = eligibleTopicIds.filter(
    (topicId) => !visitedTopicIds.has(topicId.toString())
  );

  if (unvisitedTopicIds.length === 0) {
    return null;
  }

  /* Prefer same category                                                     */
  if (currentTopic?.category) {
    const sameCategoryTopic = await dailyPlanRepository.getTopicByCategory(
      unvisitedTopicIds,
      currentTopic.category
    );

    if (sameCategoryTopic) {
      const result = await dailyPlanRepository.getTopicWithEligibleTasks({
        topicId: sameCategoryTopic._id,
        careerTrack,
        excludeTaskIds,
      });

      if (result) {
        return result;
      }
    }
  }

  /* Prefer same domain                                                       */
  if (currentTopic?.domain) {
    const sameDomainTopic = await dailyPlanRepository.getTopicByDomain(
      unvisitedTopicIds,
      currentTopic.domain
    );

    if (sameDomainTopic) {
      const result = await dailyPlanRepository.getTopicWithEligibleTasks({
        topicId: sameDomainTopic._id,
        careerTrack,
        excludeTaskIds,
      });

      if (result) {
        return result;
      }
    }
  }

  /* ------------------------------------------------------------------------ */
  /* Final fallback: any eligible unvisited topic                             */
  /* ------------------------------------------------------------------------ */
  const fallbackTopic = await dailyPlanRepository.getFallbackTopic(
    unvisitedTopicIds
  );

  if (!fallbackTopic) {
    return null;
  }

  return dailyPlanRepository.getTopicWithEligibleTasks({
    topicId: fallbackTopic._id,
    careerTrack,
    excludeTaskIds,
  });
};

/* -------------------------------------------------------------------------- */
/* Resolve Next Topic                                                         */
/* -------------------------------------------------------------------------- */

const resolveNextTopic = async ({
  currentTopic,
  careerTrack,
  excludeTaskIds,
  visitedTopicIds,
}) => {
  /*
   * First trust the explicit learning graph.
   */
  const graphResult = await resolveGraphNextTopic({
    currentTopic,
    careerTrack,
    excludeTaskIds,
    visitedTopicIds,
  });

  if (graphResult) {
    return graphResult;
  }

  /*
   * If the graph is incomplete or broken,
   * use a safe fallback.
   */
  return resolveFallbackNextTopic({
    currentTopic,
    careerTrack,
    excludeTaskIds,
    visitedTopicIds,
  });
};

/* -------------------------------------------------------------------------- */
/* Select Tasks Within Remaining Budget                                       */
/* -------------------------------------------------------------------------- */

const selectTasksFromTopic = ({
  tasks,
  remainingMinutes,
  selectedTaskIds,
}) => {
  const selected = [];
  let minutesUsed = 0;

  for (const task of tasks) {
    const taskId = task._id.toString();

    if (selectedTaskIds.has(taskId)) {
      continue;
    }

    const taskMinutes = Number(task.estimatedMinutes);

    if (!Number.isFinite(taskMinutes) || taskMinutes <= 0) {
      continue;
    }

    /*
     * Only select tasks that fit
     * inside remaining time.
     */
    if (minutesUsed + taskMinutes <= remainingMinutes) {
      selected.push(task);
      selectedTaskIds.add(taskId);
      minutesUsed += taskMinutes;
    }
  }

  return {
    selected,
    minutesUsed,
  };
};

/* -------------------------------------------------------------------------- */
/* Generate Daily Plan Tasks                                                  */
/* -------------------------------------------------------------------------- */

const generatePlanTasks = async ({
  userId,
  careerTrack,
  studyMinutesBudget,
}) => {
  const completedTaskIds = await dailyPlanRepository.getCompletedTaskIds(userId);
  
  const latestPlan = await dailyPlanRepository.getLatestPlan(userId);
  let currentTopicId = getPreviousTopicId(latestPlan);

  /* ------------------------------------------------------------------------ */
  /* 3. Planner state                                                         */
  /* ------------------------------------------------------------------------ */
  const selectedPlanTasks = [];
  const selectedTaskIds = new Set();
  const visitedTopicIds = new Set();
  let remainingMinutes = studyMinutesBudget;
  let topicHopCount = 0;
  let isFirstTopic = true;

  /* ------------------------------------------------------------------------ */
  /* 4. Resolve first topic                                                   */
  /* ------------------------------------------------------------------------ */
  let currentTopicResult = null;

  /*
   * Existing user:
   * try continuing previous topic.
   */
  if (currentTopicId) {
    currentTopicResult = await dailyPlanRepository.getTopicWithEligibleTasks({
      topicId: currentTopicId,
      careerTrack,
      excludeTaskIds: completedTaskIds,
    });

    /*
     * Previous topic is exhausted.
     *
     * Try moving forward.
     */
    if (!currentTopicResult) {
      const previousTopic = await dailyPlanRepository.getTopicById(currentTopicId);
      if (previousTopic) {
        currentTopicResult = await resolveNextTopic({
          currentTopic: previousTopic,
          careerTrack,
          excludeTaskIds: completedTaskIds,
          visitedTopicIds,
        });
      }
    }
  }

  /*
   * Brand new user or previous topic/graph exhausted.
   * Start at root topics.
   */
  if (!currentTopicResult) {
    currentTopicResult = await resolveStartingTopic({
      careerTrack,
      excludeTaskIds: completedTaskIds,
    });
  }

  /* ------------------------------------------------------------------------ */
  /* 5. Main Planning Loop                                                    */
  /* ------------------------------------------------------------------------ */
  while (remainingMinutes > 0 && currentTopicResult) {
    const { selected, minutesUsed } = selectTasksFromTopic({
      tasks: currentTopicResult.tasks,
      remainingMinutes,
      selectedTaskIds,
    });

    if (selected.length > 0) {
      const isNewTopic =
        !isFirstTopic ||
        (currentTopicId && currentTopicId.toString() !== currentTopicResult.topic._id.toString());
      const reason = isNewTopic ? TASK_REASON.NEW_TOPIC : TASK_REASON.CONTINUATION;

      for (const task of selected) {
        selectedPlanTasks.push({
          task,
          topicId: currentTopicResult.topic._id,
          reason,
        });
      }

      remainingMinutes -= minutesUsed;
    }

    /*
     * Mark current topic as visited.
     */
    visitedTopicIds.add(currentTopicResult.topic._id.toString());

    if (topicHopCount >= MAX_TOPIC_HOPS) {
      break;
    }

    currentTopicResult = await resolveNextTopic({
      currentTopic: currentTopicResult.topic,
      careerTrack,
      excludeTaskIds: completedTaskIds,
      visitedTopicIds,
    });

    topicHopCount++;
    isFirstTopic = false;
  }

  return selectedPlanTasks;
};

/* -------------------------------------------------------------------------- */
/* Public API (Services)                                                     */
/* -------------------------------------------------------------------------- */

export const createDailyPlan = async (userId) => {
  const profileData = await dailyPlanRepository.getProfileData(userId);

  const { targetCompanies, studyHoursPerDay } = profileData ?? {};

  if (!studyHoursPerDay || studyHoursPerDay <= 0) {
    throw new Error("Study hours per day must be greater than 0.");
  }

  const careerTrack = resolvePrimaryCareerTrack(targetCompanies);
  const studyMinutesBudget = Math.round(studyHoursPerDay * 60);
  const planDate = getUtcStartOfDay();

  // Fast path — today's plan already exists.
  const existingPlan = await dailyPlanRepository.findPlanByDate(userId, planDate);
  if (existingPlan) {
    return existingPlan;
  }

  // Generate tasks
  const selectedTasks = await generatePlanTasks({
    userId,
    careerTrack,
    studyMinutesBudget,
  });

  if (selectedTasks.length === 0) {
    throw new Error(
      `No eligible tasks found for career track "${careerTrack}". Check that Task.careerTracks contains this value and that Task.topicId references valid Topic documents.`
    );
  }

  try {
    return await dailyPlanRepository.saveDailyPlan({
      userId,
      planDate,
      tasks: selectedTasks.map(({ task, topicId, reason }) => ({
        taskId: task._id,
        topicId,
        reason,
        completed: false,
      })),
      studyHoursBudget: studyHoursPerDay,
      status: PLAN_STATUS.ACTIVE,
      completedTaskCount: 0,
      generatedAt: new Date(),
      schemaVersion: 1,
    });
  } catch (error) {
    // Handle concurrent creation conflict (duplicate key index error)
    if (error?.code === DUPLICATE_KEY_ERROR_CODE) {
      const existingPlan = await dailyPlanRepository.findPlanByDate(userId, planDate);
      if (existingPlan) {
        return existingPlan;
      }
    }
    throw error;
  }
};

export const getDailyPlans = async (userId) => {
  const planDate = getUtcStartOfDay();
  return await dailyPlanRepository.getDailyPlans(userId, planDate);
};

export const updateDailyPlan = async (userId, planId, updateData) => {
  const dailyPlan = await dailyPlanRepository.getDailyPlanById(planId);
  if (!dailyPlan) {
    throw new Error("Daily plan not found for the given user ID and plan ID.");
  }
  return await dailyPlanRepository.updateDailyPlan(planId, updateData);
};

export const deleteDailyPlan = async (planId) => {
  const dailyPlan = await dailyPlanRepository.getDailyPlanById(planId);
  if (!dailyPlan) {
    throw new Error("Daily plan not found for the given user ID and plan ID.");
  }
  return await dailyPlanRepository.deleteDailyPlan(planId);
};