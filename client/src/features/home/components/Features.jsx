import { Map, CalendarDays, BarChart2, Users } from "lucide-react";

const FEATURES = [
  {
    icon: Map,
    title: "Personalized Roadmaps",
    desc: "AI-powered career paths tailored to your goals — FAANG, Startups, or Government Tech roles.",
  },
  {
    icon: CalendarDays,
    title: "Daily Task System",
    desc: "Structured daily tasks across DSA, Development, CS Fundamentals, and Interview Prep.",
  },
  {
    icon: BarChart2,
    title: "Skill Tracking",
    desc: "Visualize your progress with radar charts, streaks, and XP-based gamification.",
  },
  {
    icon: Users,
    title: "Community Driven",
    desc: "Share roadmaps, follow top achievers, and learn from real success stories.",
  },
];

export default function Features() {
  return (
    <section id="features" className="px-4 py-16">
      <div className="max-w-7xl mx-auto">

        {/* Header */}
        <div className="text-center mb-12">
          <p className="text-xs font-semibold tracking-widest uppercase mb-4"
            style={{ color: "#a78bfa" }}>
            — Features —
          </p>
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4"
            style={{ fontFamily: "var(--font-head, 'Syne', sans-serif)", letterSpacing: "-0.01em" }}>
            Everything you need to land{" "}
            <br className="hidden sm:block" />
            your{" "}
            <span style={{
              background: "linear-gradient(90deg, #a78bfa, #38bdf8)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}>dream job</span>
          </h2>
          <p className="text-sm sm:text-base max-w-md mx-auto leading-relaxed"
            style={{ color: "rgba(148,163,184,0.8)" }}>
            Structured roadmaps, daily tasks, skill tracking, and a supportive
            community — all designed to get you hired.
          </p>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {FEATURES.map((f, i) => (
            <FeatureCard key={i} {...f} />
          ))}
        </div>
      </div>
    </section>
  );
}

function FeatureCard({ icon: Icon, title, desc }) {
  return (
    <div
      className="rounded-2xl p-6 border transition-all duration-300 group cursor-default"
      style={{
        background: "rgba(255,255,255,0.03)",
        borderColor: "rgba(255,255,255,0.08)",
        backdropFilter: "blur(8px)",
      }}
      onMouseEnter={e => {
        e.currentTarget.style.borderColor = "rgba(167,139,250,0.3)";
        e.currentTarget.style.background = "rgba(124,58,237,0.08)";
      }}
      onMouseLeave={e => {
        e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)";
        e.currentTarget.style.background = "rgba(255,255,255,0.03)";
      }}>
      <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-5"
        style={{ background: "rgba(124,58,237,0.2)", boxShadow: "0 0 20px rgba(124,58,237,0.15)", borderRadius: "2rem", border: "1px solid rgba(167,139,250,0.3)" }}>
        <Icon size={18} style={{ color: "#a78bfa" }} strokeWidth={1.75} />
      </div>
      <h3 className="text-[18px] font-semibold text-white mb-2"
        style={{ fontFamily: "var(--font-head, 'Syne', sans-serif)" }}>
        {title}
      </h3>
      <p className="text-sm leading-relaxed" style={{ color: "rgba(148,163,184,0.8)" }}>
        {desc}
      </p>
    </div>
  );
}

