import React from "react";
import aiImg from "../assets/ai.png";

const AiGuidance = () => {
  return (
    <section className="min-h-screen bg-gradient-to-br from-indigo-100 via-blue-50 to-cyan-100 flex flex-col items-center justify-center py-16 px-6">
      
      {/* HERO SECTION */}
      <div className="max-w-7xl w-full flex flex-col lg:flex-row items-center justify-between mt-8 gap-12">
        
        {/* LEFT CONTENT */}
        <div className="lg:w-1/2 space-y-6 text-center lg:text-left">
          <h1 className="text-5xl md:text-6xl font-extrabold text-gray-900 leading-tight">
            Transform Your Career with{" "}
            <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent">
              AI Guidance
            </span>
          </h1>

          <p className="text-gray-700 text-lg leading-relaxed">
            <strong>CareerCompass AI</strong> empowers learners and professionals with
            personalized career insights. Using cutting-edge AI models, we help
            you identify your strengths, overcome weaknesses, and align your goals
            with the latest market trends — all <strong>completely free</strong>.
          </p>

          <div className="flex flex-wrap justify-center lg:justify-start gap-3 text-sm md:text-base text-gray-700 font-medium">
            <span className="bg-white/60 backdrop-blur-md px-4 py-2 rounded-full shadow">
              🤖 Personalized AI Insights
            </span>
            <span className="bg-white/60 backdrop-blur-md px-4 py-2 rounded-full shadow">
              📊 Market Trend Analysis
            </span>
            <span className="bg-white/60 backdrop-blur-md px-4 py-2 rounded-full shadow">
              🎯 Smart Skill Roadmaps
            </span>
            <span className="bg-white/60 backdrop-blur-md px-4 py-2 rounded-full shadow">
              📈 Progress Tracking
            </span>
          </div>

          <button className="mt-6 bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-10 py-4 rounded-xl text-lg font-semibold shadow-lg hover:shadow-2xl hover:scale-105 transition duration-300 ease-in-out">
            Get Your AI Career Plan
          </button>
        </div>

        {/* RIGHT IMAGE */}
        <div className="lg:w-1/2 flex justify-center">
          <div className="relative w-full max-w-md">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-400 via-purple-400 to-cyan-400 blur-3xl opacity-40 animate-pulse"></div>
            <img
              src={aiImg}
              alt="AI Guidance"
              className="relative w-full rounded-3xl shadow-2xl transform hover:scale-105 transition duration-500"
            />
          </div>
        </div>
      </div>

      {/* FEATURES SECTION */}
      <div className="max-w-6xl w-full mt-20 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {[
          {
            title: "AI-Powered Career Insights",
            desc: "Get personalized recommendations based on your skills, interests, and industry demand.",
            icon: "🤖",
          },
          {
            title: "Adaptive Learning Path",
            desc: "AI generates study plans and tracks your growth, helping you improve every day.",
            icon: "📚",
          },
          {
            title: "Smart Resume & Interview Prep",
            desc: "AI assists in optimizing your resume and simulates interviews to build your confidence.",
            icon: "💼",
          },
          {
            title: "Real-Time Market Trends",
            desc: "Stay updated with evolving job trends and required skill sets for top roles.",
            icon: "📊",
          },
          {
            title: "Skill Gap Analysis",
            desc: "Identify what’s missing in your learning journey and receive targeted AI advice.",
            icon: "🎯",
          },
          {
            title: "Full Progress Visualization",
            desc: "View your journey with graphs and insights to measure how far you’ve come.",
            icon: "📈",
          },
        ].map((feature, index) => (
          <div
            key={index}
            className="bg-white/60 backdrop-blur-lg p-6 rounded-2xl shadow-md hover:shadow-xl hover:-translate-y-1 transition duration-300"
          >
            <div className="text-4xl mb-3">{feature.icon}</div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">
              {feature.title}
            </h3>
            <p className="text-gray-600">{feature.desc}</p>
          </div>
        ))}
      </div>

      {/* CTA SECTION */}
      <div className="max-w-4xl w-full mt-20 text-center">
        <h2 className="text-3xl font-bold text-gray-800 mb-4">
          Start Your Personalized AI Career Journey Today 🚀
        </h2>
        <p className="text-gray-600 mb-6">
          Join thousands of learners transforming their futures with
          <span className="text-blue-600 font-semibold"> CareerCompass AI</span>.
        </p>
        <button className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-10 py-4 rounded-xl font-semibold text-lg shadow-lg hover:scale-105 transition duration-300">
          Begin Free AI Assessment
        </button>
      </div>
    </section>
  );
};

export default AiGuidance;
