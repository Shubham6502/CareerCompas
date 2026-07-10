import * as dailyPlanService from './dailyPlan.service.js';

export const createDailyPlan = async (req, res) => {
    try {
        const userId = req.userId;
        if (!userId) {
            return res.status(400).json({ message: "User ID is required to create a daily plan." });
        }
        const newDailyPlan = await dailyPlanService.createDailyPlan(userId);
        res.status(201).json(newDailyPlan);
    }catch (error) {
        res.status(500).json({ message: error.message });
    }
}
