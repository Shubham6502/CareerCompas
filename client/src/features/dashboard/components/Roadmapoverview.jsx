import { motion } from "framer-motion";
import { Check, Lock } from "lucide-react";

/**
 * "Roadmap Overview" — horizontal phase stepper (Foundation -> Deployment).
 * Phase boundaries aren't in the API yet, so they're derived proportionally
 * from timelineDays — this keeps the stepper accurate as roadmaps of
 * different lengths come in, rather than hardcoding day ranges.
 */
const PHASE_NAMES = [
  "Foundation",
  "Core Concepts",
  "ML Basics",
  "Deep Learning",
  "Advanced ML",
  "Deployment",
];

function buildPhases(timelineDays, currentDay) {
  const n = PHASE_NAMES.length;
  const base = Math.floor(timelineDays / n);
  let start = 1;

  return PHASE_NAMES.map((name, i) => {
    const isLast = i === n - 1;
    const length = isLast ? timelineDays - start + 1 : base;
    const end = start + length - 1;

    let status = "locked";
    if (currentDay > end) status = "done";
    else if (currentDay >= start && currentDay <= end) status = "current";

    const phase = { name, start, end, status };
    start = end + 1;
    return phase;
  });
}

export default function RoadmapOverview({ timelineDays = 90, currentDay = 1 }) {
  const phases = buildPhases(timelineDays, currentDay);

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="card-color rounded-2xl border border-slate-100 dark:border-white/10 shadow-sm p-5 mb-5 hidden md:block"
    >
      <p className="text-[11px] font-bold tracking-widest subText-color uppercase mb-5">
        Roadmap Overview
      </p>

      <div className="overflow-x-auto -mx-1 px-1" style={{ scrollbarWidth: "none" }}>
        <div className="flex items-start min-w-[560px] sm:min-w-0">
          {phases.map((phase, i) => (
            <div key={phase.name} className="flex items-start flex-1">
              {/* node + connecting line */}
              <div className="flex flex-col items-center flex-shrink-0 w-9">
                <PhaseNode status={phase.status} index={i} />
              </div>

              {/* connector line to next node (omit after last) */}
              {i < phases.length - 1 && (
                <div className="flex-1 h-[3px] mt-[16px] mx-0.5 rounded-full overflow-hidden subcard-color relative">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{
                      width: phase.status === "done" ? "100%" : phase.status === "current" ? "50%" : "0%",
                    }}
                    transition={{ duration: 0.6, delay: 0.2 + i * 0.05, ease: "easeOut" }}
                    className="h-full bg-gradient-to-r from-emerald-400 to-indigo-400"
                    style={{ boxShadow: "0 0 8px 1px rgba(99,102,241,0.55)" }}
                  />
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="flex min-w-[560px] sm:min-w-0 mt-3">
          {phases.map((phase, i) => (
            <div key={phase.name} className="flex-1 flex flex-col items-start" style={{ minWidth: 0 }}>
              <p
                className={`text-xs sm:text-[13px] font-semibold leading-tight ${
                  phase.status === "locked" ? "subText-color opacity-60" : "text-color"
                }`}
              >
                {phase.name}
              </p>
              <p className="text-[10px] sm:text-[11px] subText-color mt-0.5">
                Days {phase.start}-{phase.end}
              </p>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}

function PhaseNode({ status, index }) {
  if (status === "done") {
    return (
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: index * 0.05, duration: 0.3, ease: "easeOut" }}
        className="w-[26px] h-[26px] rounded-full bg-emerald-500 flex items-center justify-center"
        style={{ boxShadow: "0 0 10px 2px rgba(52,211,153,0.5)" }}
      >
        <Check size={14} className="text-white" strokeWidth={3} />
      </motion.div>
    );
  }

  if (status === "current") {
    return (
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: index * 0.05, duration: 0.3, ease: "easeOut" }}
        className="relative w-[30px] h-[30px] flex items-center justify-center "
      >
        <span className="absolute w-[34px] h-[34px] rounded-full bg-indigo-500/25 animate-ping" />
        <span
          className="w-[26px] h-[26px] rounded-full border-[2.5px] border-indigo-400 bg-color flex items-center justify-center"
          style={{ boxShadow: "0 0 8px 3px rgba(129,140,248,0.7)" }}
        >
          <span
            className="w-2.5 h-2.5 rounded-full bg-indigo-400"
            style={{ boxShadow: "0 0 6px rgba(129,140,248,0.9)" }}
          />
        </span>
      </motion.div>
    );
  }

  return (
    <div className="w-[26px] h-[26px] rounded-full subcard-color border border-slate-200 dark:border-white/10 flex items-center justify-center">
      <Lock size={11} className="subText-color opacity-50" />
    </div>
  );
}