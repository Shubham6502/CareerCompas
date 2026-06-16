const STATS = [
  { value: "100+", label: "Active Learners",   color: "#a78bfa" },
  { value: "50+",  label: "Roadmaps Created",  color: "#a78bfa" },
  { value: "92%",  label: "Goal Completion",   color: "#a78bfa" },
  { value: "30–90",label: "Day Programs",      color: "#a78bfa" },
];

export default function Stats() {
  return (
    <section className="px-4 py-12">
      <div className="max-w-7xl mx-auto grid grid-cols-2 sm:grid-cols-4 gap-4">
        {STATS.map((stat, i) => (
          <div key={i}
            className="text-center px-4 py-6 rounded-2xl border"
            style={{
              background: "rgba(255,255,255,0.03)",
              borderColor: "rgba(255,255,255,0.08)",
              backdropFilter: "blur(8px)",
            }}>
            <div className="text-3xl sm:text-4xl font-bold mb-1"
              style={{
                fontFamily: "var(--font-head, 'Syne', sans-serif)",
                color: stat.color,
              }}>
              {stat.value}
            </div>
            <div className="text-xs sm:text-sm" style={{ color: "rgba(148,163,184,0.8)" }}>
              {stat.label}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}