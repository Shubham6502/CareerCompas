import Sidebar from "../components/Navbar/Sidebar";
import MobileNav from "../components/Navbar/Mobilenav";

const AppLayout = ({ children }) => {
  return (
    <div className="flex min-h-screen overflow-hidden bg-gradient-to-br from-black via-black to-purple-900 ">
      
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
