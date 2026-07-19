import * as topicMasteryService from "./topicMastery.service.js";

/* -------------------------------------------------------------------------- */
/* Error handling                                                             */
/* -------------------------------------------------------------------------- */

// AppError carries the correct statusCode (e.g. 400 for invalid input);
// anything else is an unexpected failure and should surface as a 500.
const sendError = (res, error) => {
  const statusCode = error.statusCode ?? 500;

  res.status(statusCode).json({ error: error.message });
};

export const getTopicMastery = async (req, res) => {
  try {
    const { userId } = req.params;
    const topicMastery = await topicMasteryService.getTopicMastery(userId);

    res.status(200).json(topicMastery);
  } catch (error) {
    sendError(res, error);
  }
};

export const getTopicMasteryByTopicId = async (req, res) => {
  try {
    const { userId, topicId } = req.params;
    const topicMastery = await topicMasteryService.getTopicMasteryByTopicId(
      userId,
      topicId,
    );

    res.status(200).json(topicMastery);
  } catch (error) {
    sendError(res, error);
  }
};

export const getRevisionQueue = async (req, res) => {
  try {
    const { userId } = req.params;
    const revisionQueue = await topicMasteryService.getRevisionQueue(userId);

    res.status(200).json(revisionQueue);
  } catch (error) {
    sendError(res, error);
  }
};

export const getWeakTopics = async (req, res) => {
  try {
    const { userId } = req.params;
    const weakTopics = await topicMasteryService.getWeakTopics(userId);

    res.status(200).json(weakTopics);
  } catch (error) {
    sendError(res, error);
  }
};

export const getStrongTopics = async (req, res) => {
  try {
    const { userId } = req.params;
    const strongTopics = await topicMasteryService.getStrongTopics(userId);

    res.status(200).json(strongTopics);
  } catch (error) {
    sendError(res, error);
  }
};

export const getMasterySummary = async (req, res) => {
  try {
    const { userId } = req.params;
    const summary = await topicMasteryService.getMasterySummary(userId);

    res.status(200).json(summary);
  } catch (error) {
    sendError(res, error);
  }
};

/* -------------------------------------------------------------------------- */
/* Diagnostic / Assessment                                                    */
/* -------------------------------------------------------------------------- */

export const processDiagnostic = async (req, res) => {
  try {
    const { userId, topicId } = req.params;
    const topicMastery = await topicMasteryService.processDiagnostic(
      userId,
      topicId,
      req.body,
    );

    res.status(200).json(topicMastery);
  } catch (error) {
    sendError(res, error);
  }
};

export const processAssessment = async (req, res) => {
  try {
    const { userId, topicId } = req.params;
    const topicMastery = await topicMasteryService.processAssessment(
      userId,
      topicId,
      req.body,
    );

    res.status(200).json(topicMastery);
  } catch (error) {
    sendError(res, error);
  }
};

/* -------------------------------------------------------------------------- */
/* Task / Revision Progress                                                   */
/* -------------------------------------------------------------------------- */

export const processTaskCompletion = async (req, res) => {
  try {
    const { userId, topicId } = req.params;
    const topicMastery = await topicMasteryService.processTaskCompletion(
      userId,
      topicId,
      req.body,
    );

    res.status(200).json(topicMastery);
  } catch (error) {
    sendError(res, error);
  }
};

export const processTaskSkip = async (req, res) => {
  try {
    const { userId, topicId } = req.params;
    const topicMastery = await topicMasteryService.processTaskSkip(userId, topicId);

    res.status(200).json(topicMastery);
  } catch (error) {
    sendError(res, error);
  }
};

export const processRevision = async (req, res) => {
  try {
    const { userId, topicId } = req.params;
    const topicMastery = await topicMasteryService.processRevision(
      userId,
      topicId,
      req.body,
    );

    res.status(200).json(topicMastery);
  } catch (error) {
    sendError(res, error);
  }
};

export const updateStudySession = async (req, res) => {
  try {
    const { userId, topicId } = req.params;
    const { minutes } = req.body;
    const topicMastery = await topicMasteryService.updateStudySession(
      userId,
      topicId,
      minutes,
    );

    res.status(200).json(topicMastery);
  } catch (error) {
    sendError(res, error);
  }
};

/* -------------------------------------------------------------------------- */
/* Planner / AI Metadata                                                      */
/* -------------------------------------------------------------------------- */

export const updatePlannerMetadata = async (req, res) => {
  try {
    const { userId, topicId } = req.params;
    const topicMastery = await topicMasteryService.updatePlannerMetadata(
      userId,
      topicId,
      req.body,
    );

    res.status(200).json(topicMastery);
  } catch (error) {
    sendError(res, error);
  }
};

export const updateAIInsights = async (req, res) => {
  try {
    const { userId, topicId } = req.params;
    const topicMastery = await topicMasteryService.updateAIInsights(
      userId,
      topicId,
      req.body,
    );

    res.status(200).json(topicMastery);
  } catch (error) {
    sendError(res, error);
  }
};

/* -------------------------------------------------------------------------- */
/* Manual Status Transitions                                                  */
/* -------------------------------------------------------------------------- */

export const markTopicCompleted = async (req, res) => {
  try {
    const { userId, topicId } = req.params;
    const topicMastery = await topicMasteryService.markTopicCompleted(userId, topicId);

    res.status(200).json(topicMastery);
  } catch (error) {
    sendError(res, error);
  }
};

export const markTopicSkipped = async (req, res) => {
  try {
    const { userId, topicId } = req.params;
    const topicMastery = await topicMasteryService.markTopicSkipped(userId, topicId);

    res.status(200).json(topicMastery);
  } catch (error) {
    sendError(res, error);
  }
};

export const resetTopicProgress = async (req, res) => {
  try {
    const { userId, topicId } = req.params;
    const topicMastery = await topicMasteryService.resetTopicProgress(
      userId,
      topicId,
    );

    res.status(200).json(topicMastery);
  } catch (error) {
    sendError(res, error);
  }
};