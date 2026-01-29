import { useState } from "react";
import { NavLink } from "react-router-dom";
import { SignOutButton } from "@clerk/clerk-react";
import {
  Menu,
  X,
 LayoutDashboard,
  ClipboardList,
  Map,
  BookOpen,
  BarChart3,
  User
} from "lucide-react";

const MobileDrawer = () => {
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* Hamburger Button (Right Side) */}
      <button
        onClick={() => setOpen(true)}
        className="md:hidden fixed top-4 right-4 z-50
                   p-2 rounded-lg bg-black/40 border border-white/10
                   text-white"
      >
        <Menu size={22} />
      </button>

      {/* Overlay */}
      {open && (
        <div
          onClick={() => setOpen(false)}
          className="fixed inset-0 bg-black/50 z-40"
        />
      )}

      {/* Drawer (Right Side) */}
      <aside
        className={`fixed top-0 right-0 h-full w-64 bg-[#0B0F1A]
                    border-l border-white/10 z-50
                    transform transition-transform duration-300
                    ${open ? "translate-x-0" : "translate-x-full"}`}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-white/10">
          <span className="text-white font-semibold">Menu</span>
          <button onClick={() => setOpen(false)}>
            <X className="text-white" size={20} />
          </button>
        </div>

        {/* Links */}
        <nav className="flex flex-col p-3 gap-1">
         
          <DrawerLink
            to="/dashboard"
            icon={<LayoutDashboard size={18} />}
            label="Dashboard"
          />
          <DrawerLink
            to="/dailyassessment"
            icon={<ClipboardList size={18} />}
            label="Assessment"
          />
          <DrawerLink
           to="/roadmap" 
           icon={<Map size={18} />}
            label="Roadmap"
             />

          <DrawerLink
            to="/resources"
            icon={<BookOpen size={18} />}
            label="Resources"
          />
          <DrawerLink
            to="/profile"
            icon={<User size={18} />}
            label="Profile"
          />
           
        </nav>
         <div className="px-4 py-4 border-t border-white/10 flex items-center gap-3">
          <SignOutButton>
            <button className="px-4 py-2 border text-white rounded-md">
              Logout
            </button>
          </SignOutButton>
          
        </div>
      </aside>
      
    </>
  );
};

const DrawerLink = ({ to, icon, label }) => (
  <NavLink
    to={to}
    className={({ isActive }) =>
      `flex items-center gap-3 px-4 py-3 rounded-lg transition
       ${
         isActive
           ? "bg-blue-500/10 text-blue-400"
           : "text-gray-400 hover:bg-white/5 hover:text-white"
       }`
    }
  >
    {icon}
    <span className="text-sm font-medium">{label}</span>
  </NavLink>
);

export default MobileDrawer;
