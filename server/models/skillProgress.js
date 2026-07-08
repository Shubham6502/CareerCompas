import mongoose from "mongoose";
const { Schema } = mongoose;
const SkillProgressSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    topicId: {
      type: Schema.Types.ObjectId,
      ref: "Topic",
      required: true,
    },
    topicSlug: {
      type: String,
      required: true,
    }, // denormalized, avoids a join for display
    masteryScore: {
      type: Number,
      min: 0,
      max: 100,
      default: 0,
    },
    confidenceScore: {
      type: Number,
      min: 0,
      max: 100,
      default: 0,
    },
    accuracyRate: {
      type: Number,
      min: 0,
      max: 100,
      default: 0,
    }, // rolling
    attemptsCount: {
      type: Number,
      default: 0,
    },
    correctCount: {
      type: Number,
      default: 0,
    },
    status: {
      type: String,
      enum: ["not-started", "in-progress", "mastered", "needs-revision"],
      default: "not-started",
    },
    streakCount: {
      type: Number,
      default: 0,
    },
    lastAttemptedAt: {
      type: Date,
      default: null,
    },
    lastAssessedAt: {
      type: Date,
      default: null,
    },
    nextRevisionDueAt: {
      type: Date,
      default: null,
      index: true,
    },
    revisionStage: {
      type: Number,
      default: 0,
    }, // spaced-repetition stage
    schemaVersion: {
      type: Number,
      default: 1,
    },
  },
  { timestamps: true },
);
SkillProgressSchema.index({ userId: 1, topicId: 1 }, { unique: true });
SkillProgressSchema.index({ userId: 1, nextRevisionDueAt: 1 }); // "what's due today" — the single most-run query in the system
SkillProgressSchema.index({ userId: 1, status: 1 });
SkillProgressSchema.index({ userId: 1, masteryScore: 1 }); // weak-topic queries

export default mongoose.model("SkillProgress", SkillProgressSchema);
