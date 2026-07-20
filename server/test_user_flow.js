import mongoose from "mongoose";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import User from "./models/user.js";
import CareerProfile from "./modules/careerProfile/careerProfile.model.js";
import Roadmap from "./modules/roadmap/roadmap.model.js";
import LearningCluster from "./modules/learning/learningCluster.model.js";
import RoadmapCluster from "./modules/roadmap/roadmapCluster.model.js";
import UserClusterProgress from "./modules/progress/userClusterProgress.model.js";
import Topic from "./modules/topics/topics.model.js";
import Task from "./modules/task/tasks.model.js";
import RevisionSchedule from "./modules/revision/revisionSchedule.model.js";
import AssessmentAttempt from "./modules/assessment/assessmentAttempt.model.js";
import Question from "./modules/assessment/question.model.js";
import EngineConfig from "./modules/roadmap/engineConfig.model.js";
import DailyPlan from "./modules/daily-plan/dailyPlan.model.js";
import * as dashboardService from "./modules/dashboard/dashboard.service.js";
import * as learningEngineService from "./modules/learning/learningEngine.service.js";

// Load env variables
dotenv.config();

const run = async () => {
  console.log("=== CONNECTING TO DATABASE ===");
  await connectDB();

  const testEmail = "flow_tester@example.com";

  console.log(`\n=== CLEANING OLD DATA FOR ${testEmail} ===`);
  const oldUser = await User.findOne({ email: testEmail });
  if (oldUser) {
    const uid = oldUser._id;
    await User.deleteOne({ _id: uid });
    await CareerProfile.deleteMany({ userId: uid });
    await UserClusterProgress.deleteMany({ userId: uid });
    await RevisionSchedule.deleteMany({ userId: uid });
    await AssessmentAttempt.deleteMany({ userId: uid });
    await DailyPlan.deleteMany({ userId: uid });
    console.log("Old test data cleared successfully!");
  }

  // 1. Seed base curriculum if missing
  console.log("\n=== SEEDING BASE CURRICULUM ===");
  let topic = await Topic.findOne({ slug: "js-fundamentals-topic" });
  if (!topic) {
    topic = await Topic.create({
      _id: new mongoose.Types.ObjectId(),
      slug: "js-fundamentals-topic",
      displayName: "Javascript Scopes & Closures",
      domain: "Software Development",
      category: "JS"
    });
    console.log("Topic created!");
  }

  let cluster = await LearningCluster.findOne({ clusterKey: "js-variables-cluster" });
  if (!cluster) {
    cluster = await LearningCluster.create({
      _id: new mongoose.Types.ObjectId(),
      name: "Javascript Variables Cluster",
      clusterKey: "js-variables-cluster",
      topicsIncluded: [{ topicId: topic._id, slug: topic.slug, displayName: topic.displayName }],
      estimatedHours: 4,
      estimatedTasks: 2,
      difficulty: "easy"
    });
    console.log("Learning Cluster created!");
  }

  let roadmap = await Roadmap.findOne({ domain: "Web Development", track: "Beginner" });
  if (!roadmap) {
    roadmap = await Roadmap.create({
      _id: new mongoose.Types.ObjectId(),
      title: "Web Developer Starter Kit",
      domain: "Web Development",
      track: "Beginner",
      version: 1,
      isPublished: true,
      isActive: true
    });
    console.log("Roadmap created!");
  }

  let roadmapCluster = await RoadmapCluster.findOne({ roadmapId: roadmap._id, clusterId: cluster._id });
  if (!roadmapCluster) {
    await RoadmapCluster.create({
      _id: new mongoose.Types.ObjectId(),
      roadmapId: roadmap._id,
      clusterId: cluster._id,
      order: 1
    });
    console.log("RoadmapCluster link created!");
  }

  let engineConfig = await EngineConfig.findOne({ key: "default" });
  if (!engineConfig) {
    await EngineConfig.create({
      key: "default",
      features: { revisionEngine: true, adaptiveDifficulty: true }
    });
    console.log("Default Engine Config created!");
  }

  let question = await Question.findOne({ title: "Scope Question" });
  if (!question) {
    await Question.create({
      _id: new mongoose.Types.ObjectId(),
      title: "Scope Question",
      question: "Which keyword creates block scope?",
      options: [
        { id: "A", text: "var" },
        { id: "B", text: "let" }
      ],
      correctAnswer: "B",
      questionType: "mcq",
      difficulty: "easy",
      topicSlugs: ["js-fundamentals-topic"],
      isActive: true,
      explanation: "let creates block scope, while var creates function scope.",
      learningObjective: "Understand variables scope differences",
      bloomLevel: "remember",
      assessmentGroup: "js-basics"
    });
    console.log("Assessment Question seeded!");
  }

  let task = await Task.findOne({ slug: "variables-reading" });
  if (!task) {
    await Task.create({
      _id: new mongoose.Types.ObjectId(),
      slug: "variables-reading",
      title: "Variable Scopes Article",
      description: "Read details on Block Scope, Function Scope, and lexical scoping.",
      topicId: topic._id,
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
      resource: { title: "MDN Scopes", type: "article", provider: "MDN", url: "https://mdn.com" },
      learningObjectives: ["Understand scope variables"],
      concepts: [{ name: "Variables Scope", slug: "variables-scope", weight: 0.9, difficulty: "easy" }],
      ai: { semanticSummary: "Overview of variables" }
    });
    console.log("Study Task seeded!");
  }

  // PHASE 1: REGISTER USER
  console.log("\n=== PHASE 1: REGISTER USER ===");
  const testUser = await User.create({
    _id: new mongoose.Types.ObjectId(),
    displayName: "Jane Doe",
    email: testEmail,
    passwordHash: "securePasswordHash",
    firstName: "Jane",
    lastName: "Doe",
    authProvider: "local",
    accountStatus: "active"
  });
  console.log("Registered User ID:", testUser._id.toString());

  // PHASE 2: ONBOARDING REQUIRED CHECK
  console.log("\n=== PHASE 2: CHECK DASHBOARD BEFORE ONBOARDING ===");
  let dashboardRes = await dashboardService.getDashboardData(testUser._id);
  console.log("Dashboard Action output:", JSON.stringify(dashboardRes, null, 2));

  // PHASE 3: ONBOARD USER (Create Career Profile)
  console.log("\n=== PHASE 3: ONBOARDING USER ===");
  const profile = await CareerProfile.create({
    _id: new mongoose.Types.ObjectId(),
    userId: testUser._id,
    targetRole: "Frontend Developer",
    experienceLevel: "student",
    studyHoursPerDay: 2,
    activeRoadmapId: roadmap._id,
    onboardingCompleted: true
  });
  console.log("Career Profile created with activeRoadmapId:", profile.activeRoadmapId.toString());

  // PHASE 4: DIAGNOSTIC PENDING CHECK
  console.log("\n=== PHASE 4: CHECK DASHBOARD AFTER ONBOARDING (DIAGNOSTIC PENDING) ===");
  dashboardRes = await dashboardService.getDashboardData(testUser._id);
  console.log("Dashboard Action output:", JSON.stringify(dashboardRes, null, 2));

  // PHASE 5: SUBMIT ENTRY ASSESSMENT (Score: 100%)
  console.log("\n=== PHASE 5: SUBMIT DIAGNOSTIC ASSESSMENT ===");
  // Simulate fetching start-day action
  const startDay = await learningEngineService.startDay(testUser._id);
  console.log("Start Day Action:", startDay.action);
  console.log("Fetched Diagnostic Questions:", startDay.questions?.length);

  const qId = startDay.questions[0]._id;
  const submitRes = await learningEngineService.submitAssessment(
    testUser._id,
    cluster._id,
    [{ questionId: qId, selectedAnswer: "A", timeTakenSeconds: 15 }]
  );
  console.log("Assessment Score Percentage:", submitRes.percentage + "%");
  console.log("Passed / Skipped Cluster (Should be false due to low score):", submitRes.passed);

  // PHASE 6: ACCESS ACTIVE LEARNING DASHBOARD
  console.log("\n=== PHASE 6: GET FULL ACTIVE LEARNING DASHBOARD ===");
  
  // User is now in active learning state; let's print the compiled dashboard state
  dashboardRes = await dashboardService.getDashboardData(testUser._id);
  console.log("Dashboard DTO payload:\n", JSON.stringify(dashboardRes, null, 2));

  console.log("\n=== USER FLOW SIMULATION COMPLETED SUCCESSFULLY ===");
  mongoose.connection.close();
};

run().catch(err => {
  console.error(err);
  mongoose.connection.close();
});
