import mongoose from "mongoose";
const { Schema } = mongoose;
const ConceptSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    slug: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
    },
    weight: {
      type: Number,
      min: 0,
      max: 1,
      default: 0,
    },
    difficulty: {
      type: String,
      enum: ["easy", "medium", "hard"],
      required: true,
    },
  },
  { _id: false },
);

const AdaptivePrerequisiteSchema = new Schema(
  {
    topicId: {
      type: Schema.Types.ObjectId,
      ref: "Topic",
      required: true,
    },
    topicSlug: {
      type: String,
      required: true,
      trim: true,
    },
    minMastery: {
      type: Number,
      min: 0,
      max: 100,
      default: 70,
    },
  },
  { _id: false },
);

const AdaptiveRulesSchema = new Schema(
  {
    minMastery: {
      type: Number,
      min: 0,
      max: 100,
      default: 60,
    },
    skipIfMasteryAbove: {
      type: Number,
      min: 0,
      max: 100,
      default: 95,
    },
    revisionWeight: {
      type: Number,
      min: 0,
      default: 1,
    },
    revisionIntervalDays: {
      type: Number,
      min: 0,
      default: 7,
    },
    recommendedAfter: {
      type: [AdaptivePrerequisiteSchema],
      default: [],
    },
    unlockCriteria: {
      type: Schema.Types.Mixed,
      default: {},
    },
  },
  { _id: false },
);

const ResourceSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    type: {
      type: String,
      enum: [
        "article",
        "problem",
        "project",
        "video",
        "course",
        "documentation",
        "repository",
      ],
      required: true,
    },
    provider: {
      type: String,
      required: true,
      trim: true,
    },
    url: {
      type: String,
      required: true,
      trim: true,
    },
    language: {
      type: String,
      default: "en",
    },
    estimatedReadTime: {
      type: Number,
      min: 0,
      default: 0,
    },
    qualityScore: {
      type: Number,
      min: 0,
      max: 100,
      default: 75,
    },
    isFree: {
      type: Boolean,
      default: true,
    },
  },
  { _id: false },
);

const AiMetadataSchema = new Schema(
  {
    semanticSummary: {
      type: String,
      required: true,
      trim: true,
    },
    embeddingStatus: {
      type: Boolean,
      default: false,
      index: true,
    },
    embeddingVersion: {
      type: Number,
      default: 1,
    },
    chunkVersion: {
      type: Number,
      default: 1,
    },
    lastEmbeddedAt: {
      type: Date,
      default: null,
    },
  },
  { _id: false },
);

const SearchMetadataSchema = new Schema(
  {
    keywords: {
      type: [String],
      default: [],
      index: true,
    },
    aliases: {
      type: [String],
      default: [],
    },
  },
  { _id: false },
);

const ReviewMetadataSchema = new Schema(
  {
    reviewedBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
    lastReviewedAt: {
      type: Date,
      default: null,
    },
  },
  { _id: false },
);

const TaskSchema = new Schema(
  {
    slug: {
      type: String,
      required: true,
      unique: true,
      index: true,
      trim: true,
      lowercase: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },

    topicId: {
      type: Schema.Types.ObjectId,
      ref: "Topic",
      required: true,
      index: true,
    },

    taskType: {
      type: String,
      enum: ["article", "exercise", "project", "video", "course"],
      required: true,
      index: true,
    },
    learningStage: {
      type: String,
      enum: ["introduction", "practice", "revision", "assessment", "capstone","mastery"],
      required: true,
      index: true,
    },
    bloomLevel: {
      type: String,
      enum: ["remember", "understand", "apply", "analyze", "evaluate", "create"],
      required: true,
      index: true,
    },

    learningObjectives: {
      type: [String],
      default: [],
      validate: {
        validator: (items) => items.length > 0,
        message: "Task must have at least one learning objective.",
      },
    },
    concepts: {
      type: [ConceptSchema],
      default: [],
      validate: {
        validator: (items) => items.length > 0,
        message: "Task must have at least one concept.",
      },
    },
    skills: {
      type: [String],
      default: [],
      index: true,
    },

    difficultyLevel: {
      type: String,
      enum: ["easy", "medium", "hard"],
      required: true,
      index: true,
    },
    difficultyScore: {
      type: Number,
      min: 0,
      max: 100,
      required: true,
    },
    cognitiveLoad: {
      type: Number,
      min: 1,
      max: 10,
      required: true,
    },
    estimatedMinutes: {
      type: Number,
      min: 1,
      required: true,
    },

    careerTracks: {
      type: [String],
      enum: ["faang", "product", "startup", "service", "government"],
      default: [],
      index: true,
    },
    adaptiveRules: {
      type: AdaptiveRulesSchema,
      required: true,
      default: () => ({}),
    },

    isInterviewCritical: {
      type: Boolean,
      default: false,
      index: true,
    },
    interviewRoundType: {
      type: String,
      enum: [
        "coding-round",
        "system-design-round",
        "machine-coding-round",
        "behavioral-round",
        "hr-round",
        "general-interview-prep",
        "coding-round-mock",
        null,
      ],
      default: null,
      index: true,
    },
    interviewFrequencyScore: {
      type: Number,
      min: 0,
      max: 1,
      default: null,
      index: true,
    },

    assessmentWeight: {
      type: Number,
      min: 0,
      max: 1,
      required: true,
    },
    masteryThreshold: {
      type: Number,
      min: 0,
      max: 100,
      required: true,
    },

    resource: {
      type: ResourceSchema,
      required: true,
    },

    ai: {
      type: AiMetadataSchema,
      required: true,
      default: () => ({}),
    },

    search: {
      type: SearchMetadataSchema,
      required: true,
      default: () => ({}),
    },

    metadata: {
      type: ReviewMetadataSchema,
      required: true,
      default: () => ({}),
    },

    tags: {
      type: [String],
      default: [],
      index: true,
    },
    isActive: {
      type: Boolean,
      default: true,
      index: true,
    },
    isDeprecated: {
      type: Boolean,
      default: false,
      index: true,
    },
    version: {
      type: Number,
      default: 1,
    },
    contentSource: {
      type: String,
      enum: ["seed", "admin", "ai", "import"],
      default: "seed",
    },
  },
  { timestamps: true },
);

TaskSchema.index({ topicId: 1, isActive: 1, isDeprecated: 1 });
TaskSchema.index({ taskType: 1, learningStage: 1, difficultyLevel: 1 });
TaskSchema.index({ careerTracks: 1, isActive: 1 });
TaskSchema.index({
  isInterviewCritical: 1,
  interviewRoundType: 1,
  interviewFrequencyScore: -1,
});
TaskSchema.index({ "concepts.slug": 1 });
TaskSchema.index({ "resource.provider": 1, "resource.type": 1 });
TaskSchema.index({
  title: "text",
  description: "text",
  "search.keywords": "text",
  "search.aliases": "text",
});

export default mongoose.model("Task", TaskSchema);
