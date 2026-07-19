import mongoose from "mongoose";
import * as progressService from "../progress/progress.service.js";
import * as masteryService from "../topic-mastery/mastery.service.js";
import * as revisionService from "../revision/revision.service.js";
import * as plannerService from "../daily-plan/planner.service.js";
import * as assessmentRepository from "../assessment/assessment.repository.js";
import Roadmap from "../roadmap/roadmap.model.js";
import LearningCluster from "./learningCluster.model.js";
import UserClusterProgress from "../progress/userClusterProgress.model.js";
import EngineConfig from "../roadmap/engineConfig.model.js";
import LearningEvent from "../roadmap/learningEvent.model.js";
import Question from "../assessment/question.model.js";
import User from "../../models/user.js";
import DailyPlan from "../daily-plan/dailyPlan.model.js";
import RevisionSchedule from "../revision/revisionSchedule.model.js";

// Helper to compile recommendation context
export const getRecommendationContext = async (userId, roadmapId, progress) => {
  if (!progress) {
    return {
      weakTopics: [],
      strongTopics: [],
      learningVelocity: 0,
      confidence: 0,
      estimatedCompletion: null,
      nextMilestone: null,
      nextRecommendedAction: "Choose a Roadmap"
    };
  }

  // Get weak/strong topics from mastery service
  const weakTopics = await masteryService.getWeakTopics(userId, progress.clusterId);
  const masterySummary = await masteryService.calculateClusterMastery(userId, progress.clusterId);
  
  // Expose next milestone and action
  let nextAction = "Start Learning";
  let milestoneName = "Complete Entry Assessment";

  if (progress.status === "entry_assessment") {
    nextAction = "Take Entry Assessment";
    milestoneName = "Pass Diagnostic Test";
  } else if (progress.status === "final_assessment") {
    nextAction = "Take Final Assessment";
    milestoneName = "Graduate from Cluster";
  } else if (progress.status === "learning") {
    nextAction = "Continue Learning Tasks";
    const resumePointer = await progressService.resumeLearning(userId);
    milestoneName = resumePointer?.topic?.displayName || "Next Topic";
  } else if (progress.status === "completed") {
    nextAction = "Proceed to Next Cluster";
    milestoneName = "Unlock Next Cluster";
  }

  return {
    weakTopics: weakTopics.map(t => t.displayName),
    strongTopics: [], // could populate similarly
    learningVelocity: 1.2, // mock value
    confidence: masterySummary,
    estimatedCompletion: "2026-08-15",
    nextMilestone: milestoneName,
    nextRecommendedAction: nextAction
  };
};

export const startDay = async (userId) => {
  const progress = await progressService.getCurrentProgress(userId);
  if (!progress) {
    return { action: "ROADMAP_COMPLETED", clusterId: null, dailyPlan: null };
  }

  if (progress.status === "locked") {
    return { action: "LOCKED", clusterId: progress.clusterId, dailyPlan: null };
  }

  let config = await EngineConfig.findOne({ key: "default" }).lean();
  if (!config) {
    config = await EngineConfig.create({ key: "default" });
  }

  const cluster = await LearningCluster.findById(progress.clusterId).lean();
  const topicSlugs = cluster.topicsIncluded.map(t => t.slug);

  if (progress.status === "entry_assessment") {
    // Question Fetch & Sampling
    const limit = config.entryAssessmentQuestions || 10;
    const questions = await assessmentRepository.sampleEntryQuestions(topicSlugs, limit);
    return {
      action: "ENTRY_ASSESSMENT",
      clusterId: progress.clusterId,
      questions
    };
  }

  if (progress.status === "final_assessment") {
    // Fetch entry assessment attempts to exclude those question IDs
    const previousAttempts = await assessmentRepository.getAssessmentAttemptsCount(userId, progress.clusterId, "entry_assessment");
    let excludeIds = [];
    if (previousAttempts > 0) {
      const attemptsList = await mongoose.model("AssessmentAttempt").find({
        userId,
        clusterId: progress.clusterId,
        assessmentType: "entry_assessment"
      }).select("questionIds").lean();
      excludeIds = attemptsList.flatMap(a => a.questionIds);
    }

    const limit = config.finalAssessmentQuestions || 10;
    const questions = await assessmentRepository.sampleFinalQuestions(topicSlugs, limit, excludeIds);
    return {
      action: "FINAL_ASSESSMENT",
      clusterId: progress.clusterId,
      questions
    };
  }

  if (progress.status === "learning") {
    // Generate daily plan
    const dailyPlan = await plannerService.createDailyPlan(userId);
    return {
      action: "LEARNING",
      clusterId: progress.clusterId,
      dailyPlan
    };
  }

  return { action: "ROADMAP_COMPLETED", clusterId: null, dailyPlan: null };
};

export const submitAssessment = async (userId, clusterId, answers) => {
  const progress = await UserClusterProgress.findOne({ userId, clusterId }).lean();
  if (!progress) {
    throw new Error("No active progress record found for this cluster.");
  }

  const roadmap = await Roadmap.findById(progress.roadmapId).lean();
  const cluster = await LearningCluster.findById(progress.clusterId).lean();

  let config = await EngineConfig.findOne({ key: "default" }).lean();
  if (!config) {
    config = await EngineConfig.create({ key: "default" });
  }

  const questionIds = answers.map(a => new mongoose.Types.ObjectId(a.questionId));
  const questions = await Question.find({ _id: { $in: questionIds } }).lean();
  const questionMap = new Map(questions.map(q => [q._id.toString(), q]));

  let correctCount = 0;
  const detailedAnswers = [];
  const topicStats = {}; // topicId -> { correct, total }
  const difficultyStats = {}; // easy/medium/hard -> { correct, total }

  for (const ans of answers) {
    const q = questionMap.get(ans.questionId.toString());
    if (!q) continue;

    // Simple MCQ string comparison
    const isCorrect = String(q.correctAnswer).trim().toLowerCase() === String(ans.selectedAnswer).trim().toLowerCase();
    if (isCorrect) correctCount++;

    detailedAnswers.push({
      questionId: q._id,
      selectedAnswer: ans.selectedAnswer,
      isCorrect,
      timeTakenSeconds: ans.timeTakenSeconds || 10
    });

    // Populate topic metrics
    q.topicSlugs.forEach(slug => {
      // Find the topic corresponding to this slug in the cluster
      const topicItem = cluster.topicsIncluded.find(t => t.slug === slug);
      if (topicItem) {
        const tid = topicItem.topicId.toString();
        if (!topicStats[tid]) topicStats[tid] = { correct: 0, total: 0 };
        topicStats[tid].total++;
        if (isCorrect) topicStats[tid].correct++;
      }
    });

    // Populate difficulty metrics
    const diff = q.difficulty || "medium";
    if (!difficultyStats[diff]) difficultyStats[diff] = { correct: 0, total: 0 };
    difficultyStats[diff].total++;
    if (isCorrect) difficultyStats[diff].correct++;
  }

  const scorePercentage = Math.round((correctCount / questionIds.length) * 100);
  const totalTimeTaken = answers.reduce((acc, a) => acc + (a.timeTakenSeconds || 0), 0);

  const attemptNumber = (await assessmentRepository.getAssessmentAttemptsCount(userId, clusterId, progress.status)) + 1;

  // Save the attempt record
  const attempt = await assessmentRepository.saveAssessmentAttempt({
    userId,
    roadmapId: progress.roadmapId,
    clusterId: progress.clusterId,
    roadmapVersion: roadmap?.version || 1,
    clusterVersion: cluster?.version || 1,
    assessmentType: progress.status, // "entry_assessment" or "final_assessment"
    questionIds,
    answers: detailedAnswers,
    score: correctCount,
    percentage: scorePercentage,
    timeTaken: totalTimeTaken,
    attemptNumber,
    startedAt: new Date(Date.now() - totalTimeTaken * 1000),
    submittedAt: new Date()
  });

  // Calculate and update topic mastery for each topic evaluated
  for (const [tid, stats] of Object.entries(topicStats)) {
    const topicScore = Math.round((stats.correct / stats.total) * 100);
    await masteryService.calculateTopicMastery(userId, new mongoose.Types.ObjectId(tid), topicScore, stats.total, stats.correct);
    
    // Sync clusterId reference on the topic mastery document
    await masteryService.updateMastery(userId, new mongoose.Types.ObjectId(tid), { clusterId: progress.clusterId });
  }

  // Handle state machine transition
  let transitionStatus = progress.status;
  let adaptiveMode = progress.adaptiveMode;

  if (progress.status === "entry_assessment") {
    await LearningEvent.create({
      userId,
      eventType: "ENTRY_ASSESSMENT_COMPLETED",
      metadata: { score: scorePercentage, attemptId: attempt._id }
    });

    const skipThreshold = config.adaptiveLearning?.skipThreshold || 90;
    const partialThreshold = config.adaptiveLearning?.partialThreshold || 60;

    if (scorePercentage >= skipThreshold) {
      transitionStatus = "completed";
      await UserClusterProgress.findByIdAndUpdate(progress._id, {
        $set: {
          status: "completed",
          entryAssessmentScore: scorePercentage,
          progressPercentage: 100,
          completedAt: new Date()
        }
      });
      // Schedule revisions immediately
      await revisionService.scheduleRevision(userId, clusterId);
      // Unlock next cluster in progress chain
      await progressService.getCurrentProgress(userId);
    } else if (scorePercentage >= partialThreshold) {
      transitionStatus = "learning";
      adaptiveMode = "shortened";
      
      // Compute weak topics from stats and add to completed/skipped topic logic
      const weakTopics = [];
      for (const [tid, stats] of Object.entries(topicStats)) {
        const topicScore = Math.round((stats.correct / stats.total) * 100);
        if (topicScore < (config.adaptiveLearning?.weakTopicThreshold || 55)) {
          weakTopics.push(new mongoose.Types.ObjectId(tid));
        }
      }

      // Mark the strong topics as completed so they are bypassed in the shortened path
      const allTopicIds = cluster.topicsIncluded.map(t => t.topicId.toString());
      const weakTopicIdStrings = new Set(weakTopics.map(id => id.toString()));
      const completedTopics = allTopicIds
        .filter(tid => !weakTopicIdStrings.has(tid))
        .map(tid => new mongoose.Types.ObjectId(tid));

      await UserClusterProgress.findByIdAndUpdate(progress._id, {
        $set: {
          status: "learning",
          entryAssessmentScore: scorePercentage,
          adaptiveMode: "shortened",
          completedTopics,
          currentTopicIndex: 0,
          currentTaskIndex: 0
        }
      });
    } else {
      transitionStatus = "learning";
      adaptiveMode = "full";
      await UserClusterProgress.findByIdAndUpdate(progress._id, {
        $set: {
          status: "learning",
          entryAssessmentScore: scorePercentage,
          adaptiveMode: "full",
          currentTopicIndex: 0,
          currentTaskIndex: 0
        }
      });
    }
  } else if (progress.status === "final_assessment") {
    const passingScore = config.passingScore || 60;
    const passed = scorePercentage >= passingScore;

    if (passed) {
      transitionStatus = "completed";
      await UserClusterProgress.findByIdAndUpdate(progress._id, {
        $set: {
          status: "completed",
          finalAssessmentScore: scorePercentage,
          progressPercentage: 100,
          completedAt: new Date()
        }
      });

      await LearningEvent.create({
        userId,
        eventType: "CLUSTER_COMPLETED",
        metadata: { score: scorePercentage, attemptId: attempt._id }
      });

      // Schedule revisions
      await revisionService.scheduleRevision(userId, clusterId);
      // Unlock next cluster in progress chain
      await progressService.getCurrentProgress(userId);
    } else {
      // Failed final assessment: return to learning to review weak topics
      transitionStatus = "learning";
      await UserClusterProgress.findByIdAndUpdate(progress._id, {
        $set: {
          status: "learning",
          currentTopicIndex: 0,
          currentTaskIndex: 0
        }
      });
    }
  }

  return {
    score: correctCount,
    percentage: scorePercentage,
    passed: scorePercentage >= (progress.status === "entry_assessment" ? (config.adaptiveLearning?.skipThreshold || 90) : (config.passingScore || 60)),
    attempt
  };
};

export const getDashboard = async (userId) => {
  const user = await User.findById(userId).select("firstName lastName email avatarUrl").lean();
  const progress = await progressService.getCurrentProgress(userId);

  let roadmap = null;
  let cluster = null;
  let todayPlan = null;
  let nextRevision = null;
  let dueRevisionsCount = 0;

  if (progress) {
    roadmap = await Roadmap.findById(progress.roadmapId).lean();
    cluster = await LearningCluster.findById(progress.clusterId).lean();
    todayPlan = await DailyPlan.findOne({
      userId,
      roadmapId: progress.roadmapId,
      clusterId: progress.clusterId,
      planDate: progressService.getCurrentProgress.planDate || new Date().setUTCHours(0, 0, 0, 0)
    }).lean();

    // Get due revisions count
    const dueRevisions = await revisionService.getDueRevisions(userId, progress.roadmapId);
    dueRevisionsCount = dueRevisions.length;

    // Get next upcoming revision date
    const upcoming = await RevisionSchedule.findOne({
      userId,
      completed: false
    }).sort({ dueDate: 1 }).lean();
    nextRevision = upcoming?.dueDate || null;
  }

  const recContext = await getRecommendationContext(userId, progress?.roadmapId, progress);

  return {
    user,
    roadmap,
    cluster,
    progress,
    todayPlan,
    assessment: {
      due: progress ? (progress.status === "entry_assessment" || progress.status === "final_assessment") : false,
      type: progress ? progress.status : null
    },
    revision: {
      dueCount: dueRevisionsCount,
      nextRevisionAt: nextRevision
    },
    analytics: {
      learningVelocity: recContext.learningVelocity,
      averageAccuracy: recContext.confidence
    },
    recommendationContext: recContext
  };
};
