import express from 'express';
import careerProfileController from './careerProfile.controller';

const router = express.Router();

router.get('/', careerProfileController.getCareerProfiles);
router.get('/:id', careerProfileController.getCareerProfileById);
router.post('/', careerProfileController.createCareerProfile);
router.put('/:id', careerProfileController.updateCareerProfile);
router.delete('/:id', careerProfileController.deleteCareerProfile);

export default router;