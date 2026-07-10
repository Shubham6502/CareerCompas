import * as dailyPlanRepository from './dailyPlan.repository.js';

export const createDailyPlan = async (userId) => {
    const profileData = await dailyPlanRepository.getProfileData(userId);

    const { targetRole, targetCompanies, experienceLevel, studyHoursPerDay } = profileData;

    const newDailyPlan =await dailyPlanRepository.createDailyPlan(userId,profileData);
    return newDailyPlan;
}