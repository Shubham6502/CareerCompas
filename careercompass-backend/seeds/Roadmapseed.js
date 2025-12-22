import mongoose from "mongoose";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

import Roadmap from "../models/Roadmap.js";
import roadmapData from "./RoadmapData.js";

/* ---------- ENV SETUP (IMPORTANT) ---------- */
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, "../.env") });

const MONGO_URI = process.env.MONGO_URI;

/* ---------- SAFETY CHECK ---------- */
if (!MONGO_URI) {
  console.error
  process.exit(1);
}

/* ---------- SEED FUNCTION ---------- */
const seedRoadmap = async () => {
  try {
    await mongoose.connect(MONGO_URI);
    console.log(" MongoDB connected");

    await Roadmap.deleteMany({ domain: roadmapData.domain });

   
    await Roadmap.create(roadmapData);
    console.log(" Roadmap seeded successfully");

    process.exit(0);
  } catch (err) {
    console.error(" Seeder failed:", err);
    process.exit(1);
  }
};

seedRoadmap();
