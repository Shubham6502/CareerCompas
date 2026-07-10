import express from 'express';
import { authenticateToken } from '../../middlewares/auth.middleware.js';
import * as dailyPlanController from './dailyPlan.controller.js';

const router = express.Router();

// router.get('/', authenticateToken, dailyPlanController.getDailyPlans);
router.post('/', authenticateToken, dailyPlanController.createDailyPlan);
// router.put('/:id', authenticateToken, dailyPlanController.updateDailyPlan);
// router.delete('/:id', authenticateToken, dailyPlanController.deleteDailyPlan);

export default router;