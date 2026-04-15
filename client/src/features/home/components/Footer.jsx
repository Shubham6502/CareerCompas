export default function Footer() {
  return (
    <footer className="bg-color border-t card-border py-6 px-4">
      <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">

        {/* Logo */}
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-indigo-500 flex items-center justify-center">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 2L3 7l9 5 9-5-9-5zM3 12l9 5 9-5M3 17l9 5 9-5"/>
            </svg>
          </div>
          <span className="text-sm font-semibold text-color" style={{ fontFamily: 'var(--font-head)' }}>
            CareerCompass
          </span>
        </div>

        {/* Copyright */}
        <p className="text-xs subText-color">
          © 2026 CareerCompass. All rights reserved.
        </p>
      </div>
    </footer>
  );
}