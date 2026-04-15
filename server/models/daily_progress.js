import mongoose from 'mongoose';

const dailyProgressSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true,
  },
  // Always store as midnight UTC so every query for "today" matches cleanly
  date: {
    type: Date,
    required: true,
  },
  tasksCompleted: { type: Number, default: 0, min: 0 },
  minutesSpent:   { type: Number, default: 0, min: 0 },
  xpEarned:       { type: Number, default: 0, min: 0 },

  // Array — user can work on multiple roadmaps in one day
  roadmapsWorkedOn: [{
    type: mongoose.Types.ObjectId,
    ref: 'Roadmap',
  }],

  // Which specific tasks were completed today — useful for analytics
  taskIds: [{
    type: mongoose.Types.ObjectId,
    ref: 'Task',
  }],

}, { timestamps: true });

// One document per user per day — upsert-safe
dailyProgressSchema.index({ userId: 1, date: 1 }, { unique: true });

export default mongoose.model('DailyProgress', dailyProgressSchema);