import express from "express";
import cors from "cors";
import dotenv from "dotenv";
dotenv.config();

// import communityRoutes from "./routes/CommunityRoute.js";
import rateLimit from "express-rate-limit";
import connectDB from "./config/db.js";
import cookieParser from "cookie-parser";
import authRoutes from "./routes/auth.routes.js";
import onboarding from "./routes/onboarding.routes.js";
import dashboard from "./routes/dashboard.routes.js";
import leaderboard from "./routes/leaderboard.js";
import roadmap from "./routes/roadmap.routes.js";
import resources from "./routes/resources.routes.js";
import ProfileRoute from "./routes/profileRoutes.js";
import JobApplicationRoute from "./routes/jobapplications.route.js";

const app = express();
app.use(cookieParser());
app.use(
  cors({
    origin:  "https://career-compas-tnoo.vercel.app", //  exact frontend origin
    credentials: true, // allow cookies
  }),
);
app.use(express.json()); // Allow JSON request body
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, 
  handler: (req, res) => {
    res.status(429).json({
      success: false,
      message: "Too many requests. Please try again later.",
    });
  },
});
// Connect to MongoDB
connectDB();

// app.use(limiter); // Apply rate limiting middleware

// Routes
app.use("/api/resources", resources);
app.use("/api/profile", ProfileRoute);
app.use("/api/applications", JobApplicationRoute);
// app.use("/api/communities", communityRoutes); 
app.use("/api/auth", authRoutes);
app.use("/api/onboarding", onboarding); 
app.use("/api/dashboard", dashboard); 
app.use("/api/leaderboard", leaderboard); 
app.use("/api/roadmap", roadmap);
app.get("/", (req, res) => {
  res.send("CareerCompass Backend is Running ");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
