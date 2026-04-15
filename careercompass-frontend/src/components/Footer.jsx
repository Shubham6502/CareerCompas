import { FiFacebook, FiInstagram, FiLinkedin, FiTwitter } from "react-icons/fi";

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-gray-300 py-10 ">
      <div className="max-w-6xl mx-auto px-6 grid md:grid-cols-4 sm:grid-cols-2 gap-8">
        
        {/* Brand */}
        <div>
          <h2 className="text-2xl font-semibold text-white mb-4">
            CareerCompass
          </h2>
          <p className="text-gray-400">
            Guiding your path to success — with personalized career insights, tests, and opportunities.
          </p>
        </div>

        {/* Quick Links */}
        <div>
          <h3 className="text-xl font-semibold text-white mb-3">Quick Links</h3>
          <ul className="space-y-2 text-gray-400">
            <li><a href="#hero" className="hover:text-blue-400">Home</a></li>
            <li><a href="#services" className="hover:text-blue-400">Services</a></li>
            <li><a href="#contact" className="hover:text-blue-400">Contact</a></li>
            <li><a href="#about" className="hover:text-blue-400">About</a></li>
          </ul>
        </div>

        {/* Services */}
        <div>
          <h3 className="text-xl font-semibold text-white mb-3">Our Services</h3>
          <ul className="space-y-2 text-gray-400">
            <li>Career Guidance</li>
            <li>Skill Tests</li>
            <li>Job Recommendations</li>
          </ul>
        </div>

        {/* Social Links */}
        <div>
          <h3 className="text-xl font-semibold text-white mb-3">Follow Us</h3>
          <div className="flex space-x-4 text-gray-400">
            <a href="#" className="hover:text-blue-400"><FiFacebook size={22} /></a>
            <a href="#" className="hover:text-blue-400"><FiInstagram size={22} /></a>
            <a href="#" className="hover:text-blue-400"><FiLinkedin size={22} /></a>
            <a href="#" className="hover:text-blue-400"><FiTwitter size={22} /></a>
          </div>
        </div>
      </div>

      {/* Bottom line */}
      <div className="border-t border-gray-700 mt-8 pt-4 text-center text-gray-500 text-sm">
        © {new Date().getFullYear()} CareerCompass. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;