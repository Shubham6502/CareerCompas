export default function Footer() {
  return (
    <footer className="border-t px-4 py-6" style={{ borderColor: "rgba(255,255,255,0.08)" }}>
      <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">

        {/* Logo */}
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg flex items-center justify-center"
            style={{ background: "linear-gradient(135deg, #7c3aed, #a855f7)" }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white"
              strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 2L3 7l9 5 9-5-9-5zM3 12l9 5 9-5M3 17l9 5 9-5" />
            </svg>
          </div>
          <span className="text-sm font-semibold text-white"
            style={{ fontFamily: "var(--font-head, 'Syne', sans-serif)" }}>
            CareerCompass
          </span>
        </div>

        {/* Links */}
        <div className="flex items-center gap-6">
          {["Privacy", "Terms", "Contact"].map(link => (
            <a key={link} href="#"
              className="text-xs transition-colors hover:text-white"
              style={{ color: "rgba(148,163,184,0.5)" }}>
              {link}
            </a>
          ))}
        </div>

        {/* Copyright */}
        <p className="text-xs" style={{ color: "rgba(148,163,184,0.4)" }}>
          © 2026 CareerCompass. All rights reserved.
        </p>
      </div>
    </footer>
  );
}