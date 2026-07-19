import express from "express";
import assessmentController from "./assessment.controller.js";
const router = express.Router();


router.get("/assessment/:userId/:topicId",
  assessmentController.getAssessment,
);
router.post("/assessment/:userId/:topicId/submit",
  assessmentController.submitAssessment,
);
