import React from 'react';
import { motion } from 'framer-motion';
import Typewriter from 'typewriter-effect';
import { Link } from 'react-scroll';
import { FaChevronDown } from 'react-icons/fa';
import InterviewIllustration from './InterviewIllustration';
import { useNavigate } from 'react-router-dom';

const HeroSection = () => {
  const navigate = useNavigate("")
  return (
    <section id='home' className=" py-20 px-6 md:px-12 lg:px-24 relative overflow-hidden">
      <div className="max-w-7xl mx-auto flex flex-col-reverse md:flex-row items-center justify-between gap-12">
    
        <motion.div
          className="md:w-1/2 text-center md:text-left"
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h1 className="text-4xl md:text-5xl font-extrabold leading-tight text-gray-900 mb-6">
            <Typewriter
              options={{
                strings: [
                  'Crack Your Next Interview with AI',
                  'Ace Technical Interviews Easily',
                  'Level Up with Smart Practice',
                ],
                autoStart: true,
                loop: true,
                delay: 60,
                deleteSpeed: 40,
              }}
            />
          </h1>
          <p className="text-lg md:text-xl text-gray-600 mb-8">
            Practice interviews with instant AI feedback, real-world questions, and personalized insights.
          </p>
          <div className="flex justify-center md:justify-start gap-4">
            <motion.button
              whileHover={{ scale: 1.05 }}
              onClick={()=>{navigate('/signup');}}
              className="bg-[#7366ff] text-white px-6 py-3 rounded-xl text-lg font-semibold shadow-md hover:bg-[#5e54d9] transition"
            >
              Get Started
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              onClick={()=>{navigate('/learn-more');}}
              className="border border-[#7366ff] text-[#7366ff] px-6 py-3 rounded-xl text-lg font-semibold hover:bg-[#f2f0ff] transition"
            >
              Learn More
            </motion.button>
          </div>
        </motion.div>
        <motion.div
          className="md:w-1/2 relative"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1 }}
        >
          <div className="relative z-10">
            <InterviewIllustration/>
          </div>
          <div className="absolute top-1/2 left-1/2 w-72 h-72 bg-[#7366ff] blur-3xl opacity-25 rounded-full animate-pulse -translate-x-1/2 -translate-y-1/2 z-0"></div>
        </motion.div>
      </div>
    </section>
  );
};

export default HeroSection;
