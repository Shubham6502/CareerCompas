import React from "react";
import { motion } from "framer-motion";
import roadmapImg from "../assets/roadmap.jpg"; // add your image in assets folder
import { FaChartLine, FaBrain, FaLaptopCode, FaUserGraduate } from "react-icons/fa";

const Roadmap = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-100 to-cyan-100 py-16 px-6 md:px-16">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center gap-10 mt-10">
        
        {/* Left Section */}
        <motion.div
          initial={{ x: -100, opacity: 0 }}
          whileInView={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.7 }}
          className="flex-1 text-center md:text-left"
        >
          <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
            Your <span className="text-indigo-600">Career Roadmap</span> Starts Here 🚀
          </h1>
          <p className="text-gray-600 text-lg leading-relaxed mb-6">
            At <strong>CareerCompass</strong>, we help you navigate your learning journey with structured paths 
            for every domain — from <strong>Software Development</strong> to <strong>AI & Data Science</strong>.
            Our AI-driven roadmap adapts to your goals and helps you reach your dream companies.
          </p>

          <a
            href="/login"
            className="inline-block bg-indigo-600 text-white px-6 py-3 rounded-xl shadow-lg hover:bg-indigo-700 transition-all"
          >
            Explore Personalized Roadmap
          </a>
        </motion.div>

        {/* Right Section (Image) */}
        <motion.div
          initial={{ x: 100, opacity: 0 }}
          whileInView={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.7 }}
          className="flex-1 flex justify-center"
        >
          <img src={roadmapImg} alt="Roadmap" className="w-full max-w-md drop-shadow-lg rounded-2xl" />
        </motion.div>
      </div>

      {/* Features Section */}
      <div className="max-w-6xl mx-auto mt-20 grid md:grid-cols-4 sm:grid-cols-2 gap-8">
        {[
          {
            icon: <FaUserGraduate className="text-indigo-600 text-3xl" />,
            title: "Guided Learning",
            desc: "Step-by-step paths to master your target career domain.",
          },
          {
            icon: <FaLaptopCode className="text-indigo-600 text-3xl" />,
            title: "Hands-on Practice",
            desc: "Learn by building projects and solving real-world challenges.",
          },
          {
            icon: <FaBrain className="text-indigo-600 text-3xl" />,
            title: "AI-Powered Insights",
            desc: "Our AI analyzes your performance and gives improvement tips.",
          },
          {
            icon: <FaChartLine className="text-indigo-600 text-3xl" />,
            title: "Track Progress",
            desc: "Visualize your progress and stay on top of your learning goals.",
          },
        ].map((item, index) => (
          <motion.div
            key={index}
            whileHover={{ scale: 1.05 }}
            className="bg-white p-6 rounded-2xl shadow-lg text-center hover:shadow-xl transition"
          >
            <div className="flex justify-center mb-3">{item.icon}</div>
            <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
            <p className="text-gray-600 text-sm">{item.desc}</p>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default Roadmap;
