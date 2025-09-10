import React, { useState, useEffect } from 'react';
import {
  FaRoad,
  FaRedoAlt,
  FaCalendarAlt,
  FaSpinner,
  FaCheckCircle,
} from 'react-icons/fa';
import { motion } from 'framer-motion';
import { GoogleGenerativeAI } from '@google/generative-ai';

const MODEL_NAME = 'models/gemini-2.5-flash-preview-05-20';
const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

const steps = [
  'Analyzing your current role...',
  'Mapping skills to target role...',
  'Designing career milestones...',
  'Estimating timeframes...',
  'Finalizing roadmap...'
];

function LoadingSteps() {
  const [stepIndex, setStepIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setStepIndex((prev) => (prev + 1) % steps.length);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center text-center py-10">
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ repeat: Infinity, duration: 1.5, ease: 'linear' }}
        className="text-blue-600 text-5xl mb-4"
      >
        <FaSpinner />
      </motion.div>
      <motion.p
        key={stepIndex}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        transition={{ duration: 0.5 }}
        className="text-lg font-semibold text-gray-700"
      >
        {steps[stepIndex]}
      </motion.p>
    </div>
  );
}

function CareerRoadmapGenerator() {
  const [currentRole, setCurrentRole] = useState('');
  const [targetRole, setTargetRole] = useState('');
  const [skills, setSkills] = useState('');
  const [timeline, setTimeline] = useState([]);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleGenerate = async () => {
    setError('');
    setTimeline([]);
    if (!currentRole.trim() || !targetRole.trim()) {
      setError('Please enter both your current role and target role.');
      return;
    }
    setLoading(true);
    try {
      if (!API_KEY) {
        throw new Error('Missing API key. Set VITE_GEMINI_API_KEY in your environment.');
      }
      const genAI = new GoogleGenerativeAI(API_KEY);
      const model = genAI.getGenerativeModel({ model: MODEL_NAME });
      const prompt = `You are an expert career advisor. Generate a comprehensive, actionable career path timeline in JSON format to guide a person from their current role to their target role. Each step should include:

- step number
- clear role or milestone title
- detailed description with actionable advice
- typical duration (e.g., 6 months - 1 year)

Return ONLY a JSON object in this exact format:

{
  "careerPath": [
    {
      "step": 1,
      "title": "Role or Milestone Title",
      "description": "Detailed, actionable advice about this step.",
      "duration": "Approximate duration (e.g., 1-2 years)"
    }
  ]
}

DO NOT include any markdown, explanations, or extra text.

Input:
Current Role: ${currentRole}
Target Role: ${targetRole}
Skills or Interests: ${skills.trim() ? skills : 'N/A'}
`;
      const result = await model.generateContent(prompt);
      const text = (await result.response.text()).trim();
      const jsonStart = text.indexOf('{');
      const jsonEnd = text.lastIndexOf('}');
      if (jsonStart === -1 || jsonEnd === -1) throw new Error('No JSON found in response');
      const jsonString = text.slice(jsonStart, jsonEnd + 1);
      const parsed = JSON.parse(jsonString);
      if (!parsed.careerPath || !Array.isArray(parsed.careerPath)) throw new Error('Invalid JSON format');
      setTimeline(parsed.careerPath);

      // ✅ stop loader, show success, then reveal result
      setTimeout(() => {
        setLoading(false);
        setSuccess(true);
        setTimeout(() => setSuccess(false), 1500);
      }, steps.length * 1200);
    } catch (err) {
      console.error(err);
      setError('Failed to generate career path. Please try again.');
      setLoading(false);
    }
  };

  const resetAll = () => {
    setCurrentRole('');
    setTargetRole('');
    setSkills('');
    setTimeline([]);
    setError('');
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="min-h-50 px-6 py-10 max-w-4xl mx-auto mt-20 bg-white text-gray-900 rounded-lg shadow-lg"
    >
      <header className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
        <h1 className="text-3xl font-bold text-blue-600 flex items-center gap-3">
          <FaRoad /> AI Career Path Generator
        </h1>
      </header>

      <section className="mb-8 space-y-4">
        <input
          type="text"
          placeholder="Your Current Role"
          value={currentRole}
          onChange={(e) => setCurrentRole(e.target.value)}
          className="w-full p-3 rounded-lg border border-gray-300 text-lg focus:outline-none focus:ring-2 focus:ring-blue-300 transition"
        />
        <input
          type="text"
          placeholder="Your Target Role"
          value={targetRole}
          onChange={(e) => setTargetRole(e.target.value)}
          className="w-full p-3 rounded-lg border border-gray-300 text-lg focus:outline-none focus:ring-2 focus:ring-blue-300 transition"
        />
        <textarea
          rows={3}
          placeholder="Skills or interests (optional)"
          value={skills}
          onChange={(e) => setSkills(e.target.value)}
          className="w-full p-3 rounded-lg border border-gray-300 text-base focus:outline-none focus:ring-2 focus:ring-blue-300 transition resize-none"
        />
      </section>

      <section className="mb-10 flex flex-wrap items-center gap-4">
        <button
          onClick={handleGenerate}
          disabled={loading}
          className={`flex items-center gap-3 px-6 py-2 rounded-xl font-semibold text-white shadow-md transition ${
            loading ? 'bg-gray-400 cursor-not-allowed text-gray-700' : 'bg-blue-600 hover:bg-blue-700'
          }`}
        >
          {loading ? (
            <>
              <FaSpinner className="animate-spin text-lg" /> Generating...
            </>
          ) : (
            <>
              <FaRoad className="text-lg" /> Generate Career Path
            </>
          )}
        </button>
        {timeline.length > 0 && (
          <button
            onClick={resetAll}
            className="ml-auto flex items-center gap-3 bg-red-600 hover:bg-red-700 text-white px-5 py-2 rounded-xl font-semibold shadow-md transition focus:outline-none focus:ring-2 focus:ring-red-400"
          >
            <FaRedoAlt className="text-lg" /> New Path
          </button>
        )}
      </section>

      {error && (
        <p className="text-center text-red-600 font-semibold mb-6 text-base" role="alert">
          {error}
        </p>
      )}

      {loading && <LoadingSteps />}

      {success && (
        <div className="flex flex-col items-center justify-center py-10 text-center">
          <FaCheckCircle className="text-green-600 text-6xl mb-4" />
          <p className="text-2xl font-bold text-gray-800">Career Roadmap Ready!</p>
        </div>
      )}

      {!loading && !success && timeline.length > 0 && (
        <section
          id="career-path-result"
          className="p-6 rounded-xl shadow-lg border border-gray-300 bg-gray-50 text-gray-900"
        >
          <h2 className="text-2xl font-bold mb-6 flex items-center gap-3 text-blue-600">
            <FaCalendarAlt /> Career Path Timeline
          </h2>
          <div className="relative before:absolute before:w-1 before:bg-blue-600 before:rounded-full before:h-full before:left-10 before:top-0">
            {timeline.map(({ step, title, description, duration }) => (
              <motion.div
                key={step}
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: step * 0.1, duration: 0.4 }}
                className="relative mb-10 pl-24 pr-6 py-5 rounded-xl shadow-md border border-gray-300 bg-white"
                style={{ borderLeft: '6px solid #2563eb' }}
              >
                <div className="absolute left-0 top-8 flex items-center justify-center w-10 h-10 rounded-full border-4 border-blue-600 bg-blue-100 text-blue-600 font-bold text-lg select-none">
                  {step}
                </div>
                <h3 className="text-xl font-semibold mb-1">{title}</h3>
                <p className="text-sm italic text-blue-600 font-medium mb-3">{duration}</p>
                <p className="text-base leading-relaxed">{description}</p>
              </motion.div>
            ))}
          </div>
        </section>
      )}
    </motion.div>
  );
}

export default CareerRoadmapGenerator;
