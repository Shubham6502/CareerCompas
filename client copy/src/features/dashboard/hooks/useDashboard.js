import { useContext, useCallback } from "react";
import { DashboardContext } from "../Dashboard.context.jsx";
import { comptetedTask } from "../services/dashboard.services.js";


export const useDashboard = () => {
  const { setError } = useContext(DashboardContext);

  // FIX: Wrapped in useCallback with empty deps — stable reference, never recreated.
  const task_completion = useCallback(
    async (taskId, difficulty, roadmapId, totalCount, currentDay) => {
      try {
        const response = await comptetedTask(taskId, difficulty, roadmapId, totalCount, currentDay);
        return response;
      } catch (error) {
        setError("Failed to update task completion.");
        throw error; // re-throw so Dashboard can rollback optimistic update
      }
    },
    [] // empty — comptetedTask is a module-level import, always stable
  );

  return { task_completion };
};