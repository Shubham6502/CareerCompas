import TopicMastery from './topicMastery.model.js';

export const getTopicMastery = async (userId) => {
  return await TopicMastery.find({ userId });
}

export const getTopicMasteryByTopicId = async (userId, topicId) => {
  return await TopicMastery.findOne({ userId, topicId });
}

export const updateTopicMasteryByTopicId = async (userId, topicId, updateData) => {
  return await TopicMastery.findOneAndUpdate(
    { userId, topicId },
    { $set: updateData },
    { new: true, upsert: true }
  );
}
