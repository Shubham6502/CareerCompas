

export default function PageLoader() {
  const words = ["Career", "Compass"];

  // Build flat char list with per-char delay
  let globalIndex = 0;
  const charGroups = words.map((word) => {
    const chars = [...word].map((ch) => ({
      ch,
      delay: globalIndex++ * 0.08,
    }));
    globalIndex++; // account for the space gap
    return chars;
  });

  return (
    <div
      style={{
        // position: "fixed",
        // inset: 0,
        // zIndex: 999,
        height: "100dvh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: "28px",
        background: "bg-color", 
      }}
      // className="dark:bg-slate-950"
    >
      {/* Compass SVG icon */}
      <svg
        viewBox="0 0 56 56"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{ width: 56, height: 56, animation: "cc-pulse 2s ease-in-out infinite" }}
      >
        <circle cx="28" cy="28" r="24" stroke="#185FA5" strokeWidth="2.5" />
        <circle cx="28" cy="28" r="3.5" fill="#185FA5" />
        <polygon points="28,10 31,27 28,25 25,27" fill="#185FA5" />
        <polygon points="28,46 25,29 28,31 31,29" fill="#85B7EB" />
        <polygon points="10,28 27,25 25,28 27,31" fill="#85B7EB" />
        <polygon points="46,28 29,31 31,28 29,25" fill="#185FA5" />
      </svg>

      {/* Bouncing wave letters */}
      <div style={{ display: "flex", alignItems: "baseline", gap: 0 }}>
        {charGroups.map((chars, wi) => (
          <div key={wi} style={{ display: "flex", alignItems: "baseline" }}>
            {wi > 0 && <span style={{ display: "inline-block", width: 10 }} />}
            {chars.map(({ ch, delay }, ci) => (
              <span
                key={ci}
                style={{
                  display: "inline-block",
                  fontSize: 32,
                  fontWeight: 500,
                  color: "#185FA5",
                  animation: `cc-wave 1.6s ease-in-out infinite`,
                  animationDelay: `${delay}s`,
                  letterSpacing: "0.01em",
                }}
                className="dark:text-[#85B7EB]"
              >
                {ch}
              </span>
            ))}
          </div>
        ))}
      </div>

      {/* Subtitle */}
      <p
        style={{
          fontSize: 13,
          color: "#378ADD",
          letterSpacing: "0.12em",
          textTransform: "uppercase",
          opacity: 0,
          animation: "cc-fade-sub 0.6s ease forwards 1.2s",
          margin: 0,
        }}
      >
        Finding your direction
      </p>

      {/* Bouncing dots */}
      <div style={{ display: "flex", gap: 8 }}>
        {[0, 0.2, 0.4].map((delay, i) => (
          <div
            key={i}
            style={{
              width: 6,
              height: 6,
              borderRadius: "50%",
              background: "#185FA5",
              animation: `cc-dot 1.6s ease-in-out infinite`,
              animationDelay: `${delay}s`,
            }}
            className="dark:bg-[#85B7EB]"
          />
        ))}
      </div>

      {/* Keyframes injected once */}
      <style>{`
        @keyframes cc-wave {
          0%, 100% { transform: translateY(0px); }
          50%       { transform: translateY(-10px); }
        }
        @keyframes cc-pulse {
          0%, 100% { transform: scale(1); opacity: 1; }
          50%       { transform: scale(1.08); opacity: 0.85; }
        }
        @keyframes cc-fade-sub {
          to { opacity: 0.7; }
        }
        @keyframes cc-dot {
          0%, 100% { transform: translateY(0); opacity: 0.3; }
          50%       { transform: translateY(-6px); opacity: 1; }
        }
      `}</style>
    </div>
  );
}