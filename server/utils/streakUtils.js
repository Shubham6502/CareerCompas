export async function evaluateStreak(progress, totalDailyTasks) {
  const today =  new Date().toLocaleDateString("en-CA", {timeZone: "Asia/Kolkata"});
  
    if(progress.completedDays.includes(progress.currentDay)){
      return;
    }

  const completedCount = progress.completedTasks.tasks.length;
  const allCompleted = completedCount === totalDailyTasks;

   if(!progress.completedDays.includes(progress.currentDay) && allCompleted){
    progress.streak += 1;
    progress.maxStreak = Math.max(progress.maxStreak, progress.streak);
   
   }
 }
export default evaluateStreak;

