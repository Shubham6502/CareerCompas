import { motion } from "framer-motion";
import { Flame, Zap, Target, Code2, Clock, TrendingUp } from "lucide-react";
import { useMemo } from "react";
import { useDashboardContext } from "../Dashboard.context.jsx";

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.06 } },
};
const card = {
  hidden: { opacity: 0, y: 14 },
  show:   { opacity: 1, y: 0, transition: { duration: 0.35, ease: "easeOut" } },
};

function StatCard({ icon: Icon, iconColor, label, value, unit, sub }) {



  return (
    <motion.div variants={card} whileHover={{ y: -2 }}
      className="card-color  rounded-2xl border border-slate-100 dark:border-white/10
        p-4 sm:p-5 shadow-sm hover:shadow-md transition-shadow duration-200">
      <div className="flex items-center gap-2 mb-3">
        <Icon size={15} className={`${iconColor} flex-shrink-0`} />
        <span className="text-[11px] font-semibold tracking-widest text-color uppercase">
          {label}
        </span>
      </div>
      <div className="flex items-baseline gap-1.5">
        <span className="text-2xl sm:text-3xl font-bold text-color leading-none">
          {value}
        </span>
        {unit && (
          <span className="text-sm subText-color font-medium">{unit}</span>
        )}
      </div>
      {sub && (
        <p className="text-xs text-slate-400 dark:text-white/30 mt-1">{sub}</p>
      )}
    </motion.div>
  );
}

export default function StatsGrid({ activeDayData, progress = {}, roadmapInfo = {}, doneCount = 0, totalCount = 0, completedTasksToday }) {
console.log(activeDayData);
  const pct = totalCount ? Math.min(Math.round((doneCount / totalCount) * 100), 100) : 0;
    const { currentUserRank, totalUsers } = useDashboardContext();
  
 const hr =useMemo(() => {
  return activeDayData.tasks.reduce((sum, t) => {
    return completedTasksToday.includes(t.id) ? sum + t.mins : sum;
  }, 0);
}, [activeDayData, completedTasksToday]);

  

  const STATS = [
    {
      icon: Flame,
      iconColor: "text-orange-500",
      label: "Streak",
      value: progress.currentStreak ?? 0,
      unit: "days",
    },
    {
      icon: Zap,
      iconColor: "text-violet-500",
      label: "Total XP",
      value: progress.xp ?? 0,
      unit: null,
    },
    {
      icon: Target,
      iconColor: "text-emerald-500",
      label: "Completion",
      value: pct,
      unit: "%",
    },
    {
      icon: Code2,
      iconColor: "text-blue-500",
      label: "Problems",
      value: doneCount,
      unit: "solved",
    },
    {
      icon: Clock,
      iconColor: "text-amber-500",
      label: "Study Time",
      value: (hr/ 60).toPrecision(2) || 0,
      unit: "hrs",
    },
    {
      icon: TrendingUp,
      iconColor: "text-rose-500",
      label: "Rank",
      value: currentUserRank ??"-",
      unit: `/ ${totalUsers.toLocaleString()}`,
    },
  ];

  return (
    <motion.div variants={container} initial="hidden" animate="show"
      className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-6">
      {STATS.map((s) => <StatCard key={s.label} {...s} />)}
    </motion.div>
  );
}