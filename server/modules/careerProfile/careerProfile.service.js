import * as careerProfileRepository from './careerProfile.repository.js';

export const createCareerProfile = async (careerProfileData) => {
    const { userId } = careerProfileData;
    if(!userId) {
        throw new Error("User ID is required to create a career profile.");
    }
    // console.log(careerProfileData);
    const existingProfile=await careerProfileRepository.findCareerProfileByUserId(userId);
    if(existingProfile) {
        throw new Error("A career profile already exists for this user.");
    }
    if(!careerProfileData.userId || ! careerProfileData.targetRole || !careerProfileData.targetCompanies || !careerProfileData.experienceLevel 
        ||! careerProfileData.studyHoursPerDay)
    {
        throw new Error("All fields are required to create a career profile.");
    }
    const newCareerProfile = await careerProfileRepository.createCareerProfile(careerProfileData);
    return newCareerProfile;

}

export const getCareerProfiles = async (userId) => {
    const careerProfiles = await careerProfileRepository.getCareerProfiles(userId);
    return careerProfiles;
}
export const updateCareerProfile = async (careerProfileId, updatedData) => {
    if (!careerProfileId) {
        throw new Error("Career profile ID is required to update a career profile.");
    }
    const existingProfile = await careerProfileRepository.findCareerProfileById(careerProfileId);
    if (!existingProfile) {
        throw new Error("Career profile not found.");
    }
    // Update the existing profile with the new data
    Object.assign(existingProfile, updatedData);
    const updatedProfile = await existingProfile.save();
    return updatedProfile;
}
export const deleteCareerProfile = async (careerProfileId) => {
    if (!careerProfileId) {
        throw new Error("Career profile ID is required to delete a career profile.");
    }
    const existingProfile = await careerProfileRepository.deleteCareerProfileById(careerProfileId);
    if (!existingProfile) {
        throw new Error("Career profile not found.");
    }
    return existingProfile;
}