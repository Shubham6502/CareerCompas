import { motion } from "framer-motion";
import { Link } from "react-router-dom";

const STAGE_STYLE = {
  Applied: "bg-indigo-50 dark:bg-indigo-500/15 text-indigo-600 dark:text-indigo-300",
  Screening: "subcard-color text-color",
  Interview: "subcard-color text-color",
  Offer: "bg-emerald-50 dark:bg-emerald-500/15 text-emerald-600 dark:text-emerald-400",
};

const FALLBACK_STAGES = [
  { label: "Applied", count: 12 },
  { label: "Screening", count: 5 },
  { label: "Interview", count: 3 },
  { label: "Offer", count: 1 },
];

const FALLBACK_TOP_APP = {
  company: "Tesla",
  role: "Machine Learning Engineer",
  appliedAgo: "Applied 2 days ago",
  matchPct: 85,
  logoBg: "bg-red-600",
  logoLetter: "T",
};

export default function JobPipeline({ stages, topApplication }) {
  const data = stages?.length ? stages : FALLBACK_STAGES;
  const top = topApplication || FALLBACK_TOP_APP;

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.1, ease: "easeOut" }}
      className="card-color rounded-2xl border border-slate-100 dark:border-white/10 shadow-sm p-5"
    >
      <div className="flex items-center justify-between mb-4">
        <p className="text-[11px] font-bold tracking-widest subText-color uppercase">Job Pipeline</p>
        <Link
          to="/jobtracker"
          className="text-[11px] font-semibold text-indigo-400 hover:text-indigo-300 transition-colors"
        >
          View All
        </Link>
      </div>

      <div className="grid grid-cols-4 gap-2 mb-4">
        {data.map((s, i) => (
          <motion.div
            key={s.label}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.05, duration: 0.25 }}
            className={`rounded-xl px-2 py-2.5 text-center ${STAGE_STYLE[s.label] || "subcard-color text-color"}`}
          >
            <p className="text-[10px] font-medium opacity-80 leading-none mb-1.5 truncate">{s.label}</p>
            <p className="text-lg font-bold leading-none">{s.count}</p>
          </motion.div>
        ))}
      </div>

      <p className="text-[10px] font-semibold tracking-wide subText-color uppercase mb-2">
        Top Application
      </p>
      <div className="flex items-center gap-3 subcard-color rounded-xl border border-slate-100 dark:border-white/5 p-2.5">
        <span
          className={`flex-shrink-0 w-9 h-9 rounded-lg ${top.logoBg || "bg-slate-500"} flex items-center justify-center text-white text-sm font-bold`}
        >
          {top.logoLetter || top.company?.[0] || "?"}
        </span>
        <div className="min-w-0 flex-1">
          <p className="text-xs font-semibold text-color truncate">{top.role}</p>
          <p className="text-[11px] subText-color">{top.company}</p>
          <p className="text-[10px] subText-color mt-0.5">{top.appliedAgo}</p>
        </div>
        {typeof top.matchPct === "number" && (
          <span className="flex-shrink-0 text-[10px] font-semibold text-emerald-500 bg-emerald-50 dark:bg-emerald-500/10 px-2 py-1 rounded-full">
            Good Match {top.matchPct}%
          </span>
        )}
      </div>
    </motion.div>
  );
}
