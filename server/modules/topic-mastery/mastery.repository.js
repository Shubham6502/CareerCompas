import TopicMastery from "./topicMastery.model.js";

export const getTopicMastery = async (userId) => {
  return TopicMastery.find({ userId }).lean();
};

export const getTopicMasteryByTopicId = async (userId, topicId) => {
  return TopicMastery.findOne({ userId, topicId }).lean();
};

export const createTopicMastery = async (data) => {
  return TopicMastery.create(data);
};

export const updateTopicMastery = async (userId, topicId, updateData) => {
  return TopicMastery.findOneAndUpdate(
    { userId, topicId },
    { $set: updateData },
    { new: true, upsert: true }
  ).lean();
};

export const findMasteryByTopics = async (userId, topicIds) => {
  return TopicMastery.find({
    userId,
    topicId: { $in: topicIds }
  }).lean();
};
