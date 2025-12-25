export async function evaluateDailyProgress(progress, totalDailyTasks) {
  const today =  new Date().toLocaleDateString("en-CA", {timeZone: "Asia/Kolkata"});
  // const yesterday = new Date();
  //  yesterday.setDate(yesterday.getDate() - 2);
  // progress.lastActiveDate = yesterday;
  console.log("Last Active Date set to:", progress.lastActiveDate);
  if (progress.lastActiveDate.toISOString().split("T")[0] === today) return;

  const completedCount = progress.completedTasks.tasks.length;
  const allCompleted = completedCount === totalDailyTasks;

  const isConsecutiveDay =
    progress.currentDay - progress.previousDay === 1;
  console.log("Is Consecutive Day:", isConsecutiveDay);
  if (allCompleted && isConsecutiveDay) {
    progress.streak += 1;
  } 
  else if (allCompleted && !isConsecutiveDay) {
    progress.streak = 1; // restart streak
  } 
  else {
    progress.streak = 0;
  }

  //  Max streak update
  progress.maxStreak = Math.max(progress.maxStreak, progress.streak);

  // Move forward (NO BACKLOG)
  progress.previousDay = progress.currentDay;
  progress.currentDay += 1;

  //  Reset tasks for new day
  progress.completedTasks = {
    Day: progress.currentDay,
    tasks: [],
  };

  progress.lastEvaluatedDate = today;
  progress.lastActiveDate = new Date();
  console.log("Last Active Date set to:", progress.lastActiveDate);
}
export default evaluateDailyProgress;
