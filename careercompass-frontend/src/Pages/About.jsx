import React from "react";
import aboutImg from "../assets/about.png";

const About = () => {
  return (
    <section className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-100 via-blue-50 to-cyan-100 py-16 px-6">
      <div className="max-w-6xl w-full grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
        
        {/* Left Side - Text Content */}
        <div className="space-y-6">
          <h2 className="text-4xl font-bold text-gray-800 leading-snug">
            About <span className="text-blue-600">CareerCompass</span>
          </h2>
          <p className="text-gray-700 text-lg leading-relaxed">
            <strong>CareerCompass</strong> is an AI-powered platform built to
            guide students and professionals in choosing the right career path.
            We believe everyone deserves access to structured career guidance —
            <span className="font-semibold text-blue-700"> completely free of cost.</span>
          </p>
          <p className="text-gray-700 text-lg leading-relaxed">
            Our mission is to provide personalized recommendations, track
            progress, and enhance user performance using advanced AI models
            trained on market trends. Whether you are a student planning your
            journey or a professional looking for growth, CareerCompass helps
            you make smarter career choices with confidence.
          </p>
          <div className="bg-blue-600 text-white px-6 py-3 rounded-lg inline-block shadow-lg hover:bg-blue-700 transition">
            Empowering Futures with AI 🚀
          </div>
        </div>

        {/* Right Side - Image */}
        <div className="flex justify-center">
          <img
            src={aboutImg}
            alt="About CareerCompass"
            className="w-full max-w-md md:max-w-lg"
          />
        </div>
      </div>
    </section>
  );
};

export default About;
