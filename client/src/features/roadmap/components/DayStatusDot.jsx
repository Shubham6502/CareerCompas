
import { motion, AnimatePresence } from "framer-motion";

export default function DayStatusDot({ day, allDone, locked, weekColor }) {
 
  if (locked) {
    return (
      <div className="w-9 h-9 rounded-full border border-white/8 bg-white/[0.03] flex items-center justify-center flex-shrink-0">
        <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 text-white/20" fill="currentColor">
          <path d="M18 10H17V7A5 5 0 007 7v3H6a2 2 0 00-2 2v8a2 2 0 002 2h12a2 2 0 002-2v-8a2 2 0 00-2-2zm-6 7a2 2 0 110-4 2 2 0 010 4zm3.1-7H8.9V7a3.1 3.1 0 016.2 0v3z"/>
        </svg>
      </div>
    );
  }
  if (allDone) {
    return (
      <div
        className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 border-2"
        style={{ background: weekColor + "20", borderColor: weekColor }}
      >
        <svg viewBox="0 0 10 8" fill="none" style={{ width: 14, height: 14 }}>
          <path d="M1 3.5l3 3 5-5.5" stroke={weekColor} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </div>
    );
  }
  return (
    <div className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 bg-blue-500/10 border-2 border-blue-500/60 flex-shrink-0">
      <span className="text-blue-400 text-xs font-bold">{day}</span>
    </div>
  );
}