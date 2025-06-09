import React, { useState } from "react";
import { motion } from "framer-motion";
import { FaChevronDown, FaChevronUp } from "react-icons/fa";

const faqs = [
  {
    question: "What is an AI Mock Interview Platform?",
    answer:
      "It's an intelligent platform where you can practice interviews with AI-generated questions and receive instant feedback to improve your performance.",
  },
  {
    question: "How does the AI provide feedback?",
    answer:
      "We use Google's Gemini AI to analyze your interview responses in real-time. It evaluates clarity, confidence, and content to give you actionable feedback instantly.",
  },
  {
    question: "Is the platform free to use?",
    answer:
      "We offer a free basic plan with limited features. You can upgrade to premium plans for unlimited mock interviews, resume analysis, and personalized career roadmaps.",
  },
  {
    question: "How does your platform use AI technology?",
    answer:
      "Our platform is powered by Google's Gemini AI, which understands your answers like a real interviewer. It provides smart, personalized feedback to improve your confidence and communication.",
  },
  {
    question: "Is this platform suitable for freshers?",
    answer:
      "Absolutely! Whether you're a fresher or an experienced professional, we provide role-specific mock interviews tailored to your level and goals.",
  },
  {
    question: "Can I analyze my resume with this platform?",
    answer:
      "Yes! Our AI Resume Analyzer reviews your resume using Gemini AI and suggests improvements for clarity, relevance, and job-matching.",
  },
];

const FaqSection = () => {
  const [openIndex, setOpenIndex] = useState(null);

  const toggleFaq = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section id="faq" className="py-20  px-6 md:px-12 lg:px-20">
      <div className="max-w-5xl mx-auto">
        <h2 className="text-4xl font-extrabold text-center text-gray-900 mb-10 relative">
          Frequently Asked Questions
          <span className="block w-24 h-1 bg-gradient-to-r from-[#7366ff] to-[#a57bff] mx-auto mt-2 rounded-full" />
        </h2>

        <div className="space-y-6">
          {faqs.map((faq, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              viewport={{ once: true }}
              className="bg-white border border-gray-200 shadow-md rounded-xl p-6 cursor-pointer hover:shadow-xl transition-shadow duration-300"
              onClick={() => toggleFaq(index)}
            >
              <div className="flex justify-between items-center text-left">
                <h3 className="text-lg md:text-xl font-semibold text-gray-800">
                  {faq.question}
                </h3>
                <span className="text-[#7366ff]">
                  {openIndex === index ? <FaChevronUp /> : <FaChevronDown />}
                </span>
              </div>
              {openIndex === index && (
                <motion.div
                  initial={{ maxHeight: 0, opacity: 0 }}
                  animate={{ maxHeight: 500, opacity: 1 }}
                  exit={{ maxHeight: 0, opacity: 0 }}
                  transition={{ duration: 0.3, ease: "easeOut" }}
                  className="overflow-hidden mt-4"
                >
                  <p className="text-gray-700 text-base leading-relaxed">
                    {faq.answer}
                  </p>
                </motion.div>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FaqSection;
