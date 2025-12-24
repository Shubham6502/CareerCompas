import mongoose from "mongoose";

/* ================= TASK SCHEMA ================= */
const taskSchema = new mongoose.Schema(
  {
    id: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      enum: ["DSA", "READ"],
      required: true,
    },

    platform: {
      type: String,
      default: "LeetCode", // only for DSA
    },

    problemTitle: {
      type: String, // only for DSA
    },

    title: {
      type: String, // mainly for READ tasks
    },

    difficulty: {
      type: String,
      enum: ["Easy", "Medium"],
    },

    url: {
      type: String,
      required: true,
    },
  },
  
);

/* ================= DAY SCHEMA ================= */
const daySchema = new mongoose.Schema(
  {
    day: {
      type: Number,
      required: true,
      min: 1,
      max: 90,
    },

    topic: {
      type: String,
      required: true,
    },

    difficulty: {
      type: String,
      enum: ["Easy", "Medium"],
      required: true,
    },

    tasks: {
      type: [taskSchema],
      required: true,
    },
  },
  { _id: false }
);

/* ================= ROADMAP SCHEMA ================= */
const roadmapSchema = new mongoose.Schema(
  {
    domain: {
      type: String,
      required: true,
      index: true,
    },

    durationDays: {
      type: Number,
      default: 90,
    },

    level: {
      type: String,
      default: "Beginner to Intermediate",
    },

    platform: {
      type: String,
      default: "LeetCode",
    },

    days: {
      type: [daySchema],
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Roadmap", roadmapSchema);
