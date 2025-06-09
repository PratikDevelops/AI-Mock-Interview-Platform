import React from "react";
import {
  FaFacebookF,
  FaTwitter,
  FaLinkedinIn,
  FaGithub,
  FaEnvelope,
  FaPhoneAlt,
} from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="bg-white py-10 px-6 md:px-12 lg:px-20 mt-20 border-t border-gray-300">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12 text-gray-700">
        <div>
          <img
            src="/vite.svg"
            alt="AI Mock Interview Logo"
            className="w-30 h-15 mb-6"
          />
          <p className="text-base md:text-lg leading-relaxed font-medium">
            Empower your career journey with AI-driven mock interviews, instant
            feedback, and skill-building tools tailored just for you.
          </p>
        </div>

        <div>
          <h4 className="text-xl font-semibold mb-5">Quick Links</h4>
          <ul className="space-y-3 text-lg font-medium">
            <li>
              <a href="#hero" className="hover:text-[#7366ff] transition">
                Home
              </a>
            </li>
            <li>
              <a href="#features" className="hover:text-[#7366ff] transition">
                Features
              </a>
            </li>
            <li>
              <a href="#pricing" className="hover:text-[#7366ff] transition">
                Pricing
              </a>
            </li>
            <li>
              <a href="#faq" className="hover:text-[#7366ff] transition">
                FAQ
              </a>
            </li>
          </ul>
        </div>

        <div>
          <h4 className="text-xl font-semibold mb-5">Contact Us</h4>
          <p className="flex items-center gap-3 mb-3 text-lg font-medium">
            <FaEnvelope className="text-[#7366ff]" />
            <a
              href="mailto:support@aimockinterview.com"
              className="hover:text-[#7366ff] transition"
            >
              support@aimockinterview.com
            </a>
          </p>
          <p className="flex items-center gap-3 text-lg font-medium">
            <FaPhoneAlt className="text-[#7366ff]" />
            <a
              href="tel:+1234567890"
              className="hover:text-[#7366ff] transition"
            >
              +1 234 567 890
            </a>
          </p>
        </div>

        {/* Social Media */}
        <div>
          <h4 className="text-xl font-semibold mb-5">Follow Us</h4>
          <div className="flex space-x-8 text-2xl text-gray-600">
            <a
              href="https://facebook.com"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Facebook"
              className="hover:text-[#7366ff] transition"
            >
              <FaFacebookF />
            </a>
            <a
              href="https://twitter.com"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Twitter"
              className="hover:text-[#7366ff] transition"
            >
              <FaTwitter />
            </a>
            <a
              href="https://linkedin.com"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="LinkedIn"
              className="hover:text-[#7366ff] transition"
            >
              <FaLinkedinIn />
            </a>
            <a
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="GitHub"
              className="hover:text-[#7366ff] transition"
            >
              <FaGithub />
            </a>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto mt-6 border-t border-gray-300 pt-8 text-center text-lg text-gray-500 font-medium">
        &copy; {new Date().getFullYear()} AI Mock Interview. All rights
        reserved.
      </div>
    </footer>
  );
};

export default Footer;
