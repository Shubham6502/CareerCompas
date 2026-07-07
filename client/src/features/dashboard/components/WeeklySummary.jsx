import { motion } from "framer-motion";
import { useState } from "react";
import { ChevronDown } from "lucide-react";

/**
 * Tiny inline sparkline — no charting lib needed for a 4-card trend strip.
 * Points are normalized to the viewBox so any data shape renders cleanly.
 */
function Sparkline({ points, color }) {
  const w = 64;
  const h = 22;
  const min = Math.min(...points);
  const max = Math.max(...points);
  const range = max - min || 1;

  const coords = points.map((p, i) => {
    const x = (i / (points.length - 1)) * w;
    const y = h - ((p - min) / range) * h;
    return `${x},${y}`;
  });

  const path = "M" + coords.join(" L");
  const lastPoint = coords[coords.length - 1].split(",");

  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="w-16 h-[22px] overflow-visible">
      <motion.path
        d={path}
        fill="none"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        initial={{ pathLength: 0, opacity: 0 }}
        animate={{ pathLength: 1, opacity: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        style={{ filter: `drop-shadow(0 0 3px ${color}80)` }}
      />
      <motion.circle
        cx={lastPoint[0]}
        cy={lastPoint[1]}
        r="2"
        fill={color}
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.6, duration: 0.25 }}
        style={{ filter: `drop-shadow(0 0 4px ${color})` }}
      />
    </svg>
  );
}

const RANGE_OPTIONS = ["This Week", "Last Week", "This Month"];

export default function WeeklySummary({
  xpGained = 320,
  tasksDone = 12,
  focusHours = 8.4,
  goalProgressDelta = 12,
}) {
  const [range, setRange] = useState(RANGE_OPTIONS[0]);
  const [open, setOpen] = useState(false);

  const METRICS = [
    { label: "XP Gained", value: `+${xpGained}`, unit: null, color: "#818cf8", trend: [4, 7, 5, 9, 8, 11, 12] },
    { label: "Tasks Done", value: tasksDone, unit: null, color: "#38bdf8", trend: [2, 3, 3, 5, 6, 8, 12] },
    { label: "Focus Time", value: focusHours, unit: "hrs", color: "#34d399", trend: [1, 2, 1.5, 3, 4, 6, 8.4] },
    { label: "Goal Progress", value: `+${goalProgressDelta}%`, unit: "vs last week", color: "#34d399", trend: [2, 4, 5, 7, 9, 10, 12] },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="card-color rounded-2xl border border-slate-100 dark:border-white/10 shadow-sm p-5"
    >
      <div className="flex items-center justify-between mb-4">
        <p className="text-[11px] font-bold tracking-widest subText-color uppercase">
          Weekly Summary
        </p>
        <div className="relative">
          <button
            onClick={() => setOpen((o) => !o)}
            className="flex items-center gap-1 text-[11px] font-medium subText-color hover:text-color transition-colors"
          >
            {range}
            <ChevronDown size={12} className={`transition-transform ${open ? "rotate-180" : ""}`} />
          </button>
          {open && (
            <div className="absolute right-0 top-full mt-1.5 z-20 card-color border border-slate-100 dark:border-white/10 rounded-xl shadow-lg overflow-hidden min-w-[120px]">
              {RANGE_OPTIONS.map((opt) => (
                <button
                  key={opt}
                  onClick={() => {
                    setRange(opt);
                    setOpen(false);
                  }}
                  className={`w-full text-left px-3 py-2 text-xs font-medium transition-colors ${
                    opt === range
                      ? "text-indigo-400 bg-indigo-500/10"
                      : "text-color hover:bg-slate-50 dark:hover:bg-white/5"
                  }`}
                >
                  {opt}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        {METRICS.map((m, i) => (
          <motion.div
            key={m.label}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.06, duration: 0.3 }}
            className="subcard-color rounded-xl border border-slate-100 dark:border-white/5 p-3 "
          >
            {/* <div className=" flex flex-col col-auto items-center  mb-1.5"> */}
            <p className="text-[10px] font-semibold tracking-wide subText-color uppercase mb-2">
              {m.label}
            </p>
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-baseline gap-1">
                <span className="text-lg font-bold text-color leading-none">{m.value}</span>
                {m.unit && <span className="text-[10px] subText-color">{m.unit}</span>}
              </div>
              </div>
              <div className="flex-shrink-0">
              <Sparkline points={m.trend} color={m.color} />
              
            </div>
            {/* </div> */}
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
