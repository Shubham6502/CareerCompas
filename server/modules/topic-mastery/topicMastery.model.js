import mongoose from "mongoose";

const topicMasterySchema = new mongoose.Schema(
  {
    /* -------------------------------------------------------------------------- */
    /* Relationships                                                               */
    /* -------------------------------------------------------------------------- */

    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    topicId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Topic",
      required: true,
      index: true,
    },

    /* -------------------------------------------------------------------------- */
    /* Learning State                                                              */
    /* -------------------------------------------------------------------------- */

    learningStatus: {
      type: String,
      enum: [
        "not-started",
        "learning",
        "revision",
        "mastered",
        "skipped",
      ],
      default: "not-started",
      index: true,
    },

    masteryScore: {
      type: Number,
      default: 0,
      min: 0,
      max: 100,
      index: true,
    },

    confidenceScore: {
      type: Number,
      default: 0,
      min: 0,
      max: 100,
    },

    /* -------------------------------------------------------------------------- */
    /* Assessment                                                                  */
    /* -------------------------------------------------------------------------- */

    diagnosticScore: {
      type: Number,
      default: null,
      min: 0,
      max: 100,
    },

    latestAssessmentScore: {
      type: Number,
      default: null,
      min: 0,
      max: 100,
    },

    bestAssessmentScore: {
      type: Number,
      default: null,
      min: 0,
      max: 100,
    },

    assessmentAttempts: {
      type: Number,
      default: 0,
    },

    /* -------------------------------------------------------------------------- */
    /* AI Insights                                                                 */
    /* -------------------------------------------------------------------------- */

    recommendedDifficulty: {
      type: String,
      enum: [
        "easy",
        "medium",
        "hard",
      ],
      default: "easy",
    },

    revisionPriority: {
      type: Number,
      default: 0,
      min: 0,
      max: 100,
    },

    weakConcepts: [
      {
        type: String,
        trim: true,
      },
    ],

    strongConcepts: [
      {
        type: String,
        trim: true,
      },
    ],

    /* -------------------------------------------------------------------------- */
    /* Revision                                                                     */
    /* -------------------------------------------------------------------------- */

    revisionCount: {
      type: Number,
      default: 0,
    },

    nextRevisionAt: {
      type: Date,
      default: null,
      index: true,
    },

    lastRevisionAt: {
      type: Date,
      default: null,
    },

    /* -------------------------------------------------------------------------- */
    /* Statistics                                                                   */
    /* -------------------------------------------------------------------------- */

    totalStudyMinutes: {
      type: Number,
      default: 0,
    },

    totalSessions: {
      type: Number,
      default: 0,
    },

    /* -------------------------------------------------------------------------- */
    /* Planner                                                                      */
    /* -------------------------------------------------------------------------- */

    lastStudiedAt: {
      type: Date,
      default: null,
    },

    lastPlannedAt: {
      type: Date,
      default: null,
    },

    completedAt: {
      type: Date,
      default: null,
    },

    /* -------------------------------------------------------------------------- */
    /* Future AI                                                                    */
    /* -------------------------------------------------------------------------- */

    aiMetadata: {
      lastPlannerVersion: {
        type: String,
        default: null,
      },

      lastReason: {
        type: String,
        default: null,
      },

      lastUpdatedBy: {
        type: String,
        enum: [
          "diagnostic",
          "assessment",
          "task-progress",
          "planner",
          "manual",
        ],
        default: "planner",
      },
    },

    schemaVersion: {
      type: Number,
      default: 1,
    },
  },
  {
    timestamps: true,
  }
);

topicMasterySchema.index(
  {
    userId: 1,
    topicId: 1,
  },
  {
    unique: true,
  }
);

topicMasterySchema.index({
  userId: 1,
  masteryScore: 1,
});

topicMasterySchema.index({
  userId: 1,
  learningStatus: 1,
});

topicMasterySchema.index({
  nextRevisionAt: 1,
});

export default mongoose.model(
  "TopicMastery",
  topicMasterySchema
);