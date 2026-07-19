import mongoose from "mongoose";
const { Schema } = mongoose;

const assessmentAttemptSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
  roadmapId: { type: Schema.Types.ObjectId, ref: "Roadmap", required: true },
  clusterId: { type: Schema.Types.ObjectId, ref: "LearningCluster", required: true },
  roadmapVersion: { type: Number, required: true },
  clusterVersion: { type: Number, required: true },
  assessmentType: { type: String, enum: ["entry_assessment", "final_assessment"], required: true },
  questionIds: [{ type: Schema.Types.ObjectId, ref: "Question" }],
  answers: [{
    questionId: { type: Schema.Types.ObjectId, ref: "Question", required: true },
    selectedAnswer: { type: Schema.Types.Mixed, required: true },
    isCorrect: { type: Boolean, required: true },
    timeTakenSeconds: { type: Number, required: true }
  }],
  score: { type: Number, required: true },
  percentage: { type: Number, required: true },
  timeTaken: { type: Number, required: true }, // in seconds
  topicPerformance: { type: Map, of: Number },
  difficultyDistribution: { type: Map, of: Number },
  attemptNumber: { type: Number, required: true },
  startedAt: { type: Date, required: true },
  submittedAt: { type: Date, required: true }
}, { timestamps: true });

export default mongoose.model("AssessmentAttempt", assessmentAttemptSchema);
