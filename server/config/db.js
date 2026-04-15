import mongoose from "mongoose";

const connectDB=async()=>{
    try {
         await mongoose.connect(process.env.MONGO_URI)
         
           .then(() => console.log("MongoDB Connected Successfully"))
           .catch((err) => console.log("MongoDB Connection Error:", err));
    } catch (error) {
        console.error("Error connecting to MongoDB:", error);
        process.exit(1); // Exit with failure
    }
}

export default connectDB;