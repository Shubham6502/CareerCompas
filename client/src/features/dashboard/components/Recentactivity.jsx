import { motion } from "framer-motion";
import { CheckCircle2, Code2, PlayCircle, Zap } from "lucide-react";

const ICON_MAP = {
  TaskCompletion: { icon: CheckCircle2, color: "#34d399", bg: "bg-emerald-500/15" },
  DayCompletion: { icon: CheckCircle2, color: "#34d399", bg: "bg-emerald-500/15" },
  CodeSolved: { icon: Code2, color: "#818cf8", bg: "bg-indigo-500/15" },
  Practice: { icon: Code2, color: "#818cf8", bg: "bg-indigo-500/15" },
  Watched: { icon: PlayCircle, color: "#c084fc", bg: "bg-purple-500/15" },
  XPUpdate: { icon: Zap, color: "#fbbf24", bg: "bg-amber-500/15" },
  default: { icon: Zap, color: "#fbbf24", bg: "bg-amber-500/15" },
};

const FALLBACK_ACTIVITY = [
  { _id: "f1", type: "TaskCompletion", text: 'Completed "Model Evaluation"', xp: 40, ago: "2h ago" },
  { _id: "f2", type: "CodeSolved", text: "Solved 2 problems on LeetCode", xp: 60, ago: "5h ago" },
  { _id: "f3", type: "Watched", text: 'Watched "Attention Mechanism"', xp: 30, ago: "Yesterday" },
];

function timeAgo(dateStr) {
  if (!dateStr) return "";
  const diffMs = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diffMs / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  if (days === 1) return "Yesterday";
  return `${days}d ago`;
}

export default function RecentActivity({ activityLogs }) {
  const raw = activityLogs?.activity?.slice(-5).reverse() ?? [];

  const items = raw.length
    ? raw.map((log) => ({
        _id: log._id || Math.random().toString(),
        type: log.activityType,
        text: log.details || "Activity logged",
        xp: log.xpEarned ?? log.xp ?? 0,
        ago: timeAgo(log.createdAt),
      }))
    : FALLBACK_ACTIVITY;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.15, ease: "easeOut" }}
      className="card-color rounded-2xl border border-slate-100 dark:border-white/10 shadow-sm p-5 h-full"
    >
      <p className="text-[11px] font-bold tracking-widest subText-color uppercase mb-4">
        Recent Activity
      </p>

      <div className="space-y-3.5">
        {items.map((item, i) => {
          const { icon: Icon, color, bg } = ICON_MAP[item.type] || ICON_MAP.default;
          return (
            <motion.div
              key={item._id}
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.06, duration: 0.3, ease: "easeOut" }}
              className="flex items-center gap-3"
            >
              <span
                className={`flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center ${bg}`}
                style={{ boxShadow: `0 0 10px ${color}40` }}
              >
                <Icon size={15} style={{ color, filter: `drop-shadow(0 0 3px ${color}80)` }} />
              </span>

              <div className="flex-1 min-w-0">
                <p className="text-xs sm:text-sm text-color leading-snug truncate">{item.text}</p>
              </div>

              <div className="flex-shrink-0 text-right">
                <p className="text-[11px] font-semibold text-emerald-400">Earned {item.xp} XP</p>
                <p className="text-[10px] subText-color">{item.ago}</p>
              </div>
            </motion.div>
          );
        })}

        {items.length === 0 && (
          <p className="text-xs subText-color text-center py-6">No recent activity yet.</p>
        )}
      </div>
    </motion.div>
  );
}