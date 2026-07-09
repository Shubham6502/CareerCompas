import * as careerProfileRepository from './careerProfile.repository.js';

export const createCareerProfile = async (careerProfileData) => {

    if(!userId) {
        throw new Error("User ID is required to create a career profile.");
    }

    const existingProfile=await careerProfileRepository.findCareerProfileByUserId(userId);
    if(existingProfile) {
        throw new Error("A career profile already exists for this user.");
    }

}
