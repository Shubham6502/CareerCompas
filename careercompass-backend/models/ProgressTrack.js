import mongoose from "mongoose";


const progressSchema = new mongoose.Schema(
  {
    clerkId: {
      type: String,
      required: true,
      index: true,
    },

    domain: {
      type: String,
      required: true,
    },

    currentDay: {
      type: Number,
      default: 1,
      min: 1,
    },

    completedDays: {
      type: [Number],
      default: [],
    },

    todayTasksCompleted: {
      type: Boolean,
      default: false,
    },

    streak: {
      type: Number,
      default: 0,
      min: 0,
    },

    maxStreak: {
      type: Number,
      default: 0,
      min: 0,
    },

    progressPercent: {
      type: Number,
      default: 0,
      min: 0,
      max: 100,
    },

    startDate: {
      type: Date,
      default: Date.now,
    },

    lastActiveDate: {
      type: Date,
      default: Date.now,
    },
    previousDay: {
      type: Number,
      default: 0,
    },
    completedTasks: {
      Day: {
        type: Number,
        default: 1,
      },
      tasks: {
        type: [String],
        default: [],
      },
      Assessment: {
        taken: {
          type: Boolean,
          default: false,
        },
        score: {
          type: Number,
          default: 0,
        },
        lastAttemptAt: {
          type: Date,
        },
      },
    },
    ActiveDays: [
      {
        day: {
          type: Number,
          require: true,
        },
        date: {
          type: String,
          require: true,
        },
        tasks: {
          type: [String],
          default: [],
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("ProgressTrack", progressSchema);
