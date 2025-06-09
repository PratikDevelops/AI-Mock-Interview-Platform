import React, { useState } from "react";
import {
  FaSpinner,
  FaChevronDown,
  FaChevronUp,
  FaLightbulb,
} from "react-icons/fa";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { motion } from "framer-motion";
import Markdown from "react-markdown"; // Just this import

const MODEL_NAME = "gemini-2.5-flash-preview-04-17";
const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

const InterviewQAGenerator = () => {
  const [topic, setTopic] = useState("");
  const [numQuestions, setNumQuestions] = useState(5);
  const [qaPairs, setQaPairs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [openIndex, setOpenIndex] = useState(null);

  const toggleIndex = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  const handleGenerate = async () => {
    setError("");
    setQaPairs([]);

    if (!topic.trim()) {
      setError("Please enter a topic or job title.");
      return;
    }

    if (isNaN(numQuestions) || numQuestions < 1 || numQuestions > 50) {
      setError("Please enter a valid number of questions (1-50).");
      return;
    }

    setLoading(true);

    const genAI = new GoogleGenerativeAI(API_KEY);
    const model = genAI.getGenerativeModel({ model: MODEL_NAME });

    const prompt = `Generate ${numQuestions} interview questions and answers for the topic: "${topic}". Return the result ONLY in valid JSON format like this:
[
  {
    "question": "Your question?",
    "answer": "Detailed answer..."
  }
]`;

    try {
      const result = await model.generateContent(prompt);
      const text = (await result.response.text()).trim();

      const jsonStart = text.indexOf("[");
      const jsonEnd = text.lastIndexOf("]");
      const jsonString = text.slice(jsonStart, jsonEnd + 1);
      const parsed = JSON.parse(jsonString);

      setQaPairs(parsed);
    } catch (err) {
      console.error(err);
      setError("Failed to generate interview questions.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="min-h-36 px-6 py-10 mt-20 max-w-4xl mx-auto bg-white text-gray-900 rounded-lg shadow-lg"
    >
      <header className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold flex items-center gap-2 text-blue-600">
          <FaLightbulb /> AI Interview Q&A Generator
        </h1>
      </header>

      <section className="mb-6">
        <input
          type="text"
          placeholder="Enter job role or topic (e.g., React, DSA)"
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
          className="w-full p-3 rounded-lg border border-gray-300 text-lg focus:outline-none focus:ring-2 focus:ring-blue-300 bg-gray-100 mb-4"
        />
        <input
          type="number"
          min="1"
          max="20"
          value={numQuestions}
          onChange={(e) => setNumQuestions(parseInt(e.target.value))}
          placeholder="How many questions? (1-20)"
          className="w-full p-3 rounded-lg border border-gray-300 text-lg focus:outline-none focus:ring-2 focus:ring-blue-300 bg-gray-100 mb-4"
        />
        <button
          onClick={handleGenerate}
          disabled={loading}
          className={` flex justify-center items-center gap-2 px-6 py-3 rounded font-semibold transition ${
            loading
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-blue-600 hover:bg-blue-700 text-white"
          }`}
        >
          {loading ? (
            <>
              <FaSpinner className="animate-spin" /> Generating...
            </>
          ) : (
            "Generate Questions"
          )}
        </button>
      </section>

      {error && <p className="text-red-500 font-semibold mb-4">{error}</p>}

      <section className="space-y-4">
        {qaPairs.map((item, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="border rounded p-4 shadow bg-gray-50 border-gray-300 transition"
          >
            <button
              onClick={() => toggleIndex(index)}
              className="w-full flex justify-between items-center text-left text-lg font-semibold focus:outline-none"
            >
              {item.question}
              {openIndex === index ? <FaChevronUp /> : <FaChevronDown />}
            </button>
            {openIndex === index && (
              <div className="mt-3 prose prose-blue max-w-none text-base leading-relaxed">
                <Markdown>{item.answer}</Markdown>
              </div>
            )}
          </motion.div>
        ))}
      </section>
    </motion.div>
  );
};

export default InterviewQAGenerator;
