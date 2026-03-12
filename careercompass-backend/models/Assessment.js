import mongoose from "mongoose";

const QuestionSchema = new mongoose.Schema(
  {
    question: {
      type: String,
      required: true,
      trim: true,
    },
     options: [String],
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
roadmapSchema.index({ domain: 1 });
roadmapSchema.index({day:1})
export default mongoose.model("Assessment", AssessmentSchema);
