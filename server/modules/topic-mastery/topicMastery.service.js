import * as topicMasteryRepository from "./topicMastery.repository.js";
import AppError from "../utils/AppError.js";

const LEARNING_STATUS = {
  NOT_STARTED: "not-started",
  LEARNING: "learning",
  REVISION: "revision",
  MASTERED: "mastered",
  SKIPPED: "skipped",
};

const DIFFICULTY = {
  EASY: "easy",
  MEDIUM: "medium",
  HARD: "hard",
};

const MASTERY_GAIN = {
  EASY: 2,
  MEDIUM: 3,
  HARD: 5,
  REVISION: 2,
  SKIP: -2,
};

const THRESHOLDS = {
  MASTERED: 80,
  MEDIUM: 50,
  REVISION_HIGH: 60,
  REVISION_LOW: 40,
};

// Both mastery-score and confidence-score blend a previous value with a new
// one on the same 70/30 split, so they share this constant.
const MASTERY_WEIGHTS = {
  PREVIOUS: 0.7,
  ASSESSMENT: 0.3,
};

// Days until next revision, keyed by the mastery-score band reached.
const REVISION_SCHEDULE = [
  { minScore: THRESHOLDS.MASTERED, days: 14 },
  { minScore: THRESHOLDS.REVISION_HIGH, days: 7 },
  { minScore: THRESHOLDS.REVISION_LOW, days: 3 },
];
const DEFAULT_REVISION_DAYS = 1;

const MAX_REVISION_PRIORITY = 100;

const INITIAL_AI_METADATA = {
  lastPlannerVersion: null,
  lastReason: null,
  lastUpdatedBy: "manual",
};
const clampScore = (score) => Math.max(0, Math.min(100, score));
const isValidScore = (score) =>
  typeof score === "number" && !Number.isNaN(score) && score >= 0 && score <= 100;

const assertValidScore = (score) => {
  if (!isValidScore(score)) {
    throw new AppError(400, "Invalid score");
  }
};

const assertRequiredIds = (userId, topicId) => {
  if (!userId || !topicId) {
    throw new AppError(400, "userId and topicId are required");
  }
};
const toNonNegativeMinutes = (minutes) => {
  const value = Number(minutes);
  return Number.isFinite(value) && value > 0 ? value : 0;
};

const toConceptList = (concepts) => (Array.isArray(concepts) ? concepts : []);

const calculateLearningStatus = (masteryScore) => {
  if (masteryScore >= THRESHOLDS.MASTERED) return LEARNING_STATUS.MASTERED;
  if (masteryScore > 0) return LEARNING_STATUS.LEARNING;

  return LEARNING_STATUS.NOT_STARTED;
};

const calculateRecommendedDifficulty = (masteryScore) => {
  if (masteryScore >= THRESHOLDS.MASTERED) return DIFFICULTY.HARD;
  if (masteryScore >= THRESHOLDS.MEDIUM) return DIFFICULTY.MEDIUM;

  return DIFFICULTY.EASY;
};

const calculateConfidenceScore = (masteryScore, assessmentScore = 0) => {
  const confidence = Math.round(
    masteryScore * MASTERY_WEIGHTS.PREVIOUS +
      assessmentScore * MASTERY_WEIGHTS.ASSESSMENT,
  );

  return Math.min(100, confidence);
};

const calculateMasteryScore = (previousMastery, assessmentScore) => {
  return Math.round(
    previousMastery * MASTERY_WEIGHTS.PREVIOUS +
      assessmentScore * MASTERY_WEIGHTS.ASSESSMENT,
  );
};

const calculateRevisionPriority = (masteryScore) => {
  return Math.max(0, 100 - masteryScore);
};

const calculateNextRevisionDate = (masteryScore) => {
  const now = new Date();
  const band = REVISION_SCHEDULE.find((entry) => masteryScore >= entry.minScore);
  const days = band ? band.days : DEFAULT_REVISION_DAYS;

  now.setDate(now.getDate() + days);

  return now;
};

// Accepts any casing ("easy" / "Easy" / "EASY") and falls back to the EASY
// gain for unknown values, so a bad/legacy value can never produce NaN.
const getMasteryGainForDifficulty = (taskDifficulty) => {
  const normalized = String(taskDifficulty ?? "")
    .trim()
    .toUpperCase();

  return MASTERY_GAIN[normalized] ?? MASTERY_GAIN.EASY;
};

/* -------------------------------------------------------------------------- */
/* Shared mastery-state builder                                               */
/* -------------------------------------------------------------------------- */

/**
 * Single source of truth for the derived fields that follow from a mastery
 * score change. Centralizing this keeps every write path in sync and is
 * the one place an AI-driven version of this logic would replace later.
 */
const buildMasteryState = (masteryScore, assessmentScore = 0) => {
  return {
    confidenceScore: calculateConfidenceScore(masteryScore, assessmentScore),
    learningStatus: calculateLearningStatus(masteryScore),
    recommendedDifficulty: calculateRecommendedDifficulty(masteryScore),
    revisionPriority: calculateRevisionPriority(masteryScore),
    nextRevisionAt: calculateNextRevisionDate(masteryScore),
  };
};

// Shorthand for the aiMetadata options every write path builds; avoids
// repeating `{ previousAiMetadata: topicMastery.aiMetadata, updatedBy, ... }`
// at every call site.
const buildUpdateMeta = (topicMastery, updatedBy, extra) => ({
  previousAiMetadata: topicMastery.aiMetadata,
  updatedBy,
  extra,
});

/**
 * Persists a mastery-state update, optionally stamping aiMetadata.
 * Every business (write) method funnels its final payload through here —
 * the one place future AI-driven update logic needs to hook into. `meta`
 * is optional so paths that never touched aiMetadata (e.g. markTopicSkipped)
 * keep behaving exactly as before.
 */
const persistMasteryUpdate = (userId, topicId, payload, meta) => {
  const updatePayload = { ...payload };

  if (meta) {
    updatePayload.aiMetadata = {
      ...meta.previousAiMetadata,
      ...meta.extra,
      lastUpdatedBy: meta.updatedBy,
    };
  }

  return topicMasteryRepository.updateTopicMasteryByTopicId(
    userId,
    topicId,
    updatePayload,
  );
};

/* -------------------------------------------------------------------------- */
/* Initialization                                                             */
/* -------------------------------------------------------------------------- */

export const initializeTopic = async (userId, topicId) => {
  assertRequiredIds(userId, topicId);

  let topicMastery = await topicMasteryRepository.getTopicMasteryByTopicId(
    userId,
    topicId,
  );

  if (topicMastery) {
    return topicMastery;
  }

  // Only values NOT already covered by schema defaults are set explicitly
  // (learningStatus / recommendedDifficulty are assumed to default to
  // "not-started" / "easy" — adjust if your schema differs).
  topicMastery = await topicMasteryRepository.createTopicMastery({
    userId,
    topicId,
    aiMetadata: INITIAL_AI_METADATA,
  });

  return topicMastery;
};

/* -------------------------------------------------------------------------- */
/* Diagnostic Processing                                                      */
/* -------------------------------------------------------------------------- */

export const processDiagnostic = async (userId, topicId, diagnosticData) => {
  const topicMastery = await initializeTopic(userId, topicId);

  const { score } = diagnosticData ?? {};
  assertValidScore(score);

  const masteryScore = clampScore(score);
  const { confidenceScore, learningStatus, recommendedDifficulty, nextRevisionAt } =
    buildMasteryState(masteryScore, score);

  return persistMasteryUpdate(
    userId,
    topicId,
    {
      masteryScore,
      confidenceScore,
      diagnosticScore: score,
      learningStatus,
      recommendedDifficulty,
      nextRevisionAt,
    },
    buildUpdateMeta(topicMastery, "diagnostic"),
  );
};

/* -------------------------------------------------------------------------- */
/* Assessment Processing                                                      */
/* -------------------------------------------------------------------------- */

export const processAssessment = async (userId, topicId, assessmentData) => {
  const topicMastery = await initializeTopic(userId, topicId);

  const { score, weakConcepts, strongConcepts } = assessmentData ?? {};
  assertValidScore(score);

  const masteryScore = calculateMasteryScore(topicMastery.masteryScore, score);

  const {
    confidenceScore,
    learningStatus,
    recommendedDifficulty,
    revisionPriority,
    nextRevisionAt,
  } = buildMasteryState(masteryScore, score);

  const bestAssessmentScore =
    topicMastery.bestAssessmentScore === null
      ? score
      : Math.max(topicMastery.bestAssessmentScore, score);

  // A completed topic is "uncompleted" if a later assessment drags mastery
  // back below the threshold — this mirrors learningStatus, which the same
  // masteryScore also downgrades away from MASTERED.
  const completedAt = masteryScore >= THRESHOLDS.MASTERED ? new Date() : null;

  return persistMasteryUpdate(
    userId,
    topicId,
    {
      masteryScore,
      confidenceScore,
      learningStatus,
      latestAssessmentScore: score,
      bestAssessmentScore,
      assessmentAttempts: topicMastery.assessmentAttempts + 1,
      recommendedDifficulty,
      revisionPriority,
      weakConcepts: toConceptList(weakConcepts),
      strongConcepts: toConceptList(strongConcepts),
      nextRevisionAt,
      completedAt,
    },
    buildUpdateMeta(topicMastery, "assessment"),
  );
};

/* -------------------------------------------------------------------------- */
/* Task Progress                                                              */
/* -------------------------------------------------------------------------- */

export const processTaskCompletion = async (userId, topicId, taskData) => {
  const topicMastery = await initializeTopic(userId, topicId);

  const { studyMinutes, taskDifficulty = DIFFICULTY.EASY } = taskData ?? {};

  const masteryScore = clampScore(
    topicMastery.masteryScore + getMasteryGainForDifficulty(taskDifficulty),
  );

  const { confidenceScore, learningStatus, recommendedDifficulty } = buildMasteryState(
    masteryScore,
    topicMastery.latestAssessmentScore ?? 0,
  );

  return persistMasteryUpdate(
    userId,
    topicId,
    {
      masteryScore,
      confidenceScore,
      learningStatus,
      recommendedDifficulty,
      totalStudyMinutes: topicMastery.totalStudyMinutes + toNonNegativeMinutes(studyMinutes),
      totalSessions: topicMastery.totalSessions + 1,
      lastStudiedAt: new Date(),
    },
    buildUpdateMeta(topicMastery, "task-progress"),
  );
};

export const processTaskSkip = async (userId, topicId) => {
  const topicMastery = await initializeTopic(userId, topicId);

  const masteryScore = Math.max(0, topicMastery.masteryScore + MASTERY_GAIN.SKIP);
  const { revisionPriority } = buildMasteryState(masteryScore);

  return persistMasteryUpdate(
    userId,
    topicId,
    {
      masteryScore,
      revisionPriority,
    },
    buildUpdateMeta(topicMastery, "task-progress"),
  );
};

export const processRevision = async (userId, topicId, revisionData) => {
  const topicMastery = await initializeTopic(userId, topicId);

  const { studyMinutes } = revisionData ?? {};

  const masteryScore = Math.min(
    100,
    topicMastery.masteryScore + MASTERY_GAIN.REVISION,
  );

  const { confidenceScore, recommendedDifficulty, revisionPriority, nextRevisionAt } =
    buildMasteryState(masteryScore, topicMastery.latestAssessmentScore ?? 0);

  // Revision only ever distinguishes mastered vs. still-in-revision, unlike
  // the general-purpose calculateLearningStatus used elsewhere (it never
  // needs to report NOT_STARTED/LEARNING — a revision implies prior study).
  const learningStatus =
    masteryScore >= THRESHOLDS.MASTERED
      ? LEARNING_STATUS.MASTERED
      : LEARNING_STATUS.REVISION;

  return persistMasteryUpdate(
    userId,
    topicId,
    {
      masteryScore,
      confidenceScore,
      learningStatus,
      // Previously left stale after a revision — recommendedDifficulty and
      // revisionPriority must track masteryScore here too, exactly as they
      // do on every other write path.
      recommendedDifficulty,
      revisionPriority,
      revisionCount: topicMastery.revisionCount + 1,
      totalStudyMinutes: topicMastery.totalStudyMinutes + toNonNegativeMinutes(studyMinutes),
      totalSessions: topicMastery.totalSessions + 1,
      lastRevisionAt: new Date(),
      nextRevisionAt,
    },
    buildUpdateMeta(topicMastery, "task-progress"),
  );
};

/* -------------------------------------------------------------------------- */
/* Study Sessions & Planner / AI Metadata                                     */
/* -------------------------------------------------------------------------- */

export const updateStudySession = async (userId, topicId, minutes) => {
  const topicMastery = await initializeTopic(userId, topicId);

  return persistMasteryUpdate(userId, topicId, {
    totalStudyMinutes: topicMastery.totalStudyMinutes + toNonNegativeMinutes(minutes),
    totalSessions: topicMastery.totalSessions + 1,
    lastStudiedAt: new Date(),
  });
};

export const updatePlannerMetadata = async (userId, topicId, plannerData) => {
  const topicMastery = await initializeTopic(userId, topicId);

  const { plannerVersion = null, reason = null } = plannerData ?? {};

  return persistMasteryUpdate(
    userId,
    topicId,
    { lastPlannedAt: new Date() },
    buildUpdateMeta(topicMastery, "planner", {
      lastPlannerVersion: plannerVersion,
      lastReason: reason,
    }),
  );
};

export const updateAIInsights = async (userId, topicId, insights) => {
  const topicMastery = await initializeTopic(userId, topicId);

  const {
    weakConcepts,
    strongConcepts,
    revisionPriority,
    recommendedDifficulty,
  } = insights ?? {};

  return persistMasteryUpdate(
    userId,
    topicId,
    {
      weakConcepts: weakConcepts ?? topicMastery.weakConcepts,
      strongConcepts: strongConcepts ?? topicMastery.strongConcepts,
      revisionPriority: revisionPriority ?? topicMastery.revisionPriority,
      recommendedDifficulty: recommendedDifficulty ?? topicMastery.recommendedDifficulty,
    },
    buildUpdateMeta(topicMastery, "planner"),
  );
};

/* -------------------------------------------------------------------------- */
/* Manual Status Transitions                                                  */
/* -------------------------------------------------------------------------- */

export const markTopicCompleted = async (userId, topicId) => {
  const topicMastery = await initializeTopic(userId, topicId);

  // masteryScore/confidenceScore are pinned to 100 by definition; passing
  // 100 for both buildMasteryState inputs derives recommendedDifficulty,
  // revisionPriority and nextRevisionAt from the same source of truth used
  // everywhere else while still landing on confidenceScore === 100.
  const { confidenceScore, recommendedDifficulty, revisionPriority, nextRevisionAt } =
    buildMasteryState(100, 100);

  return persistMasteryUpdate(
    userId,
    topicId,
    {
      masteryScore: 100,
      confidenceScore,
      learningStatus: LEARNING_STATUS.MASTERED,
      lastStudiedAt: new Date(),
      completedAt: new Date(),
      recommendedDifficulty,
      revisionPriority,
      // Intentional: mastery doesn't end spaced repetition. A 14-day
      // follow-up revision is still scheduled to protect long-term
      // retention, same as any other topic that reaches the MASTERED band.
      nextRevisionAt,
      // assessmentAttempts is NOT incremented here — completing a topic
      // manually is not the same event as finishing an assessment.
    },
    buildUpdateMeta(topicMastery, "manual"),
  );
};

export const markTopicSkipped = async (userId, topicId) => {
  const topicMastery = await initializeTopic(userId, topicId);

  return persistMasteryUpdate(
    userId,
    topicId,
    {
      learningStatus: LEARNING_STATUS.SKIPPED,
      // Highest priority so the topic resurfaces first...
      revisionPriority: MAX_REVISION_PRIORITY,
      // ...which only works if it's also immediately due; a stale future
      // nextRevisionAt would keep it out of a date-filtered revision queue
      // despite the max priority.
      nextRevisionAt: new Date(),
      // A skipped topic is by definition not a completed one.
      completedAt: null,
    },
    buildUpdateMeta(topicMastery, "manual"),
  );
};

export const resetTopicProgress = async (userId, topicId) => {
  const topicMastery = await initializeTopic(userId, topicId);

  return persistMasteryUpdate(
    userId,
    topicId,
    {
      learningStatus: LEARNING_STATUS.NOT_STARTED,
      masteryScore: 0,
      confidenceScore: 0,
      diagnosticScore: null,
      latestAssessmentScore: null,
      bestAssessmentScore: null,
      assessmentAttempts: 0,
      revisionCount: 0,
      revisionPriority: 0,
      weakConcepts: [],
      strongConcepts: [],
      totalStudyMinutes: 0,
      totalSessions: 0,
      lastStudiedAt: null,
      lastPlannedAt: null,
      lastRevisionAt: null,
      nextRevisionAt: null,
      completedAt: null,
      recommendedDifficulty: DIFFICULTY.EASY,
    },
    buildUpdateMeta(topicMastery, "manual", INITIAL_AI_METADATA),
  );
};

/* -------------------------------------------------------------------------- */
/* Queries                                                                    */
/* -------------------------------------------------------------------------- */

export const getTopicMastery = async (userId) => {
  return topicMasteryRepository.getTopicMastery(userId);
};

export const getTopicMasteryByTopicId = async (userId, topicId) => {
  return initializeTopic(userId, topicId);
};

export const getRevisionQueue = async (userId) => {
  return topicMasteryRepository.getRevisionQueue(userId, new Date());
};

export const getWeakTopics = async (userId) => {
  return topicMasteryRepository.getWeakTopics(userId);
};

export const getStrongTopics = async (userId) => {
  return topicMasteryRepository.getStrongTopics(userId);
};

/* -------------------------------------------------------------------------- */
/* Dashboard Summary                                                          */
/* -------------------------------------------------------------------------- */

export const getMasterySummary = async (userId) => {
  const topics = (await topicMasteryRepository.getTopicMastery(userId)) ?? [];

  const summary = {
    totalTopics: topics.length,
    mastered: 0,
    learning: 0,
    revision: 0,
    notStarted: 0,
    skipped: 0,
    averageMastery: 0,
    averageConfidence: 0,
  };

  let masteryTotal = 0;
  let confidenceTotal = 0;

  for (const topic of topics) {
    masteryTotal += topic.masteryScore;
    confidenceTotal += topic.confidenceScore;

    switch (topic.learningStatus) {
      case LEARNING_STATUS.MASTERED:
        summary.mastered++;
        break;

      case LEARNING_STATUS.LEARNING:
        summary.learning++;
        break;

      case LEARNING_STATUS.REVISION:
        summary.revision++;
        break;

      case LEARNING_STATUS.SKIPPED:
        summary.skipped++;
        break;

      default:
        summary.notStarted++;
    }
  }

  if (topics.length) {
    summary.averageMastery = Math.round(masteryTotal / topics.length);
    summary.averageConfidence = Math.round(confidenceTotal / topics.length);
  }

  return summary;
};