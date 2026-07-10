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
export const getCareerProfiles = async (req, res) => {
      try {
        const userId =req.user?.userId;
        if (!userId) {
            return res.status(400).json({ message: "User ID is required to fetch career profiles." });
        }
        const careerProfiles = await careerProfileService.getCareerProfiles(userId);
        res.status(200).json(careerProfiles);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
export const updateCareerProfile = async (req, res) => {
    try {
        const careerProfileId = req.params.id;
        if (!careerProfileId) {
            return res.status(400).json({ message: "Career profile ID is required to update a career profile." });
        }
        const updatedData = req.body;
        const updatedCareerProfile = await careerProfileService.updateCareerProfile(careerProfileId, updatedData);
        res.status(200).json(updatedCareerProfile);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
export const deleteCareerProfile = async (req, res) => {
    try {
        const careerProfileId = req.params.id;
        if (!careerProfileId) {
            return res.status(400).json({ message: "Career profile ID is required to delete a career profile." });
        }
        const deletedCareerProfile = await careerProfileService.deleteCareerProfile(careerProfileId);
        res.status(200).json({ message: "Career profile deleted successfully", deletedCareerProfile });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};