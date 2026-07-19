import express from "express";
import * as topicMasteryController from "./topicMastery.controller.js";

const router = express.Router();

router.get("/topic-mastery/:userId/summary",
     topicMasteryController.getMasterySummary);
router.get("/topic-mastery/:userId/revision-queue",
  topicMasteryController.getRevisionQueue,
);
router.get("/topic-mastery/:userId/weak-topics",
     topicMasteryController.getWeakTopics);

router.get("/topic-mastery/:userId/strong-topics",
  topicMasteryController.getStrongTopics,
);
router.get("/topic-mastery/:userId",
     topicMasteryController.getTopicMastery);


router.get("/topic-mastery/:userId/:topicId",
  topicMasteryController.getTopicMasteryByTopicId,
);

router.post("/topic-mastery/:userId/:topicId/diagnostic",
  topicMasteryController.processDiagnostic,
);
router.post("/topic-mastery/:userId/:topicId/assessment",
  topicMasteryController.processAssessment,
);

router.post("/topic-mastery/:userId/:topicId/tasks/complete",
  topicMasteryController.processTaskCompletion,
);
router.post("/topic-mastery/:userId/:topicId/tasks/skip",
  topicMasteryController.processTaskSkip,
);
router.post("/topic-mastery/:userId/:topicId/revision",
  topicMasteryController.processRevision,
);
router.post("/topic-mastery/:userId/:topicId/study-session",
  topicMasteryController.updateStudySession,
);

/* -------------------------------------------------------------------------- */
/* Planner / AI Metadata                                                      */
/* -------------------------------------------------------------------------- */

router.post("/topic-mastery/:userId/:topicId/planner",
  topicMasteryController.updatePlannerMetadata,
);
router.post("/topic-mastery/:userId/:topicId/ai-insights",
  topicMasteryController.updateAIInsights,
);

/* -------------------------------------------------------------------------- */
/* Manual Status Transitions                                                  */
/* -------------------------------------------------------------------------- */

router.post("/topic-mastery/:userId/:topicId/complete",
  topicMasteryController.markTopicCompleted,
);
router.post("/topic-mastery/:userId/:topicId/skip",
  topicMasteryController.markTopicSkipped,
);
router.post("/topic-mastery/:userId/:topicId/reset",
  topicMasteryController.resetTopicProgress,
);

export default router;