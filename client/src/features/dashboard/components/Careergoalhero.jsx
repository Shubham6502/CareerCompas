import { motion } from "framer-motion";
import { Pencil } from "lucide-react";

/**
 * Hero card — "Your Career Goal"
 * Fed by roadmapInfo (goalRole, targetCompany, timelineDays) + currentDay.
 * Falls back to sensible dummy data when fields are missing so the card
 * never looks broken before the roadmap finishes loading.
 */
export default function CareerGoalHero({ roadmapInfo = {}, currentDay = 1 }) {
  const goalRole = roadmapInfo.goalRole || "Software Engineer";
  const targetCompany = roadmapInfo.targetCompany || "Google";
  const timelineDays = roadmapInfo.timelineDays || 90;

  const day = Math.min(currentDay || 1, timelineDays);
  const pct = timelineDays ? Math.min(Math.round((day / timelineDays) * 100), 100) : 0;
  const daysRemaining = Math.max(timelineDays - day, 0);

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="card-color rounded-2xl border border-slate-100 dark:border-white/10 shadow-sm
        p-5 sm:p-6 mb-5 relative overflow-hidden"
    >
      {/* Ambient glow wash bleeding from the illustration into the card */}
      <div
        className="hidden sm:block absolute -top-10 -right-10 w-72 h-72 rounded-full
          bg-purple-600/25 dark:bg-purple-500/20 blur-[80px] pointer-events-none"
        aria-hidden="true"
      />

      <div className="flex items-start justify-between gap-4 relative z-10">
        {/* Left: text content */}
        <div className="flex-1 min-w-0">
          <p className="text-[11px] font-bold tracking-widest subText-color uppercase mb-2">
            Your Career Goal
          </p>

          <div className="flex items-center gap-2 mb-4 sm:mb-5">
            <h2 className="text-xl sm:text-2xl lg:text-[28px] font-bold text-color leading-tight">
              {goalRole}
            </h2>
            <button
              type="button"
              aria-label="Edit career goal"
              className="flex-shrink-0 w-6 h-6 rounded-md flex items-center justify-center
                subText-color hover:text-color hover:bg-slate-100 dark:hover:bg-white/10 transition-colors"
            >
              <Pencil size={13} />
            </button>
          </div>

          <p className="text-[11px] font-medium subText-color uppercase tracking-wide mb-1.5">
            Target Company
          </p>
          <p className="text-sm sm:text-base font-bold text-color mb-5 sm:mb-6">
            {targetCompany}
          </p>

          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium subText-color">Overall Progress</span>
            <span className="text-lg sm:text-xl font-bold text-color">{pct}%</span>
          </div>

          <div className="h-2 rounded-full subcard-color overflow-hidden mb-2.5 relative">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${pct}%` }}
              transition={{ duration: 0.8, ease: "easeOut", delay: 0.15 }}
              className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-purple-400 relative"
              style={{ boxShadow: "0 0 12px 1px rgba(167,139,250,0.7), 0 0 4px rgba(167,139,250,0.9)" }}
            >
              <span className="absolute right-0 top-1/2 -translate-y-1/2 w-2.5 h-2.5 rounded-full bg-purple-200 blur-[2px]" />
            </motion.div>
          </div>

          <div className="flex items-center justify-between text-[11px] sm:text-xs subText-color">
            <span>
              Day {day} of {timelineDays}
            </span>
            <span>{daysRemaining} days remaining</span>
          </div>
        </div>

        {/* Right: illustration — hidden on small screens to keep things tight */}
        <div className="hidden sm:block flex-shrink-0 w-[120px] md:w-[150px] lg:w-[170px] self-center relative z-10">
          <GoalIllustration />
        </div>
      </div>
    </motion.div>
  );
}

function GoalIllustration() {
  return (
    <svg viewBox="0 0 170 170" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-auto">
      <defs>
        <linearGradient id="goalGlow" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#c4b5fd" />
          <stop offset="100%" stopColor="#6366f1" />
        </linearGradient>
        <radialGradient id="goalRadial" cx="50%" cy="35%" r="65%">
          <stop offset="0%" stopColor="#a855f7" stopOpacity="0.55" />
          <stop offset="55%" stopColor="#7c3aed" stopOpacity="0.2" />
          <stop offset="100%" stopColor="#7c3aed" stopOpacity="0" />
        </radialGradient>
        <filter id="goalBlurGlow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="4" />
        </filter>
      </defs>

      <circle cx="85" cy="58" r="78" fill="url(#goalRadial)" />

      {/* Isometric step path */}
      {[
        [30, 130],
        [55, 118],
        [80, 106],
        [105, 94],
        [130, 82],
      ].map(([x, y], i) => (
        <motion.rect
          key={i}
          x={x - 13}
          y={y - 7}
          width="26"
          height="14"
          rx="3"
          fill="#1e1b3a"
          stroke="url(#goalGlow)"
          strokeWidth="1.3"
          initial={{ opacity: 0, y: y + 8 }}
          animate={{ opacity: 1, y }}
          transition={{ delay: 0.2 + i * 0.08, duration: 0.4, ease: "easeOut" }}
          style={{ filter: "drop-shadow(0 0 5px rgba(139,92,246,0.55))" }}
        />
      ))}

      {/* Connecting dotted line, lit */}
      <path
        d="M30 130 L55 118 L80 106 L105 94 L130 82"
        stroke="#a78bfa"
        strokeWidth="1.2"
        strokeDasharray="3 4"
        opacity="0.65"
        style={{ filter: "drop-shadow(0 0 3px rgba(167,139,250,0.6))" }}
      />

      {/* Glowing nodes along the path */}
      {[
        [30, 130],
        [80, 106],
        [130, 82],
      ].map(([x, y], i) => (
        <g key={i}>
          <circle cx={x} cy={y} r="7" fill="#a78bfa" opacity="0.18" filter="url(#goalBlurGlow)" />
          <motion.circle
            cx={x}
            cy={y}
            r="3"
            fill="#d8b4fe"
            initial={{ opacity: 0.4 }}
            animate={{ opacity: [0.4, 1, 0.4] }}
            transition={{ duration: 2, repeat: Infinity, delay: i * 0.4 }}
            style={{ filter: "drop-shadow(0 0 5px rgba(216,180,254,0.9))" }}
          />
        </g>
      ))}

      {/* Target rings, top right, glowing */}
      <g transform="translate(132, 26)" style={{ filter: "drop-shadow(0 0 6px rgba(168,85,247,0.55))" }}>
        <circle r="24" fill="none" stroke="#a78bfa" strokeWidth="1.5" opacity="0.3" />
        <circle r="16" fill="none" stroke="#a78bfa" strokeWidth="1.5" opacity="0.5" />
        <circle r="8" fill="none" stroke="#c4b5fd" strokeWidth="1.5" opacity="0.8" />
        <motion.circle
          r="2.5"
          fill="#e9d5ff"
          animate={{ opacity: [0.6, 1, 0.6] }}
          transition={{ duration: 1.8, repeat: Infinity }}
        />
      </g>

      {/* Flag at the end of the path */}
      <g transform="translate(130, 82)">
        <line x1="0" y1="0" x2="0" y2="-24" stroke="#d8b4fe" strokeWidth="1.5" />
        <path d="M0 -24 L15 -19.5 L0 -15 Z" fill="#f472b6" style={{ filter: "drop-shadow(0 0 4px rgba(244,114,182,0.7))" }} />
      </g>
    </svg>
  );
}