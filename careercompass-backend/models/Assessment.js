import mongoose from "mongoose";

const QuestionSchema = new mongoose.Schema(
  {
    question: {
      type: String,
      required: true,
      trim: true,
    },
    options: [
      {
        option: {
          type: String,
          required: true,
          trim: true,
        },
      },
    ],
    answer: {
      type: String,
      required: true,
      trim: true,
    },
  },
  { _id: false }
);

const AssessmentSchema = new mongoose.Schema(
  {
    day: {
      type: Number,
      required: true,
    },
    questions: [QuestionSchema],
  },
  { timestamps: true }
);

export default mongoose.model("Assessment", AssessmentSchema);
