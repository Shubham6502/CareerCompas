import { ArrowRight, Users } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function CTA() {
  const navigate = useNavigate();

  return (
    <section className="px-4 py-16">
      <div className="max-w-7xl mx-auto">
        <div
          className="relative overflow-hidden rounded-3xl border p-10 sm:p-14 text-center"
          style={{
            background: "rgba(124,58,237,0.08)",
            borderColor: "rgba(167,139,250,0.2)",
            backdropFilter: "blur(12px)",
          }}>

          {/* Background glow */}
          <div className="pointer-events-none absolute inset-0 z-0"
            style={{
              background: "radial-gradient(ellipse at 50% 0%, rgba(124,58,237,0.25) 0%, transparent 70%)",
            }} />

          <div className="relative z-10">
            {/* Community badge */}
            <div className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full mb-6 border"
              style={{
                background: "rgba(124,58,237,0.15)",
                borderColor: "rgba(167,139,250,0.25)",
                color: "#c4b5fd",
              }}>
              <Users size={11} />
              Join the community
            </div>

            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4"
              style={{ fontFamily: "var(--font-head, 'Syne', sans-serif)", letterSpacing: "-0.02em" }}>
              Ready to map your{" "}
              <span style={{
                background: "linear-gradient(90deg, #a78bfa, #38bdf8)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}>career?</span>
            </h2>

            <p className="text-sm sm:text-base mb-8 max-w-md mx-auto leading-relaxed"
              style={{ color: "rgba(148,163,184,0.8)" }}>
              Join thousands of learners using CareerCompass to land roles at top tech companies.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <button onClick={() => navigate("/register")}
                className="flex items-center gap-2 text-white font-semibold text-sm px-7 py-3.5 rounded-xl transition-all duration-200 w-full sm:w-auto justify-center"
                style={{ background: "linear-gradient(135deg, #7c3aed, #a855f7)", boxShadow: "0 0 32px rgba(124,58,237,0.4)" }}
                onMouseEnter={e => { e.currentTarget.style.boxShadow = "0 0 48px rgba(124,58,237,0.6)"; e.currentTarget.style.transform = "translateY(-1px)"; }}
                onMouseLeave={e => { e.currentTarget.style.boxShadow = "0 0 32px rgba(124,58,237,0.4)"; e.currentTarget.style.transform = "translateY(0)"; }}>
                Start Your Roadmap
                <ArrowRight size={16} />
              </button>

              <button onClick={() => navigate("/login")}
                className="text-sm font-medium px-6 py-3.5 rounded-xl border transition-all duration-200 w-full sm:w-auto text-center"
                style={{ color: "#cbd5e1", borderColor: "rgba(255,255,255,0.12)", background: "rgba(255,255,255,0.05)" }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = "rgba(167,139,250,0.4)"; e.currentTarget.style.color = "#fff"; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.12)"; e.currentTarget.style.color = "#cbd5e1"; }}>
                See Live Demo
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}