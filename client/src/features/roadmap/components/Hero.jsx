 import { motion, AnimatePresence } from "framer-motion";

 
 export default function Hero({ totalTasks, doneTasks,roadmapDetails,currentDay }) {
  console.log("roadmapDetails in Hero:", roadmapDetails);
  const pct = Math.round((doneTasks / totalTasks) * 100);
  const PHASES = [
    { label: "Core Basics",     color: "#22c55e" },
    { label: "Intermediate",    color: "#f59e0b" },
    { label: "Advanced",        color: "#ef4444" },
    { label: "Interview Ready", color: "#3b82f6" },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      className="card-color rounded-2xl border border-white/[0.07] p-4 sm:p-5 mb-4"
    >
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="min-w-0">
          <h1 className="text-lg sm:text-xl font-bold text-color leading-tight">{roadmapDetails?.timelineDays || 28}-Day {roadmapDetails?.targetType || "Software Engineer"} Roadmap</h1>
          <p className="text-xs sm:text-sm subText-color mt-0.5">{roadmapDetails?.goalRole || "Software Engineer"} · {roadmapDetails?.timelineDays ? Math.ceil(roadmapDetails.timelineDays / 7) : 4} weeks · {roadmapDetails?.timelineDays || 28} days</p>
        </div>
        <div className="flex-shrink-0 flex items-center gap-1.5 bg-blue-500/10 border border-blue-500/20 px-3 py-1.5 rounded-xl">
          <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 text-blue-400 flex-shrink-0" fill="currentColor">
            <path d="M12 2L2 7l10 5 10-5-10-5zm0 7L2 14l10 5 10-5-10-5z"/>
          </svg>
          <span className="text-sm font-bold text-blue-400 whitespace-nowrap">{doneTasks}/{totalTasks}</span>
        </div>
      </div>

      {/* phase legend */}
      <div className="flex flex-wrap gap-x-4 gap-y-1.5 mb-4">
        {PHASES.map(p => (
          <div key={p.label} className="flex items-center gap-1.5">
            <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: p.color }} />
            <span className="text-[11px] subText-color">{p.label}</span>
          </div>
        ))}
      </div>

      {/* progress bar — segmented */}
      <div className="flex items-center gap-2.5">
        <div className="flex-1 flex gap-[3px] min-w-0">
          {Array.from({ length:roadmapDetails?.timelineDays  }, (_, i) => {
            const filled = currentDay>i;
            return (
              <motion.div
                key={i}
                initial={{ scaleY: 0 }}
                animate={{ scaleY: 1 }}
                transition={{ delay: 0.3 + i * 0.015, duration: 0.15 }}
                className="flex-1 h-1.5 rounded-full"
                style={{ background: filled ? "#22c55e" : "rgba(255,255,255,0.06)" }}
              />
            );
          })}
        </div>
        <span className="text-xs font-semibold text-green-500 flex-shrink-0">{pct}%</span>
      </div>
    </motion.div>
  );
}
