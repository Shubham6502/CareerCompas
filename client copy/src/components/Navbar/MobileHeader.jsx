import { useTheme } from "../../context/ThemeContext.jsx";
import { LogOut,Sun,Moon} from 'lucide-react';
import { useNavigate } from "react-router-dom";

const MobileHeader = () => {
    const { isDarkMode, setIsDarkMode } = useTheme();
    const navigate = useNavigate();

    const handleLogout = () => {
        confirm("Are you sure you want to log out?") && navigate("/logout");
    };

  return (
    <div className="md:hidden fixed top-0 left-0 w-full z-50 
                    flex items-center justify-between px-4 py-3
                    card-color border-b card-border ">
      
      <div className="flex items-center gap-2">
       
        <div className="w-8 h-8 rounded-lg bg-indigo-500 flex items-center justify-center">
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="white"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M12 2L3 7l9 5 9-5-9-5zM3 12l9 5 9-5M3 17l9 5 9-5" />
            </svg>
          </div>
        <span className="font-semibold text-color">Career Compass</span>
      </div>

       <div className="flex items-center gap-2">
        <button
                 onClick={() => setIsDarkMode(!isDarkMode)}
                      className={`md:hidden  p-2 rounded-lg border transition-colors ${isDarkMode ? "border-gray-700 text-gray-300 hover:bg-gray-800" : "border-gray-200 text-gray-500 hover:bg-gray-100"}`}
                      aria-label="Toggle theme"
                    >
                      {isDarkMode ? <Sun/> : <Moon/>}
                    </button>

        {/* Mobile hamburger */}
        
        <button
          className="md:hidden p-2 rounded-lg text-color"
          onClick={handleLogout}
        >
            <LogOut size={18} />
        </button>
        </div>
    </div>
  );
};

export default MobileHeader;