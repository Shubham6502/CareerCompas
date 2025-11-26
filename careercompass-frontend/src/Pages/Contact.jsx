import React from "react";
import contactImg from "../assets/contact.jpg";

const Contact = () => {
  return (
    <section className="min-h-screen  flex items-center justify-center py-16 px-1 ">
      <div className="max-w-6xl w-full grid grid-cols-1 md:grid-cols-2 gap-12 items-center mt-8">
        
        {/* Left Side - Image */}
        <div className="flex justify-center hidden md:block">
          <img
            src={contactImg}
            alt="Contact CareerCompass"
            className="w-full max-w-md md:max-w-lg"
          />
        </div>

        {/* Right Side - Contact Form */}
        <div className="bg-white rounded-2xl sm:shadow-2xl  px-9 py-5 border border-gray-100">
          <h2 className="text-3xl font-bold text-gray-800 mb-2 text-center">
            Any <span className="text-blue-600">Query?</span>
          </h2>
          

          <form className="space-y-5">
            {/* Name */}
            <div>
              <label className="block text-gray-700 font-semibold ">Full Name</label>
              <input
                type="text"
                placeholder="Enter your name"
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>

            {/* Email */}
            <div>
              <label className="block text-gray-700 font-semibold ">Email</label>
              <input
                type="email"
                placeholder="Enter your email"
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>

            {/* Query Type */}
            <div>
              <label className="block text-gray-700 font-semibold ">Query Type</label>
              <select className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none">
                <option value="">Select a type</option>
                <option value="career">Career Guidance</option>
                <option value="study">Study Query</option>
                <option value="technical">Technical Support</option>
                <option value="feedback">Feedback</option>
              </select>
            </div>

            {/* Message */}
            <div>
              <label className="block text-gray-700 font-semibold">Message</label>
              <textarea
                placeholder="Write your message or study query..."
                rows="4"
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
              ></textarea>
            </div>

            {/* Submit Button */}
            <div className="text-center">
              <button
                type="submit"
                className="bg-blue-600 text-white px-8 py-2 rounded-lg font-semibold shadow-md hover:bg-blue-700 transition duration-200"
              >
                Submit Query
              </button>
            </div>
          </form>

          {/* Contact Info Section */}
          <div className="mt-3 text-center">
            <p className="text-gray-600">
              📧 Email us at:{" "}
              <a
                href="mailto:support@careercompass.ai"
                className="text-blue-600 font-medium hover:underline"
              >
                support@careercompass.ai
              </a>
            </p>
            <p className="text-gray-600 mt-1">
              🌐 Visit our website:{" "}
              <a
                href="https://careercompass.ai"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 font-medium hover:underline"
              >
                careercompass.ai
              </a>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
