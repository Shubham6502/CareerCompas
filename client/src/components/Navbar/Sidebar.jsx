import { NavLink } from "react-router-dom";
import { UserButton, useUser, SignOutButton } from "@clerk/clerk-react";
import { useState, useEffect } from "react";
import logo from "../../assets/logo1.png";
import { useTheme } from "../../context/ThemeContext.jsx";
import { useNavigate } from "react-router-dom";
import { Logout } from "../../features/auth/pages/Logout.jsx";

import {
  LayoutDashboard,
  ClipboardList,
  Map,
  BookOpen,
  User,
  LogOut,
  Moon,
  Sun,
  ClipboardPen,
  Users,
  Crown,
} from "lucide-react";

const Sidebar = () => {
 const { isDarkMode, setIsDarkMode }= useTheme();
const navigate = useNavigate();
  return (
    <aside className=" relative hidden md:block h-screen p-4">
      {/* Sidebar Card */}

      {/* Kept for future use — decorative glow blob behind the sidebar.
          Not currently used; uncomment if a background accent is wanted.
      <div
        className="absolute left-50 bottom-0 w-100 h-160 rounded-full
                   bg-violet-600/50 blur-3xl opacity-30
                   pointer-events-none"
      /> */}
      <div
        className=" relative h-full w-64 rounded-2xl card-color
                      card-border
                      shadow-[0_0_40px_rgba(124,58,237,0.06)]
                      flex flex-col"
      >
        {/* Logo */}

        <div className=" px-6 py-5 flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl  flex items-center justify-center">
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
          {/* Kept for future use — Assessment feature not yet live.
          <SidebarLink
            to="/dailyassessment"
            icon={<ClipboardList size={18} />}
            label="Assessment"
          /> */}
          <SidebarLink to="/roadmap" icon={<Map size={18} />} label="Roadmap" />
          <SidebarLink
            to="/jobtracker"
            icon={<ClipboardPen size={18} />}
            label="Job Tracker"
          />
          <SidebarLink
            to="/resources"
            icon={<BookOpen size={18} />}
            label="Resources"
          />
          {/* Kept for future use — Community feature not yet live.
          <SidebarLink
            to="/community"
            icon={<Users size={18} />}
            label="Community"
          /> */}
          <SidebarLink
            to="/profile"
            icon={<User size={18} />}
            label="Profile"
          />
        </nav>
         {/* Upgrade to Pro card */}
        <div className="px-3 mt-2">
          <div className="sidebar-upgrade-card rounded-2xl p-4">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-7 h-7 rounded-lg sidebar-upgrade-icon flex items-center justify-center shrink-0">
                <Crown size={14} />
              </div>
              <span className="text-[13px] font-semibold text-color">Upgrade to Pro</span>
            </div>
            <p className="text-[12px] subText-color leading-snug mb-3">
              Unlock advanced job insights, resume reviews, and more.
            </p>
            <button className="sidebar-upgrade-btn w-full text-[13px] font-semibold py-2 rounded-xl cursor-pointer">
              Upgrade Now
            </button>
          </div>
        </div>

        {/* User */}
        <div className="px-4 py-4 border-t card-border flex items-center gap-3 ">

            <button onClick={()=> navigate("/logout")} className="px-4 py-2 border card-border text-color rounded-md cursor-pointer">
              <LogOut size={16} className="inline-block mr-2"  />
              Logout
            </button>


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
           ? "sidebar-link-active"
           : "sidebar-link"
       }`
    }
  >
    {icon}
    {label}
  </NavLink>
);

export default Sidebar;