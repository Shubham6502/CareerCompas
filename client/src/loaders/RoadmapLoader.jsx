import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Sparkles,
  Brain,
  Code,
  Database,
  Server,
  Zap,
  CheckCircle2,
  Loader2,
} from "lucide-react";

const steps = [
  {
    icon: Brain,
    label: "Analyzing your profile",
    detail: "Understanding your goals and experience level",
  },
  {
    icon: Code,
    label: "Mapping skill requirements",
    detail: "Identifying key competencies for your target role",
  },
  {
    icon: Database,
    label: "Curating resources",
    detail: "Selecting the best learning materials for you",
  },
  {
    icon: Server,
    label: "Building your timeline",
    detail: "Optimizing daily tasks for your schedule",
  },
  {
    icon: Zap,
    label: "Finalizing roadmap",
    detail: "Polishing your personalized career plan",
  },
];

const tips = [
  "💡 Consistency beats intensity — 2 hours daily > 8 hours once a week",
  "🎯 The average FAANG prep takes 3–6 months of focused effort",
  "🚀 Focus on understanding patterns, not memorizing solutions",
  "📊 70% of successful candidates practiced system design daily",
  "⭐ Spaced repetition improves retention by up to 200%",
];

const STEP_DURATION = 2200;
const TIP_DURATION = 4000;

const DOTS = Array.from({ length: 18 }, (_, i) => ({
  id: i,
  left: `${5 + ((i * 5.3) % 90)}%`,
  top: `${10 + ((i * 7.1) % 80)}%`,
  duration: 3 + (i % 3),
  delay: (i * 0.3) % 3,
  purple: i % 2 !== 0,
  large: i % 3 === 0,
}));

export default function RoadmapLoader({ onComplete }) {
  const [activeStep, setActiveStep] = useState(0);
  const [tipIndex, setTipIndex] = useState(0);

  useEffect(() => {
    if (activeStep >= steps.length - 1) {
      const t = setTimeout(() => onComplete?.(), 1200);
      return () => clearTimeout(t);
    }
    const t = setTimeout(() => setActiveStep((s) => s + 1), STEP_DURATION);
    return () => clearTimeout(t);
  }, [activeStep, onComplete]);

  useEffect(() => {
    const t = setInterval(
      () => setTipIndex((i) => (i + 1) % tips.length),
      TIP_DURATION
    );
    return () => clearInterval(t);
  }, []);

  const progress = ((activeStep + 1) / steps.length) * 100;

  return (
    <div className="min-h-screen bg-[#0a0a0f] flex items-center justify-center relative overflow-hidden px-6">

      {/* Ambient orb — indigo */}
      <motion.div
        className="absolute w-[420px] h-[420px] rounded-full pointer-events-none"
        style={{
          background:
            "radial-gradient(circle, rgba(99,102,241,0.18) 0%, transparent 70%)",
          top: "8%",
          left: "4%",
          filter: "blur(48px)",
        }}
        animate={{ scale: [1, 1.15, 1], opacity: [0.6, 1, 0.6] }}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* Ambient orb — purple */}
      <motion.div
        className="absolute w-[300px] h-[300px] rounded-full pointer-events-none"
        style={{
          background:
            "radial-gradient(circle, rgba(168,85,247,0.14) 0%, transparent 70%)",
          bottom: "12%",
          right: "6%",
          filter: "blur(48px)",
        }}
        animate={{ scale: [1, 1.2, 1], opacity: [0.4, 0.8, 0.4] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 1 }}
      />

      {/* Floating dots */}
      {DOTS.map((d) => (
        <motion.div
          key={d.id}
          className={`absolute rounded-full pointer-events-none ${
            d.large ? "w-[3px] h-[3px]" : "w-[2px] h-[2px]"
          } ${d.purple ? "bg-purple-400/30" : "bg-indigo-400/40"}`}
          style={{ left: d.left, top: d.top }}
          animate={{ y: [0, -20, 0], opacity: [0.2, 0.7, 0.2] }}
          transition={{
            duration: d.duration,
            repeat: Infinity,
            delay: d.delay,
            ease: "easeInOut",
          }}
        />
      ))}

      {/* Card */}
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="relative z-10 w-full max-w-[460px] rounded-3xl p-10"
        style={{
          background:
            "linear-gradient(145deg, rgba(255,255,255,0.055) 0%, rgba(255,255,255,0.02) 100%)",
          border: "1px solid rgba(255,255,255,0.08)",
          backdropFilter: "blur(24px)",
          boxShadow:
            "0 0 0 1px rgba(99,102,241,0.12), 0 32px 80px rgba(0,0,0,0.55)",
        }}
      >
        {/* Icon */}
        <div className="flex justify-center mb-7">
          <motion.div
            animate={{ rotate: [0, 8, -8, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            className="w-16 h-16 rounded-2xl flex items-center justify-center shadow-lg"
            style={{
              background: "linear-gradient(135deg, #6366f1 0%, #a855f7 100%)",
              boxShadow: "0 8px 32px rgba(99,102,241,0.45)",
            }}
          >
            <Sparkles className="w-7 h-7 text-white" />
          </motion.div>
        </div>

        {/* Title */}
        <h1 className="text-center text-slate-100 text-[22px] font-bold tracking-tight mb-2">
          Generating your roadmap
        </h1>
        <p className="text-center text-slate-400 text-[13.5px] mb-8">
          Our AI is crafting a personalized plan just for you
        </p>

        {/* Progress bar */}
        <div className="relative h-[6px] rounded-full bg-white/[0.06] mb-8 overflow-hidden">
          <motion.div
            className="absolute inset-y-0 left-0 rounded-full"
            style={{
              background: "linear-gradient(90deg, #6366f1, #a855f7)",
            }}
            initial={{ width: "0%" }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.65, ease: "easeOut" }}
          />
          {/* shimmer */}
          <motion.div
            className="absolute inset-y-0 rounded-full bg-white/20"
            style={{ width: "28%" }}
            animate={{ x: ["-100%", "450%"] }}
            transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
          />
        </div>

        {/* Steps */}
        <div className="space-y-2 mb-8">
          {steps.map((step, i) => {
            const isDone = i < activeStep;
            const isActive = i === activeStep;
            const Icon = step.icon;

            return (
              <motion.div
                key={step.label}
                initial={{ opacity: 0, x: -16 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.08, duration: 0.4 }}
                className={`flex items-center gap-3 px-3 py-3 rounded-xl transition-all duration-300 ${
                  isActive
                    ? "bg-white/[0.06] shadow-sm"
                    : isDone
                    ? "opacity-60"
                    : "opacity-25"
                }`}
              >
                {/* Step icon */}
                <div
                  className={`w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 transition-all duration-300 ${
                    isDone
                      ? "bg-emerald-500/15"
                      : isActive
                      ? ""
                      : "bg-white/[0.04]"
                  }`}
                  style={
                    isActive
                      ? {
                          background:
                            "linear-gradient(135deg, #6366f1, #a855f7)",
                          boxShadow: "0 4px 16px rgba(99,102,241,0.35)",
                        }
                      : {}
                  }
                >
                  {isDone ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  ) : isActive ? (
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{
                        duration: 1.4,
                        repeat: Infinity,
                        ease: "linear",
                      }}
                    >
                      <Loader2 className="w-4 h-4 text-white" />
                    </motion.div>
                  ) : (
                    <Icon className="w-4 h-4 text-slate-500" />
                  )}
                </div>

                {/* Label + detail */}
                <div className="min-w-0">
                  <p
                    className={`text-sm font-medium leading-snug ${
                      isDone || isActive ? "text-slate-200" : "text-slate-500"
                    }`}
                  >
                    {step.label}
                  </p>
                  <AnimatePresence>
                    {isActive && (
                      <motion.p
                        className="text-xs text-slate-400 mt-0.5 leading-snug"
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.25 }}
                      >
                        {step.detail}
                      </motion.p>
                    )}
                  </AnimatePresence>
                </div>

                {/* Done badge */}
                {isDone && (
                  <motion.span
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ type: "spring", stiffness: 300, damping: 20 }}
                    className="ml-auto text-[10px] font-semibold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full flex-shrink-0"
                  >
                    Done
                  </motion.span>
                )}
              </motion.div>
            );
          })}
        </div>

        {/* Rotating tips */}
        <div className="h-11 flex items-center justify-center">
          <AnimatePresence mode="wait">
            <motion.p
              key={tipIndex}
              className="text-xs text-slate-500 text-center"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.28 }}
            >
              {tips[tipIndex]}
            </motion.p>
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
}