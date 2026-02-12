import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
dotenv.config();
import userRoutes from "./routes/userRoutes.js";
import userTest from "./routes/userTest.js"
import TestRoute from "./routes/TestRoute.js"
import roadmapRoutes from "./routes/RoadmapRoute.js";
import progressRoutes from "./routes/ProgressRoutes.js";
import ResourceRoute from "./routes/ResourceRoute.js"
import DailyAssessment from "./routes/DailyAssessmentRoute.js";
import ProfileRoute from "./routes/ProfileRoutes.js"
import rateLimit from "express-rate-limit";



const app = express();
app.use(
  cors({
    origin: "http://localhost:5173", //  exact frontend origin
    credentials: true,              // allow cookies
  })
);
               // Allow frontend to connect
app.use(express.json());     // Allow JSON request body
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max:100, // limit each IP to 100 requests per window
  handler: (req, res) => {
    res.status(429).json({
      success: false,
      message: "Too many requests. Please try again later."
    })
  }
});
// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)

  .then(() => console.log("MongoDB Connected Successfully"))
  .catch((err) => console.log("MongoDB Connection Error:", err));
  


app.use(limiter); // Apply rate limiting middleware
// Routes
app.use("/api/users", userRoutes);
app.use("/api/userTest", userTest);
app.use("/api/test",TestRoute);
app.use("/api/roadmap",roadmapRoutes);
app.use("/api/progress",progressRoutes);
app.use("/api/Resource",ResourceRoute)
app.use("/api/DailyAssessment",DailyAssessment)
app.use("/api/profile",ProfileRoute);


app.get("/", (req, res) => {
  res.send("CareerCompass Backend is Running ");
});



const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
