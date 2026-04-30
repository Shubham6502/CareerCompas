import request from "supertest";
import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";
import connectDB from "../config/db.js";

let app;
let mongo;

beforeAll(async () => {
  // 1. Start test DB
  mongo = await MongoMemoryServer.create();
  const uri = mongo.getUri();
    console.log("Connecting to:", uri);
    // 2. Connect mongoose FIRST
    await connectDB(uri);
    console.log("DB state:", mongoose.connection.readyState); // must be 1
    // 3. ONLY AFTER DB → import app
    app = (await import("../app.js")).default;
});

afterEach(async () => {
  const collections = mongoose.connection.collections;
  for (const key in collections) {
    await collections[key].deleteMany({});
  }
});
afterAll(async () => {
  await mongoose.connection.close();
  await mongo.stop();
});

describe('Roadmap API', () => {
  // Add roadmap tests here
  it('should create a new roadmap', async () => {

  // 1. Register user
  const registerRes = await request(app)
    .post('/api/auth/register')
    .send({
      displayName: "Shubham",
      email: "test@example.com",
      password: "123456"
    });
    console.log("Register response:", registerRes.body);

  const token = registerRes.body.user.token;

  // 2. Insert roadmap data
  const Roadmap = (await import("../models/roadmap.js")).default;

  await Roadmap.create({
    domain: "SWE",
    experienceLevel: "beginner",
    targetType: "faang_product",
    timelineDays: 30,
    goalRole: "Software Engineer"
  });

  // 3. Call onboarding API
  const res = await request(app)
    .post('/api/onboarding/roadmap')
    .set('Cookie', [`token=${token}`])
    .send({
      selections: {
        domain: "SWE",
        target: "faang_product",
        experience: "beginner",
        timeline: {
          timeline: 30,
          prompt: ""
        }
      }
    });

  expect(res.statusCode).toBe(200);
  expect(res.body).toHaveProperty('success', true);
});


it('should get the roadmap for user', async () => {

  // 1. Register user
  const registerRes = await request(app)
    .post('/api/auth/register')
    .send({
      displayName: "Shubham",
      email: "test@example.com",
      password: "123456"
    });

  const token = registerRes.body.user.token;

  // 2. Insert roadmap data
  const Roadmap = (await import("../models/roadmap.js")).default;

  await Roadmap.create({
    domain: "SWE",
    experienceLevel: "beginner",
    targetType: "faang_product",
    timelineDays: 30,
    goalRole: "Software Engineer"
  });

  // 3. Call onboarding API
  const createRes = await request(app)
    .post('/api/onboarding/roadmap')
    .set('Cookie', [`token=${token}`])
    .send({
      selections: {
        domain: "SWE",
        target: "faang_product",
        experience: "beginner",
        timeline: {
          timeline: 30,
          prompt: ""
        }
      }
    });

    const res= await request(app)
    .get('/api/roadmap/getUserRoadmap')
    .set('Cookie', [`token=${token}`]);
    
    
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('success', true);


});




});
