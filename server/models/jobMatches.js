import mongoose from "mongoose";
const { Schema } = mongoose;
const JobMatchSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
  jobId: { type: String, required: true }, // external source ID — see integration note
  jobTitle: { type: String, required: true },
  company: { type: String, required: true },
  jobUrl: { type: String, required: true },
  matchScore: { type: Number, min: 0, max: 100, required: true },
  matchingSkills: [String],
  missingSkills: [String],
  status: { type: String, enum: ["suggested","saved","applied","rejected","interviewing"], required: true },
  matchedAt: { type: Date, default: Date.now },
  schemaVersion: { type: Number, default: 1 },
});
export default mongoose.model("JobMatch", JobMatchSchema);