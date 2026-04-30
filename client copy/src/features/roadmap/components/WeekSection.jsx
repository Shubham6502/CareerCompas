import {motion, AnimatePresence} from "framer-motion";
import { useState } from "react";
import DayCard from "./DayCard";
// import { useRoadmapContext } from "../roadmap.context.jsx";

export default function WeekSection({ week, taskDoneMap, onToggle, defaultOpen, index }) {
  const [open, setOpen] = useState(defaultOpen);
 

  const totalTasks = week.days.reduce((s, d) => s + d.tasks.length, 0);
  const doneTasks  = week.days.reduce((s, d) => s + d.tasks.filter(t => taskDoneMap[t.id]).length, 0);
  const pct        = totalTasks > 0 ? Math.round((doneTasks / totalTasks) * 100) : 0;
  // console.log(doneTasks)

  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.07, duration: 0.3 }}
      className="rounded-2xl border border-white/[0.07] card-color overflow-hidden mb-3"
    >
      {/* week header */}
      <button
        onClick={() => setOpen(v => !v)}
        className="w-full flex items-center gap-3 px-4 py-3.5 hover:bg-white/[0.02] transition-colors duration-150"
      >
        {/* color accent bar */}
        <div className="w-1 h-8 rounded-full flex-shrink-0" style={{ background: week.colorCls }} />

        <div className="flex-1 min-w-0 text-left">
          <div className="text-sm font-semibold text-color">{week.name}</div>
          <div className="text-[11px] subText-color mt-0.5">
            {week.days.length} days · {doneTasks}/{totalTasks} tasks
            {week.locked && " · Locked"}
          </div>
        </div>

        {/* mini progress */}
        <div className="flex items-center gap-2 flex-shrink-0">
          <div className="w-16 h-1.5 bg-white/[0.06] rounded-full overflow-hidden hidden sm:block">
            <motion.div
              className="h-full rounded-full"
              style={{ background: week.color }}
              initial={{ width: 0 }}
              animate={{ width: `${pct}%` }}
              transition={{ duration: 0.6, ease: "easeOut", delay: 0.3 + index * 0.07 }}
            />
          </div>
          <span className="text-[11px] font-medium" style={{ color: week.color, minWidth: 28, textAlign: "right" }}>
            {pct}%
          </span>
          <motion.div
            animate={{ rotate: open ? 180 : 0 }}
            transition={{ duration: 0.2 }}
            className="subText-color"
          >
            <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M19 9l-7 7-7-7" strokeLinecap="round"/>
            </svg>
          </motion.div>
        </div>
      </button>

      {/* days */}
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            key="body"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: [0.4, 0, 0.2, 1] }}
            className="overflow-hidden"
          >
            <div
              className="border-t border-white/[0.05] px-2 py-2 flex flex-col gap-0.5"
              style={{ borderLeftWidth: 2, borderLeftColor: week.color + "40", borderLeftStyle: "solid" }}
            >
              {week.days.map((day, di) => (
                <DayCard
                  key={day.id}
                  dayObj={day}
                  locked={week.locked}
                  weekColor={week.colorCls}
                  taskDoneMap={taskDoneMap}
                  onToggle={onToggle}
                  defaultOpen={!week.locked && di === 0}
                />
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
