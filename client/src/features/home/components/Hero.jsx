import { ArrowRight, Sparkles } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function Hero() {
  const navigate = useNavigate();

  return (
    <section className="relative overflow-hidden text-center px-4 pt-24 pb-20">

      {/* Background radial glow — the signature element */}
      <div className="pointer-events-none absolute inset-0 z-0">
        {/* Main purple radial */}
        <div style={{
          position: "absolute", top: "0", left: "50%", transform: "translateX(-50%)",
          width: "900px", height: "600px",
          background: "radial-gradient(ellipse at 50% 0%, rgba(124,58,237,0.45) 0%, rgba(168,85,247,0.15) 40%, transparent 70%)",
        }} />
        {/* Teal accent bottom-left */}
        <div style={{
          position: "absolute", bottom: "0", left: "-100px",
          width: "400px", height: "400px",
          background: "radial-gradient(ellipse, rgba(20,184,166,0.12) 0%, transparent 70%)",
        }} />
        {/* Deep center darkening */}
        <div style={{
          position: "absolute", inset: 0,
          background: "radial-gradient(ellipse at 50% 100%, rgba(10,8,20,0.8) 0%, transparent 60%)",
        }} />
      </div>

      <div className="relative z-10 max-w-2xl mx-auto">

        {/* Badge */}
        <div className="inline-flex items-center gap-2 text-xs font-semibold px-4 py-2 rounded-full mb-8 border"
          style={{
            background: "rgba(124,58,237,0.15)",
            borderColor: "rgba(167,139,250,0.3)",
            color: "#c4b5fd",
          }}>
          <Sparkles size={11} />
          AI-Powered Career Roadmaps
          <span className="ml-1 px-1.5 py-0.5 rounded text-[10px] font-bold"
            style={{ background: "rgba(167,139,250,0.25)", color: "#a78bfa" }}>NEW</span>
        </div>

        {/* Headline */}
        <h1 className="text-5xl sm:text-7xl font-extrabold leading-tight mb-5 text-white"
          style={{ fontFamily: "var(--font-head, 'Syne', sans-serif)", letterSpacing: "-0.02em" }}>
          Your Career,{" "}
          <span style={{
            background: "linear-gradient(90deg, #a78bfa 0%, #38bdf8 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}>
            Mapped Out
          </span>
        </h1>

        {/* Sub */}
        <p className="text-base sm:text-lg leading-relaxed mb-10 max-w-xl mx-auto"
          style={{ color: "rgba(203,213,225,0.8)" }}>
          Choose your domain, set your goal, and get a personalized day-by-day
          roadmap with tasks, resources, and progress tracking — all in one place.
        </p>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-8">
          <button onClick={() => navigate("/register")}
            className="flex items-center gap-2 text-white font-semibold text-sm px-7 py-3.5 rounded-xl transition-all duration-200 w-full sm:w-auto justify-center"
            style={{ background: "linear-gradient(135deg, #7c3aed, #a855f7)", boxShadow: "0 0 32px rgba(124,58,237,0.4)" }}
            onMouseEnter={e => { e.currentTarget.style.boxShadow = "0 0 48px rgba(124,58,237,0.6)"; e.currentTarget.style.transform = "translateY(-1px)"; }}
            onMouseLeave={e => { e.currentTarget.style.boxShadow = "0 0 32px rgba(124,58,237,0.4)"; e.currentTarget.style.transform = "translateY(0)"; }}>
            Get Started Free
            <ArrowRight size={16} />
          </button>

          <button onClick={() => navigate("/login")}
            className="text-sm font-medium px-6 py-3.5 rounded-xl border transition-all duration-200 w-full sm:w-auto text-center"
            style={{ color: "#cbd5e1", borderColor: "rgba(255,255,255,0.12)", background: "rgba(255,255,255,0.05)" }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = "rgba(167,139,250,0.4)"; e.currentTarget.style.color = "#fff"; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.12)"; e.currentTarget.style.color = "#cbd5e1"; }}>
            Log in to Dashboard
          </button>
        </div>

        {/* Trust line */}
        <div className="flex items-center justify-center gap-6 text-xs" style={{ color: "rgba(148,163,184,0.7)" }}>
          <span className="flex items-center gap-1.5">
            <span style={{ color: "#a78bfa" }}>✓</span> No credit card
          </span>
          <span className="flex items-center gap-1.5">
            <span style={{ color: "#a78bfa" }}>✓</span> Free to start
          </span>
          <span className="flex items-center gap-1.5">
            <span style={{ color: "#a78bfa" }}>✓</span> Cancel anytime
          </span>
        </div>
      </div>
    </section>
  );
}