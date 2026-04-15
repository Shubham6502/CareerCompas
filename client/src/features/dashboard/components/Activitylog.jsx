import { motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";

const STATIC_LOGS = [
  { time: "09:43", type: "xp",      text: "+25 XP earned · streak extended to 7 days" },
  { time: "10:15", type: "cmd",     text: "$ npm run test -- valid-anagram.test.ts" },
  { time: "10:15", type: "success", text: "All 12 test cases passed" },
  { time: "10:31", type: "unlock",  text: "Skill unlocked: Hash Maps · Level 2" },
  { time: "11:00", type: "cmd",     text: "$ docker-compose up -d postgres redis" },
  { time: "11:00", type: "info",    text: "Environment ready · 2 services running" },
  { time: "12:00", type: "warn",    text: "Daily goal: 2/4 tasks remaining" },
  { time: "13:29", type: "cmd",     text: "$ curl -X POST /api/system-design/review" },
  { time: "14:23", type: "score",   text: "System Design score: 72/100 (+8 from yesterday)" },
];

const LINE_COLOR = {
  UserRegistration:      "text-yellow-400",
  DayCompletion:     "text-slate-300",
  TaskCompletion: "text-emerald-400",
  UserLogin:  "text-violet-400",
  XPUpdate:    "text-sky-400",
  onboarding:    "text-orange-400",
  score:   "text-indigo-400",
};

const LINE_PREFIX = {
  UserRegistration:"→",
  XPUpdate:     "★",
  TaskCompletion: "✓",
  UserLogin:  "$",
  onboarding:    "·",
  warn:    "⚠",
  score:   "~",
};

export default function ActivityLog({ progress, activityLogs }) {
  const bottomRef  = useRef(null);
  const [visible, setVisible] = useState([]);

 useEffect(() => {
  if (!activityLogs?.activity) return; 

  const logsToShow = activityLogs.activity.slice(-8).map((log) => {
    const logTime = new Date(log.createdAt).toLocaleTimeString("en-IN", {
      hour: "2-digit",
      minute: "2-digit",
    });
    return {
      _id: log._id || Math.random().toString(), // stable key if possible
      time: logTime,
      type: log.activityType, 
      text: log.details,
    };
  });

  setVisible(logsToShow);
}, [activityLogs]); 
 
  // const timers = [];

  // STATIC_LOGS.forEach((log, i) => {
  //   const timer = setTimeout(() => {
  //   hour12: true,
  // }), 
  // type: log.activitytype, text: log.details }]);
  //   }, i * 180);
  // });

  // const timers = [];

  // STATIC_LOGS.forEach((log, i) => {
  //   const timer = setTimeout(() => {
  //     setVisible((prev) => {
  //       const updated = [...prev, log];
  //       return updated.slice(-5);
  //     });
  //   }, i * 200);

  //   timers.push(timer);
  // });

  // return () => {
  //   timers.forEach(clearTimeout); 
  // };

// }, []);

  // Auto-scroll to bottom
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [visible]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.15, ease: "easeOut" }}
      className="rounded-2xl overflow-hidden border border-slate-200 dark:border-white/10 shadow-sm mb-5"
    >
      {/* Terminal title bar */}
      <div className="bg-black  px-4 py-2.5 flex items-center gap-2">
        <span className="w-3 h-3 rounded-full bg-red-500" />
        <span className="w-3 h-3 rounded-full bg-yellow-500" />
        <span className="w-3 h-3 rounded-full bg-green-500" />
        <span className="ml-3 text-[11px] text-slate-400 font-mono tracking-wide select-none">
          activity.log — CareerCompass
        </span>
      </div>

      {/* Log body */}
      <div className="bg-[#0f172a] px-4 py-3 h-48 sm:h-56 overflow-y-auto font-mono text-[12px] leading-relaxed"
        style={{ scrollbarWidth: "thin", scrollbarColor: "#333 transparent" }}>
        {visible.map((log) => (
          <motion.div
            key={log._id || log.text + log.time}
            initial={{ opacity: 0, x: -6 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.2 }}
            className="flex items-start gap-2 mb-0.5"
          >
            <span className="text-slate-600 flex-shrink-0 select-none">{log.time}</span>
            <span className={`flex-shrink-0 ${LINE_COLOR[log.type]}`}>{LINE_PREFIX[log.type]}</span>
            <span className={LINE_COLOR[log.type]}>{log.text}</span>
          </motion.div>
        ))}

        {/* Blinking cursor */}
        <div className="flex items-center gap-1 mt-1">
          <span className="text-emerald-400">›</span>
          <motion.span
            animate={{ opacity: [1, 0, 1] }}
            transition={{ duration: 1, repeat: Infinity }}
            className="inline-block w-1.5 h-3.5 bg-emerald-400 rounded-sm"
          />
        </div>
        <div ref={bottomRef} />
      </div>
    </motion.div>
  );
}