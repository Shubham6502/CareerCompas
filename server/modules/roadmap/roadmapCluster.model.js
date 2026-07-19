import mongoose from "mongoose";
const { Schema } = mongoose;

const unlockConditionSchema = new Schema({
  type: { type: String, enum: ["COMPLETE_CLUSTER", "ASSESSMENT_SCORE"], required: true },
  minimum: { type: Number, default: 70 }
}, { _id: false });

const roadmapClusterSchema = new Schema({
  roadmapId: { type: Schema.Types.ObjectId, ref: "Roadmap", required: true, index: true },
  clusterId: { type: Schema.Types.ObjectId, ref: "LearningCluster", required: true, index: true },
  order: { type: Number, required: true },
  isOptional: { type: Boolean, default: false },
  unlockCondition: { type: unlockConditionSchema, default: () => ({ type: "COMPLETE_CLUSTER" }) }
}, { timestamps: true });

roadmapClusterSchema.index({ roadmapId: 1, order: 1 });
roadmapClusterSchema.index({ roadmapId: 1, clusterId: 1 }, { unique: true });

export default mongoose.model("RoadmapCluster", roadmapClusterSchema);
