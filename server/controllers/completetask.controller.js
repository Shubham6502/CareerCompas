import mongoose from 'mongoose';
import UserTaskProgress from '../models/userTaskProgress.js';
import UserRoadmap      from '../models/user_roadmap.js';
import DailyProgress    from '../models/daily_progress.js';

const XP_PER_TASK = 50; // tune as needed

// Truncate a date to midnight UTC — key for daily deduplication
function toMidnightUTC(date = new Date()) {
  const d = new Date(date);
  d.setUTCHours(0, 0, 0, 0);
  return d;
}

export async function completeTask({ userId, taskId, roadmapId, minutesSpent = 0 }) {
  const session = await mongoose.startSession();

  try {
    await session.withTransaction(async () => {

      // 1. Mark task done in UserTaskProgress
      const taskProgress = await UserTaskProgress.findOneAndUpdate(
        { userId, taskId },
        {
          $set: {
            status: 'completed',
            completedAt: new Date(),
          },
          $inc: { timeSpentMinutes: minutesSpent },
        },
        { session, new: true }
      );

      if (!taskProgress) throw new Error('Task progress record not found');

      // 2. Update UserRoadmap — recalculate progress + streak
      const userRoadmap = await UserRoadmap.findOne({ userId, roadmapId }).session(session);
      if (!userRoadmap) throw new Error('UserRoadmap not found');

      const today     = toMidnightUTC();
      const yesterday = new Date(today); yesterday.setUTCDate(yesterday.getUTCDate() - 1);
      const lastActive = userRoadmap.lastActivityAt
        ? toMidnightUTC(userRoadmap.lastActivityAt)
        : null;

      // Streak logic: increment if active yesterday, reset if gap > 1 day
      let newStreak = userRoadmap.currentStreak;
      if (!lastActive || lastActive < yesterday) {
        newStreak = 1; // reset — missed a day
      } else if (lastActive.getTime() === yesterday.getTime()) {
        newStreak += 1; // consecutive day
      }
      // if lastActive === today, streak stays the same (already counted)

      const newCompletedCount = userRoadmap.completedTasksCount + 1;
      const totalTasksCount   = await UserTaskProgress.countDocuments({ userId, roadmapId }).session(session);
      const newProgress       = Math.round((newCompletedCount / totalTasksCount) * 100);
      const newXP             = userRoadmap.totalXP + XP_PER_TASK;

      await UserRoadmap.findOneAndUpdate(
        { userId, roadmapId },
        {
          $set: {
            progressPercentage:  newProgress,
            completedTasksCount: newCompletedCount,
            totalXP:             newXP,
            currentStreak:       newStreak,
            longestStreak:       Math.max(userRoadmap.longestStreak, newStreak),
            lastActivityAt:      new Date(),
            status: newProgress === 100 ? 'completed' : 'in_progress',
          },
        },
        { session }
      );

      // 3. Upsert DailyProgress — one row per user per day
      await DailyProgress.findOneAndUpdate(
        { userId, date: today },
        {
          $inc: {
            tasksCompleted: 1,
            minutesSpent: minutesSpent,
            xpEarned: XP_PER_TASK,
          },
          $addToSet: {
            roadmapsWorkedOn: roadmapId, // won't duplicate if already in array
            taskIds: taskId,
          },
        },
        { session, upsert: true, new: true }
      );
    });

  } finally {
    session.endSession();
  }
}