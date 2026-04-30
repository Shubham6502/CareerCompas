import { motion, AnimatePresence } from "framer-motion";
export default function Checkbox({ checked, onChange, color = "#22c55e", disabled = false }) {
  return (
    <button
      onClick={e => { e.stopPropagation(); if (!disabled) onChange(!checked); }}
      disabled={disabled}
      className="flex-shrink-0 relative"
      style={{ width: 16, height: 16 }}
      aria-label={checked ? "Mark incomplete" : "Mark complete"}
    >
      <motion.div
        animate={checked
          ? { background: color, borderColor: color, scale: 1 }
          : { background: "transparent", borderColor: "rgba(255,255,255,0.15)", scale: 1 }
        }
        whileTap={!disabled ? { scale: 0.85 } : {}}
        transition={{ duration: 0.15 }}
        className="w-full h-full rounded-[4px] border flex items-center justify-center"
        style={{ borderWidth: 1.5 }}
      >
        <AnimatePresence>
          {checked && (
            <motion.svg
              key="check"
              initial={{ opacity: 0, scale: 0.3 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.3 }}
              transition={{ duration: 0.12, ease: "backOut" }}
              viewBox="0 0 10 8"
              fill="none"
              style={{ width: 9, height: 9 }}
            >
              <path
                d="M1 3.5l3 3 5-5.5"
                stroke="white"
                strokeWidth="1.6"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </motion.svg>
          )}
        </AnimatePresence>
      </motion.div>
    </button>
  );
}
