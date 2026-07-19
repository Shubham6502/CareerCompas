import TopicMastery from "./topicMastery.model.js";

const WEAK_MASTERY_CEILING = 50;
const STRONG_MASTERY_FLOOR = 80;

// Reads                                                                      
export const getTopicMastery = async (userId) => {
  return TopicMastery.find({ userId });
};

export const getTopicMasteryByTopicId = async (userId, topicId) => {
  return TopicMastery.findOne({ userId, topicId });
};

export const getRevisionQueue = async (userId, referenceDate) => {
  return TopicMastery.find({
    userId,
    nextRevisionAt: { $lte: referenceDate },
  }).sort({ revisionPriority: -1, nextRevisionAt: 1 });
};

export const getWeakTopics = async (userId) => {
  return TopicMastery.find({
    userId,
    masteryScore: { $lt: WEAK_MASTERY_CEILING },
  }).sort({ masteryScore: 1 });
};

export const getStrongTopics = async (userId) => {
  return TopicMastery.find({
    userId,
    masteryScore: { $gte: STRONG_MASTERY_FLOOR },
  }).sort({ masteryScore: -1 });
};

/* -------------------------------------------------------------------------- */
/* Writes                                                                     */
/* -------------------------------------------------------------------------- */
export const createTopicMastery = async ({ userId, topicId, aiMetadata }) => {
  const topicMastery = new TopicMastery({ userId, topicId, aiMetadata });

  return topicMastery.save();
};

export const updateTopicMasteryByTopicId = async (userId, topicId, updateData) => {
  return TopicMastery.findOneAndUpdate(
    { userId, topicId },
    { $set: updateData },
    { new: true, upsert: true },
  );
};