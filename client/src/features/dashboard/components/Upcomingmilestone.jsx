import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { Trophy } from "lucide-react";

/**
 * "Upcoming Milestone" — live countdown to the next phase boundary.
 * targetDate falls back to 7 days from now when not supplied, so the
 * card always renders a believable countdown rather than zeros/NaN.
 */
function getRemaining(targetDate) {
  const diff = Math.max(targetDate.getTime() - Date.now(), 0);
  const days = Math.floor(diff / 86400000);
  const hrs = Math.floor((diff % 86400000) / 3600000);
  const mins = Math.floor((diff % 3600000) / 60000);
  const secs = Math.floor((diff % 60000) / 1000);
  return { days, hrs, mins, secs };
}

export default function UpcomingMilestone({ title, targetDate }) {
  const target = targetDate || new Date(Date.now() + 7 * 86400000 + 45 * 60000);
  const milestoneTitle = title || "Deep Learning Fundamentals";

  const [remaining, setRemaining] = useState(() => getRemaining(target));

  useEffect(() => {
    const id = setInterval(() => setRemaining(getRemaining(target)), 1000);
    return () => clearInterval(id);
  }, [target]);

  const units = [
    { label: "Days", value: remaining.days },
    { label: "Hrs", value: remaining.hrs },
    { label: "Mins", value: remaining.mins },
    { label: "Secs", value: remaining.secs },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.2, ease: "easeOut" }}
      className="card-color rounded-2xl border border-slate-100 dark:border-white/10 shadow-sm p-5 h-full
        flex flex-col sm:flex-row items-center sm:items-stretch justify-between gap-4 relative overflow-hidden"
    >
      <div
        className="absolute -bottom-12 -right-12 w-56 h-56 rounded-full bg-purple-600/25 dark:bg-purple-500/25 blur-[70px] pointer-events-none"
        aria-hidden="true"
      />

      <div className="flex-1 min-w-0 z-10">
        <p className="text-[11px] font-bold tracking-widest subText-color uppercase mb-2">
          Upcoming Milestone
        </p>
        <p className="text-base sm:text-lg font-bold text-color leading-snug mb-4 sm:mb-6">
          {milestoneTitle}
        </p>

        <div className="flex items-center gap-2 sm:gap-3">
          {units.map((u, i) => (
            <div key={u.label} className="flex items-center gap-2 sm:gap-3">
              <div className="flex flex-col items-center">
                <span className="text-xl sm:text-2xl font-bold text-color tabular-nums leading-none">
                  {String(u.value).padStart(2, "0")}
                </span>
                <span className="text-[9px] subText-color uppercase tracking-wide mt-1">
                  {u.label}
                </span>
              </div>
              {i < units.length - 1 && (
                <span className="text-color opacity-30 text-lg font-bold -mt-3">:</span>
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="flex-shrink-0 relative w-[72px] h-[72px] sm:w-[90px] sm:h-[90px] flex items-center justify-center z-10">
        <span className="absolute w-full h-full rounded-full bg-purple-500/35 blur-2xl" />
        <motion.div
          animate={{ y: [0, -4, 0] }}
          transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
          className="relative z-10"
        >
          <Trophy
            size={40}
            className="text-purple-300 sm:w-[52px] sm:h-[52px]"
            strokeWidth={1.5}
            style={{ filter: "drop-shadow(0 0 14px rgba(192,132,252,0.85))" }}
          />
        </motion.div>
      </div>
    </motion.div>
  );
}