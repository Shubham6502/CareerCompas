import { motion } from "framer-motion";
import { useMemo } from "react";

const SKILLS = [
  { label: "DSA",           value: 65, color: "#6366f1" },
  { label: "System Design", value: 35, color: "#6366f1" },
  { label: "Frontend",      value: 58, color: "#6366f1" },
  { label: "Backend",       value: 45, color: "#6366f1" },
  { label: "Behavioral",    value: 55, color: "#6366f1" },
  { label: "DevOps",        value: 28, color: "#6366f1" },
 
];

const LEGEND = [
  { label: "DSA",           pct: 65, color: "#6366f1" },
  { label: "System Design", pct: 35, color: "#6366f1" },
  { label: "Frontend",      pct: 58, color: "#6366f1" },
  { label: "Backend",       pct: 45, color: "#6366f1" },
  { label: "DevOps",        pct: 28, color: "#6366f1" },
  { label: "Behavioral",    pct: 55, color: "#6366f1" },

];

function polarToXY(angle, radius, cx, cy) {
  const rad = (angle - 90) * (Math.PI / 180);
  return { x: cx + radius * Math.cos(rad), y: cy + radius * Math.sin(rad) };
}

function RadarChart({ skills, size = 200 }) {
  const cx     = size / 2;
  const cy     = size / 2;
  const maxR   = size * 0.38;
  const n      = skills.length;
  const angles = skills.map((_, i) => (360 / n) * i);

  // Grid rings
  const rings  = [0.25, 0.5, 0.75, 1].map((r) =>
    angles.map((a) => polarToXY(a, maxR * r, cx, cy))
      .map((p) => `${p.x},${p.y}`)
      .join(" ")
  );

  // Data polygon
  const dataPoints = skills.map((s, i) =>
    polarToXY(angles[i], (maxR * s.value) / 100, cx, cy)
  );
  const polyPath = dataPoints.map((p) => `${p.x},${p.y}`).join(" ");

  // Axes
  const axes = angles.map((a) => polarToXY(a, maxR, cx, cy));

  // Label positions
  const labelPos = angles.map((a, i) => {
    const p = polarToXY(a, maxR + 18, cx, cy);
    const skill = skills[i];
    return { ...p, label: skill.label };
  });

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="overflow-visible">
      {/* Grid rings */}
      {rings.map((pts, i) => (
        <polygon key={i} points={pts}
          fill="none" stroke="#e2e8f0" strokeWidth="0.8"
          className="dark:stroke-white/10" />
      ))}

      {/* Axes */}
      {axes.map((p, i) => (
        <line key={i} x1={cx} y1={cy} x2={p.x} y2={p.y}
          stroke="#e2e8f0" strokeWidth="0.8" className="dark:stroke-white/10" />
      ))}

      {/* Data polygon */}
      <motion.polygon
        points={polyPath}
        fill="#6366f1" fillOpacity="0.18"
        stroke="#6366f1" strokeWidth="2"
        strokeLinejoin="round"
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{ opacity: 1, scale: 1 }}
        style={{ transformOrigin: `${cx}px ${cy}px` }}
        transition={{ duration: 0.7, ease: "easeOut" }}
      />

      {/* Data points */}
      {dataPoints.map((p, i) => (
        <motion.circle key={i} cx={p.x} cy={p.y} r="3.5"
          fill="#6366f1"
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          style={{ transformOrigin: `${p.x}px ${p.y}px` }}
          transition={{ delay: 0.5 + i * 0.06, duration: 0.25 }}
        />
      ))}

      {/* Labels */}
      {labelPos.map((p, i) => (
        <text key={i} x={p.x} y={p.y}
          textAnchor="middle" dominantBaseline="middle"
          fontSize="9" fontWeight="600"
          fill="#94a3b8"
          className="dark:fill-blue-500/50 select-none"
        >
          {p.label}
        </text>
      ))}
    </svg>
  );
}

export default function SkillRadar() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.1, ease: "easeOut" }}
      className="card-color rounded-2xl border border-slate-100 dark:border-white/10 shadow-sm p-5"
    >
      <p className="text-[11px] font-bold tracking-widest text-color uppercase mb-1">
        Skill Radar
      </p>
      <p className="text-xs subText-color mb-4">
        Your competency across key areas
      </p>

      {/* Chart */}
      <div className="flex justify-center mb-4">
        <RadarChart skills={SKILLS} size={190} />
      </div>

      {/* Legend grid */}
      <div className="grid grid-cols-2 gap-x-4 gap-y-2">
        {LEGEND.map((s) => (
          <div key={s.label} className="flex items-center gap-2">
            <div className="w-5 h-0.5 rounded-full flex-shrink-0" style={{ background: "#6366f1" }} />
            <span className="text-[11px] subText-color flex-1 leading-none">{s.label}</span>
            <span className="text-[11px] font-semibold subText-color">{s.pct}%</span>
          </div>
        ))}
      </div>
    </motion.div>
  );
}