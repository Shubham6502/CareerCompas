import * as topicMasteryRepository from './topicMastery.repository.js';



const InitializeTopicMastery = async (userId, topicId) => {
  const existingTopicMastery = await topicMasteryRepository.getTopicMasteryByTopicId(userId, topicId);
  if (!existingTopicMastery) {
    const newTopicMastery = {
      userId,
      topicId,
        masteryScore: 0,
        learningStatus: "not-started",
    };
    await topicMasteryRepository.updateTopicMasteryByTopicId(userId, topicId, newTopicMastery);
  }
};

const processAssessmentCompletion = async (userId, topicId, assessmentScore) => {
  const topicMastery = await topicMasteryRepository.getTopicMasteryByTopicId(userId, topicId);
    if (!topicMastery) {
        await InitializeTopicMastery(userId, topicId);
    }
  const updatedMasteryScore = Math.min(100, topicMastery.masteryScore + assessmentScore);
  const updatedLearningStatus = updatedMasteryScore >= 80 ? "mastered" : "learning";
  await topicMasteryRepository.updateTopicMasteryByTopicId(userId, topicId, {
    masteryScore: updatedMasteryScore,
    learningStatus: updatedLearningStatus,
  });
}

const updateRevisionStatus = async (userId, topicId) => {
  const topicMastery = await topicMasteryRepository.getTopicMasteryByTopicId(userId, topicId);
    if (!topicMastery) {
        await InitializeTopicMastery(userId, topicId);
    }
    const updatedLearningStatus = topicMastery.learningStatus === "mastered" ? "revision" : topicMastery.learningStatus;
    await topicMasteryRepository.updateTopicMasteryByTopicId(userId, topicId, {
        learningStatus: updatedLearningStatus,
    });
}






export const getTopicMastery = async (userId) => {
  return await topicMasteryRepository.getTopicMastery(userId);
}

export const getTopicMasteryByTopicId = async (userId, topicId) => {
  await InitializeTopicMastery(userId, topicId);
  return await topicMasteryRepository.getTopicMasteryByTopicId(userId, topicId);
}

export const updateTopicMasteryByTopicId = async (userId, topicId, updateData) => {
  await InitializeTopicMastery(userId, topicId);
  return await topicMasteryRepository.updateTopicMasteryByTopicId(userId, topicId, updateData);
}
