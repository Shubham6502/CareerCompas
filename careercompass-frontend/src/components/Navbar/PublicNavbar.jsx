import { useClerk } from "@clerk/clerk-react";
import { useTheme } from "../../themeContext";
import { Moon, Sun } from "lucide-react";
const PublicNavbar = () => {
  const { openSignIn, openSignUp } = useClerk();
  const{ isDarkMode, setIsDarkMode } = useTheme();

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 px-6 md:px-10  py-4 flex items-center justify-between">
      
      {/* Logo */}
      <div className="text-xl font-semibold text-color tracking-wide">
        Career Compass
      </div>

      {/* Auth Buttons */}

    
      <div className="flex items-center gap-4">
         <button
            onClick={() => setIsDarkMode(!isDarkMode)}
            className="theme-switch"
            aria-label="Toggle theme"
          >
            <div className={`thumb ${isDarkMode ? "dark" : "light"}`}>
              {isDarkMode ? <Moon size={14} /> : <Sun size={14} />}
            </div>
          </button>

       <button
  onClick={openSignIn}
  className="px-4 py-2 text-sm font-medium
             rounded-lg
             card-color backdrop-blur-md
             border border-blue-400
             text-color
             hover:card-color
             transition-all duration-200"
>
  Login
</button>


        {/* <button
          onClick={openSignUp}
          className="px-4 py-1.5 rounded-md text-sm font-medium
                     bg-white text-black hover:bg-gray-200 transition"
        >
          Get Started
        </button> */}
      </div>
    </nav>
  );
};

export default PublicNavbar;
