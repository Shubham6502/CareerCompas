import { NavLink } from "react-router-dom";
import { UserButton, useUser } from "@clerk/clerk-react";
import {
  LayoutDashboard,
  ClipboardList,
  Map,
  BookOpen,
  BarChart3,
} from "lucide-react";

const Sidebar = () => {
  const { user } = useUser();

  return (
    <aside className=" relative hidden md:block h-screen p-4">
      {/* Sidebar Card */}
      <div
  className="absolute left-30 top-10 w-60 h-60 rounded-full
             bg-violet-600 blur-3xl opacity-30
             pointer-events-none"
/>
      <div className=" relative h-full w-64 rounded-2xl bg-[#0F172A]
                      border border-white/10
                      shadow-[0_0_40px_rgba(59,130,246,0.08)]
                      flex flex-col">

        {/* Logo */}
        
        <div className=" px-6 py-5 flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-cyan-400 to-blue-600
                          flex items-center justify-center font-bold text-black">
            C
          </div>
          <span className="text-lg font-semibold text-white">
            Career Compass
          </span>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 space-y-1">
          <SidebarLink to="/dashboard" icon={<LayoutDashboard size={18} />} label="Dashboard" />
          <SidebarLink to="/assessment" icon={<ClipboardList size={18} />} label="Assessment" />
          <SidebarLink to="/roadmap" icon={<Map size={18} />} label="Roadmap" />
          <SidebarLink to="/resources" icon={<BookOpen size={18} />} label="Resources" />
          <SidebarLink to="/progress" icon={<BarChart3 size={18} />} label="Progress" />
        </nav>

        {/* User */}
        <div className="px-4 py-4 border-t border-white/10 flex items-center gap-3">
          <UserButton />
          <div className="leading-tight">
            <p className="text-sm text-white font-medium">
              {user?.firstName}
            </p>
            <p className="text-xs text-gray-400">View profile</p>
          </div>
        </div>
      </div>
    </aside>
  );
};

const SidebarLink = ({ to, icon, label }) => (
  <NavLink
    to={to}
    className={({ isActive }) =>
      `flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm transition-all
       ${
         isActive
           ? "bg-blue-600/90 text-white shadow-[0_0_20px_rgba(59,130,246,0.5)]"
           : "text-gray-400 hover:bg-white/5 hover:text-white"
       }`
    }
  >
    {icon}
    {label}
  </NavLink>
);

export default Sidebar;
