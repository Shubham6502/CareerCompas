import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRoadmapContext } from "../../roadmap/roadmap.context.jsx";
import { BookOpen, CheckCircle2 } from "lucide-react";

const COLORS = ["#818cf8", "#34d399", "#f59e0b", "#f472b6", "#38bdf8"];

export default function CourseProgress({ courses = [] }) {
  const [tab, setTab] = useState("running");
  const { progress } = useRoadmapContext();

  const running   = courses.filter(c => c.status === "active");
  const completed = courses.filter(c => c.status === "completed");

  const list = tab === "running" ? running : completed;

  return (
    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}
      className="card-color rounded-2xl border border-slate-100 dark:border-white/8 p-5">
      {/* Tabs */}
      <div className="flex items-center justify-between mb-4">
        <p className="text-[10px] font-bold tracking-widest uppercase text-indigo-400">Course Progress</p>
        <div className="flex gap-1 subcard-color rounded-xl p-0.5 border border-slate-100 dark:border-white/8">
          {["running", "completed"].map(t => (
            <button key={t} onClick={() => setTab(t)}
              className={`px-3 py-1 rounded-lg text-[10px] font-bold tracking-wide uppercase transition-all ${
                tab === t ? "bg-indigo-600 text-white shadow-sm" : "subText-color hover:text-color"
              }`}>
              {t}
            </button>
          ))}
        </div>
      </div>

      <AnimatePresence mode="wait">
        {list.length === 0 ? (
          <motion.div key="empty" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="text-center py-8 flex flex-col items-center gap-2">
            {tab === "running"
              ? <><BookOpen size={28} className="subText-color opacity-40" /><p className="text-[12px] subText-color">No active courses. Start a roadmap!</p></>
              : <><CheckCircle2 size={28} className="subText-color opacity-40" /><p className="text-[12px] subText-color">Completed courses will appear here.</p></>
            }
          </motion.div>
        ) : (
          <motion.div key={tab} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
            className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {list.map((course, i) => {
              const pct = tab === "running" ? (progress || 0) : 100;
              const color = COLORS[i % COLORS.length];
              return (
                <div key={course.roadmap?.goalRole || i}
                  className="subcard-color rounded-xl border border-slate-100 dark:border-white/6 p-3">
                  <div className="flex items-start justify-between mb-2">
                    <div className="min-w-0">
                      <p className="text-[12px] font-semibold text-color truncate">{course.roadmap?.goalRole}</p>
                      <p className="text-[10px] subText-color truncate">{course.roadmap?.experienceLevel}</p>
                    </div>
                    {tab === "completed" && (
                      <CheckCircle2 size={15} className="text-emerald-400 flex-shrink-0 mt-0.5"
                        style={{ filter: "drop-shadow(0 0 4px rgba(52,211,153,0.5))" }} />
                    )}
                  </div>
                  <div className="flex items-center justify-between text-[10px] mb-1.5">
                    <span className="subText-color">{course.roadmap?.timelineDays}-day roadmap</span>
                    <span className="font-bold" style={{ color }}>{pct}%</span>
                  </div>
                  <div className="h-1 rounded-full subcard-color dark:bg-white/6 overflow-hidden">
                    <motion.div initial={{ width: 0 }} animate={{ width: `${pct}%` }}
                      transition={{ duration: 0.7, ease: "easeOut", delay: i * 0.05 }}
                      className="h-full rounded-full"
                      style={{ background: color, boxShadow: `0 0 6px ${color}80` }} />
                  </div>
                </div>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}