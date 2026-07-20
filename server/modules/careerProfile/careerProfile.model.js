import mongoose from "mongoose";
const { Schema } = mongoose;

const CareerProfileSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
      index: true,
    },
    activeRoadmapId: {
      type: Schema.Types.ObjectId,
      ref: "Roadmap",
      default: null,
    },
    targetRole: {
      type: String,
      required: true,
    }, // e.g. "SDE-1", "Backend Engineer", "Data Analyst"
    targetCompanies: [
      {
        company: {
          type: String,
          required: true,
        }, // "google", "amazon" — same vocabulary as Tasks.companyRelevance.company
        tier: {
          type: String,
          enum: ["faang", "product", "startup", "service", "government"],
          required: true,
        },
        priority: {
          type: Number,
          min: 1,
          max: 3,
          default: 2,
        },
        _id: false,
      },
    ],
    experienceLevel: {
      type: String,
      enum: ["student", "fresher", "0-2yrs", "2-5yrs", "5+yrs"],
      required: true,
    },
    studyHoursPerDay: {
      type: Number,
      min: 0.5,
      max: 16,
      required: true,
    },
    deadlineDate: {
      type: Date,
      default: null,
      index: true,
    }, // target interview/placement date
    preferredLearningStyle: {
      type: String,
      enum: ["visual", "reading", "hands-on", "mixed"],
      default: "mixed",
    },
    onboardingCompleted: {
      type: Boolean,
      default: false,
    },
    currentStreak: {
      type: Number,
      default: 0,
    },
    longestStreak: {
      type: Number,
      default: 0,
    },
    lastActiveDate: {
      type: Date,
      default: null,
    },
    isDeleted: {
      type: Boolean,
      default: false,
      index: true,
    },
    schemaVersion: {
      type: Number,
      default: 1,
    },
  },
  { timestamps: true },
);

export default mongoose.model("CareerProfile", CareerProfileSchema);
