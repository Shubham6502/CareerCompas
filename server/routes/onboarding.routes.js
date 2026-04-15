import express from 'express';

import {onboardingController} from "../controllers/onboarding.controller.js"
const router = express.Router();

router.post("/roadmap",onboardingController);
export default router;