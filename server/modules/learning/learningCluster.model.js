import mongoose from "mongoose";
const { Schema } = mongoose;

const learningClusterSchema = new Schema({
  name: { type: String, required: true, trim: true },
  clusterKey: { type: String, required: true, unique: true, index: true },
  topicsIncluded: [{
    topicId: { type: Schema.Types.ObjectId, ref: "Topic", required: true },
    slug: { type: String, required: true },
    displayName: { type: String, required: true }
  }],
  estimatedHours: { type: Number, default: 0 },
  estimatedTasks: { type: Number, default: 0 },
  difficulty: { type: String, enum: ["easy", "medium", "hard"], default: "medium" },
  prerequisiteClusters: [{ type: Schema.Types.ObjectId, ref: "LearningCluster" }],
  version: { type: Number, default: 1 },
  isDeleted: { type: Boolean, default: false, index: true },
  deletedAt: { type: Date, default: null }
}, { timestamps: true });

export default mongoose.model("LearningCluster", learningClusterSchema);
