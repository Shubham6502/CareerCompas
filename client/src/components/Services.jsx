import React from 'react'
import { FiCompass, FiCheckCircle, FiBriefcase } from "react-icons/fi";

const Services = () => {
   const services = [
    {
      icon: <FiCompass size={32} className="text-blue-600" />,
      title: "Personalized Career Guidance",
      desc: "Get AI-based recommendations and guidance tailored to your skills, interests, and goals.",
    },
    {
      icon: <FiCheckCircle size={32} className="text-blue-600" />,
      title: "Skill & Preference Tests",
      desc: "Take career and skill assessment tests to discover your ideal career path and improve where needed.",
    },
    {
      icon: <FiBriefcase size={32} className="text-blue-600" />,
      title: "Job Openings & Opportunities",
      desc: "Explore relevant job openings and internships matched with your career goals.",
    },
  ];

  return (
    <section className="py-16 bg-gray-50 text-center" id="services">
      <h2 className="text-3xl font-bold text-gray-800 mb-8">
        What We Offer
      </h2>
      <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-8 px-6">
        {services.map((service, index) => (
          <div
            key={index}
            className="bg-white shadow-md rounded-2xl p-6 hover:shadow-lg transition"
          >
            <div className="flex justify-center mb-4">{service.icon}</div>
            <h3 className="text-xl font-semibold mb-2">{service.title}</h3>
            <p className="text-gray-600">{service.desc}</p>
          </div>
        ))}
      </div>
    </section>
  )
}

export default Services