import { useState } from "react";
import { Menu, X, Sun, Moon } from "lucide-react";
import { useContext } from "react";
import { useTheme } from "../../../context/ThemeContext";
import { useNavigate } from "react-router-dom";

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  const { isDarkMode, setIsDarkMode } = useTheme();

  return (
    <nav className="sticky top-0 z-50 bg-color border-b card-border">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-[60px] flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center gap-2 shrink-0">
          <div className="w-8 h-8 rounded-lg bg-indigo-500 flex items-center justify-center">
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="white"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M12 2L3 7l9 5 9-5-9-5zM3 12l9 5 9-5M3 17l9 5 9-5" />
            </svg>
          </div>
          <span
            className="font-bold text-[15px] text-color"
            style={{ fontFamily: "var(--font-head)" }}
          >
            CareerCompass
          </span>
        </div>

        {/* Desktop Links */}
        <div className="hidden md:flex items-center gap-8">
          {["Features", "Domains", "Community"].map((link) => (
            <a
              key={link}
              href="/login"
              className="text-sm text-neutral-500 hover:text-color transition-colors duration-200"
            >
              {link}
            </a>
          ))}
        </div>

        {/* Desktop Actions */}
        <div className="hidden md:flex items-center gap-3">
          <button
            onClick={navigate.bind(null, "/login")}
            className="text-sm font-medium text-color px-3 py-2 transition-colors cursor-pointer"
          >
            Log in
          </button>
          <button
            onClick={navigate.bind(null, "/register")}
            className="text-sm font-semibold text-white bg-indigo-500 hover:bg-indigo-600 px-4 py-2 rounded-lg transition-colors duration-200 cursor-pointer"
          >
            Get Started
          </button>
          <button
              onClick={() => setIsDarkMode(!isDarkMode)}
              className={`p-2 rounded-lg border transition-colors ${isDarkMode ? "border-gray-700 text-gray-300 hover:bg-gray-800" : "border-gray-200 text-gray-500 hover:bg-gray-100"}`}
              aria-label="Toggle theme"
            >
              {isDarkMode ? <Sun/> : <Moon/>}
            </button>
        </div>



        {/* Mobile Theme Toggle */}
        <div className="flex items-center gap-2">
        <button
                 onClick={() => setIsDarkMode(!isDarkMode)}
                      className={`md:hidden  p-2 rounded-lg border transition-colors ${isDarkMode ? "border-gray-700 text-gray-300 hover:bg-gray-800" : "border-gray-200 text-gray-500 hover:bg-gray-100"}`}
                      aria-label="Toggle theme"
                    >
                      {isDarkMode ? <Sun/> : <Moon/>}
                    </button>

        {/* Mobile hamburger */}
        <button
          className="md:hidden p-2 rounded-lg text-color"
          onClick={() => setOpen(!open)}
        >
          {open ? <X size={20} /> : <Menu size={20} />}
        </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {open && (
        <div className="md:hidden border-t card-border bg-color px-4 py-4 flex flex-col gap-3">
          {["Features", "Domains", "Community"].map((link) => (
            <a key={link} href="/login" className="text-sm text-color py-1">
              {link}
            </a>
          ))}
          
          <div className="flex flex-col gap-2 pt-2 border-t card-border">
           
            <button
              onClick={navigate.bind(null, "/login")}
              className="text-sm font-medium text-color py-2 text-center border card-border rounded-lg"
            >
              Log in
            </button>
            <button
              onClick={navigate.bind(null, "/register")}
              className="text-sm font-semibold text-white bg-indigo-500 py-2 text-center rounded-lg"
            >
              Get Started
            </button>
            
            
          </div>
        </div>
      )}
    </nav>
  );
}
