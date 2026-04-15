import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    clerkId: {
        type: String,
        required: true,
        unique: true
    },
    name: String,
    email: {
        type: String,
        required: true
    },
      hasTakenTest: { type: Boolean, default: false },
      domain:{
        type:String,
      }
});

export default mongoose.model("User", userSchema);
