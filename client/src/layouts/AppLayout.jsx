import Sidebar from "../components/Navbar/Sidebar";
import MobileNav from "../components/Navbar/Mobilenav";
import MobileHeader from "../components/Navbar/MobileHeader";
import { useEffect, useState } from "react";

const AppLayout = ({ children }) => {
  return (
    <div
      className="flex min-h-screen overflow-hidden  min-h-screen bg-color text-color"
    >
      {/* Sidebar (Desktop) */}
      <Sidebar />

      {/* Main Content */}

      <main className="relative flex-1 md:px-6 md:py-6 pt-16 pb-20 px-3">{children}</main>

      {/* Mobile Bottom Nav */}
      <MobileHeader />

      <MobileNav />
     
    </div>
  );
};

export default AppLayout;
