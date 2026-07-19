import Roadmap from "./roadmap.model.js";
import RoadmapCluster from "./roadmapCluster.model.js";

export const getRoadmapById = async (id) => {
  return Roadmap.findOne({ _id: id, isDeleted: false }).lean();
};

export const getLatestRoadmapByDomainAndTrack = async (domain, track) => {
  return Roadmap.findOne({ domain, track, isPublished: true, isDeleted: false })
    .sort({ version: -1 })
    .lean();
};

export const createRoadmap = async (data) => {
  return Roadmap.create(data);
};

export const linkClusterToRoadmap = async (roadmapId, clusterId, order, unlockCondition = null, isOptional = false) => {
  return RoadmapCluster.findOneAndUpdate(
    { roadmapId, clusterId },
    { $set: { order, unlockCondition, isOptional } },
    { new: true, upsert: true }
  ).lean();
};

export const getRoadmapClusters = async (roadmapId) => {
  return RoadmapCluster.find({ roadmapId })
    .populate({
      path: "clusterId",
      match: { isDeleted: false }
    })
    .sort({ order: 1 })
    .lean();
};

export const softDeleteRoadmap = async (id) => {
  return Roadmap.findByIdAndUpdate(
    id,
    { $set: { isDeleted: true, deletedAt: new Date() } },
    { new: true }
  ).lean();
};
