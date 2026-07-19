import mongoose from "mongoose";
const { Schema } = mongoose;

const roadmapSchema = new Schema({
  title: { type: String, required: true },
  domain: { type: String, required: true, index: true }, // e.g. "Backend"
  track: { type: String, required: true, index: true },  // e.g. "Beginner"
  description: { type: String, default: "" },
  version: { type: Number, default: 1, required: true },
  isPublished: { type: Boolean, default: false, index: true },
  previousVersion: { type: Schema.Types.ObjectId, ref: "Roadmap", default: null },
  isActive: { type: Boolean, default: true },
  isDeleted: { type: Boolean, default: false, index: true },
  deletedAt: { type: Date, default: null }
}, { timestamps: true });

roadmapSchema.index({ domain: 1, track: 1, version: 1 }, { unique: true });

export default mongoose.model("Roadmap", roadmapSchema);
