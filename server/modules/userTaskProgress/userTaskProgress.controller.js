import * as userTaskProgressService from '../userTaskProgress/userTaskProgress.service.js';


export const createUserTaskProgress = async (req, res) => {
  try {
    const userId = req.userId;
    const { taskId, progress } = req.body;
    const userTaskProgress = await userTaskProgressService.createUserTaskProgress(userId, { taskId, progress });
    res.status(201).json(userTaskProgress);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getUserTaskProgress = async (req, res) => {
  try {
    const userId = req.userId;
    const userTaskProgress = await userTaskProgressService.getUserTaskProgress(userId);
    res.status(200).json(userTaskProgress);
  }
    catch (error) {
    res.status(500).json({ message: error.message });
  }
};
//get plan  id from frontend and then get the task progress for that plan id
export const updateUserTaskProgress = async (req, res) => {
    try {
        const userId = req.userId;
        const taskProgressId = req.params.id;
        const { progress } = req.body;
        const updatedUserTaskProgress = await userTaskProgressService.updateUserTaskProgress(userId, taskProgressId, progress);
        res.status(200).json(updatedUserTaskProgress);
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const deleteUserTaskProgress = async (req, res) => {
    try {
        const userId = req.userId;
        const taskProgressId = req.params.id;
        await userTaskProgressService.deleteUserTaskProgress(userId, taskProgressId);
        res.status(200).json({ message: "User task progress deleted successfully." });
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
};