import * as userTaskProgressRepository from './userTaskProgress.repository.js';
import { updateUserStreak } from '../careerProfile/streak.service.js';

export const createUserTaskProgress = async (userId, taskProgressData) => {
  const { taskId, progress } = taskProgressData;
  if(!userId || !taskId || progress === undefined) {
    throw new Error("User ID, Task ID, and progress are required to create user task progress.");
  }
  const taskData = await userTaskProgressRepository.getTaskDataById(taskId);

  if (!taskData) {
    throw new Error("Task not found for the given task ID.");
  }

  return userTaskProgressRepository.createUserTaskProgress(userId, taskId, progress,taskData);
}

export const getUserTaskProgress = async (userId) => {
  if(!userId) {
    throw new Error("User ID is required to fetch user task progress.");
  }
    return userTaskProgressRepository.getUserTaskProgressByUserId(userId);      
}

export const updateUserTaskProgress = async (userId, taskProgressId, progress) => {
  if(!userId || !taskProgressId || progress === undefined) {
    throw new Error("User ID, Task Progress ID, and progress are required to update user task progress.");
  }
  const planId = progress.planId;
  if (!planId) {
    throw new Error("Plan ID is required to update user task progress.");
  }
  if(progress.status==="completed"){
      progress.completedAt = new Date();
      await userTaskProgressRepository.updateDailyPlanTaskCompletion(userId,planId,taskProgressId);
      // Trigger streak update
      await updateUserStreak(userId);
  }
  return userTaskProgressRepository.updateUserTaskProgress(userId, taskProgressId, progress);
}

export const deleteUserTaskProgress = async (userId, taskProgressId) => {
  if(!userId || !taskProgressId) {
    throw new Error("User ID and Task Progress ID are required to delete user task progress.");
  }
    return userTaskProgressRepository.deleteUserTaskProgress(userId, taskProgressId);
}