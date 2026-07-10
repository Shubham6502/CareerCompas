import CareerProfile from "../careerProfile/careerProfile.model.js";
import Task from "../task/tasks.model.js";
import DailyPlan from "./dailyPlan.model.js";
import mongoose from "mongoose";

export const getProfileData = async (userId) => {
  if (!userId) {
    throw new Error("User ID is required to fetch profile data.");
  }
  const careerProfile = await CareerProfile.findOne({
    userId,
    isDeleted: false,
  }).select("targetRole targetCompanies experienceLevel studyHoursPerDay");
  if (!careerProfile) {
    throw new Error("Career profile not found for the given user ID.");
  }
  return careerProfile;
};

export const createDailyPlan = async (userId, profileData) => {
  if (!userId) {
    throw new Error("User ID is required to create a daily plan.");
  }
  try {
    const { targetRole, targetCompanies, experienceLevel, studyHoursPerDay } =
      profileData;
    const planDate = new Date().toISOString().split("T")[0]; // Get current date in YYYY-MM-DD format
    const tasks = await Task.find({
      isActive: true,
      isDeprecated: false,
      careerTracks: "faang",
    })
      .sort({
        difficultyScore: 1,
        estimatedMinutes: 1,
      })
      .limit(4);

    const newDailyPlan = new DailyPlan({
      userId,
      planDate,
      tasks: tasks.map((task) => ({
        taskId: task._id,
        slug: task.slug,
        topicId: task.topicId,
      })),
      studyHoursBudget: profileData.studyHoursPerDay,
      status: "active",
      completedTaskCount: 0,
      generatedAt: new Date(),
      schemaVersion: 1,
    });
    return await newDailyPlan.save();
  } catch (error) {
    console.error("Error fetching tasks:", error);
    throw new Error("Failed to fetch tasks for the daily plan.");
  }
};
