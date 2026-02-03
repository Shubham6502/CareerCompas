import Sidebar from "../components/Navbar/Sidebar";
import MobileNav from "../components/Navbar/Mobilenav";
import { useEffect,useState } from "react";

const AppLayout = ({ children }) => {
 
  return (
    <div
      className="flex min-h-screen overflow-hidden  min-h-screen
  bg-color
  text-color"
    >
      {/* Sidebar (Desktop) */}
      <Sidebar  />

      {/* Main Content */}

      <main className="relative flex-1 px-10 py-6">{children}</main>

      {/* Mobile Bottom Nav */}
      <MobileNav 
      
        />
      {/* <div
  className="absolute right-20 bottom-0 w-100 h-100 rounded-full
             bg-violet-600 blur-3xl opacity-20
             pointer-events-none"
/> */}
    </div>
  );
};

export default AppLayout;
