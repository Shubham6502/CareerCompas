import mongoose from "mongoose";
const { Schema } = mongoose;

const DailyPlanSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
  planDate: { type: Date, required: true }, // date-only, normalized to midnight UTC
  tasks: [{
    taskId: { type: Schema.Types.ObjectId, ref: "Task", required: true },
    taskSlug: String,
    topicId: Schema.Types.ObjectId,
    reason: { type: String, enum: ["weak-area","revision-due","unlock","interview-prep","new-topic"], default: "new-topic" },
    triggerData: Schema.Types.Mixed, // e.g. { accuracy: 42, threshold: 50, daysSinceLastReview: 21 }
    completed: { type: Boolean, default: false },
    _id: false,
  }],
  studyHoursBudget: { type: Number, required: true },
  status: { type: String, enum: ["active","completed","partially-completed","expired"], default: "active" },
  completedTaskCount: { type: Number, default: 0 },
  generatedAt: { type: Date, default: Date.now },
  schemaVersion: { type: Number, default: 1 },
});
export default mongoose.model("DailyPlan", DailyPlanSchema);