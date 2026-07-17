import express from 'express';
import * as getTopicMastery  from './topicMastery.controller.js';
const router = express.Router();

router.get('/topic-mastery/:userId', getTopicMastery.getTopicMastery);
router.get('/topic-mastery/:userId/:topicId', getTopicMastery.getTopicMasteryByTopicId);   
router.put('/topic-mastery/:userId/:topicId', getTopicMastery.updateTopicMasteryByTopicId); 

export default router;