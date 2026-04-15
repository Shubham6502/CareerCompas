import mongoose from 'mongoose';

const userTaskProgressSchema = new mongoose.Schema({
  userId:        { type: mongoose.Types.ObjectId, ref: 'User', required: true, index: true },
  roadmapId:     { type: mongoose.Types.ObjectId, ref: 'Roadmap', required: true },
  taskId:        { type: mongoose.Types.ObjectId, ref: 'Task', required: true },
  status:        { type: String, enum: ['not_started', 'in_progress', 'completed', 'skipped'], default: 'not_started' },
  startedAt:     { type: Date },
  completedAt:   { type: Date },
  timeSpentMinutes: { type: Number, default: 0 },
  notes:         { type: String },
}, { timestamps: true });

// One progress row per user per task — no duplicates
userTaskProgressSchema.index({ userId: 1, taskId: 1 }, { unique: true });

export default mongoose.model('UserTaskProgress', userTaskProgressSchema);