import express from 'express';
import * as careerProfileController from './careerProfile.controller.js';
import { authenticateToken } from '../../shared/middlewares/authenticateToken.js';

const router = express.Router();

router.get('/', authenticateToken, careerProfileController.getCareerProfiles);
// router.get('/:id', careerProfileController.getCareerProfileById);
router.post('/', authenticateToken, careerProfileController.createCareerProfile);
router.put('/:id', authenticateToken, careerProfileController.updateCareerProfile);
router.delete('/:id', authenticateToken, careerProfileController.deleteCareerProfile);

export default router;