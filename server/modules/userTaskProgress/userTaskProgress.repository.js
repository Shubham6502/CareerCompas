import Task from "../task/tasks.model.js";
import UserTaskProgress from "./userTaskProgress.js";
import DailyPlan from "../daily-plan/dailyPlan.model.js";

export const getTaskDataById = async (taskId) => {
  if (!taskId) {
    throw new Error("Task ID is required to fetch task data.");
  }
    const task = await Task.findById(taskId).select("topicId slug ").lean();
    if (!task) {
        throw new Error("Task not found for the given task ID.");
    }
    return task;
}

export const createUserTaskProgress = async (userId, taskId, progress, taskData) => {
  const userTaskProgress = new UserTaskProgress({
    userId,
    taskId,
    topicId: taskData.topicId,
    taskSlug: taskData.slug,
    status: progress.status,
    accuracy: progress.accuracy|| null,
    timeSpentMinutes: progress.timeSpentMinutes,
    attemptsCount:1,
    firstAttemptedAt: new Date() || null,
    completedAt: progress.completedAt || null,
    lastAttemptedAt: progress.lastAttemptedAt || null,
  });
  return userTaskProgress.save();
};

export const getUserTaskProgressByUserId = async (userId) => {
  if (!userId) {
    throw new Error("User ID is required to fetch user task progress.");
  }
    return UserTaskProgress.find({ userId }).lean();
};

export const updateUserTaskProgress = async (userId, taskProgressId, progress) => {
  if (!userId || !taskProgressId) {
    throw new Error("User ID and Task Progress ID are required to update user task progress.");
  }
    return UserTaskProgress.findOneAndUpdate(
        { _id: taskProgressId,userId:userId },
        { $set: {... progress } },
        { new: true }
    ).lean();
};

export const deleteUserTaskProgress = async (userId, taskProgressId) => {
  if (!userId || !taskProgressId) {
    throw new Error("User ID and Task Progress ID are required to delete user task progress.");
  }
    return UserTaskProgress.findOneAndDelete(
        { _id: taskProgressId, userId }
    ).lean();
};

// Additional function to update the daily plan task completion status
export const updateDailyPlanTaskCompletion = async (
  userId,
  planId,
  taskProgressId
) => {
  if (!userId || !planId || !taskProgressId) {
    throw new Error(
      "User ID, Plan ID, and Task Progress ID are required."
    );
  }

  // Get actual taskId from UserTaskProgress
  const userTaskProgress = await UserTaskProgress.findOne({
    _id: taskProgressId,
    userId,
  }).lean();

  if (!userTaskProgress) {
    throw new Error("User task progress not found.");
  }
  console.log("USER TASK PROGRESS:", userTaskProgress);
 

  const updatedPlan = await DailyPlan.findOneAndUpdate(
    {
      _id: planId,
      userId,

      // Important: only match if this task is not already completed
      tasks: {
        $elemMatch: {
          taskId: userTaskProgress.taskId,
          completed: false,
        },
      },
    },
    {
      $set: {
        "tasks.$[task].completed": true,
        "tasks.$[task].completedAt": new Date(),
      },

      $inc: {
        completedTaskCount: 1,
      },
    },
    {
      new: true,
      runValidators: true,

      arrayFilters: [
        {
          "task.taskId": userTaskProgress.taskId,
          "task.completed": false,
        },
      ],
    }
  ).lean();

  if (!updatedPlan) {
    throw new Error(
      "Daily plan not found, task not found in plan, or task is already completed."
    );
  }

  return updatedPlan;
};
