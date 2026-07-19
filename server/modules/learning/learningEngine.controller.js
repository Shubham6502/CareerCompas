import * as learningEngineService from "./learningEngine.service.js";

export const getDashboard = async (req, res) => {
  try {
    const userId = req.userId;
    if (!userId) {
      return res.status(400).json({ success: false, message: "User ID is required." });
    }
    const data = await learningEngineService.getDashboard(userId);
    res.status(200).json({ success: true, ...data });
  } catch (error) {
    console.error("Dashboard error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

export const startDay = async (req, res) => {
  try {
    const userId = req.userId;
    if (!userId) {
      return res.status(400).json({ success: false, message: "User ID is required." });
    }
    const data = await learningEngineService.startDay(userId);
    res.status(200).json({ success: true, ...data });
  } catch (error) {
    console.error("Start day error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

export const submitAssessment = async (req, res) => {
  try {
    const userId = req.userId;
    const { clusterId, answers } = req.body;
    if (!userId || !clusterId || !Array.isArray(answers)) {
      return res.status(400).json({ success: false, message: "Missing required fields." });
    }
    const result = await learningEngineService.submitAssessment(userId, clusterId, answers);
    res.status(200).json({ success: true, ...result });
  } catch (error) {
    console.error("Submit assessment error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};
