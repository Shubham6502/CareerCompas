import mongoose from "mongoose";
const { Schema } = mongoose;

const learningEventSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
  eventType: { 
    type: String, 
    enum: [
      "ENTRY_ASSESSMENT_COMPLETED", 
      "TASK_COMPLETED", 
      "TOPIC_COMPLETED", 
      "CLUSTER_COMPLETED", 
      "ROADMAP_COMPLETED", 
      "REVISION_COMPLETED", 
      "STREAK_CONTINUED"
    ], 
    required: true,
    index: true 
  },
  metadata: { type: Schema.Types.Mixed, default: {} }
}, { timestamps: true });

export default mongoose.model("LearningEvent", learningEventSchema);
