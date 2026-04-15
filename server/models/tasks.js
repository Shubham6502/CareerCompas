import mongoose from "mongoose";

const taskSchema = new mongoose.Schema({

  userId: {
    type: String,       // "ALL" = global template, or specific userId
    default: "ALL",
    index: true
  },

  category: {
    type: String,       // "dsa", "backend", "frontend", etc.
    required: true,
    index: true
  },

  difficulty: {
    type: String,
    enum: ["beginner", "intermediate", "advanced"],
    required: true,
    index: true
  },

  targetTypes: [{
    type: String,
    enum: ["faang", "product", "startup", "service", "government"],
  }],

  title:       String,
  description: String,
  resourceUrl: String,

  type: {
    type: String,
    enum: ["article", "video", "exercise", "quiz", "project", "course"]
  },

  estimatedMinutes: Number,

  difficultyLevel: {
    type: String,
    enum: ["easy", "medium", "hard"]
  },

  priority: {
    type: Number,       // 1 = must-do, 5 = optional
    default: 5,
    index: true
  },

 
  order: {
    type: Number,
    required: true,
    index: true
  },


}, { timestamps: true });


taskSchema.index({
  category:    1,
  difficulty:  1,
  targetTypes: 1,
  order:       1,       // ← order replaces random sort
  priority:    1,
  userId:      1
});

export default mongoose.model("Task", taskSchema);