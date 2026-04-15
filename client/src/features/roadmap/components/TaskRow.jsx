import { motion, AnimatePresence } from "framer-motion";
import Checkbox from "./Checkbox";
import { Link } from "react-router-dom";
import { useRoadmapContext } from "../roadmap.context";

const CAT_COLOR = {
  dsa: "bg-blue-500/80",
  backend: "bg-purple-500/80",
  frontend: "bg-cyan-500/80",
  cstheory: "bg-orange-500/80",
  systemdesign: "bg-pink-500/80",
  swe: "bg-slate-500/80",
  devops: "bg-teal-500/80",
};

const DIFF = {
  Easy: {
    cls: "text-green-400 bg-green-500/10 border-green-500/20",
    label: "Easy",
  },
  Medium: {
    cls: "text-yellow-400 bg-yellow-500/10 border-yellow-500/20",
    label: "Medium",
  },
  Hard: { cls: "text-red-400 bg-red-500/10 border-red-500/20", label: "Hard" },
};
export default function TaskRow({ task, locked, weekColor, onToggle, index ,showUrl}) {
  const done = task.done;
  const diff = DIFF[task.d];
  const{currentDay}=useRoadmapContext();
  // console.log(locked,"locked");

  return (
    <motion.div
      initial={{ opacity: 0, x: -6 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.03, duration: 0.2 }}
      // onClick={() => !locked && onToggle(task.id)}
      className={`
        flex items-center gap-2.5 px-3 py-2 rounded-xl cursor-pointer
        border transition-all duration-150 group
        bg-white/[0.02] border-white/[0.05]
        hover:border-white/10 hover:bg-white/[0.04]
        ${locked ? "opacity-35 pointer-events-none" : ""}
        ${done ? "opacity-60" : ""}
      `}
    >
      <Checkbox
        checked={done}
        onChange={() => onToggle(task.id)}
        color={weekColor}
        disabled
      />

      {/* category dot */}
      <div
        className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${CAT_COLOR[task.category] ?? "bg-slate-500"}`}
      />

      {/* title */}
      <span
        className={`flex-1 min-w-0 text-xs leading-snug truncate transition-colors duration-150
        ${done ? "subText-color" : "text-color group-hover:subText-color"}`}
      >

        <span className="sm:hidden">
          {task.title.length > 25
            ? task.title.slice(0, 23) + "..."
            : task.title}
        </span>
        <span className="hidden sm:inline">
          {!showUrl && task.title}
          {showUrl && (
            <Link to={task.resourceUrl} target="_blank" className="hover:text-blue-400 ">
              {task.title}
            </Link>
          )}
        </span>
      </span>

      {/* meta — hide on smallest screens */}
      <div className="flex items-center gap-1.5 flex-shrink-0">
        <span
          className={`hidden sm:block text-[10px] px-1.5 py-0.5 rounded-md border font-medium`}
        >
          {/* {diff.title} */}
        </span>
        <span className="text-[10px] subText-color hidden xs:block whitespace-nowrap">
          {task.time}
        </span>
      </div>
    </motion.div>
  );
}
