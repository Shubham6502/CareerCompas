import mongoose from 'mongoose';
import CareerProfile from './careerProfile.model.js';

export const findCareerProfileByUserId = async (userId) => {
    if (!userId) {
        throw new Error("User ID is required to find career profiles.");
    }
    return await CareerProfile.findOne({ userId, isDeleted: false });
};

