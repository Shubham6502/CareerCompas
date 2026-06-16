import { useState } from "react";
import { Menu, X, Sun, Moon } from "lucide-react";
import { useTheme } from "../../../context/ThemeContext";
import { useNavigate } from "react-router-dom";


export default function Navbar() {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const { isDarkMode, setIsDarkMode } = useTheme();
  const links = [
  { name: "Features", href: "#features" },
  { name: "Domains", href: "#domains" },
  { name: "How it works", href: "#how-it-works" },
  // { name: "Community", href: "#community" },
];

  return (
    <nav className="sticky top-0 z-50 border-b border-white/5 backdrop-blur-sm"
      style={{ background: "rgba(10, 8, 20, 0.75)" }}>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-[65px] flex items-center justify-between">

        {/* Logo */}
        <div className="flex items-center gap-2 shrink-0 cursor-pointer" onClick={() => navigate("/")}>
          <div className="w-8 h-8 rounded-lg flex items-center justify-center"
            style={{ background: "linear-gradient(135deg, #7c3aed, #a855f7)" }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white"
              strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 2L3 7l9 5 9-5-9-5zM3 12l9 5 9-5M3 17l9 5 9-5" />
            </svg>
          </div>
          <span className="font-bold text-[15px] text-white" style={{ fontFamily: "var(--font-head, 'Syne', sans-serif)" }}>
            CareerCompass
          </span>
        </div>

        {/* Desktop Links */}
        <div className="hidden md:flex items-center gap-8">
          {links.map((link) => (
            <a key={link.name} href={link.href} className="text-sm text-gray-400 hover:text-white transition-colors duration-200">
              {link.name}
            </a>
          ))}
        </div>

        {/* Desktop Actions */}
        <div className="hidden md:flex items-center gap-3">
          <button onClick={() => navigate("/login")}
            className="text-sm font-medium text-gray-300 hover:text-white px-3 py-2 transition-colors cursor-pointer">
            Log in
          </button>
          <button onClick={() => navigate("/register")}
            className="text-sm font-semibold text-white px-4 py-2 rounded-lg transition-all duration-200 cursor-pointer"
            style={{ background: "linear-gradient(135deg, #7c3aed, #a855f7)" }}
            onMouseEnter={e => e.currentTarget.style.opacity = "0.9"}
            onMouseLeave={e => e.currentTarget.style.opacity = "1"}>
            Get Started
          </button>
          <button onClick={() => setIsDarkMode(!isDarkMode)}
            className="p-2 rounded-lg border border-white/10 text-gray-400 hover:text-white hover:border-white/20 transition-colors"
            aria-label="Toggle theme">
            {isDarkMode ? <Sun size={16} /> : <Moon size={16} />}
          </button>
        </div>

        {/* Mobile right */}
        <div className="flex items-center gap-2 md:hidden">
          <button onClick={() => setIsDarkMode(!isDarkMode)}
            className="p-2 rounded-lg border border-white/10 text-gray-400"
            aria-label="Toggle theme">
            {isDarkMode ? <Sun size={16} /> : <Moon size={16} />}
          </button>
          <button className="p-2 rounded-lg text-gray-300" onClick={() => setOpen(!open)}>
            {open ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {open && (
        <div className="md:hidden border-t border-white/10 px-4 py-4 flex flex-col gap-3"
          style={{ background: "rgba(10, 8, 20, 0.95)" }}>
          {["Features", "Domains", "How it works", "Community"].map((link) => (
            <a key={link} href="#" className="text-sm text-gray-300 py-1 hover:text-white transition-colors">
              {link}
            </a>
          ))}
          <div className="flex flex-col gap-2 pt-2 border-t border-white/10">
            <button onClick={() => navigate("/login")}
              className="text-sm font-medium text-white py-2 text-center border border-white/15 rounded-lg hover:border-white/30 transition-colors">
              Log in
            </button>
            <button onClick={() => navigate("/register")}
              className="text-sm font-semibold text-white py-2 text-center rounded-lg"
              style={{ background: "linear-gradient(135deg, #7c3aed, #a855f7)" }}>
              Get Started
            </button>
          </div>
        </div>
      )}
    </nav>
  );
}