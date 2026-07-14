import mongoose from "mongoose";
const { Schema } = mongoose;
const UserTaskProgressSchema = new Schema({
  userId: { 
    type: Schema.Types.ObjectId,
     ref: "User", 
     required: true 
    },
  taskId: { type: Schema.Types.ObjectId, ref: "Task", required: true },
  taskSlug: { type: String, required: true },
  topicId: { type: Schema.Types.ObjectId, ref: "Topic", required: true }, // denormalized, avoids a Task lookup on every rollup
  status: { type: String, enum: ["not-started","in-progress","completed","skipped"], default: "not-started" },
  accuracy: { type: Number, min: 0, max: 100, default: null },
  timeSpentMinutes: { type: Number, default: 0 },
  attemptsCount: { type: Number, default: 0 },
  firstAttemptedAt: { type: Date, default: null },
  completedAt: { type: Date, default: null },
  lastAttemptedAt: { type: Date, default: null },
  schemaVersion: { type: Number, default: 1 },
}, { timestamps: true });
export default mongoose.model("UserTaskProgress", UserTaskProgressSchema);