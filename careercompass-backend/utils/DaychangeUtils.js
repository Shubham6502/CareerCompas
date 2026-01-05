export async function evaluateDailyProgress(progress) {
const today=  new Date().toLocaleDateString("en-CA", {timeZone: "Asia/Kolkata"});
// const yesterday = new Date();
//    yesterday.setDate(yesterday.getDate() - 1);
//   progress.lastActiveDate = yesterday;
 
  if (progress.lastActiveDate.toISOString().split("T")[0] === today) return;


    const isConsecutiveDay =progress.currentDay - progress.previousDay === 1;
    const completedCount = progress.completedTasks.tasks.length;
    const allCompleted = completedCount === 3; // assuming 3 tasks per day
    if ( !isConsecutiveDay || !allCompleted) {
    progress.streak = 0; // restart streak

    }
   
  progress.previousDay = progress.currentDay;
  progress.currentDay += 1;

  //  Reset tasks for new day
  progress.completedTasks = {
    Day: progress.currentDay,
    tasks: [],
  };
  const Currdate=new Date().toISOString().split("T")[0];
  progress.ActiveDays.push({
    day: progress.currentDay,
    date: Currdate,
    tasks: []
  })

  
   

  

//   progress.lastEvaluatedDate = today;
  progress.lastActiveDate = today;
  console.log("Last Active Date set to:", progress.lastActiveDate);
}
export default evaluateDailyProgress;
