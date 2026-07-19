import mongoose from "mongoose";
const { Schema } = mongoose;

const learningSessionSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
  dailyPlanId: { type: Schema.Types.ObjectId, ref: "DailyPlan", default: null, index: true },
  startedAt: { type: Date, default: Date.now },
  endedAt: { type: Date, default: null },
  durationMinutes: { type: Number, default: 0 },
  completedTasks: [{ type: Schema.Types.ObjectId, ref: "Task" }],
  interruptionsCount: { type: Number, default: 0 },
  focusScore: { type: Number, min: 1, max: 10, default: null },
  device: { type: String, enum: ["Mobile", "Desktop", "Tablet"], default: "Desktop" },
  platform: { type: String, enum: ["iOS", "Android", "Web"], default: "Web" },
  studyMode: { type: String, enum: ["Focused", "Casual", "Timed"], default: "Focused" }
}, { timestamps: true });

export default mongoose.model("LearningSession", learningSessionSchema);
