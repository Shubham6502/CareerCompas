import request from "supertest";
import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";
import connectDB from "../config/db.js";
import User from "../models/user.js";
import CareerProfile from "../modules/careerProfile/careerProfile.model.js";
import Roadmap from "../modules/roadmap/roadmap.model.js";
import LearningCluster from "../modules/learning/learningCluster.model.js";
import RoadmapCluster from "../modules/roadmap/roadmapCluster.model.js";
import UserClusterProgress from "../modules/progress/userClusterProgress.model.js";

let app;
let mongo;
let token;
let userId;
let mockRoadmap;
let mockCluster;

beforeAll(async () => {
  mongo = await MongoMemoryServer.create();
  const uri = mongo.getUri();
  await connectDB(uri);
  app = (await import("../app.js")).default;

  // 1. Register User
  const registerRes = await request(app)
    .post("/api/auth/register")
    .send({
      displayName: "Jane Doe",
      email: "jane@example.com",
      password: "password123"
    });
  
  token = registerRes.body.user.token;
  userId = new mongoose.Types.ObjectId(registerRes.body.user.id || registerRes.body.user._id);

  // 2. Mock roadmap/cluster
  mockCluster = await LearningCluster.create({
    name: "Javascript Foundations",
    clusterKey: "js-foundations",
    topicsIncluded: []
  });

  mockRoadmap = await Roadmap.create({
    title: "Frontend Development",
    domain: "Frontend",
    track: "Beginner",
    version: 1,
    isPublished: true,
    isActive: true
  });

  await RoadmapCluster.create({
    roadmapId: mockRoadmap._id,
    clusterId: mockCluster._id,
    order: 1
  });
});

afterAll(async () => {
  await mongoose.connection.close();
  await mongo.stop();
});

describe("Dashboard Controller Integration Tests", () => {
  
  it("1. GET /api/dashboard returns 401 when token is missing", async () => {
    const res = await request(app).get("/api/dashboard");
    expect(res.statusCode).toBe(401);
  });

  it("2. GET /api/dashboard returns ONBOARDING_REQUIRED status when profile not setup", async () => {
    const res = await request(app)
      .get("/api/dashboard")
      .set("Cookie", [`token=${token}`]);

    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual({ action: "ONBOARDING_REQUIRED" });
  });

  it("3. GET /api/dashboard returns ENTRY_ASSESSMENT status when onboarded and entry pending", async () => {
    // Onboard user
    await CareerProfile.create({
      userId,
      targetRole: "Frontend Engineer",
      experienceLevel: "student",
      studyHoursPerDay: 2,
      onboardingCompleted: true,
      activeRoadmapId: mockRoadmap._id
    });

    // Create progress
    await UserClusterProgress.create({
      userId,
      roadmapId: mockRoadmap._id,
      clusterId: mockCluster._id,
      status: "entry_assessment",
      clusterVersion: 1
    });

    const res = await request(app)
      .get("/api/dashboard")
      .set("Cookie", [`token=${token}`]);

    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual({ action: "ENTRY_ASSESSMENT" });
  });
});
