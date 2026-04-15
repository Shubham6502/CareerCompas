import { motion } from "framer-motion";

function getGreeting() {
  const h = new Date().getHours();
  if (h < 12) return "Good morning";
  if (h < 17) return "Good afternoon";
  return "Good evening";
}

export default function DashboardHeader({ roadmapInfo = {}, studyHoursPerDay = 2, currentDay = 1 }) {
  const greeting = getGreeting();
  const studyH   = Math.floor(studyHoursPerDay);
  const studyM   = Math.round((studyHoursPerDay - studyH) * 60);

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="mb-6"
    >
      <h1 className="text-xl sm:text-2xl font-bold text-color flex items-center gap-2 flex-wrap">
        {greeting}, Engineer
        <motion.span
          animate={{ rotate: [0, 20, -10, 20, 0] }}
          transition={{ delay: 0.5, duration: 0.8, ease: "easeInOut" }}
          className="inline-block"
        >
          👋
        </motion.span>
      </h1>
      <p className="subText-color mt-1 text-sm flex items-center gap-2 flex-wrap">
        <span>Day {currentDay} of your FAANG journey</span>
        <span className="subText-color">·</span>
        <span>
          <span className="font-semibold subText-color">{studyH}h</span>
          {studyM > 0 && (
            <> <span className="font-semibold text-indigo-500">{studyM}m</span></>
          )}
          {" "}study time today
        </span>
      </p>
    </motion.div>
  );
} 
 