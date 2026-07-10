import mongoose from 'mongoose';
import CareerProfile from './careerProfile.model.js';

export const findCareerProfileByUserId = async (userId) => {
    if (!userId) {
        throw new Error("User ID is required to find career profiles.");
    }
    return await CareerProfile.findOne({ userId, isDeleted: false });
};

export const createCareerProfile = async (careerProfileData) => {
    const newCareerProfile = new CareerProfile(careerProfileData);
    return await newCareerProfile.save();
}
export const getCareerProfiles = async (userId) => {
    return await CareerProfile.find({ userId, isDeleted: false });
}
export const findCareerProfileById = async (careerProfileId) => {
    if (!careerProfileId) {
        throw new Error("Career profile ID is required to find a career profile.");
    }
    if (!mongoose.Types.ObjectId.isValid(careerProfileId)) {
        throw new Error("Invalid career profile ID format.");
    }
    return await CareerProfile.findById(careerProfileId);
}
export const deleteCareerProfileById = async (careerProfileId) => {
    if (!careerProfileId) {
        throw new Error("Career profile ID is required to delete a career profile.");
    }
    if (!mongoose.Types.ObjectId.isValid(careerProfileId)) {
        throw new Error("Invalid career profile ID format.");
    }
    return await CareerProfile.findByIdAndDelete(careerProfileId);
};
