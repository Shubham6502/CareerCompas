import { motion } from "framer-motion";
import { useRoadmapContext } from "../../roadmap/roadmap.context.jsx";
import { ArrowRight, Clock, Target } from "lucide-react";

export default function ActiveModule({ module, onContinue }) {
  const { progress } = useRoadmapContext();

  let roadmapData = null;
  if (Array.isArray(module)) {
    const active = module.find(m => m.status === "active");
    roadmapData = active?.roadmap || module[0]?.roadmap || null;
  } else if (module?.status === "active") {
    roadmapData = module.roadmap;
  }

  if (!roadmapData) return (
    <div className="card-color rounded-2xl border border-slate-100 dark:border-white/8 p-5 flex flex-col items-center justify-center py-10 text-center">
      <div className="w-12 h-12 rounded-2xl subcard-color flex items-center justify-center mb-3">
        <Target size={20} className="subText-color" />
      </div>
      <p className="text-sm font-semibold text-color mb-1">No Active Roadmap</p>
      <p className="text-[12px] subText-color">Start a learning path to track your progress here.</p>
    </div>
  );

  const pct = Math.min(Math.round(progress || 0), 100);

  return (
    <motion.div initial={{ opacity:0, y:8 }} animate={{ opacity:1, y:0 }}
      transition={{ duration:0.35, delay:0.08 }}
      className="card-color rounded-2xl border border-slate-100 dark:border-white/8 p-5 relative overflow-hidden">
      <div className="absolute -top-10 -right-10 w-40 h-40 rounded-full bg-emerald-400/10 blur-3xl pointer-events-none" />
      <div className="absolute -bottom-8 -left-8 w-32 h-32 rounded-full bg-indigo-500/8 blur-3xl pointer-events-none" />

      <div className="relative z-10">
        <div className="flex items-center gap-2 mb-4">
          <span className="text-[10px] font-bold tracking-widest px-2.5 py-1 rounded-full"
            style={{ background:"rgba(52,211,153,0.12)", color:"#34d399", border:"1px solid rgba(52,211,153,0.25)" }}>
            ● ACTIVE ROADMAP
          </span>
        </div>

        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-shrink-0 w-full sm:w-28 h-20 rounded-2xl flex items-center justify-center"
            style={{ background:"radial-gradient(circle at 50% 50%,rgba(52,211,153,0.12),transparent)", border:"1px solid rgba(52,211,153,0.15)" }}>
            <motion.div animate={{ scale:[1,1.08,1], opacity:[0.7,1,0.7] }}
              transition={{ duration:3, repeat:Infinity, ease:"easeInOut" }}
              className="w-10 h-10 rounded-full"
              style={{ background:"radial-gradient(circle,#34d399,#059669)", boxShadow:"0 0 24px rgba(52,211,153,0.5)" }} />
          </div>

          <div className="flex-1 min-w-0">
            <h3 className="text-base font-bold text-color leading-snug mb-1">{roadmapData.goalRole}</h3>
            <div className="flex flex-wrap gap-1.5 mb-3">
              {[roadmapData.experienceLevel, roadmapData.targetType].filter(Boolean).map(tag => (
                <span key={tag} className="text-[10px] subText-color subcard-color px-2 py-0.5 rounded-full border border-slate-100 dark:border-white/8">{tag}</span>
              ))}
            </div>
            <div className="mb-3">
              <div className="flex items-center justify-between text-[10px] mb-1">
                <span className="subText-color">Overall Progress</span>
                <span className="font-bold text-emerald-400">{pct}%</span>
              </div>
              <div className="h-1.5 rounded-full subcard-color overflow-hidden">
                <motion.div initial={{ width:0 }} animate={{ width:`${pct}%` }}
                  transition={{ duration:0.8, ease:"easeOut" }}
                  className="h-full rounded-full bg-gradient-to-r from-emerald-400 to-blue-400"
                  style={{ boxShadow:"0 0 8px rgba(52,211,153,0.5)" }} />
              </div>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1 text-[10px] subText-color">
                <Clock size={10} />
                <span>{roadmapData.studyHoursPerDay}h/day · {roadmapData.timelineDays}-day plan</span>
              </div>
              <button onClick={onContinue}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-[11px] font-semibold transition-colors"
                style={{ boxShadow:"0 0 10px rgba(99,102,241,0.35)" }}>
                Continue <ArrowRight size={11} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}