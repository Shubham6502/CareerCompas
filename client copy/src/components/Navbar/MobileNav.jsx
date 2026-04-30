import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  Map,
  BookOpen,
  ClipboardPen,
  User
} from "lucide-react";

const MobileNav = () => {
  return (
    <div className="md:hidden fixed bottom-0 left-0 w-full z-50 
                    card-color border-t card-border
                    flex justify-around items-center py-2">

      <NavItem to="/dashboard" icon={<LayoutDashboard size={20} />} label="Dashboard" />
      <NavItem to="/roadmap" icon={<Map size={20} />} label="Roadmap" />
      <NavItem to="/resources" icon={<BookOpen size={20} />} label="Resources" />
      <NavItem to="/jobtracker" icon={<ClipboardPen size={20} />} label="Jobs" />
      <NavItem to="/profile" icon={<User size={20} />} label="Profile" />

    </div>
  );
};

const NavItem = ({ to, icon, label }) => (
  <NavLink
    to={to}
    className={({ isActive }) =>
      `flex flex-col items-center text-xs transition-all
       ${
         isActive
           ? "text-blue-500"
           : "subText-color"
       }`
    }
  >
    {icon}
    <span className="mt-1">{label}</span>
  </NavLink>
);

export default MobileNav;