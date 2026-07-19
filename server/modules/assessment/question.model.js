import mongoose from "mongoose";

const optionSchema = new mongoose.Schema(
  {
    id: {
      type: String,
      required: true,
    },
    text: {
      type: String,
      required: true,
      trim: true,
    },
  },
  { _id: false }
);

const referenceSchema = new mongoose.Schema(
  {
    title: String,
    url: String,
    type: {
      type: String,
      enum: [
        "article",
        "video",
        "documentation",
        "book",
        "leetcode",
        "youtube",
        "other",
      ],
      default: "article",
    },
  },
  { _id: false }
);

const questionSchema = new mongoose.Schema(
  {
    // ============================
    // ASSESSMENT
    // ============================

    assessmentGroup: {
      type: String,
      required: true,
      index: true,
    },

    title: {
      type: String,
      required: true,
      trim: true,
    },

    question: {
      type: String,
      required: true,
      trim: true,
    },

    // ============================
    // QUESTION TYPE
    // ============================

    questionType: {
      type: String,
      enum: [
        "mcq",
        "multiple-select",
        "true-false",
        "fill-blank",
        "coding",
        "short-answer",
      ],
      required: true,
      index: true,
    },

    options: {
      type: [optionSchema],
      default: [],
    },

    correctAnswer: {
      type: mongoose.Schema.Types.Mixed,
      required: true,
    },

    // ============================
    // DIFFICULTY
    // ============================

    difficulty: {
      type: String,
      enum: ["easy", "medium", "hard"],
      required: true,
      index: true,
    },

    estimatedTimeSeconds: {
      type: Number,
      default: 90,
      min: 10,
    },

    points: {
      type: Number,
      default: 5,
      min: 1,
    },

    negativeMarks: {
      type: Number,
      default: 0,
      min: 0,
    },

    // ============================
    // LEARNING METADATA
    // ============================

    bloomLevel: {
      type: String,
      enum: [
        "remember",
        "understand",
        "apply",
        "analyze",
        "evaluate",
        "create",
      ],
      required: true,
    },

    learningObjective: {
      type: String,
      required: true,
      trim: true,
    },

    interviewFrequency: {
      type: String,
      enum: [
        "low",
        "medium",
        "high",
        "very-high",
      ],
      default: "medium",
    },

    topicSlugs: {
      type: [String],
      required: true,
      index: true,
    },

    conceptTags: {
      type: [String],
      default: [],
      index: true,
    },

    prerequisites: {
      type: [String],
      default: [],
    },

    companyTags: {
      type: [String],
      default: [],
      index: true,
    },

    // ============================
    // ANSWER
    // ============================

    explanation: {
      type: String,
      required: true,
      trim: true,
    },

    whyCorrect: {
      type: String,
      default: "",
    },

    whyIncorrect: {
      type: Map,
      of: String,
      default: {},
    },

    hints: {
      type: [String],
      default: [],
    },

    commonMistakes: {
      type: [String],
      default: [],
    },

    references: {
      type: [referenceSchema],
      default: [],
    },

    // ============================
    // AI METADATA
    // ============================

    aiMetadata: {
      generatedBy: {
        type: String,
        default: "Claude",
      },

      model: {
        type: String,
        default: "",
      },

      promptVersion: {
        type: String,
        default: "v1",
      },

      generationDate: {
        type: Date,
        default: Date.now,
      },

      reviewed: {
        type: Boolean,
        default: false,
      },

      reviewedBy: {
        type: String,
        default: "",
      },

      version: {
        type: Number,
        default: 1,
      },
    },

    // ============================
    // STATUS
    // ============================

    isActive: {
      type: Boolean,
      default: true,
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

// ============================
// Indexes
// ============================

questionSchema.index({
  assessmentGroup: 1,
  difficulty: 1,
  questionType: 1,
  isActive: 1,
});

questionSchema.index({
  topicSlugs: 1,
  difficulty: 1,
});

questionSchema.index({
  companyTags: 1,
  difficulty: 1,
});

questionSchema.index({
  question: "text",
  title: "text",
  learningObjective: "text",
  conceptTags: "text",
});

export default mongoose.model("Question", questionSchema);