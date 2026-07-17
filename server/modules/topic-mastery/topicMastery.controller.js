import * as topicMasteryService from './topicMastery.service.js';

export const getTopicMastery = async (req, res) => {
  try {
    const { userId } = req.params;
    const topicMastery = await topicMasteryService.getTopicMastery(userId);
    res.status(200).json(topicMastery);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getTopicMasteryByTopicId = async (req, res) => {
  try {
    const { userId, topicId } = req.params;
    const topicMastery = await topicMasteryService.getTopicMasteryByTopicId(userId, topicId);
    res.status(200).json(topicMastery);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const updateTopicMasteryByTopicId = async (req, res) => {
  try {
    const { userId, topicId } = req.params;
    const { masteryScore, learningStatus, lastReason } = req.body;
    const topicMastery = await topicMasteryService.updateTopicMasteryByTopicId(userId, topicId, { masteryScore, learningStatus, lastReason });
    res.status(200).json(topicMastery);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};