import React from "react";
import { motion } from "framer-motion";
import {
  FaRobot,
  FaComments,
  FaChartLine,
  FaFileAlt,
  FaMapSigns,
  FaQuestionCircle,
} from "react-icons/fa";

const features = [
  {
    icon: <FaRobot className="text-[#7366ff] w-12 h-12" />,
    title: "AI-Powered Feedback",
    description:
      "Get instant, detailed feedback on your answers powered by cutting-edge AI.",
  },
  {
    icon: <FaComments className="text-[#7366ff] w-12 h-12" />,
    title: "Realistic Mock Interviews",
    description:
      "Practice with realistic interview questions tailored to your field and skill level.",
  },
  {
    icon: <FaChartLine className="text-[#7366ff] w-12 h-12" />,
    title: "Progress Tracking",
    description:
      "Track your improvement over time with detailed analytics and performance charts.",
  },
  {
    icon: <FaFileAlt className="text-[#7366ff] w-12 h-12" />,
    title: "AI Resume Analyzer",
    description: "Optimize your resume with AI suggestions to boost your chances.",
  },
  {
    icon: <FaMapSigns className="text-[#7366ff] w-12 h-12" />,
    title: "AI Career Roadmap Generator",
    description:
      "Generate personalized career roadmaps tailored to your goals and skills.",
  },
  {
    icon: <FaQuestionCircle className="text-[#7366ff] w-12 h-12" />,
    title: "AI Interview Question Generator",
    description:
      "Get a variety of interview questions generated specifically for your role.",
  },
];

const FeaturesSection = () => {
  return (
    <section id="features" className=" py-20  px-6 md:px-12 lg:px-20">
      <div className="max-w-7xl mx-auto text-center mb-14">
        <h2 className="text-4xl font-extrabold text-gray-900 mb-4 relative inline-block">
          Why Choose Our Platform?
          <span className="absolute left-0 -bottom-2 w-24 h-1 rounded-full bg-gradient-to-r from-[#7366ff] to-[#a57bff]"></span>
        </h2>
        <p className="text-gray-700 max-w-3xl mx-auto text-lg md:text-xl">
          Powerful AI tools designed to prepare you for success at every step.
        </p>
      </div>

      <div className="grid gap-12 md:grid-cols-3 max-w-7xl mx-auto">
        {features.map(({ icon, title, description }, index) => (
          <motion.div
            key={index}
            className="relative bg-white rounded-3xl p-8 shadow-xl cursor-pointer overflow-hidden border-2 border-transparent hover:border-gradient-to-r hover:border-lime-400 hover:border-r-pink-500 transition-all duration-500"
            whileHover={{ scale: 1.07, boxShadow: "0 15px 30px rgba(115, 102, 255, 0.4)" }}
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 * index, duration: 0.6, ease: "easeOut" }}
          >
            <div className="mb-6 flex justify-center">{icon}</div>
            <h3 className="text-2xl font-bold text-gray-900 mb-3 text-center">{title}</h3>
            <p className="text-gray-700 text-base text-center">{description}</p>

            <div
              className="pointer-events-none absolute -top-6 -right-6 w-24 h-24 bg-gradient-to-tr from-[#7366ff] to-[#a57bff] rounded-full opacity-20 blur-3xl"
              aria-hidden="true"
            ></div>
          </motion.div>
        ))}
      </div>
    </section>
  );
};

export default FeaturesSection;
