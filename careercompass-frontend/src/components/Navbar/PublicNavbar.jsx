import { useClerk } from "@clerk/clerk-react";

const PublicNavbar = () => {
  const { openSignIn, openSignUp } = useClerk();

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 px-6 md:px-10 py-4 flex items-center justify-between">
      
      {/* Logo */}
      <div className="text-xl font-semibold text-white tracking-wide">
        Career Compass
      </div>

      {/* Auth Buttons */}
      <div className="flex items-center gap-4">
        <button
          onClick={openSignIn}
          className="text-sm text-gray-300 hover:text-white transition "
        >
          Login
        </button>

        <button
          onClick={openSignUp}
          className="px-4 py-1.5 rounded-md text-sm font-medium
                     bg-white text-black hover:bg-gray-200 transition"
        >
          Get Started
        </button>
      </div>
    </nav>
  );
};

export default PublicNavbar;
