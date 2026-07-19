import mongoose from "mongoose";
const { Schema } = mongoose;
const topicSchema = new mongoose.Schema(

{
_id: {
  type: mongoose.Schema.Types.ObjectId
},
  // Identity
  slug: String,
  displayName: String,
  shortName: String,

  // Classification
  domain: String,              // engineering
  category: String,            // backend
  subCategory: String,         // nodejs
  parentTopic: mongoose.Schema.Types.ObjectId,

  // Learning Graph
  prerequisites: [{
      topicId: mongoose.Schema.Types.ObjectId,
      minMastery: Number,
      minAssessmentScore: Number
  }],

  nextTopics:[{
      topicId:mongoose.Schema.Types.ObjectId,
      edgeWeight:Number
  }],

  relatedTopics:[mongoose.Schema.Types.ObjectId],

  // Learning
  description: String,
  learningObjectives:[String],
  keyConcepts:[String],
  commonMistakes:[String],

  // Difficulty
  difficultyScore:Number,
  importanceScore:Number,

  // Interview
  interviewWeight:Number,
  interviewFrequency:Number,
  isCoreConcept:Boolean,
  isInterviewCritical:Boolean,

  // AI
  semanticSummary:String,
  keywords:[String],

  // RAG
  embeddingStatus:{
      isEmbedded:Boolean,
      embeddingVersion:Number,
      embeddedAt:Date
  },

  // Metadata
  estimatedLearningHours:Number,

  createdAt:{
      type:Date,
      default:Date.now},
  updatedAt:{
      type:Date,
      default:Date.now},
  isDeleted: {
      type: Boolean,
      default: false,
      index: true
  },
  deletedAt: {
      type: Date,
      default: null
  }
}
);
export default mongoose.model("Topic", topicSchema);