import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";
import connectDB from "../config/db.js";
import User from "../models/user.js";
import CareerProfile from "../modules/careerProfile/careerProfile.model.js";
import Roadmap from "../modules/roadmap/roadmap.model.js";
import LearningCluster from "../modules/learning/learningCluster.model.js";
import RoadmapCluster from "../modules/roadmap/roadmapCluster.model.js";
import UserClusterProgress from "../modules/progress/userClusterProgress.model.js";
import Topic from "../modules/topics/topics.model.js";
import Task from "../modules/task/tasks.model.js";
import RevisionSchedule from "../modules/revision/revisionSchedule.model.js";
import AssessmentAttempt from "../modules/assessment/assessmentAttempt.model.js";
import TopicMastery from "../modules/topic-mastery/topicMastery.model.js";
import LearningSession from "../modules/roadmap/learningSession.model.js";
import DailyPlan from "../modules/daily-plan/dailyPlan.model.js";
import app from "../app.js";
import * as dashboardService from "../modules/dashboard/dashboard.service.js";

let mongo;
let userId;
let mockRoadmap;
let mockCluster;
let mockTopic;

beforeAll(async () => {
  mongo = await MongoMemoryServer.create();
  const uri = mongo.getUri();
  await connectDB(uri);

  // Setup generic test data
  const testUserId = new mongoose.Types.ObjectId();
  const testUser = await User.create({
    _id: testUserId,
    displayName: "Dashboard Tester",
    email: "tester@example.com",
    passwordHash: "dummy",
    authProvider: "local",
    firstName: "Dash",
    lastName: "Tester"
  });
  userId = testUser._id;

  mockTopic = await Topic.create({
    _id: new mongoose.Types.ObjectId(),
    slug: "variables-101",
    displayName: "Variables 101",
    domain: "Software",
    category: "JS"
  });

  mockCluster = await LearningCluster.create({
    _id: new mongoose.Types.ObjectId(),
    name: "Javascript Fundamentals",
    clusterKey: "js-fundamentals",
    topicsIncluded: [{ topicId: mockTopic._id, slug: mockTopic.slug, displayName: mockTopic.displayName }]
  });

  mockRoadmap = await Roadmap.create({
    _id: new mongoose.Types.ObjectId(),
    title: "Software Engineer Roadmap",
    domain: "Software",
    track: "Beginner",
    version: 1,
    isPublished: true
  });

  await RoadmapCluster.create({
    _id: new mongoose.Types.ObjectId(),
    roadmapId: mockRoadmap._id,
    clusterId: mockCluster._id,
    order: 1
  });
});

afterAll(async () => {
  await mongoose.connection.close();
  await mongo.stop();
});

afterEach(async () => {
  // Clear dynamic dynamic data tables
  await CareerProfile.deleteMany({});
  await UserClusterProgress.deleteMany({});
  await RevisionSchedule.deleteMany({});
  await AssessmentAttempt.deleteMany({});
  await TopicMastery.deleteMany({});
  await LearningSession.deleteMany({});
  await DailyPlan.deleteMany({});
});

describe("Dashboard Service Tests", () => {
  
  it("1. Returns ONBOARDING_REQUIRED when profile does not exist or onboardingCompleted is false", async () => {
    const res = await dashboardService.getDashboardData(userId);
    expect(res).toEqual({ action: "ONBOARDING_REQUIRED" });

    await CareerProfile.create({
      userId,
      targetRole: "Software Engineer",
      experienceLevel: "student",
      studyHoursPerDay: 2,
      onboardingCompleted: false
    });

    const res2 = await dashboardService.getDashboardData(userId);
    expect(res2).toEqual({ action: "ONBOARDING_REQUIRED" });
  });

  it("2. Returns NO_ROADMAP when profile is onboarded but has no activeRoadmapId and no default exists", async () => {
    // Unpublish mockRoadmap to ensure no default fallback is found
    await Roadmap.updateOne({ _id: mockRoadmap._id }, { $set: { isPublished: false } });

    await CareerProfile.create({
      userId,
      targetRole: "Software Engineer",
      experienceLevel: "student",
      studyHoursPerDay: 2,
      onboardingCompleted: true,
      activeRoadmapId: null
    });

    const res = await dashboardService.getDashboardData(userId);
    expect(res).toEqual({ action: "NO_ROADMAP" });

    // Restore mockRoadmap publication status
    await Roadmap.updateOne({ _id: mockRoadmap._id }, { $set: { isPublished: true } });
  });

  it("3. Returns ENTRY_ASSESSMENT when user cluster progress status is entry_assessment", async () => {
    await CareerProfile.create({
      userId,
      targetRole: "Software Engineer",
      experienceLevel: "student",
      studyHoursPerDay: 2,
      onboardingCompleted: true,
      activeRoadmapId: mockRoadmap._id
    });

    await UserClusterProgress.create({
      userId,
      roadmapId: mockRoadmap._id,
      clusterId: mockCluster._id,
      status: "entry_assessment",
      clusterVersion: 1
    });

    const res = await dashboardService.getDashboardData(userId);
    expect(res).toEqual({ action: "ENTRY_ASSESSMENT" });
  });

  it("4. Returns ROADMAP_COMPLETED when all progress status is completed/skipped and no active progress remains", async () => {
    await CareerProfile.create({
      userId,
      targetRole: "Software Engineer",
      experienceLevel: "student",
      studyHoursPerDay: 2,
      onboardingCompleted: true,
      activeRoadmapId: mockRoadmap._id
    });

    await UserClusterProgress.create({
      userId,
      roadmapId: mockRoadmap._id,
      clusterId: mockCluster._id,
      status: "completed",
      clusterVersion: 1
    });

    const res = await dashboardService.getDashboardData(userId);
    expect(res).toEqual({ action: "ROADMAP_COMPLETED" });
  });

  it("5. Returns active learning DTO with correct statistics and revision context", async () => {
    await CareerProfile.create({
      userId,
      targetRole: "Software Engineer",
      experienceLevel: "student",
      studyHoursPerDay: 2,
      onboardingCompleted: true,
      activeRoadmapId: mockRoadmap._id,
      currentStreak: 5
    });

    await UserClusterProgress.create({
      userId,
      roadmapId: mockRoadmap._id,
      clusterId: mockCluster._id,
      status: "learning",
      clusterVersion: 1
    });

    const taskMock = await Task.create({
      _id: new mongoose.Types.ObjectId(),
      slug: "js-reading-task",
      title: "Scope rules",
      description: "Scope details",
      topicId: mockTopic._id,
      taskType: "article",
      learningStage: "introduction",
      bloomLevel: "remember",
      difficultyLevel: "easy",
      difficultyScore: 10,
      cognitiveLoad: 2,
      estimatedMinutes: 20,
      careerTracks: ["product"],
      assessmentWeight: 0.5,
      masteryThreshold: 70,
      resource: { title: "MDN", type: "article", provider: "Mozilla", url: "https://mdn.com" },
      learningObjectives: ["Test objectives"],
      concepts: [{ name: "JS Variables", slug: "js-vars", weight: 0.8, difficulty: "easy" }],
      ai: { semanticSummary: "Test semantic" }
    });

    await DailyPlan.create({
      userId,
      roadmapId: mockRoadmap._id,
      clusterId: mockCluster._id,
      planDate: new Date(new Date().setUTCHours(0, 0, 0, 0)),
      studyHoursBudget: 2,
      status: "active",
      tasks: [{ taskId: taskMock._id, taskSlug: taskMock.slug, reason: "new-topic", completed: false }]
    });

    // Create a revision schedule due in past
    await RevisionSchedule.create({
      userId,
      topicId: mockTopic._id,
      clusterId: mockCluster._id,
      revisionNumber: 1,
      dueDate: new Date(Date.now() - 3600000),
      completed: false,
      interval: 1
    });

    const res = await dashboardService.getDashboardData(userId);
    expect(res.success).toBe(true);
    expect(res.user.firstName).toBe("Dash");
    expect(res.roadmap.title).toBe("Software Engineer Roadmap");
    expect(res.cluster.name).toBe("Javascript Fundamentals");
    expect(res.progress.status).toBe("learning");
    expect(res.todayPlan.totalTasks).toBe(1);
    expect(res.todayPlan.estimatedRemainingMinutes).toBe(20);
    expect(res.revision.dueCount).toBe(1);
    expect(res.analytics.streak).toBe(5);
  });
});
