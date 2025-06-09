import React from "react";
import { motion } from "framer-motion";
import { FaUserTie } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const BookInterviewSection = () => {
  const navigate = useNavigate("");
  return (
    <motion.section
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className="bg-gradient-to-r from-purple-200  via-indigo-200 to-purple-200 py-16 px-6 sm:px-10 md:px-12 lg:px-20 rounded-3xl max-w-7xl mx-auto my-16 shadow-lg text-indigo-900 flex flex-col md:flex-row items-center justify-between gap-10"
    >
      <div className="flex flex-col md:flex-row  items-center md:items-start gap-6 md:gap-8 w-full md:w-auto px-4 sm:px-0">
        <div className="p-5 bg-indigo-400 rounded-full shadow-lg text-white flex-shrink-0">
          <FaUserTie className="w-16 h-16" />
        </div>
        <div className="w-full md:w-auto text-center md:text-left">
          <h2 className="text-3xl md:text-4xl font-extrabold mb-3 leading-tight">
            Book a One-on-One Interview with Experts
          </h2>
          <p className="text-lg md:text-xl font-medium leading-relaxed max-w-md mx-auto md:mx-0">
            Get personalized advice and feedback from industry professionals to
            boost your career confidence and skills.
          </p>
        </div>
      </div>
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        onClick={() =>
          navigate("/signup", { state: { from: "/dashboard/expert-booking" } })
        }
        className="bg-indigo-700 hover:bg-indigo-800 text-white font-bold px-10 md:px-12 py-3 md:py-4 rounded-full text-lg md:text-xl shadow-lg transition w-full md:w-auto mt-8 md:mt-0"
      >
        Book Now
      </motion.button>
    </motion.section>
  );
};

export default BookInterviewSection;
