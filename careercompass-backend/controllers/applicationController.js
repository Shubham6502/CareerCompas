
import { JobApplication } from "../models/JobApplication.js";

export const getApplications = async (req, res) => {
  const { clerkId } = req.params;
  try {
    const applications = await JobApplication.findOne({ clerkId });
    if (!applications) {
      return res
        .status(404)
        .json({ message: "No applications found for this user" });
    }
    res.status(200).json(applications);
  } catch (error) {
    console.error("Error fetching applications:", error);
    res
      .status(500)
      .json({ message: "Server error while fetching applications" });
  }
};
export const addApplication = async (req, res) => {
  const { clerkId } = req.params;
  const data = req.body;
  try {
    let userApplications = await JobApplication.findOne({ clerkId });
    if (userApplications) {
      userApplications.applications.push(data);
    } else {
      userApplications = new JobApplication({
        clerkId,
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
  const { clerkId, appId } = req.params;
  try {
    const userApplications = await JobApplication.findOne({ clerkId });
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
  const { appId } = req.params;
  const data = req.body;
  try {
    await JobApplication.updateOne(
      { "applications._id": appId },
      { $set: { "applications.$": data } },
    );
    res.status(200).json({ message: "Application updated successfully" });
  } catch (error) {
    console.error("Error editing application:", error);
    res.status(500).json({ message: "Server error while editing application" });
  }
};
