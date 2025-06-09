import React, { useState } from "react";
import { motion } from "framer-motion";

const plans = {
  monthly: [
    {
      name: "Basic",
      price: "₹749",
      features: [
        { text: "5 Mock Interviews", tooltip: "Practice 5 interviews per month" },
        { text: "AI Feedback Reports", tooltip: "Receive AI-generated feedback" },
        { text: "Access to Resume Analyzer", tooltip: "Use our AI resume tool" },
      ],
      popular: false,
    },
    {
      name: "Pro",
      price: "₹2,199",
      features: [
        { text: "Unlimited Mock Interviews", tooltip: "Practice as much as you want" },
        { text: "Detailed AI Feedback & Tips", tooltip: "Get in-depth analysis" },
        { text: "Career Roadmap Generator", tooltip: "Plan your career path" },
        { text: "Priority Support", tooltip: "Faster customer support" },
      ],
      popular: true,
    },
    {
      name: "Enterprise",
      price: "Contact Us",
      features: [
        { text: "Team Accounts", tooltip: "Manage multiple users" },
        { text: "Dedicated AI Coach", tooltip: "Personalized coaching" },
        { text: "Custom Interview Modules", tooltip: "Tailored interview questions" },
        { text: "24/7 Support", tooltip: "Round-the-clock assistance" },
      ],
      popular: false,
    },
  ],
  yearly: [
    {
      name: "Basic",
      price: "₹7,499",
      features: [
        { text: "5 Mock Interviews / Month", tooltip: "60 interviews/year" },
        { text: "AI Feedback Reports", tooltip: "Receive AI-generated feedback" },
        { text: "Access to Resume Analyzer", tooltip: "Use our AI resume tool" },
      ],
      popular: false,
    },
    {
      name: "Pro",
      price: "₹21,999",
      features: [
        { text: "Unlimited Mock Interviews", tooltip: "Practice as much as you want" },
        { text: "Detailed AI Feedback & Tips", tooltip: "Get in-depth analysis" },
        { text: "Career Roadmap Generator", tooltip: "Plan your career path" },
        { text: "Priority Support", tooltip: "Faster customer support" },
      ],
      popular: true,
    },
    {
      name: "Enterprise",
      price: "Contact Us",
      features: [
        { text: "Team Accounts", tooltip: "Manage multiple users" },
        { text: "Dedicated AI Coach", tooltip: "Personalized coaching" },
        { text: "Custom Interview Modules", tooltip: "Tailored interview questions" },
        { text: "24/7 Support", tooltip: "Round-the-clock assistance" },
      ],
      popular: false,
    },
  ],
};


const PricingSection = () => {
  const [billingCycle, setBillingCycle] = useState("monthly");

  return (
    <section id="pricing" className=" py-20 px-6 md:px-12 lg:px-20 overflow-hidden">
      <motion.div
        className="absolute top-10 left-10 w-48 h-48 bg-purple-300 opacity-30 rounded-full blur-3xl pointer-events-none"
        animate={{ y: [0, 20, 0] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute bottom-20 right-20 w-64 h-64 bg-indigo-300 opacity-20 rounded-full blur-3xl pointer-events-none"
        animate={{ x: [0, -20, 0] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
      />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="max-w-7xl mx-auto text-center mb-12 relative z-10"
      >
        <h2 className="text-4xl font-extrabold text-gray-900 mb-4">
          Choose Your Plan
        </h2>
        <p className="text-gray-700 max-w-3xl mx-auto text-lg">
          Find the perfect plan tailored to your interview preparation needs.
        </p>

        {/* Billing cycle toggle */}
        <div className="mt-8 inline-flex items-center bg-white rounded-full shadow-lg p-1 cursor-pointer w-fit mx-auto">
          {["monthly", "yearly"].map((cycle) => (
            <button
              key={cycle}
              onClick={() => setBillingCycle(cycle)}
              className={`px-6 py-2 rounded-full font-semibold transition ${
                billingCycle === cycle
                  ? "bg-purple-600 text-white shadow-md"
                  : "text-purple-700 hover:bg-purple-100"
              }`}
            >
              {cycle.charAt(0).toUpperCase() + cycle.slice(1)}
            </button>
          ))}
        </div>
      </motion.div>

      <div className="max-w-7xl mx-auto grid gap-10 md:grid-cols-3 relative z-10">
        {plans[billingCycle].map(({ name, price, features, popular }, index) => (
          <motion.div
            key={index}
            whileHover={{ scale: 1.05 }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.2, duration: 0.5 }}
            className={`relative bg-white rounded-3xl shadow-lg p-8 flex flex-col justify-between ${
              popular ? "border-4 border-purple-600" : ""
            }`}
          >
            {popular && (
              <div className="absolute -top-5 left-1/2 transform -translate-x-1/2 bg-purple-600 text-white text-sm font-semibold px-4 py-1 rounded-full shadow-lg">
                Most Popular
              </div>
            )}
            <h3 className="text-2xl font-bold text-gray-900 mb-4">{name}</h3>
            <p className="text-5xl font-extrabold text-purple-600 mb-6">{price}</p>
            <ul className="mb-8 space-y-3 text-gray-700 text-left">
              {features.map(({ text, tooltip }, i) => (
                <li key={i} className="flex items-center" title={tooltip}>
                  <svg
                    className="w-6 h-6 text-purple-500 mr-2 flex-shrink-0"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={2}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    viewBox="0 0 24 24"
                  >
                    <path d="M5 13l4 4L19 7" />
                  </svg>
                  {text}
                </li>
              ))}
            </ul>
            <button
              type="button"
              className={`w-full py-3 rounded-lg font-semibold text-lg transition ${
                popular
                  ? "bg-purple-600 text-white hover:bg-purple-700 shadow-lg"
                  : "bg-purple-100 text-purple-700 hover:bg-purple-200"
              }`}
            >
              Select Plan
            </button>
          </motion.div>
        ))}
      </div>
    </section>
  );
};

export default PricingSection;

