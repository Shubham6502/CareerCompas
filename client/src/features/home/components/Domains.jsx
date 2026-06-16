import { Code2, BarChart2, Brain, Server, Layout, Terminal } from "lucide-react";

const DOMAINS = [
  { icon: Code2,     label: "Software Engineer",   iconColor: "#60a5fa", glowColor: "rgba(96,165,250,0.15)",  num: "01" },
  { icon: BarChart2, label: "Data Analyst",         iconColor: "#fbbf24", glowColor: "rgba(251,191,36,0.15)", num: "02" },
  { icon: Brain,     label: "AI / ML Engineer",     iconColor: "#a78bfa", glowColor: "rgba(167,139,250,0.15)",num: "03" },
  { icon: Server,    label: "DevOps Engineer",      iconColor: "#94a3b8", glowColor: "rgba(148,163,184,0.1)", num: "04" },
  { icon: Layout,    label: "Frontend Developer",   iconColor: "#f472b6", glowColor: "rgba(244,114,182,0.15)",num: "05" },
  { icon: Terminal,  label: "Backend Developer",    iconColor: "#34d399", glowColor: "rgba(52,211,153,0.15)", num: "06" },
];

export default function Domains() {
  return (
    <section  id="domains" className="px-4 py-16">
      <div className="max-w-7xl mx-auto">

        {/* Header */}
        <div className="text-center mb-12">
          <p className="text-xs font-semibold tracking-widest uppercase mb-4"
            style={{ color: "#a78bfa" }}>
            — Career Domains —
          </p>
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4"
            style={{ fontFamily: "var(--font-head, 'Syne', sans-serif)", letterSpacing: "-0.01em" }}>
            Pick your{" "}
            <span style={{
              background: "linear-gradient(90deg, #a78bfa, #38bdf8)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}>career domain</span>
          </h2>
          <p className="text-sm sm:text-base max-w-sm mx-auto leading-relaxed"
            style={{ color: "rgba(148,163,184,0.8)" }}>
            We support multiple tech career paths with curated, day-by-day roadmaps for each.
          </p>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          {DOMAINS.map((d, i) => (
            <DomainCard key={i} {...d} />
          ))}
        </div>
      </div>
    </section>
  );
}

function DomainCard({ icon: Icon, label, iconColor, glowColor, num }) {
  return (
    <div
      className="relative flex flex-col items-center gap-3 p-6 rounded-2xl border cursor-pointer transition-all duration-300"
      style={{
        background: "rgba(255,255,255,0.03)",
        borderColor: "rgba(255,255,255,0.08)",
        backdropFilter: "blur(8px)",
      }}
      onMouseEnter={e => {
        e.currentTarget.style.borderColor = iconColor + "55";
        e.currentTarget.style.background = glowColor;
        e.currentTarget.style.transform = "translateY(-2px)";
      }}
      onMouseLeave={e => {
        e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)";
        e.currentTarget.style.background = "rgba(255,255,255,0.03)";
        e.currentTarget.style.transform = "translateY(0)";
      }}>

      {/* Number badge */}
      <span className="absolute top-3 right-4 text-[10px] font-bold"
        style={{ color: "rgba(148,163,184,0.3)", fontFamily: "var(--font-head, 'Syne', sans-serif)" }}>
        {num}
      </span>

      <div className="w-12 h-12 rounded-xl flex items-center justify-center"
        style={{ background: glowColor, boxShadow: `0 0 20px ${glowColor}` }}>
        <Icon size={22} style={{ color: iconColor }} strokeWidth={1.75} />
      </div>

      <div className="text-center">
        <span className="text-sm font-semibold text-white block mb-1"
          style={{ fontFamily: "var(--font-head, 'Syne', sans-serif)" }}>
          {label}
        </span>
        <span className="text-xs" style={{ color: "rgba(148,163,184,0.5)" }}>
          Roadmap available
        </span>
      </div>
    </div>
  );
}