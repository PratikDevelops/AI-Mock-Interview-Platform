import React from "react";
import { FaPlayCircle, FaRobot, FaCheckCircle } from "react-icons/fa";
import { motion } from "framer-motion";
import { useNavigate, useLocation } from "react-router-dom";

const steps = [
  {
    icon: <FaPlayCircle className="w-12 h-12 text-[#7366ff] bounce" />,
    title: "Start a Mock Interview",
    description:
      "Choose your job role and start a simulated interview powered by AI, tailored to your field.",
  },
  {
    icon: <FaRobot className="w-12 h-12 text-[#7366ff] bounce" />,
    title: "Get AI Feedback",
    description:
      "Receive instant AI-powered feedback on your answers, including tips to improve.",
  },
  {
    icon: <FaCheckCircle className="w-12 h-12 text-[#7366ff] bounce" />,
    title: "Track Your Progress",
    description:
      "Monitor your growth over time and unlock new challenges as you improve.",
  },
];

const HowItWorksSection = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // Get redirect path from location.state or default to /dashboard
  const from = location.state?.from || "/dashboard";

  return (
    <section className=" py-24 px-6 md:px-12 lg:px-20 overflow-hidden">
      <div className="absolute top-[-60px] left-[-80px] w-72 h-72 bg-[#7366ff] opacity-10 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-[-80px] right-[-60px] w-96 h-96 bg-[#a57bff] opacity-10 rounded-full blur-3xl pointer-events-none"></div>

      <div className="max-w-5xl mx-auto text-center mb-16 relative z-10">
        <h2 className="text-4xl font-extrabold text-gray-900 mb-4 inline-block relative">
          How It Works
          <span className="absolute left-0 -bottom-2 w-20 h-1 rounded-full bg-gradient-to-r from-[#7366ff] to-[#a57bff]"></span>
        </h2>
        <p className="text-gray-700 text-lg md:text-xl max-w-3xl mx-auto">
          Simple steps to help you prepare effectively and confidently for your
          next interview.
        </p>
      </div>

      <div className="relative max-w-6xl mx-auto grid gap-14 md:grid-cols-3 z-10">
        <div className="hidden md:flex absolute top-20 left-0 right-0 mx-auto w-full max-w-6xl justify-between items-center pointer-events-none">
          <div className="w-1/3 border-t-2 border-gray-300"></div>
          <div className="w-1/3 border-t-2 border-gray-300"></div>
        </div>

        {steps.map(({ icon, title, description }, index) => (
          <motion.div
            key={index}
            className="relative bg-white rounded-3xl p-8 shadow-xl cursor-pointer overflow-hidden border-2 border-transparent hover:border-gradient-to-r hover:border-lime-400 hover:border-r-pink-500 transition-all duration-500"
            whileHover={{
              scale: 1.07,
              boxShadow: "0 15px 30px rgba(115, 102, 255, 0.4)",
            }}
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 * index, duration: 0.6, ease: "easeOut" }}
          >
            <motion.div
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="flex justify-center mb-6"
            >
              {icon}
            </motion.div>

            <h3 className="text-2xl font-semibold text-gray-900 mb-3 text-center">
              {title}
            </h3>
            <p className="text-gray-700 text-base leading-relaxed text-center">
              {description}
            </p>
          </motion.div>
        ))}
      </div>

      <div className="mt-16 text-center relative z-10">
        <button
          type="button"
          onClick={() =>
          navigate("/signup", { state: { from: "/dashboard/" } })
        }
          className="bg-[#7366ff] hover:bg-[#5e54d9] text-white font-semibold px-8 py-3 rounded-full shadow-lg text-lg transition"
        >
          Start Your Mock Interview
        </button>
      </div>
    </section>
  );
};

export default HowItWorksSection;
