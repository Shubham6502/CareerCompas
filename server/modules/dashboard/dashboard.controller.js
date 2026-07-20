import * as dashboardService from "./dashboard.service.js";

export const getDashboard = async (req, res) => {
  try {
    const userId = req.userId;
    console.log("Dashboard controller - userId:", userId);
    if (!userId) {
      return res.status(400).json({ success: false, message: "User ID is required." });
    }
    const dashboardData = await dashboardService.getDashboardData(userId);
    return res.status(200).json(dashboardData);
  } catch (error) {
    console.error("Dashboard controller error:", error);
    return res.status(500).json({ success: false, message: error.message || "Internal server error" });
  }
};
