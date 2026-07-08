import mongoose from "mongoose";

const AssessmentResultSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  assessmentId: { type: mongoose.Schema.Types.ObjectId, required: true }, // see gap note below
  topicId: { type: mongoose.Schema.Types.ObjectId, ref: "Topic", required: true },
  score: { type: Number, min: 0, max: 100, required: true },
  totalQuestions: { type: Number, required: true },
  correctAnswers: { type: Number, required: true },
  timeTakenSeconds: { type: Number, required: true },
  answers: [{
    questionId: mongoose.Schema.Types.ObjectId,
    selectedAnswer: String,
    isCorrect: Boolean,
    timeTakenSeconds: Number,
    _id: false,
  }], // bounded by question count — safe to embed
  passed: { type: Boolean, required: true },
  attemptNumber: { type: Number, required: true },
  submittedAt: { type: Date, required: true, index: true },
  schemaVersion: { type: Number, default: 1 },
});
// No updatedAt needed — this document is never updated after creation.
export default mongoose.model("AssessmentResult", AssessmentResultSchema);