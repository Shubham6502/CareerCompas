import mongoose from "mongoose";

const optionSchema = new mongoose.Schema(
  {
    id: {
      type: String,
      required: true,
      // Example: opt_a, opt_b, opt_c, opt_d
    },

    text: {
      type: String,
      required: true,
      trim: true,
    },
  },
  {
    _id: false,
  }
);

const questionSchema = new mongoose.Schema(
  {
    // =========================
    // RELATIONSHIPS
    // =========================

    topicId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Topic",
      required: true,
      index: true,
    },

    skillId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Skill",
      index: true,
    },

    // =========================
    // QUESTION CONTENT
    // =========================

    questionType: {
      type: String,
      enum: [
        "single_choice",
        "multiple_choice",
        "true_false",
        "code_output",
        "code_debugging",
        "scenario_based",
        "short_answer",
      ],
      required: true,
      index: true,
    },

    question: {
      type: String,
      required: true,
      trim: true,
    },

    codeSnippet: {
      type: String,
      default: null,
    },

    programmingLanguage: {
      type: String,
      default: null,
    },

    options: {
      type: [optionSchema],
      default: [],
    },

    // Store option IDs, not array indexes
    // Example: ["opt_b"]
    correctAnswer: {
      type: [String],
      required: true,
    },

    explanation: {
      type: String,
      required: true,
      trim: true,
    },

    // =========================
    // LEARNING METADATA
    // =========================

    concept: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },

    subConcepts: {
      type: [String],
      default: [],
    },

    difficulty: {
      type: String,
      enum: ["easy", "medium", "hard"],
      required: true,
      index: true,
    },

    cognitiveLevel: {
      type: String,
      enum: [
        "remember",
        "understand",
        "apply",
        "analyze",
      ],
      required: true,
    },

    tags: {
      type: [String],
      default: [],
    },

    estimatedTimeSeconds: {
      type: Number,
      default: 60,
      min: 10,
    },

    // =========================
    // QUESTION SOURCE
    // =========================

    source: {
      type: {
        type: String,
        enum: [
          "manual",
          "ai_generated",
          "rag_generated",
        ],
        default: "manual",
      },

      model: {
        type: String,
        default: null,
      },

      sourceDocumentIds: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: "KnowledgeDocument",
        },
      ],
    },

    // =========================
    // AI METADATA
    // =========================

    aiMetadata: {
      generationPromptVersion: {
        type: String,
        default: null,
      },

      confidenceScore: {
        type: Number,
        min: 0,
        max: 1,
        default: null,
      },

      verified: {
        type: Boolean,
        default: false,
      },
    },

    // =========================
    // STATUS
    // =========================

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

// Fast assessment question selection
questionSchema.index({
  topicId: 1,
  difficulty: 1,
  questionType: 1,
  isActive: 1,
});

// Fast concept-based retrieval
questionSchema.index({
  topicId: 1,
  concept: 1,
  difficulty: 1,
});

// Basic text search
questionSchema.index({
  question: "text",
  concept: "text",
  tags: "text",
});

const Question = mongoose.model(
  "Question",
  questionSchema
);

export default Question;