import mongoose from "mongoose";
const { Schema } = mongoose;
const ResourceSchema = new Schema(
  {
    slug: {
      type: String,
      required: true,
      unique: true,
    },
    title: {
      type: String,
      required: true,
    },
    url: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      enum: ["article", "video", "course", "tool", "practice-set"],
      required: true,
    },
    provider: {
      type: String,
      required: true,
    }, // "LeetCode", "GeeksforGeeks", "YouTube", "freeCodeCamp"
    topicIds: [
      {
        type: Schema.Types.ObjectId,
        ref: "Topic",
        index: true,
      },
    ],
    durationMinutes: {
      type: Number,
      default: null,
    },
    qualityScore: {
      type: Number,
      min: 1,
      max: 10,
      default: 7,
    }, // admin-curated
    isFree: {
      type: Boolean,
      default: true,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    isDeprecated: {
      type: Boolean,
      default: false,
    },
    schemaVersion: {
      type: Number,
      default: 1,
    },
  },
  { timestamps: true },
);

export default mongoose.model("Resource", ResourceSchema);
