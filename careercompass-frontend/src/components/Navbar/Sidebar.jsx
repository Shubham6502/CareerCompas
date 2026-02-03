import { NavLink } from "react-router-dom";
import { UserButton, useUser, SignOutButton } from "@clerk/clerk-react";
import { useState, useEffect } from "react";
import logo from "../../assets/logo1.png";
import { useTheme } from "../../themeContext.jsx";

import {
  LayoutDashboard,
  ClipboardList,
  Map,
  BookOpen,
  User,
  LogOut,
  Moon,
  Sun,
} from "lucide-react";

const Sidebar = () => {
 const { isDarkMode, setIsDarkMode }= useTheme();
  console.log(isDarkMode)
  console.log(localStorage.getItem("theme"));
  return (
    <aside className=" relative hidden md:block h-screen p-4">
      {/* Sidebar Card */}

      {/* <div
  className="absolute left-50 bottom-0 w-100 h-160 rounded-full
             bg-violet-600/50 blur-3xl opacity-30
             pointer-events-none"
/> */}
      <div
        className=" relative h-full w-64 rounded-2xl card-color
                      border border-white/10
                      shadow-[0_0_40px_rgba(59,130,246,0.08)]
                      flex flex-col"
      >
        {/* Logo */}

        <div className=" px-6 py-5 flex items-center gap-3">
          <div className="w-9 h-9  flex items-center justify-center">
            <img src={logo} alt="" className=" rounded-full" />
          </div>
          <span className="text-lg font-semibold text-color">
            Career Compass
          </span>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 space-y-1 ">
          <SidebarLink
            to="/dashboard"
            icon={<LayoutDashboard size={18} />}
            label="Dashboard"
          />
          <SidebarLink
            to="/dailyassessment"
            icon={<ClipboardList size={18} />}
            label="Assessment"
          />
          <SidebarLink to="/roadmap" icon={<Map size={18} />} label="Roadmap" />
          <SidebarLink
            to="/resources"
            icon={<BookOpen size={18} />}
            label="Resources"
          />
          <SidebarLink
            to="/profile"
            icon={<User size={18} />}
            label="Profile"
          />
        </nav>

        {/* User */}
        <div className="px-4 py-4 border-t border-white/10 flex items-center gap-3">
          <SignOutButton>
            <button className="px-4 py-2 border text-color rounded-md">
              <LogOut size={16} className="inline-block mr-2" />
              Logout
            </button>
          </SignOutButton>

          <button
            onClick={() => setIsDarkMode(!isDarkMode)}
            className="theme-switch"
            aria-label="Toggle theme"
          >
            <div className={`thumb ${isDarkMode ? "dark" : "light"}`}>
              {isDarkMode ? <Moon size={14} /> : <Sun size={14} />}
            </div>
          </button>
        </div>
      </div>
    </aside>
  );
};

const SidebarLink = ({ to, icon, label }) => (
  <NavLink
    to={to}
    className={({ isActive }) =>
      `flex items-center gap-3 px-4 py-2.5 rounded-xl text-md  font-medium transition-all
       ${
         isActive
           ? "bg-blue-500/15 text-blue-400 ring-1 ring-blue-500/30"
           : "text-color hover:bg-white/5 hover:text-color"
       }`
    }
  >
    {icon}
    {label}
  </NavLink>
);

export default Sidebar;
