export async function evaluateDailyProgress(progress, totalDailyTasks) {
  const today =  new Date().toLocaleDateString("en-CA", {timeZone: "Asia/Kolkata"});


  

  if (progress.lastActiveDate.toISOString().split("T")[0] === today) return;

  const completedCount = progress.completedTasks?.tasks?.length || 0;
  const allCompleted = completedCount === totalDailyTasks;

  const isConsecutiveDay =
    progress.currentDay - progress.previousDay === 1;
  console.log("Is Consecutive Day:",isConsecutiveDay);
  console.log("All Tasks Completed:",allCompleted);
  console.log("Completed Count:",completedCount,"/ Total Tasks:",totalDailyTasks);
 
  if (allCompleted && isConsecutiveDay) {
    progress.streak += 1;
  } 
  else if (allCompleted && !isConsecutiveDay) {
    progress.streak = 1; // restart streak
  } 
  else {
    progress.streak = 0;
  }

  // 📈 Max streak update
  progress.maxStreak = Math.max(progress.maxStreak, progress.streak);

  // ⏭ Move forward (NO BACKLOG)
  progress.previousDay = progress.currentDay;
  progress.currentDay += 1;

  // 🔄 Reset tasks for new day
  progress.completedTasks = {
    Day: progress.currentDay,
    tasks: [],
  };

  progress.lastEvaluatedDate = today;
}
export default evaluateDailyProgress;
