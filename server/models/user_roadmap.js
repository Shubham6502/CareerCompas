import mongoose from 'mongoose';

const userRoadmapSchema = new mongoose.Schema({
  userId:           { type: mongoose.Types.ObjectId, ref: 'User', required: true, index: true },
  goalRole:         { type: String },
roadmapIds: [
  {
    roadmapId: {
      type: mongoose.Types.ObjectId,
      ref: "Roadmap",
      required: true,
    },
    status: {
      type: String,
      enum: ["active", "completed"],
      default: "active",
    },
  },
], // Support multiple roadmaps per user
  

  // progressPercentage:  { type: Number, default: 0, min: 0, max: 100 },
  // completedTasksCount: { type: Number, default: 0, min: 0 },
  // totalXP:             { type: Number, default: 0, min: 0 },
  // Streak belongs here — it's per roadmap, not per day
  // currentStreak: { type: Number, default: 0 },
  // longestStreak: { type: Number, default: 0 },

  lastActivityAt: { type: Date },
  startedAt:   { type: Date },
  completedAt: { type: Date },

}, { timestamps: true });

userRoadmapSchema.index({ userId: 1, targetType: 1 }, { unique: true });

export default mongoose.model('UserRoadmap', userRoadmapSchema);