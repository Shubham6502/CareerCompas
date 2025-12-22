import Sidebar from "../components/Navbar/Sidebar";
import MobileNav from "../components/Navbar/Mobilenav";

const AppLayout = ({ children }) => {
  return (
    <div className="flex min-h-screen bg-[#0B0F1A] grid-bg">
      
      {/* Sidebar (Desktop) */}
      <Sidebar />

      {/* Main Content */}
      <main className="flex-1 px-10 py-6">
        {children}
      </main>

      {/* Mobile Bottom Nav */}
      <MobileNav />
    </div>
  );
};

export default AppLayout;
