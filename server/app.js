import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import rateLimit from "express-rate-limit";

// Routes
import authRoutes from "./modules/auth/auth.routes.js";
import careerProfileRoutes from "./modules/careerProfile/careerProfile.routes.js";
import dailyPlanRoutes from "./modules/daily-plan/dailyPlan.routes.js";
import userTaskProgressRoutes from "./modules/userTaskProgress/userTaskProgress.routes.js";
import learningEngineRoutes from "./modules/learning/learningEngine.routes.js";
import onboarding from "./routes/onboarding.routes.js";
// import dashboard from "./routes/dashboard.routes.js";
// import leaderboard from "./routes/leaderboard.js";
import roadmap from "./routes/roadmap.routes.js";
// import resources from "./routes/resources.routes.js";
// import ProfileRoute from "./routes/profileRoutes.js";
// import JobApplicationRoute from "./routes/jobapplications.route.js";

const app = express();

const API_URL = process.env.API_URL || "http://localhost:5000/api";
// Middleware
app.use(cookieParser());

app.use(
  cors({
     origin:  API_URL, //  exact frontend origin
    credentials: true,
  })
);

app.use(express.json());

// Rate limiter
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  handler: (req, res) => {
    res.status(429).json({
      success: false,
      message: "Too many requests. Please try again later.",
    });
  },
});

// app.use(limiter);

// Routes
// app.use("/api/resources", resources);
// app.use("/api/profile", ProfileRoute);
// app.use("/api/applications", JobApplicationRoute);
app.use("/api/auth", authRoutes);
app.use("/api/career-profile", careerProfileRoutes);
app.use("/api/daily-plan", dailyPlanRoutes);
app.use("/api/user-task-progress", userTaskProgressRoutes);
app.use("/api/learning-engine", learningEngineRoutes);
app.use("/api/onboarding", onboarding);
// app.use("/api/dashboard", dashboard);
// app.use("/api/leaderboard", leaderboard);
app.use("/api/roadmap", roadmap);

app.get("/", (req, res) => {
  res.send("CareerCompass Backend is Running");
});

export default app;