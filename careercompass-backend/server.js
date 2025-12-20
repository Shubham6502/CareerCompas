import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
dotenv.config();
import userRoutes from "./routes/userRoutes.js";
import userTest from "./routes/userTest.js"
import TestRoute from "./routes/TestRoute.js"
import roadmapRoutes from "./routes/RoadmapRoute.js";




const app = express();

// Middlewares
app.use(cors());                // Allow frontend to connect
app.use(express.json());        // Allow JSON request body

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)

  .then(() => console.log("MongoDB Connected Successfully"))
  .catch((err) => console.log("MongoDB Connection Error:", err));
  


// Routes
app.use("/api/users", userRoutes);
app.use("/api/userTest", userTest);
app.use("/api/test",TestRoute);
app.use("/api/roadmap",roadmapRoutes);

app.get("/", (req, res) => {
  res.send("CareerCompass Backend is Running ");
});



const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
