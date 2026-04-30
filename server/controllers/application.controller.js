import {getAllApplications} from '../services/application.service.js'
import { JobApplication } from "../models/job_application.js";

import jwt from "jsonwebtoken";

const getUserIdFromToken = (req) => {
  try {
    const token = req.cookies?.token;
    if (!token) return null;
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    return decoded.userId;
  } catch {
    return null;
  }
};


export const getApplications = async (req, res) => {
   
  const userId = getUserIdFromToken(req);

  if (!userId) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  try {
    const applications = await getAllApplications(userId);
    
    console.log("Fetched applications:", applications);
    
    res.status(200).json(applications.applications);
  } catch (error) {
    console.error("Error fetching applications:", error);
    res
      .status(500)
      .json({ message: "Server error while fetching applications" });
  }
};


export const addApplication = async (req, res) => {
  const userId = getUserIdFromToken(req);
  if (!userId) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  const data = req.body;
  try {
    let userApplications = await JobApplication.findOne({ userId });
    if (userApplications) {
      userApplications.applications.push(data);
    } else {
      userApplications = new JobApplication({
        userId  : userId,
        applications: [data],
      });
    }
    await userApplications.save();
    res.status(201).json(userApplications);
  } catch (error) {
    console.error("Error adding application:", error);
    res.status(500).json({ message: "Server error while adding application" });
  }
};
export const deleteApplication = async (req, res) => {
  const userId = getUserIdFromToken(req);
  if (!userId) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  const { appId } = req.params;
  try {
    const userApplications = await JobApplication.findOne({ userId });
    if (!userApplications) {
      return res
        .status(404)
        .json({ message: "No applications found for this user" });
    }
    userApplications.applications = userApplications.applications.filter(
      (app) => app._id.toString() !== appId,
    );
    await userApplications.save();
    res.status(200).json({ message: "Application deleted successfully" });
  } catch (error) {
    console.error("Error deleting application:", error);
    res
      .status(500)
      .json({ message: "Server error while deleting application" });
  }
};
export const editApplication = async (req, res) => {
  const userId = getUserIdFromToken(req);
  if (!userId) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  const { appId } = req.params;
  const data = req.body;
  try {
     const result = await JobApplication.updateOne(
      { "applications._id": appId },
      { $set: { "applications.$": data } },
    );
    res.status(200).json({  message: "Application updated successfully" });
  } catch (error) {
    console.error("Error editing application:", error);
    res.status(500).json({ message: "Server error while editing application" });
  }
};
