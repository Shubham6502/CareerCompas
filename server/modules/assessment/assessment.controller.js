import * as assessmentService from "./assessment.service.js";

export const getAssessment = async (req, res) => {
  try {
    const { userId, topicId } = req.params;
    const assessment = await assessmentService.getAssessment(userId, topicId);
    res.status(200).json(assessment);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
