import { motion, AnimatePresence } from "framer-motion";
import { Clock, Circle, CheckCircle2 } from "lucide-react";
import { Link } from "react-router-dom";
import { useCallback } from "react";

const DIFF_STYLE = {
  Easy:   "bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400",
  Medium: "bg-amber-50  text-amber-600  dark:bg-amber-500/10  dark:text-amber-400",
  Hard:   "bg-red-50    text-red-600    dark:bg-red-500/10    dark:text-red-400",
};

const fmtTime = (m) =>
  m >= 60 ? `${Math.floor(m / 60)}h ${m % 60 ? m % 60 + "m" : ""}`.trim() : `${m}m`;

function TaskItem({ task, onToggle, task_completion, roadmapInfo, totalCount, currentDay, index, completedTasksToday, pendingTasks }) {
 
  const handleClick = useCallback(() => {
    
    onToggle(task.id, task.difficulty, roadmapInfo?.roadmapId, totalCount, currentDay);
 
  }, [task.id, task.difficulty, onToggle, roadmapInfo, totalCount, currentDay]);
console.log("Rendering TaskItem:", { task, completedTasksToday, pendingTasks });
  return (
    <motion.div
      initial={{ opacity: 0, x: -12 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.07, duration: 0.32, ease: "easeOut" }}
      className={`flex items-center gap-3 sm:gap-4 py-3.5 px-4 rounded-xl border transition-all duration-200 group
        ${completedTasksToday.includes(task.id)
          ? "subcard-color border-slate-100 dark:border-white/5"
          : "subcard-color border-slate-100 dark:border-white/10 hover:border-indigo-200 dark:hover:border-indigo-500/30 hover:shadow-sm"
        }`}
    >
      {/* Checkbox */}
      <button onClick={handleClick}
      disabled={pendingTasks.has(task.id)}
        className="flex-shrink-0 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400 rounded-full">
          
        <motion.div whileTap={{ scale: 0.85 }}>
          {completedTasksToday.includes(task.id)
            ? <CheckCircle2 size={20} className="text-indigo-500 pointer-events-none" />
            : <Circle size={20} className="text-slate-300 dark:text-white/20 group-hover:text-indigo-300 transition-colors" />
          }
        </motion.div>
      </button>

      {/* Title + meta */}
      <div className="flex-1 min-w-0">
        <Link to={task.resourceUrl || "#"} target="_blank" rel="noopener noreferrer"
          onClick={(e) => e.stopPropagation()}
          className={`text-sm font-medium leading-snug  decoration-indigo-300 underline-offset-2 transition-colors
            ${task.done ? " subText-color" : "text-color "}`}>
          {task.title}
        </Link>
        <div className="flex items-center gap-2 mt-0.5">
          <span className="text-[11px] subText-color capitalize">
            {task.category}
          </span>
          <span className="subText-color">·</span>
          <span className="text-[11px] subText-color">
            {fmtTime(task.mins)}
          </span>
        </div>
      </div>

      {/* Difficulty badge */}
      <span className={`flex-shrink-0 text-[11px] font-semibold px-2.5 py-1 rounded-lg ${DIFF_STYLE[task.difficulty] || DIFF_STYLE.Easy}`}>
        {task.difficulty}
      </span>
    </motion.div>
  );
}

export default function TodaysMission({
  activeDayData,
  allDays,
  selectedDay,
  onSelectDay,
  onToggle,
  task_completion,
  roadmapInfo,
  totalCount,
  completedTasksToday,
  pendingTasks,
  loading,
}) {
  if (loading) {
    return (
      <div className="card-color  rounded-2xl border border-slate-100 dark:border-white/10 shadow-sm p-5 mb-5">
        <div className="space-y-3">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-14 rounded-xl subcard-color animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  const done  = completedTasksToday.length ?? 0;
  const total = activeDayData?.tasks.length ?? 0;
  const totalMins = activeDayData?.tasks.reduce((s, t) => s + (t.mins || 0), 0) ?? 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="card-color  rounded-2xl border border-slate-100 dark:border-white/10 shadow-sm mb-5 overflow-hidden"
    >
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100 dark:border-white/10">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-indigo-600 flex items-center justify-center">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>
            </svg>
          </div>
          <div>
            <p className="text-sm font-bold text-color">Today's Mission</p>
            <p className="text-xs subText-color">
              Day {selectedDay} · {done}/{total} complete
            </p>
          </div>
        </div>
        <div className="flex items-center gap-1.5 text-xs subText-color">
          <Clock size={13} />
          <span>~{fmtTime(totalMins)}</span>
        </div>
      </div>

      {/* Day tabs — scrollable */}
      {allDays.length > 1 && (
        <div className="flex gap-1.5 overflow-x-auto px-4 pt-3 pb-0"
          style={{ scrollbarWidth: "none" }}>
          {allDays.map((d) => {
            const dDone  = d.tasks.filter((t) => t.done).length;
            const dTotal = d.tasks.length;
            const allDone = dDone === dTotal && dTotal > 0;
            const active  = selectedDay === d.day;
            return (
              <button key={d.day} onClick={() => onSelectDay(d.day)}
                className={`flex-shrink-0 flex flex-col items-center px-3 py-1.5 rounded-lg text-xs font-semibold transition-all duration-150
                  ${active
                    ? "bg-indigo-600 text-white shadow-sm"
                    : allDone
                    ? "bg-indigo-50 dark:bg-indigo-500/10 text-indigo-500 border border-indigo-200 dark:border-indigo-500/20"
                    : "bg-slate-50 dark:bg-white/5 text-slate-400 hover:text-slate-600 dark:hover:text-white/60 border border-slate-100 dark:border-white/10"
                  }`}>
                <span>Day {d.day}</span>
                <span className={`text-[10px] font-normal ${active ? "text-indigo-200" : "text-slate-300 dark:text-white/20"}`}>
                  {dDone}/{dTotal}
                </span>
              </button>
            );
          })}
        </div>
      )}

      {/* Task list */}
      <div className="p-4 space-y-2">
        <AnimatePresence mode="wait">
          {activeDayData?.tasks.length ? (
            activeDayData.tasks.map((task, i) => (
              <TaskItem
                key={task.id}
                task={task}
                index={i}
                onToggle={onToggle}
                task_completion={task_completion}
                roadmapInfo={roadmapInfo}
                totalCount={totalCount}
                currentDay={selectedDay}
                completedTasksToday={completedTasksToday}
                pendingTasks={pendingTasks}
              />
            ))
          ) : (
            <motion.p
              initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              className="text-sm text-slate-400 text-center py-10">
              No tasks for this day.
            </motion.p>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}

