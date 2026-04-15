import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Code2, BookOpen, Users, Zap } from "lucide-react";

const ACTIONS = [
  {
    icon: Code2,
    label: "Continue Coding",
    sub: "Pick up where you left off",
    bg: "bg-indigo-50 dark:bg-indigo-500/10",
    iconBg: "bg-indigo-100 dark:bg-indigo-500/20",
    iconColor: "text-indigo-500",
    to: "/roadmap",
    arrow: false,
  },
  {
    icon: BookOpen,
    label: "Study Resources",
    sub: "Curated materials",
    bg: "bg-amber-50 dark:bg-amber-500/10",
    iconBg: "bg-amber-100 dark:bg-amber-500/20",
    iconColor: "text-amber-500",
    to: "/resources",
    arrow: false,
  },
  {
    icon: Users,
    label: "Community",
    sub: "Connect with peers",
    bg: "bg-emerald-50 dark:bg-emerald-500/10",
    iconBg: "bg-emerald-100 dark:bg-emerald-500/20",
    iconColor: "text-emerald-500",
    to: "",
    arrow: false,
  },
  {
    icon: Zap,
    label: "Quick Practice",
    sub: "5-min coding challenge",
    bg: "bg-orange-50 dark:bg-orange-500/10",
    iconBg: "bg-orange-100 dark:bg-orange-500/20",
    iconColor: "text-orange-500",
    to: "#",
    arrow: true,
  },
];

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.07 } },
};
const card = {
  hidden: { opacity: 0, y: 18 },
  show:   { opacity: 1, y: 0, transition: { duration: 0.38, ease: "easeOut" } },
};

export default function QuickActions() {
  const navigate = useNavigate();
  return (
    <motion.div variants={container} initial="hidden" animate="show"
      className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
      {ACTIONS.map((a) => {
        const Icon = a.icon;
        return (
          <motion.button key={a.label} variants={card}
            whileHover={{ scale: 1.025, y: -3 }} whileTap={{ scale: 0.97 }}
            onClick={() => navigate(a.to)}
            className={`${a.bg} rounded-2xl p-4 sm:p-5 text-left border border-transparent
              hover:border-slate-200/70 dark:hover:border-white/10 transition-colors duration-200 group w-full`}>
            <div className="flex items-start justify-between mb-3">
              <div className={`${a.iconBg} ${a.iconColor} w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0`}>
                <Icon size={19}  />
              </div>
              {a.arrow && (
                <span className={`${a.iconColor} opacity-50 group-hover:opacity-100 transition-all duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5`}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <path d="M7 17L17 7M17 7H7M17 7v10"/>
                  </svg>
                </span>
              )}
            </div>
            <p className="text-sm font-semibold text-color">{a.label}</p>
            <p className="hidden md:block text-xs subText-color mt-0.5 leading-snug">{a.sub}</p>
          </motion.button>
        );
      })}
    </motion.div>
  );
}