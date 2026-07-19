import * as masteryRepository from "./mastery.repository.js";
import LearningCluster from "../learning/learningCluster.model.js";
import Topic from "../topics/topics.model.js";

// Blending weights
const WEIGHT_PREVIOUS = 0.7;
const WEIGHT_NEW = 0.3;

export const calculateTopicMastery = async (userId, topicId, score, totalQuestions = 10, correctAnswers = null) => {
  let topicMastery = await masteryRepository.getTopicMasteryByTopicId(userId, topicId);
  
  if (!topicMastery) {
    topicMastery = await masteryRepository.createTopicMastery({
      userId,
      topicId,
      attempts: 0,
      mastery: 0,
      confidence: 0,
      accuracy: 0,
      averageScore: 0
    });
  }

  const newAttempts = (topicMastery.attempts || 0) + 1;
  const newAverageScore = Math.round(
    (((topicMastery.averageScore || 0) * (newAttempts - 1)) + score) / newAttempts
  );

  // If correctAnswers is provided, compute accuracy; otherwise assume score is percentage
  const totalQ = totalQuestions || 10;
  const correctQ = correctAnswers !== null ? correctAnswers : Math.round((score / 100) * totalQ);
  const attemptAccuracy = Math.round((correctQ / totalQ) * 100);
  const newAccuracy = topicMastery.attempts > 0
    ? Math.round(((topicMastery.accuracy || 0) * (newAttempts - 1) + attemptAccuracy) / newAttempts)
    : attemptAccuracy;

  // Blending formula
  const prevMastery = topicMastery.attempts > 0 ? topicMastery.mastery : score;
  const newMastery = Math.min(100, Math.max(0, Math.round((prevMastery * WEIGHT_PREVIOUS) + (score * WEIGHT_NEW))));
  
  const prevConfidence = topicMastery.attempts > 0 ? topicMastery.confidence : score;
  const newConfidence = Math.min(100, Math.max(0, Math.round((prevConfidence * WEIGHT_PREVIOUS) + (score * WEIGHT_NEW))));

  const updateData = {
    mastery: newMastery,
    confidence: newConfidence,
    accuracy: newAccuracy,
    attempts: newAttempts,
    averageScore: newAverageScore,
    // Sync with legacy fields
    masteryScore: newMastery,
    confidenceScore: newConfidence,
    assessmentAttempts: newAttempts,
    latestAssessmentScore: score
  };

  return masteryRepository.updateTopicMastery(userId, topicId, updateData);
};

export const updateMastery = async (userId, topicId, updateData) => {
  return masteryRepository.updateTopicMastery(userId, topicId, updateData);
};

export const getWeakTopics = async (userId, clusterId) => {
  const cluster = await LearningCluster.findById(clusterId).lean();
  if (!cluster || !cluster.topicsIncluded) return [];

  const topicIds = cluster.topicsIncluded.map(t => t.topicId);
  const masteries = await masteryRepository.findMasteryByTopics(userId, topicIds);
  const masteryMap = new Map(masteries.map(m => [m.topicId.toString(), m]));

  const weakTopics = [];
  for (const item of cluster.topicsIncluded) {
    const m = masteryMap.get(item.topicId.toString());
    if (m && m.attempts > 0) {
      // Multi-factor weakness logic:
      // A topic is weak if mastery < 55, or if attempts are high but accuracy remains low.
      const weaknessScore = (m.attempts * 0.2) + (100 - m.mastery) * 0.4 + (100 - m.accuracy) * 0.4;
      if (m.mastery < 60 || weaknessScore > 45) {
        weakTopics.push({
          topicId: item.topicId,
          slug: item.slug,
          displayName: item.displayName,
          mastery: m.mastery,
          accuracy: m.accuracy,
          attempts: m.attempts
        });
      }
    }
  }
  return weakTopics;
};

export const calculateClusterMastery = async (userId, clusterId) => {
  const cluster = await LearningCluster.findById(clusterId).lean();
  if (!cluster || !cluster.topicsIncluded || cluster.topicsIncluded.length === 0) return 0;

  const topicIds = cluster.topicsIncluded.map(t => t.topicId);
  const masteries = await masteryRepository.findMasteryByTopics(userId, topicIds);
  
  if (masteries.length === 0) return 0;
  const sum = masteries.reduce((acc, m) => acc + (m.mastery || 0), 0);
  return Math.round(sum / cluster.topicsIncluded.length);
};

export const calculateRoadmapMastery = async (userId, roadmapId) => {
  // Get all clusters for this roadmap
  const RoadmapCluster = mongoose.model("RoadmapCluster");
  const mappings = await RoadmapCluster.find({ roadmapId }).lean();
  if (mappings.length === 0) return 0;

  let totalMastery = 0;
  for (const m of mappings) {
    totalMastery += await calculateClusterMastery(userId, m.clusterId);
  }
  return Math.round(totalMastery / mappings.length);
};
