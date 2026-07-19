import mongoose from "mongoose";
const { Schema } = mongoose;

const userClusterProgressSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
  roadmapId: { type: Schema.Types.ObjectId, ref: "Roadmap", required: true },
  clusterId: { type: Schema.Types.ObjectId, ref: "LearningCluster", required: true },
  status: { 
    type: String, 
    enum: ["locked", "entry_assessment", "learning", "paused", "final_assessment", "revision", "completed", "skipped"],
    default: "locked",
    index: true
  },
  currentTopicIndex: { type: Number, default: 0 },
  currentTaskIndex: { type: Number, default: 0 },
  completedTopics: [{ type: Schema.Types.ObjectId, ref: "Topic" }],
  skippedTopics: [{ type: Schema.Types.ObjectId, ref: "Topic" }],
  entryAssessmentScore: { type: Number, default: null },
  finalAssessmentScore: { type: Number, default: null },
  progressPercentage: { type: Number, default: 0 },
  lastActivity: { type: Date, default: Date.now },
  clusterVersion: { type: Number, default: 1 },
  completedVersion: { type: Number, default: null },
  adaptiveMode: { type: String, enum: ["full", "shortened"], default: null },
  startedAt: { type: Date, default: Date.now },
  completedAt: { type: Date, default: null }
}, { timestamps: true });

userClusterProgressSchema.index({ userId: 1, roadmapId: 1, clusterId: 1 }, { unique: true });

export default mongoose.model("UserClusterProgress", userClusterProgressSchema);
