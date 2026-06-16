import { Compass, CalendarDays, Trophy } from "lucide-react";

const STEPS = [
  {
    num: "01",
    icon: Compass,
    title: "Choose Your Path",
    desc: "Select a career domain, experience level, and target goal.",
  },
  {
    num: "02",
    icon: CalendarDays,
    title: "Get Your Roadmap",
    desc: "Receive a structured 30–90 day plan with daily tasks and resources.",
  },
  {
    num: "03",
    icon: Trophy,
    title: "Track & Achieve",
    desc: "Complete tasks, earn XP, build streaks, and land your dream role.",
  },
];

export default function HowItWorks() {
  return (
    <section  id="how-it-works" className="px-4 py-16">
      <div className="max-w-7xl mx-auto">

        {/* Header */}
        <div className="text-center mb-14">
          <p className="text-xs font-semibold tracking-widest uppercase mb-4"
            style={{ color: "#a78bfa" }}>
            — Process —
          </p>
          <h2 className="text-3xl sm:text-4xl font-bold text-white"
            style={{ fontFamily: "var(--font-head, 'Syne', sans-serif)", letterSpacing: "-0.01em" }}>
            How it{" "}
            <span style={{
              background: "linear-gradient(90deg, #a78bfa, #38bdf8)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}>works</span>
          </h2>
        </div>

        {/* Steps */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-10">
          {STEPS.map((step, i) => (
            <div key={i} className="flex flex-col items-center text-center relative">

              {/* Connector line between steps (desktop only) */}
              {i < STEPS.length - 1 && (
                <div className="hidden sm:block absolute top-6 left-[calc(50%+28px)] w-[calc(100%-56px)] h-px"
                  style={{ background: "linear-gradient(90deg, rgba(124,58,237,0.4), rgba(56,189,248,0.1))" }} />
              )}

              {/* <span className="text-xs font-bold tracking-widest mb-4 block"
                style={{ color: "#7c3aed", fontFamily: "var(--font-head, 'Syne', sans-serif)" }}>
                {step.num}
              </span> */}

              <div className="relative w-14 h-14 rounded-2xl flex items-center justify-center mb-5"
                style={{
                  background: "rgba(124,58,237,0.15)",
                  border: "1px solid rgba(167,139,250,0.25)",
                  boxShadow: "0 0 24px rgba(124,58,237,0.2)",
                }}>
                <step.icon size={22} style={{ color: "#a78bfa" }} strokeWidth={1.75} />

                {/* Number dot */}
                <div className="absolute -top-2 -right-2 w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold"
                  style={{ background: "linear-gradient(135deg, #7c3aed, #a855f7)", color: "#fff" }}>
                  {i + 1}
                </div>
              </div>

              <h3 className="text-[18px] font-semibold text-white mb-2"
                style={{ fontFamily: "var(--font-head, 'Syne', sans-serif)" }}>
                {step.title}
              </h3>
              <p className="text-sm leading-relaxed max-w-[200px]"
                style={{ color: "rgba(148,163,184,0.75)" }}>
                {step.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}