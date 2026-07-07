import { motion } from "framer-motion";
import { Sparkles, ChevronRight, Star } from "lucide-react";

export default function AICoach({
  message,
  recommendation,
  onAskAnything,
}) {
  const tip =
    message ||
    "Focus more on System Design. It will boost your interview readiness.";

  const rec =
    recommendation || {
      title: "System Design Interview",
      author: "Alex Xu",
      lessons: 12,
      rating: 4.8,
    };

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.05, ease: "easeOut" }}
      className="card-color rounded-2xl border border-slate-100 dark:border-white/10 shadow-sm p-5"
    >
      <div className="flex items-center justify-between mb-4">
        <p className="text-[11px] font-bold tracking-widest subText-color uppercase">AI Coach</p>
        <button
          onClick={onAskAnything}
          className="flex items-center gap-0.5 text-[11px] font-semibold text-indigo-400 hover:text-indigo-300 transition-colors"
        >
          Ask Anything
          <ChevronRight size={13} />
        </button>
      </div>

      {/* Tip bubble */}
      <div className="relative rounded-xl p-3.5 mb-4 overflow-hidden bg-gradient-to-br from-indigo-500/15 via-purple-500/10 to-transparent border border-indigo-500/20">
        <div
          className="absolute -top-6 -right-6 w-20 h-20 rounded-full bg-purple-500/30 blur-2xl pointer-events-none"
          aria-hidden="true"
        />
        <div className="relative flex items-start gap-2.5">
          <motion.span
            animate={{ scale: [1, 1.08, 1] }}
            transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
            className="flex-shrink-0 w-7 h-7 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center shadow-[0_0_14px_rgba(124,58,237,0.5)]"
          >
            <Sparkles size={13} className="text-white" />
          </motion.span>
          <div className="min-w-0">
            <p className="text-sm font-semibold text-color leading-snug">
              You're doing great! 🔥
            </p>
            <p className="text-xs subText-color leading-snug mt-0.5">{tip}</p>
          </div>
        </div>
      </div>

      {/* Recommendation */}
      <p className="text-[10px] font-semibold tracking-wide subText-color uppercase mb-2.5">
        Recommended for you
      </p>
      <button className="w-full flex items-center gap-3 subcard-color rounded-xl border border-slate-100 dark:border-white/5 p-2.5 hover:border-indigo-300 dark:hover:border-indigo-500/30 transition-colors text-left group">
        <span className="flex-shrink-0 w-11 h-12 rounded-lg bg-gradient-to-br from-indigo-600 to-purple-700 flex items-center justify-center shadow-sm">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.8">
            <path d="M4 4h11a2 2 0 0 1 2 2v14H6a2 2 0 0 1-2-2V4z" />
            <path d="M4 4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2" />
          </svg>
        </span>
        <div className="min-w-0 flex-1">
          <p className="text-xs font-semibold text-color leading-snug truncate group-hover:text-indigo-400 transition-colors">
            {rec.title}
          </p>
          <p className="text-[11px] subText-color mt-0.5">by {rec.author}</p>
          <div className="flex items-center gap-1 mt-1 text-[11px] subText-color">
            <span>{rec.lessons} Lessons</span>
            <span>·</span>
            <span className="flex items-center gap-0.5">
              {rec.rating}
              <Star size={10} className="text-amber-400 fill-amber-400" />
            </span>
          </div>
        </div>
      </button>
    </motion.div>
  );
}
