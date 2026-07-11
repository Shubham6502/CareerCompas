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

export const getDailyPlans = async (req, res) => {
    try {
        const userId = req.userId;
        if (!userId) {
            return res.status(400).json({ message: "User ID is required to fetch daily plans." });
        }
        const dailyPlans = await dailyPlanService.getDailyPlans(userId);
        res.status(200).json(dailyPlans);
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }   
}

export const updateDailyPlan = async (req, res) => {
    try {
        const userId = req.userId;
        const planId = req.params.id;
        const updateData = req.body;
        const updatedDailyPlan = await dailyPlanService.updateDailyPlan(userId, planId, updateData);
        res.status(200).json(updatedDailyPlan);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const deleteDailyPlan = async (req, res) => {
    try {
        const planId = req.params.id;
        await dailyPlanService.deleteDailyPlan(planId);
        res.status(200).json({ message: "Daily plan deleted successfully." });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};