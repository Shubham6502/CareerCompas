import mongoose from "mongoose";
const { Schema } = mongoose;
const CareerReadinessSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: "User", required: true, unique: true },
  overallReadinessScore: { type: Number, min: 0, max: 100, default: 0 },
  dsaReadiness: { type: Number, min: 0, max: 100, default: 0 },
  systemDesignReadiness: { type: Number, min: 0, max: 100, default: 0 },
  backendReadiness: { type: Number, min: 0, max: 100, default: 0 },
  resumeReadiness: { type: Number, min: 0, max: 100, default: 0 },
  interviewReadiness: { type: Number, min: 0, max: 100, default: 0 },
  trend: { type: String, enum: ["improving","stable","declining"], default: "stable" },
  history: [{ date: Date, score: Number, _id: false }], // bounded — capped at 30 entries in app logic
  calculationVersion: { type: Number, required: true }, // which scoring formula produced this
  lastCalculatedAt: { type: Date, default: Date.now },
  schemaVersion: { type: Number, default: 1 },
});
export default mongoose.model("CareerReadiness", CareerReadinessSchema);