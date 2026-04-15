import { useState, useEffect } from "react";

const steps = [
  { icon: "🧠", label: "Analyzing your profile", detail: "Understanding your goals and experience level" },
  { icon: "💻", label: "Mapping skill requirements", detail: "Identifying key competencies for your target role" },
  { icon: "🗄️", label: "Curating resources", detail: "Selecting the best learning materials for you" },
  { icon: "🖥️", label: "Building your timeline", detail: "Optimizing daily tasks for your schedule" },
  { icon: "⚡", label: "Finalizing roadmap", detail: "Polishing your personalized career plan" },
];

const tips = [
  "💡 Tip: Consistency beats intensity — 2 hours daily > 8 hours once a week",
  "🎯 Fun fact: The average FAANG prep takes 3-6 months",
  "🚀 Pro tip: Focus on understanding patterns, not memorizing solutions",
  "📊 Did you know? 70% of successful candidates practiced system design daily",
  "⭐ Reminder: Take breaks — spaced repetition improves retention by 200%",
];

export default function GeneratingRoadmap({ onComplete }) {
  const [activeStep, setActiveStep] = useState(0);
  const [tipIndex, setTipIndex] = useState(0);
  const [particles] = useState(() =>
    Array.from({ length: 20 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      delay: Math.random() * 3,
      duration: 3 + Math.random() * 2,
    }))
  );
  const [shimmerOffset, setShimmerOffset] = useState(-30);
  const [iconAngle, setIconAngle] = useState(0);

  const progress = ((activeStep + 1) / steps.length) * 100;

  // Step progression
  useEffect(() => {
    if (activeStep >= steps.length - 1) {
      const t = setTimeout(() => onComplete?.(), 1200);
      return () => clearTimeout(t);
    }
    const t = setTimeout(() => setActiveStep((p) => p + 1), 2200);
    return () => clearTimeout(t);
  }, [activeStep, onComplete]);

  // Tip rotation
  useEffect(() => {
    const id = setInterval(() => setTipIndex((p) => (p + 1) % tips.length), 4000);
    return () => clearInterval(id);
  }, []);

  // Shimmer animation
  useEffect(() => {
    let frame;
    let start = null;
    const animate = (ts) => {
      if (!start) start = ts;
      const elapsed = (ts - start) / 1500;
      setShimmerOffset(-30 + (elapsed % 1) * 160);
      frame = requestAnimationFrame(animate);
    };
    frame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frame);
  }, []);

  // Icon wobble
  useEffect(() => {
    let frame;
    let start = null;
    const animate = (ts) => {
      if (!start) start = ts;
      const t = (ts - start) / 1000;
      setIconAngle(Math.sin(t * 2) * 5);
      frame = requestAnimationFrame(animate);
    };
    frame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frame);
  }, []);

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#0f0f13",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        position: "relative",
        overflow: "hidden",
        fontFamily: "'Inter', sans-serif",
      }}
    >
      {/* Floating particles */}
      {particles.map((p) => (
        <div
          key={p.id}
          style={{
            position: "absolute",
            left: `${p.x}%`,
            top: `${p.y}%`,
            width: 6,
            height: 6,
            borderRadius: "50%",
            background: "rgba(139,92,246,0.3)",
            animation: `float-${p.id} ${p.duration}s ${p.delay}s ease-in-out infinite`,
          }}
        />
      ))}

      {/* Pulsing glow */}
      <div
        style={{
          position: "absolute",
          width: 320,
          height: 320,
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(139,92,246,0.08) 0%, transparent 70%)",
          animation: "pulse-glow 3s ease-in-out infinite",
          pointerEvents: "none",
        }}
      />

      <style>{`
        @keyframes pulse-glow {
          0%, 100% { transform: scale(1); opacity: 0.4; }
          50% { transform: scale(1.3); opacity: 0.8; }
        }
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes fade-in-up {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes slide-in {
          from { opacity: 0; transform: translateX(-16px); }
          to { opacity: 1; transform: translateX(0); }
        }
        @keyframes tip-in {
          from { opacity: 0; transform: translateY(8px); }
          to { opacity: 1; transform: translateY(0); }
        }
        ${particles
          .map(
            (p) => `
          @keyframes float-${p.id} {
            0%, 100% { transform: translateY(0) scale(1); opacity: 0.2; }
            50% { transform: translateY(-28px) scale(1.4); opacity: 0.5; }
          }
        `
          )
          .join("")}
      `}</style>

      <div
        style={{
          position: "relative",
          zIndex: 10,
          width: "100%",
          maxWidth: 480,
          padding: "0 24px",
          boxSizing: "border-box",
        }}
      >
        {/* Central icon */}
        <div style={{ display: "flex", justifyContent: "center", marginBottom: 32 }}>
          <div
            style={{
              width: 80,
              height: 80,
              borderRadius: 20,
              background: "linear-gradient(135deg, #7c3aed 0%, #a855f7 100%)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 32,
              boxShadow: "0 8px 32px rgba(124,58,237,0.4)",
              transform: `rotate(${iconAngle}deg)`,
              transition: "transform 0.05s linear",
            }}
          >
            ✨
          </div>
        </div>

        {/* Heading */}
        <h1
          style={{
            fontSize: 22,
            fontWeight: 600,
            color: "#f5f5f7",
            textAlign: "center",
            margin: "0 0 8px",
            animation: "fade-in-up 0.5s ease",
          }}
        >
          Generating your roadmap
        </h1>
        <p
          style={{
            fontSize: 14,
            color: "#888",
            textAlign: "center",
            margin: "0 0 36px",
            animation: "fade-in-up 0.5s 0.15s ease both",
          }}
        >
          Our AI is crafting a personalized plan just for you
        </p>

        {/* Progress bar */}
        <div
          style={{
            height: 6,
            borderRadius: 999,
            background: "#1e1e28",
            marginBottom: 32,
            overflow: "hidden",
            position: "relative",
          }}
        >
          <div
            style={{
              position: "absolute",
              inset: 0,
              width: `${progress}%`,
              background: "linear-gradient(90deg, #7c3aed, #a855f7)",
              borderRadius: 999,
              transition: "width 0.6s cubic-bezier(0.4,0,0.2,1)",
            }}
          />
          <div
            style={{
              position: "absolute",
              top: 0,
              bottom: 0,
              left: `${shimmerOffset}%`,
              width: "30%",
              background: "rgba(255,255,255,0.15)",
              borderRadius: 999,
              transition: "none",
            }}
          />
        </div>

        {/* Steps */}
        <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 36 }}>
          {steps.map((s, i) => {
            const done = i < activeStep;
            const active = i === activeStep;
            return (
              <div
                key={s.label}
                style={{
                  display: "flex",
                  alignItems: "flex-start",
                  gap: 12,
                  padding: "12px 14px",
                  borderRadius: 14,
                  background: active ? "#1a1a24" : "transparent",
                  border: active ? "1px solid rgba(139,92,246,0.25)" : "1px solid transparent",
                  opacity: done ? 0.65 : active ? 1 : 0.3,
                  transition: "all 0.35s ease",
                  animation: `slide-in 0.4s ${i * 0.08}s ease both`,
                }}
              >
                {/* Icon box */}
                <div
                  style={{
                    width: 36,
                    height: 36,
                    borderRadius: 10,
                    background: done
                      ? "rgba(34,197,94,0.12)"
                      : active
                      ? "linear-gradient(135deg, #7c3aed, #a855f7)"
                      : "#1e1e28",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                    fontSize: 15,
                    transition: "background 0.3s ease",
                  }}
                >
                  {done ? (
                    <span style={{ fontSize: 16 }}>✅</span>
                  ) : active ? (
                    <span
                      style={{
                        display: "inline-block",
                        fontSize: 16,
                        animation: "spin 1.2s linear infinite",
                      }}
                    >
                      ⏳
                    </span>
                  ) : (
                    <span style={{ fontSize: 15 }}>{s.icon}</span>
                  )}
                </div>

                {/* Labels */}
                <div style={{ minWidth: 0 }}>
                  <p
                    style={{
                      margin: 0,
                      fontSize: 14,
                      fontWeight: 500,
                      color: done || active ? "#f0f0f5" : "#666",
                      transition: "color 0.3s",
                    }}
                  >
                    {s.label}
                  </p>
                  {active && (
                    <p
                      style={{
                        margin: "3px 0 0",
                        fontSize: 12,
                        color: "#888",
                        animation: "fade-in-up 0.3s ease",
                        overflow: "hidden",
                      }}
                    >
                      {s.detail}
                    </p>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Rotating tips */}
        <div
          style={{
            minHeight: 40,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <p
            key={tipIndex}
            style={{
              margin: 0,
              fontSize: 12,
              color: "#666",
              textAlign: "center",
              animation: "tip-in 0.35s ease",
            }}
          >
            {tips[tipIndex]}
          </p>
        </div>
      </div>
    </div>
  );
}