import { useClerk, UserButton, UserProfile, useUser } from "@clerk/clerk-react";
import { useState } from "react";
import { FiMenu, FiX } from "react-icons/fi";
import { Link } from "react-router-dom";

const Navbar = () => {
  const { openSignIn } = useClerk();
  const { user } = useUser();

  const [open, setOpen] = useState(false);
  return (
    <nav className="flex items-center justify-between px-4 py-4 backdrop-blur-md bg-white/60 shadow-md fixed w-full z-50">
      {/* Logo */}
      <div className="text-2xl font-bold text-blue-700"> Career Compass</div>

      {/* Desktop Links */}
      {user ? (
        <>
         <ul className="hidden md:flex space-x-8 text-gray-700 font-medium">
          <Link to="/roadmapView" className="hover:text-blue-600 cursor-pointer">
              RoadMap
            </Link>
            <Link to="/" className="hover:text-blue-600 cursor-pointer">
              Track Progress
            </Link>
            {/* <Link to="/test" className="hover:text-blue-600 cursor-pointer">
              Take Test
            </Link> */}
         </ul>
         

          {/* Buttons – Desktop */}
          <div className="flex justify-center items-center gap-4">
           
            {" "}
            Hi,{user.firstName}
            <UserButton />
          </div>
        </>
      ) : (<> <ul className="hidden md:flex space-x-8 text-gray-700 font-medium">
            <Link to="/" className="hover:text-blue-600 cursor-pointer">
              Home
            </Link>
            <Link to="/roadmap" className="hover:text-blue-600 cursor-pointer">
              Roadmaps
            </Link>
            <Link
              to="/aiguidance"
              className="hover:text-blue-600 cursor-pointer"
            >
              AI Guidance
            </Link>
            <Link to="/about" className="hover:text-blue-600 cursor-pointer">
              About
            </Link>
            <Link to="/contact" className="hover:text-blue-600 cursor-pointer">
              Contact
            </Link>
          </ul>
        <div className="hidden md:flex space-x-3">
          {/* <Link to='/login'  > */}
          <button
            onClick={(e) => openSignIn()}
            className="px-4 py-2 border border-blue-600 text-blue-600 rounded-lg hover:bg-blue-600 hover:text-white transition"
          >
            Login
          </button>
          {/* </Link> */}

          {/* <Link to='/register'className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition" >
         Sign Up
         </Link> */}
         
        </div></>
      )}

      {/* Mobile Menu Icon */}
      <div
        className="md:hidden text-3xl text-blue-700"
        onClick={() => setOpen(!open)}
      >
        {open ? <FiX /> : <FiMenu />}
      </div>

      {/* Mobile Menu Drawer */}
      {open && (
        <div className="absolute top-16 left-0 w-full bg-white shadow-md md:hidden">
          <ul className="flex flex-col items-center space-y-4 py-6 text-gray-700 font-medium">
            <Link to="/">Home</Link>
            <li>Roadmaps</li>
            <Link to="/aiguidance">AI Guidance</Link>
            <Link to="/about">About</Link>
            <Link to="/contact">Contact</Link>
            <div className="flex space-x-4 pt-4">
              <button onClick={(e) => openSignIn()} className="px-4 py-2 border border-blue-600 text-blue-600 rounded-lg">
                Login
              </button>
             
            </div>
          </ul>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
