import mongoose from "mongoose";

const connectDB = async (customURI = null) => {
  try {
    const uri = customURI || process.env.MONGO_URI;

    if (!uri) {
      throw new Error("MONGO_URI is missing");
    }

    await mongoose.connect(uri);
    console.log(" MongoDB Connected:");
  } catch (error) {
    console.error("DB Error:", error);
    process.exit(1);
  }
};

export default connectDB;