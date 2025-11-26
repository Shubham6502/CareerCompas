import React from "react";
import heroImg from "../assets/Heroimg.svg";
import { FaFacebook, FaAmazon, FaApple } from "react-icons/fa";
import { SiNetflix, SiMeta} from "react-icons/si";
import { FcGoogle } from "react-icons/fc";
import { motion } from "framer-motion";
import axios from "axios";
import { useUser } from "@clerk/clerk-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";


const Home = () => {
   const { user } = useUser();
   const navigate=useNavigate();
  const [hasTakenTest, setHasTakenTest] = useState(null);
    useEffect(() => {
    if (user) {
      axios
        .get(`http://localhost:5000/api/userTest/status/${user.id}`)
        .then((res) => setHasTakenTest(res.data.hasTakenTest))
        .catch((err) => console.log(err));
    }
  }, [user]);

  console.log(hasTakenTest);
  return (
    <section className="min-h-screen bg-gradient-to-br from-indigo-100 via-blue-50 to-cyan-100 flex flex-col items-center justify-center">
      
      {/* Hero Section */}
      <div className="max-w-7xl w-full flex flex-col-reverse lg:flex-row items-center justify-between px-6 mt-10 py-20">
        {/* Left Content */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 1 }}
          className="text-center lg:text-left space-y-5"
        >
          <h1 className="text-5xl font-extrabold text-gray-800 leading-tight">
            Welcome to{" "}
            <span className="text-blue-600 drop-shadow-md">CareerCompass</span>
          </h1>
          <p className="text-gray-700 text-lg max-w-md mx-auto lg:mx-0">
            Your AI-powered career partner that helps you find the right path,
            improve your skills, and get placed in top companies like FANG.
          </p>
          <p className="text-gray-600">
            Discover your strengths, track your growth, and achieve your goals —
            all guided by smart AI insights.
          </p>
           {user && hasTakenTest === false && (
        <button onClick={() => navigate("/test")} className="bg-blue-600 text-white px-4 py-2 rounded cursor-pointer">
          Take Test
        </button>

      )}
        </motion.div>

        {/* Right Image */}
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 1 }}
          className="flex justify-center lg:justify-end"
        >
          <img
            src={heroImg}
            alt="Career Compass"
            className="w-[320px] md:w-[420px] lg:w-[500px] drop-shadow-2xl"
          />
        </motion.div>
        
      </div>

      {/* Company Logos */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5, duration: 1 }}
        className="w-full backdrop-blur-md  py-8"
      >
        
     
      

        <h2 className="text-center text-gray-800 text-xl font-semibold mb-6 ">
          Empowering Career With Industry Leaders:
        </h2>
        <div className="flex flex-wrap justify-center gap-10 text-5xl px-10">
          <FaAmazon className="text-yellow-500 hover:scale-110 transition" />
          <SiNetflix className="text-red-600 hover:scale-110 transition" />
          <FcGoogle className="hover:scale-110 transition" />
          <FaApple className="text-gray-700 hover:scale-110 transition" />
          <SiMeta className="text-blue-500 hover:scale-110 transition" />
          {/* <SiMicrosoft className="text-purple-600 hover:scale-110 transition" /> */}
          <FaFacebook className="text-blue-600 hover:scale-110 transition" />
        </div>
      </motion.div>

      {/* Info Cards Section */}
      <div className="max-w-7xl w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 py-20 px-6">
        {/* Card 1 */}
        <motion.div
          whileHover={{ scale: 1.05 }}
          className="bg-white shadow-lg rounded-2xl p-6 text-center hover:shadow-2xl transition"
        >
          <h3 className="text-2xl font-semibold text-blue-600 mb-3">
            Personalized Roadmaps
          </h3>
          <p className="text-gray-600">
            Get a step-by-step AI-generated learning path to achieve your
            dream job faster and smarter.
          </p>
        </motion.div>

        {/* Card 2 */}
        <motion.div
          whileHover={{ scale: 1.05 }}
          className="bg-white shadow-lg rounded-2xl p-6 text-center hover:shadow-2xl transition"
        >
          <h3 className="text-2xl font-semibold text-blue-600 mb-3">
            Skill Analysis
          </h3>
          <p className="text-gray-600">
            Our AI identifies your strengths and weaknesses to tailor
            personalized upskilling suggestions.
          </p>
        </motion.div>

        {/* Card 3 */}
        <motion.div
          whileHover={{ scale: 1.05 }}
          className="bg-white shadow-lg rounded-2xl p-6 text-center hover:shadow-2xl transition"
        >
          <h3 className="text-2xl font-semibold text-blue-600 mb-3">
            Real-time Progress Tracking
          </h3>
          <p className="text-gray-600">
            Visualize your growth with AI-powered progress analytics and keep
            improving every day.
          </p>
        </motion.div>
      </div>
    </section>
  );
};

export default Home;
