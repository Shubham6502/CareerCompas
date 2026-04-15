import {motion, AnimatePresence} from "framer-motion";

export default function StatsRow({ doneTasks, totalTasks,currentDay }) {
  const remaining = totalTasks - doneTasks;
  const STATS = [
    { val: doneTasks,  label: "Completed", color: "text-green-500" },
    { val: currentDay, label: "Current Day", color: "text-blue-400"  },
    { val: remaining,  label: "Remaining",  color: "text-yellow-500"},
  ];
  return (
    <div className="grid grid-cols-3 gap-2.5 mb-4">
      {STATS.map((s, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 + i * 0.06 }}
          className="card-color border border-white/[0.07] rounded-xl px-3 py-3 text-center"
        >
          <div className={`text-xl font-bold ${s.color}`}>{s.val}</div>
          <div className="text-[10px] subText-color mt-0.5">{s.label}</div>
        </motion.div>
      ))}
    </div>
  );
}