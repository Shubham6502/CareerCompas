import * as dailyPlanRepository from './dailyPlan.repository.js';

export const createDailyPlan = async (userId) => {
    const profileData = await dailyPlanRepository.getProfileData(userId);

    
    const { targetRole, targetCompanies, experienceLevel, studyHoursPerDay } = profileData;
   
    const newDailyPlan =await dailyPlanRepository.createDailyPlan(userId,profileData);
    return newDailyPlan;
}

export const getDailyPlans = async (userId) => {
    const dailyPlans = await dailyPlanRepository.getDailyPlans(userId);
    return dailyPlans;
}

export const updateDailyPlan = async (userId, planId, updateData) => {
    const dailyPlan = await dailyPlanRepository.getDailyPlanById(planId);
    if (!dailyPlan) {
        throw new Error("Daily plan not found for the given user ID and plan ID.");
      }
      Object.assign(dailyPlan, updateData);
      return await dailyPlan.save();

}
export const deleteDailyPlan = async (planId) => {
    const dailyPlan = await dailyPlanRepository.getDailyPlanById(planId);
    if (!dailyPlan) {
        throw new Error("Daily plan not found for the given user ID and plan ID.");
      }
    const result = await dailyPlanRepository.deleteDailyPlan(planId);   
}