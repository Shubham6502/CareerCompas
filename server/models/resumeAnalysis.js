import mongoose from "mongoose";
const { Schema } = mongoose;
const ResumeAnalysisSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
  resumeVersion: { type: Number, required: true },
  fileUrl: { type: String, required: true }, // pointer to object storage, never binary in Mongo
  atsScore: { type: Number, min: 0, max: 100, required: true },
  extractedSkills: [String],
  missingKeywords: [String],
  relatedTopicSlugs: [String], // where missingKeywords maps onto existing Topics — a genuine integration point
  strengths: [String],
  improvementSuggestions: [String],
  targetRoleAtAnalysis: { type: String, required: true }, // denormalized from CareerProfile at analysis time
  aiModelUsed: { type: String, required: true }, // e.g. "gemini-1.5-pro" — for auditability/reproducibility
  analyzedAt: { type: Date, default: Date.now, index: true },
  schemaVersion: { type: Number, default: 1 },
});
export default mongoose.model("ResumeAnalysis", ResumeAnalysisSchema);