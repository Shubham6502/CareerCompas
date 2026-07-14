import mongoose from "mongoose";

const questionSelectionSchema =
  new mongoose.Schema(
    {
      easy: {
        type: Number,
        default: 3,
        min: 0,
      },

      medium: {
        type: Number,
        default: 5,
        min: 0,
      },

      hard: {
        type: Number,
        default: 2,
        min: 0,
      },
    },
    {
      _id: false,
    }
  );

const assessmentSchema =
  new mongoose.Schema(
    {
      // =========================
      // BASIC INFORMATION
      // =========================

      title: {
        type: String,
        required: true,
        trim: true,
      },

      description: {
        type: String,
        default: "",
      },

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

      // Optional:
      // If this assessment belongs to a specific task
      taskId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Task",
        default: null,
        index: true,
      },

      // =========================
      // ASSESSMENT TYPE
      // =========================

      assessmentType: {
        type: String,
        enum: [
          "topic_quiz",
          "practice",
          "final_assessment",
          "adaptive",
        ],
        default: "topic_quiz",
        index: true,
      },

      // =========================
      // QUESTION SELECTION MODE
      // =========================

      selectionMode: {
        type: String,
        enum: [
          "fixed",
          "random",
          "adaptive",
        ],
        default: "random",
      },

      /*
       * Used when selectionMode = "fixed"
       *
       * Example:
       * questionIds: [
       *   ObjectId("..."),
       *   ObjectId("...")
       * ]
       */
      questionIds: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Question",
        },
      ],

      /*
       * Used when selectionMode = "random"
       *
       * Example:
       * {
       *   easy: 3,
       *   medium: 5,
       *   hard: 2
       * }
       */
      questionSelection: {
        type: questionSelectionSchema,
        default: () => ({
          easy: 3,
          medium: 5,
          hard: 2,
        }),
      },

      // =========================
      // ASSESSMENT CONFIGURATION
      // =========================

      totalQuestions: {
        type: Number,
        required: true,
        default: 10,
        min: 1,
      },

      durationMinutes: {
        type: Number,
        default: 15,
        min: 1,
      },

      passingPercentage: {
        type: Number,
        default: 70,
        min: 0,
        max: 100,
      },

      maxAttempts: {
        type: Number,
        default: 3,
        min: 1,
      },

      // =========================
      // BEHAVIOR
      // =========================

      shuffleQuestions: {
        type: Boolean,
        default: true,
      },

      shuffleOptions: {
        type: Boolean,
        default: true,
      },

      showExplanationAfterAnswer: {
        type: Boolean,
        default: false,
      },

      showExplanationAfterCompletion: {
        type: Boolean,
        default: true,
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

// Common lookup
assessmentSchema.index({
  topicId: 1,
  assessmentType: 1,
  isActive: 1,
});

const Assessment = mongoose.model(
  "Assessment",
  assessmentSchema
);

export default Assessment;