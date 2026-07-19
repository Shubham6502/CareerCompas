import mongoose from "mongoose";
const { Schema } = mongoose;

const adaptiveLearningConfigSchema = new Schema({
  skipThreshold: { type: Number, default: 90 },
  partialThreshold: { type: Number, default: 60 },
  weakTopicThreshold: { type: Number, default: 55 },
  minimumConfidence: { type: Number, default: 70 }
}, { _id: false });

const plannerConfigSchema = new Schema({
  maxTopicsPerDay: { type: Number, default: 3 },
  maxCodingTasks: { type: Number, default: 2 },
  maxReadingTasks: { type: Number, default: 2 }
}, { _id: false });

const featuresConfigSchema = new Schema({
  adaptiveDifficulty: { type: Boolean, default: true },
  revisionEngine: { type: Boolean, default: true },
  aiRecommendations: { type: Boolean, default: false },
  leaderboard: { type: Boolean, default: false },
  gamification: { type: Boolean, default: false }
}, { _id: false });

const engineConfigSchema = new Schema({
  key: { type: String, required: true, unique: true, index: true, default: "default" },
  entryAssessmentQuestions: { type: Number, default: 10 },
  finalAssessmentQuestions: { type: Number, default: 10 },
  passingScore: { type: Number, default: 60 },
  skipScore: { type: Number, default: 90 },
  revisionPolicy: { type: String, enum: ["SM2", "FSRS", "fixed"], default: "SM2" },
  plannerStrategy: { type: String, enum: ["balanced", "focus", "aggressive"], default: "balanced" },
  adaptiveLearning: { type: adaptiveLearningConfigSchema, default: () => ({}) },
  planner: { type: plannerConfigSchema, default: () => ({}) },
  features: { type: featuresConfigSchema, default: () => ({}) }
}, { timestamps: true });

export default mongoose.model("EngineConfig", engineConfigSchema);
