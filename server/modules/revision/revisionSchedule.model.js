import mongoose from "mongoose";
const { Schema } = mongoose;

const revisionPolicySchema = new Schema({
  intervals: { type: [Number], default: [1, 7, 15, 30] },
  algorithm: { type: String, enum: ["SM2", "FSRS", "fixed"], default: "SM2" }
}, { _id: false });

const revisionScheduleSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
  topicId: { type: Schema.Types.ObjectId, ref: "Topic", required: true, index: true },
  clusterId: { type: Schema.Types.ObjectId, ref: "LearningCluster", required: true, index: true },
  revisionNumber: { type: Number, required: true },
  dueDate: { type: Date, required: true, index: true },
  completed: { type: Boolean, default: false, index: true },
  interval: { type: Number, required: true },
  easeFactor: { type: Number, default: 2.5 },
  policy: { type: revisionPolicySchema, default: () => ({}) }
}, { timestamps: true });

export default mongoose.model("RevisionSchedule", revisionScheduleSchema);
