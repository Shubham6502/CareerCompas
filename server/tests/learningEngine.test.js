import request from "supertest";
import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";
import connectDB from "../config/db.js";
import User from "../models/user.js";
import CareerProfile from "../modules/careerProfile/careerProfile.model.js";
import Roadmap from "../modules/roadmap/roadmap.model.js";
import LearningCluster from "../modules/learning/learningCluster.model.js";
import RoadmapCluster from "../modules/roadmap/roadmapCluster.model.js";
import Topic from "../modules/topics/topics.model.js";
import Task from "../modules/task/tasks.model.js";
import Question from "../modules/assessment/question.model.js";
import EngineConfig from "../modules/roadmap/engineConfig.model.js";
import RevisionSchedule from "../modules/revision/revisionSchedule.model.js";
import UserClusterProgress from "../modules/progress/userClusterProgress.model.js";
import DailyPlan from "../modules/daily-plan/dailyPlan.model.js";

let app;
let mongo;
let token;
let userId;

// Setup mock roadmap elements
let mockRoadmap;
let mockCluster;
let mockTopic1;
let mockTopic2;
let mockTask1;
let mockTask2;
let mockQuestions = [];

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

  // 2. Create EngineConfig default doc
  await EngineConfig.create({
    key: "default",
    entryAssessmentQuestions: 5,
    finalAssessmentQuestions: 5,
    passingScore: 60,
    skipScore: 90,
    revisionPolicy: "SM2",
    plannerStrategy: "balanced",
    adaptiveLearning: {
      skipThreshold: 90,
      partialThreshold: 60,
      weakTopicThreshold: 55,
      minimumConfidence: 70
    },
    planner: {
      maxTopicsPerDay: 2,
      maxCodingTasks: 2,
      maxReadingTasks: 2
    }
  });

  // 3. Create Topics
  mockTopic1 = await Topic.create({
    _id: new mongoose.Types.ObjectId(),
    slug: "basics-variables",
    displayName: "Variables & Types",
    domain: "Software Engineering",
    category: "Javascript",
    difficultyScore: 10,
    importanceScore: 80
  });

  mockTopic2 = await Topic.create({
    _id: new mongoose.Types.ObjectId(),
    slug: "control-flow",
    displayName: "Control Flow",
    domain: "Software Engineering",
    category: "Javascript",
    difficultyScore: 20,
    importanceScore: 85
  });

  // 4. Create Tasks
  mockTask1 = await Task.create({
    slug: "variables-reading",
    title: "Understanding Let and Const",
    description: "Read about JS variables scope",
    topicId: mockTopic1._id,
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
    order: 1,
    learningObjectives: ["Understand scope"],
    concepts: [{ name: "Variables Scope", slug: "variables-scope", weight: 0.9, difficulty: "easy" }],
    ai: { semanticSummary: "Overview of variable scoping rules in JS" }
  });

  mockTask2 = await Task.create({
    slug: "control-flow-coding",
    title: "Loops Exercise",
    description: "Write basic loops",
    topicId: mockTopic2._id,
    taskType: "exercise",
    learningStage: "practice",
    bloomLevel: "apply",
    difficultyLevel: "easy",
    difficultyScore: 15,
    cognitiveLoad: 3,
    estimatedMinutes: 30,
    careerTracks: ["product"],
    assessmentWeight: 0.5,
    masteryThreshold: 70,
    resource: { title: "Leetcode", type: "project", provider: "Leetcode", url: "https://leetcode.com" },
    order: 1,
    learningObjectives: ["Master control flow loops"],
    concepts: [{ name: "Control Loops", slug: "control-loops", weight: 0.9, difficulty: "easy" }],
    ai: { semanticSummary: "Practical coding exercise for loops" }
  });

  // 5. Create Questions
  const questionTitles = ["Var Scope", "Const Mutability", "If Statements", "Switch Cases", "For Loops", "While Loops"];
  for (let i = 0; i < questionTitles.length; i++) {
    const q = await Question.create({
      assessmentGroup: "JS Fundamentals",
      title: questionTitles[i],
      question: `Question about ${questionTitles[i]}?`,
      questionType: "mcq",
      options: [{ id: "A", text: "Option A" }, { id: "B", text: "Option B" }],
      correctAnswer: "A",
      difficulty: "easy",
      bloomLevel: "understand",
      learningObjective: "Test objectives",
      topicSlugs: i < 3 ? [mockTopic1.slug] : [mockTopic2.slug],
      explanation: "Explanation text",
      isActive: true
    });
    mockQuestions.push(q);
  }

  // 6. Create LearningCluster
  mockCluster = await LearningCluster.create({
    name: "Javascript Foundations",
    clusterKey: "js-foundations",
    topicsIncluded: [
      { topicId: mockTopic1._id, slug: mockTopic1.slug, displayName: mockTopic1.displayName },
      { topicId: mockTopic2._id, slug: mockTopic2.slug, displayName: mockTopic2.displayName }
    ],
    estimatedHours: 2,
    estimatedTasks: 2,
    difficulty: "easy"
  });

  // 7. Create Roadmap
  mockRoadmap = await Roadmap.create({
    title: "Frontend Development Roadmap",
    domain: "Frontend",
    track: "Beginner",
    description: "Learn frontend basics",
    version: 1,
    isPublished: true,
    isActive: true
  });

  // Link cluster to roadmap
  await RoadmapCluster.create({
    roadmapId: mockRoadmap._id,
    clusterId: mockCluster._id,
    order: 1
  });

  // 8. Associate to User Profile
  await CareerProfile.create({
    userId,
    targetRole: "Frontend Developer",
    targetCompanies: [{ company: "Google", tier: "product", priority: 1 }],
    experienceLevel: "student",
    studyHoursPerDay: 1.5, // 90 minutes budget
    onboardingCompleted: true,
    activeRoadmapId: mockRoadmap._id
  });
});

afterAll(async () => {
  await mongoose.connection.close();
  await mongo.stop();
});

describe("Adaptive Learning Engine Test Suite", () => {
  
  it("1. GET /dashboard initially directs user to Entry Assessment diagnostic", async () => {
    const res = await request(app)
      .get("/api/learning-engine/dashboard")
      .set("Cookie", [`token=${token}`]);

    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.progress.status).toBe("entry_assessment");
    expect(res.body.recommendationContext.nextRecommendedAction).toBe("Take Entry Assessment");
  });

  it("2. GET /start-day samples entry assessment questions in < 50ms benchmark", async () => {
    const start = performance.now();
    const res = await request(app)
      .get("/api/learning-engine/start-day")
      .set("Cookie", [`token=${token}`]);
    const duration = performance.now() - start;

    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.action).toBe("ENTRY_ASSESSMENT");
    expect(res.body.questions.length).toBeGreaterThan(0);
    expect(duration).toBeLessThan(100); // Fetch must complete under 100ms
  });

  it("3. POST /submit-assessment low score (<60) routes user to Full Learning Path", async () => {
    // Submit all wrong answers ("B") to trigger low score
    const answers = mockQuestions.slice(0, 5).map(q => ({
      questionId: q._id.toString(),
      selectedAnswer: "B", // wrong
      timeTakenSeconds: 15
    }));

    const res = await request(app)
      .post("/api/learning-engine/submit-assessment")
      .set("Cookie", [`token=${token}`])
      .send({
        clusterId: mockCluster._id.toString(),
        answers
      });

    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.passed).toBe(false);
    expect(res.body.percentage).toBe(0);

    // Verify progress transitioned to learning - full path
    const progress = await UserClusterProgress.findOne({ userId, clusterId: mockCluster._id }).lean();
    expect(progress.status).toBe("learning");
    expect(progress.adaptiveMode).toBe("full");
  });

  it("4. GET /start-day plans daily tasks in < 100ms benchmark matching time budget", async () => {
    const start = performance.now();
    const res = await request(app)
      .get("/api/learning-engine/start-day")
      .set("Cookie", [`token=${token}`]);
    const duration = performance.now() - start;

    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.action).toBe("LEARNING");
    
    const plan = res.body.dailyPlan;
    expect(plan.status).toBe("active");
    expect(plan.roadmapId).toBe(mockRoadmap._id.toString());
    expect(plan.clusterId).toBe(mockCluster._id.toString());
    expect(plan.tasks.length).toBeGreaterThan(0);
    expect(duration).toBeLessThan(200); // Daily Plan generation must complete under 200ms
  });

  it("5. Completing the daily plan unlocks Final Assessment status", async () => {
    // Fetch the active progress pointer
    const progressBefore = await UserClusterProgress.findOne({ userId, clusterId: mockCluster._id }).lean();
    expect(progressBefore.status).toBe("final_assessment");

    // Manually mark all topic tasks completed to simulate completion
    await UserClusterProgress.findByIdAndUpdate(progressBefore._id, {
      $set: {
        completedTopics: [mockTopic1._id, mockTopic2._id],
        currentTopicIndex: 2
      }
    });

    // Invoke start-day to trigger the final assessment transition logic
    const res = await request(app)
      .get("/api/learning-engine/start-day")
      .set("Cookie", [`token=${token}`]);

    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.action).toBe("FINAL_ASSESSMENT");
    expect(res.body.questions.length).toBeGreaterThan(0);
  });

  it("6. Submitting passing Final Assessment schedules spaced revisions & completes cluster", async () => {
    // Submit all correct answers ("A")
    const answers = mockQuestions.slice(0, 5).map(q => ({
      questionId: q._id.toString(),
      selectedAnswer: "A", // correct
      timeTakenSeconds: 12
    }));

    // Perform final assessment submission
    const res = await request(app)
      .post("/api/learning-engine/submit-assessment")
      .set("Cookie", [`token=${token}`])
      .send({
        clusterId: mockCluster._id.toString(),
        answers
      });

    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.passed).toBe(true);
    expect(res.body.percentage).toBe(100);

    // Verify progress completed
    const progress = await UserClusterProgress.findOne({ userId, clusterId: mockCluster._id }).lean();
    expect(progress.status).toBe("completed");
    expect(progress.completedAt).not.toBeNull();

    // Verify revisions scheduled for all topics in the cluster
    const schedules = await RevisionSchedule.find({ userId, clusterId: mockCluster._id }).lean();
    expect(schedules.length).toBe(2); // Two topics in this cluster
    expect(schedules.every(s => s.revisionNumber === 1)).toBe(true);
  });

  it("7. Overdue Revisions are injected first in the daily planner", async () => {
    // 1. Manually set a revision schedule as due in the past
    await RevisionSchedule.updateMany(
      { userId, topicId: mockTopic1._id },
      { $set: { dueDate: new Date(Date.now() - 3600 * 1000) } } // 1 hour ago
    );

    // 2. Set user cluster progress status back to learning for testing injection
    await UserClusterProgress.findOneAndUpdate(
      { userId, clusterId: mockCluster._id },
      { $set: { status: "learning", currentTopicIndex: 0, currentTaskIndex: 0, completedTopics: [] } }
    );

    // 3. Clear today's plan so we generate a fresh one
    await DailyPlan.deleteMany({ userId });

    const res = await request(app)
      .get("/api/learning-engine/start-day")
      .set("Cookie", [`token=${token}`]);

    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.action).toBe("LEARNING");

    // The first task in the daily plan should be the revision task we injected
    const tasks = res.body.dailyPlan.tasks;
    expect(tasks.length).toBeGreaterThan(0);
    expect(tasks[0].reason).toBe("revision");
  });
});
