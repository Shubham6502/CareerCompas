import request from "supertest";
import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";
import connectDB from "../config/db.js";
import bcrypt from "bcrypt";

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

describe('Auth API', () => {

  // Register
 it('should register a new user', async () => {
  const res = await request(app)
    .post('/api/auth/register')
    .send({
      displayName: "Shubham", 
      email: "test@example.com",
      password: "12345678"
    });

  expect(res.statusCode).toBe(201);
  expect(res.body.user).toHaveProperty('token');
});

  // Login
it('should login user', async () => {

  // Step 1: Register user first
  await request(app)
    .post('/api/auth/register')
    .send({
      displayName: "Shubham",
      email: "test@example.com",
      password: "123456"
    });

  //  Login with SAME credentials
  const res = await request(app)
    .post('/api/auth/login')
    .send({
      email: "test@example.com",
      password: "123456" 
    });

  expect(res.statusCode).toBe(200);
  expect(res.body.user).toHaveProperty('token');
});

  // Invalid login
 it('should fail with wrong password', async () => {

  // create user
  await request(app)
    .post('/api/auth/register')
    .send({
      displayName: "Shubham",
      email: "test@example.com",
      password: "123456"
    });

  // attempt login with wrong password
  const res = await request(app)
    .post('/api/auth/login')
    .send({
      email: "test@example.com",
      password: "wrong123"
    });

  expect(res.statusCode).toBe(400);
});


  it('should hash password correctly', async () => {
    const password = "123456";
    const hash = await bcrypt.hash(password, 10);

    const isMatch = await bcrypt.compare(password, hash);
    expect(isMatch).toBe(true);
  });



});