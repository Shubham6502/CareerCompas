import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import DayStatusDot from "./DayStatusDot";
import TaskRow from "./TaskRow";
import { useRoadmapContext } from "../roadmap.context";



export default function DayCard({ dayObj, locked, weekColor, taskDoneMap, onToggle, defaultOpen }) {
  const [open, setOpen] = useState(defaultOpen);
  const {currentDay}=useRoadmapContext();
  const doneCnt = dayObj.tasks.filter(t => taskDoneMap[t.id]).length;
  const total   = dayObj.tasks.length;
  const allDone = doneCnt === total;

  // console.log(dayObj)
  const showUrl=dayObj.dayNumber<=currentDay;
  // Sync done state from parent map
  const tasks = dayObj.tasks.map(t => ({ ...t, done: !!taskDoneMap[t.id] }));
  // console.log(tasks)
  return (
    <div className="relative">
      {/* timeline connector */}
      <div className="absolute left-[18px] top-10 bottom-0 w-px card-color pointer-events-none" />

      {/* header */}
      <button
        onClick={() => setOpen(v => !v)}
        className="w-full flex items-center gap-3 py-2.5 px-4 hover:bg-white/[0.02] transition-colors duration-150 rounded-xl group"
      >
        <DayStatusDot day={dayObj.dayNumber} allDone={allDone} locked={locked} weekColor={weekColor} />

        <div className="flex-1 min-w-0 text-left">
          <div className="text-[10px] subText-color mb-[2px]">Day {dayObj.dayNumber}</div>
          <div className={`text-sm font-medium leading-snug truncate transition-colors
            ${locked ? "subText-color" : allDone ? "subText-color" : "text-color group-hover:subText-color"}`}>
            {dayObj.title}
          </div>
        </div>

        <div className="flex items-center gap-2 flex-shrink-0">
          {/* mini task progress dots */}
          <div className="hidden sm:flex gap-[3px] items-center">
            {tasks.slice(0, 5).map((t, i) => (
              <div
                key={i}
                className="w-[5px] h-[5px] rounded-full transition-colors duration-200"
                style={{ background: t.done ? weekColor : "rgba(255,255,255,0.1)" }}
              />
            ))}
            {total > 5 && <span className="text-[9px] subText-color ml-0.5">+{total - 5}</span>}
          </div>
          <span className="text-[10px] subText-color whitespace-nowrap">{doneCnt}/{total}</span>

          <motion.div
            animate={{ rotate: open ? 90 : 0 }}
            transition={{ duration: 0.18 }}
            className="subText-color"
          >
            <svg viewBox="0 0 24 24" className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M9 18l6-6-6-6" strokeLinecap="round"/>
            </svg>
          </motion.div>
        </div>
      </button>

      {/* tasks */}
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            key="tasks"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.22, ease: [0.4, 0, 0.2, 1] }}
            className="overflow-hidden"
          >
            <div className="ml-12 flex flex-col gap-1.5 pb-3 pr-2">
              {locked ? (
                <div className="flex items-center gap-2 px-3 py-2 rounded-xl border border-dashed border-white/[0.06] bg-color">
                  <svg viewBox="0 0 24 24" className="w-3 h-3 text-blue-400 flex-shrink-0" fill="currentColor">
                    <path d="M18 10H17V7A5 5 0 007 7v3H6a2 2 0 00-2 2v8a2 2 0 002 2h12a2 2 0 002-2v-8a2 2 0 00-2-2zm-6 7a2 2 0 110-4 2 2 0 010 4zm3.1-7H8.9V7a3.1 3.1 0 016.2 0v3z"/>
                  </svg>
                  <span className="text-[11px] subText-color">Complete previous week to unlock</span>
                </div>
              ) : (
                tasks.map((task, ti) => (
                  <TaskRow
                    key={task.id}
                    task={task}
                    locked={locked}
                    weekColor={weekColor}
                    onToggle={onToggle}
                    currentDay={currentDay}
                    showUrl={showUrl}
                    index={ti}
                  />
                ))
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}