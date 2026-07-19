import Question from "./question.model.js";
import AssessmentAttempt from "./assessmentAttempt.model.js";

export const sampleEntryQuestions = async (topicSlugs, limit = 10) => {
  return Question.aggregate([
    { $match: { topicSlugs: { $in: topicSlugs }, isActive: true } },
    { $sample: { size: limit } }
  ]);
};

export const sampleFinalQuestions = async (topicSlugs, limit = 10, excludeIds = []) => {
  const match = { topicSlugs: { $in: topicSlugs }, isActive: true };
  if (excludeIds.length > 0) {
    match._id = { $nin: excludeIds };
  }
  return Question.aggregate([
    { $match: match },
    { $sample: { size: limit } }
  ]);
};

export const sampleWeakTopicQuestions = async (weakTopicSlugs, limit = 10) => {
  return Question.aggregate([
    { $match: { topicSlugs: { $in: weakTopicSlugs }, isActive: true } },
    { $sample: { size: limit } }
  ]);
};

export const sampleRevisionQuestions = async (topicSlugs, limit = 10) => {
  return Question.aggregate([
    { $match: { topicSlugs: { $in: topicSlugs }, isActive: true } },
    { $sample: { size: limit } }
  ]);
};

export const sampleCompanyQuestions = async (companyTags, limit = 10) => {
  return Question.aggregate([
    { $match: { companyTags: { $in: companyTags }, isActive: true } },
    { $sample: { size: limit } }
  ]);
};

export const saveAssessmentAttempt = async (data) => {
  return AssessmentAttempt.create(data);
};

export const getAssessmentAttemptsCount = async (userId, clusterId, assessmentType) => {
  return AssessmentAttempt.countDocuments({ userId, clusterId, assessmentType });
};
