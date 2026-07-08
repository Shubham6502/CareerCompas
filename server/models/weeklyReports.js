import mongoose from "mongoose";
const { Schema } = mongoose;
const WeeklyReportSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
  weekStartDate: { type: Date, required: true },
  weekEndDate: { type: Date, required: true },
  tasksCompleted: { type: Number, default: 0 },
  hoursStudied: { type: Number, default: 0 },
  topicsImproved: [{ topicId: Schema.Types.ObjectId, topicSlug: String, masteryDelta: Number, _id: false }],
  revisionsCompleted: { type: Number, default: 0 },
  assessmentsTaken: { type: Number, default: 0 },
  avgAssessmentScore: { type: Number, default: null },
  readinessScoreStart: Number,
  readinessScoreEnd: Number,
  readinessDelta: Number,
  aiSummaryText: { type: String, required: true }, // generated once at week-end, stored
  aiModelUsed: String,
  generatedAt: { type: Date, default: Date.now },
  schemaVersion: { type: Number, default: 1 },
});
export default mongoose.model("WeeklyReport", WeeklyReportSchema);