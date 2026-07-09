import * as careerProfileService from './careerProfile.service.js';

export const createCareerProfile = async (req, res) => {
    try {
        const careerProfileData = req.body;
        const newCareerProfile = await careerProfileService.createCareerProfile(careerProfileData);
        res.status(201).json(newCareerProfile);
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
};