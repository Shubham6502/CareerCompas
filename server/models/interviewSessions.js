const InterviewSessionSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
  sessionType: { type: String, enum: ["behavioral","technical-coding","system-design"], required: true },
  targetCompany: String,
  targetRole: String, // denormalized from CareerProfile at session start
  questions: [{
    questionText: String,
    userAnswerTranscript: String,
    aiScore: Number,
    aiFeedback: String,
    _id: false,
  }], // bounded per session — safe to embed
  overallScore: { type: Number, min: 0, max: 100, default: null },
  durationMinutes: Number,
  status: { type: String, enum: ["in-progress","completed","abandoned"], default: "in-progress" },
  aiModelUsed: String,
  startedAt: { type: Date, default: Date.now },
  completedAt: Date,
  schemaVersion: { type: Number, default: 1 },
});
export default mongoose.model("InterviewSession", InterviewSessionSchema);