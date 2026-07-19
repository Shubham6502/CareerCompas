import UserClusterProgress from "./userClusterProgress.model.js";
import RoadmapCluster from "../roadmap/roadmapCluster.model.js";
import LearningCluster from "../learning/learningCluster.model.js";
import CareerProfile from "../careerProfile/careerProfile.model.js";
import Roadmap from "../roadmap/roadmap.model.js";
import Task from "../task/tasks.model.js";
import Topic from "../topics/topics.model.js";

export const checkPrerequisites = async (userId, clusterId) => {
  const cluster = await LearningCluster.findById(clusterId).lean();
  if (!cluster || !cluster.prerequisiteClusters || cluster.prerequisiteClusters.length === 0) {
    return true;
  }

  // Check if progress records for all prerequisite clusters are completed or skipped
  const prereqProgressDocs = await UserClusterProgress.find({
    userId,
    clusterId: { $in: cluster.prerequisiteClusters }
  }).lean();

  if (prereqProgressDocs.length < cluster.prerequisiteClusters.length) {
    return false;
  }

  return prereqProgressDocs.every(p => p.status === "completed" || p.status === "skipped");
};

export const getCurrentProgress = async (userId) => {
  // Find active progress (not completed, not skipped)
  let activeProgress = await UserClusterProgress.findOne({
    userId,
    status: { $nin: ["completed", "skipped"] }
  }).lean();

  if (activeProgress) {
    // If locked, re-evaluate prerequisites
    if (activeProgress.status === "locked") {
      const satisfied = await checkPrerequisites(userId, activeProgress.clusterId);
      if (satisfied) {
        const updated = await UserClusterProgress.findByIdAndUpdate(
          activeProgress._id,
          { $set: { status: "entry_assessment" } },
          { new: true }
        ).lean();
        return updated;
      }
    }
    return activeProgress;
  }

  // If no active progress, resolve roadmap and start first cluster
  const profile = await CareerProfile.findOne({ userId, isDeleted: false }).lean();
  let roadmapId = profile?.activeRoadmapId;

  if (!roadmapId) {
    // Resolve a default roadmap if none active
    const defaultRoadmap = await Roadmap.findOne({ isPublished: true, isActive: true, isDeleted: false }).lean();
    if (!defaultRoadmap) {
      throw new Error("No active or published roadmaps found in the system.");
    }
    roadmapId = defaultRoadmap._id;
    await CareerProfile.findOneAndUpdate({ userId }, { $set: { activeRoadmapId: roadmapId } });
  }

  // Get clusters in order
  const clusters = await RoadmapCluster.find({ roadmapId }).sort({ order: 1 }).lean();
  if (clusters.length === 0) {
    return null; // Roadmap has no clusters
  }

  // Find the first cluster that isn't already completed/skipped
  const allProgress = await UserClusterProgress.find({ userId, roadmapId }).lean();
  const completedOrSkipped = new Set(
    allProgress.filter(p => p.status === "completed" || p.status === "skipped").map(p => p.clusterId.toString())
  );

  const nextClusterMapping = clusters.find(c => !completedOrSkipped.has(c.clusterId.toString()));
  if (!nextClusterMapping) {
    return null; // All clusters in roadmap are completed
  }

  const cid = nextClusterMapping.clusterId;
  const isSatisfied = await checkPrerequisites(userId, cid);
  const startStatus = isSatisfied ? "entry_assessment" : "locked";

  const clusterDoc = await LearningCluster.findById(cid).lean();
  const newProgress = await UserClusterProgress.create({
    userId,
    roadmapId,
    clusterId: cid,
    status: startStatus,
    clusterVersion: clusterDoc?.version || 1,
    currentTopicIndex: 0,
    currentTaskIndex: 0,
    completedTopics: [],
    skippedTopics: []
  });

  return newProgress.toObject();
};

export const resumeLearning = async (userId) => {
  const progress = await getCurrentProgress(userId);
  if (!progress || progress.status !== "learning") {
    return null;
  }

  const cluster = await LearningCluster.findById(progress.clusterId).lean();
  if (!cluster || !cluster.topicsIncluded || cluster.topicsIncluded.length === 0) {
    return null;
  }

  // Resolve topics
  const topicsList = progress.adaptiveMode === "shortened"
    ? cluster.topicsIncluded.filter(t => !progress.completedTopics.some(ct => ct.toString() === t.topicId.toString()))
    : cluster.topicsIncluded;

  const currentTopicItem = topicsList[progress.currentTopicIndex];
  if (!currentTopicItem) {
    return null;
  }

  const currentTopic = await Topic.findById(currentTopicItem.topicId).lean();
  if (!currentTopic) {
    return null;
  }

  // Fetch tasks for the topic, sorted by order field
  const tasks = await Task.find({
    topicId: currentTopic._id,
    isActive: true,
    isDeprecated: false
  }).sort({ order: 1 }).lean();

  const currentTask = tasks[progress.currentTaskIndex] || null;

  return {
    progressId: progress._id,
    clusterId: progress.clusterId,
    currentTopicIndex: progress.currentTopicIndex,
    currentTaskIndex: progress.currentTaskIndex,
    topic: currentTopic,
    task: currentTask,
    totalTopics: topicsList.length,
    totalTasksInTopic: tasks.length
  };
};
