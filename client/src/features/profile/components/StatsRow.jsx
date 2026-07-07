import { motion } from "framer-motion";
import { Trophy, Zap } from "lucide-react";

export default function StatsRow({ rankData = {} }) {
  const STATS = [
    {
      label: "Global Ranking",
      value: rankData.rank && rankData.rank !== -1 ? `#${rankData.rank}` : "—",
      icon: Trophy,
      color: "#f59e0b",
      glow: "rgba(245,158,11,0.25)",
      bg: "rgba(245,158,11,0.10)",
    },
    {
      label: "Experience Points",
      value: rankData.xp ? rankData.xp.toLocaleString() : "0",
      icon: Zap,
      color: "#818cf8",
      glow: "rgba(129,140,248,0.25)",
      bg: "rgba(129,140,248,0.10)",
    },
  ];

  return (
    <div className="grid grid-cols-2 gap-3">
      {STATS.map((s, i) => {
        const Icon = s.icon;
        return (
          <motion.div key={s.label}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08, duration: 0.35 }}
            className="card-color rounded-2xl border border-slate-100 dark:border-white/8 p-4 relative overflow-hidden">
            <div className="absolute inset-0 pointer-events-none"
              style={{ background: `radial-gradient(ellipse at 80% 20%, ${s.glow} 0%, transparent 70%)` }} />
            <div className="w-8 h-8 rounded-xl flex items-center justify-center mb-3 relative z-10"
              style={{ background: s.bg, boxShadow: `0 0 10px ${s.glow}` }}>
              <Icon size={15} style={{ color: s.color }} />
            </div>
            <p className="text-2xl font-bold text-color leading-none mb-1 relative z-10"
              style={{ color: s.color }}>{s.value}</p>
            <p className="text-[10px] font-semibold tracking-widest uppercase subText-color relative z-10">{s.label}</p>
          </motion.div>
        );
      })}
    </div>
  );
}