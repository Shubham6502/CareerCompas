import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  ClipboardList,
  Map,
  User,
} from "lucide-react";

const MobileNav = () => {
  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-[#0B0F1A] border-t border-white/10 flex justify-around py-2">
      <MobileLink to="/dashboard" icon={<LayoutDashboard />} />
      <MobileLink to="/assessment" icon={<ClipboardList />} />
      <MobileLink to="/roadmap" icon={<Map />} />
      <MobileLink to="/profile" icon={<User />} />
    </nav>
  );
};

const MobileLink = ({ to, icon }) => (
  <NavLink
    to={to}
    className={({ isActive }) =>
      `p-2 rounded-lg ${
        isActive ? "text-blue-500" : "text-gray-400"
      }`
    }
  >
    {icon}
  </NavLink>
);

export default MobileNav;
