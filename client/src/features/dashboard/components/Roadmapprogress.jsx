import { motion } from "framer-motion";
import { CheckCircle2 } from "lucide-react";
import { Link } from "react-router-dom";

/**
 * "Roadmap Progress" — shows a short window of days around the current
 * day (2 before, current, 2 after) with a vertical connecting line,
 * mirroring the reference design's Day 46-50 list.
 *
 * Pulls titles from roadmapDays when available; falls back to a generic
 * "Day N" label so the card never breaks if task data is sparse.
 */
export default function RoadmapProgress({ roadmapDays = [], currentDay = 1 }) {
  const dayTitleMap = new Map(
    roadmapDays.map((d) => [d.day, d.tasks?.[0]?.title || `Study Day ${d.day}`])
  );

  const windowStart = Math.max(currentDay - 2, 1);
  const items = Array.from({ length: 5 }, (_, i) => {
    const day = windowStart + i;
    return {
      day,
      title: dayTitleMap.get(day) || `Study Day ${day}`,
      status: day < currentDay ? "done" : day === currentDay ? "current" : "upcoming",
    };
  });

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="card-color rounded-2xl border border-slate-100 dark:border-white/10 shadow-sm p-5"
    >
      <div className="flex items-center justify-between mb-4">
        <p className="text-[11px] font-bold tracking-widest subText-color uppercase">
          Roadmap Progress
        </p>
        <Link
          to="/roadmap"
          className="flex items-center gap-1 text-[11px] font-semibold text-indigo-400 hover:text-indigo-300 transition-colors"
        >
          View Roadmap
          <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path d="M7 17L17 7M17 7H7M17 7v10" />
          </svg>
        </Link>
      </div>

      <div className="relative">
        {/* connecting vertical line, glowing where progress has passed */}
        <div className="absolute left-[9px] top-2 bottom-2 w-px bg-slate-100 dark:bg-white/10" />
        <motion.div
          initial={{ height: 0 }}
          animate={{ height: `${(Math.min(currentDay - windowStart, 4) / 4) * 100}%` }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          className="absolute left-[9px] top-2 w-px bg-gradient-to-b from-emerald-400 to-indigo-400"
          style={{ boxShadow: "0 0 6px rgba(129,140,248,0.7)" }}
        />

        <div className="space-y-3.5">
          {items.map((item, i) => (
            <motion.div
              key={item.day}
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.06, duration: 0.3, ease: "easeOut" }}
              className="relative flex items-center gap-3"
            >
              <span className="relative z-10 flex-shrink-0 w-[18px] h-[18px] flex items-center justify-center">
                {item.status === "done" ? (
                  <CheckCircle2
                    size={18}
                    className="text-emerald-400 fill-emerald-500/15"
                    style={{ filter: "drop-shadow(0 0 4px rgba(52,211,153,0.6))" }}
                  />
                ) : item.status === "current" ? (
                  <span className="relative flex items-center justify-center w-[18px] h-[18px]">
                    <span className="absolute w-[22px] h-[22px] rounded-full bg-indigo-500/30 animate-ping" />
                    <span
                      className="w-[11px] h-[11px] rounded-full border-2 border-indigo-400 bg-color"
                      style={{ boxShadow: "0 0 8px 2px rgba(129,140,248,0.8)" }}
                    />
                  </span>
                ) : (
                  <span className="w-[10px] h-[10px] rounded-full border-2 border-slate-200 dark:border-white/15 bg-color" />
                )}
              </span>

              <span
                className={`text-xs font-bold flex-shrink-0 w-12 ${
                  item.status === "current" ? "text-indigo-400" : "subText-color"
                }`}
              >
                Day {item.day}
              </span>

              <span
                className={`text-xs sm:text-sm flex-1 min-w-0 truncate ${
                  item.status === "current" ? "font-semibold text-color" : "subText-color"
                }`}
              >
                {item.title}
              </span>

              {item.status === "current" && (
                <motion.span
                  animate={{ opacity: [0.7, 1, 0.7] }}
                  transition={{ duration: 1.8, repeat: Infinity }}
                  className="flex-shrink-0 text-[10px] font-semibold text-indigo-300 bg-indigo-500/15 border border-indigo-500/30 px-2 py-0.5 rounded-full"
                  style={{ boxShadow: "0 0 8px rgba(129,140,248,0.35)" }}
                >
                  Current
                </motion.span>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}