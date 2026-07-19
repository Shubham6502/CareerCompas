import LearningCluster from "./learningCluster.model.js";

export const getClusterById = async (id) => {
  return LearningCluster.findOne({ _id: id, isDeleted: false }).lean();
};

export const getClusterByKey = async (clusterKey) => {
  return LearningCluster.findOne({ clusterKey, isDeleted: false }).lean();
};

export const createCluster = async (data) => {
  return LearningCluster.create(data);
};

export const softDeleteCluster = async (id) => {
  return LearningCluster.findByIdAndUpdate(
    id,
    { $set: { isDeleted: true, deletedAt: new Date() } },
    { new: true }
  ).lean();
};
