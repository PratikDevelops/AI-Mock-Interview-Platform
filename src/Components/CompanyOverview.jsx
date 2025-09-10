import React, { useState, useEffect } from 'react';
import {
  FaBuilding, FaStar, FaChartLine, FaUsers, FaHandshake, FaSpinner, FaCheck
} from 'react-icons/fa';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { motion, AnimatePresence } from 'framer-motion';
import Markdown from 'react-markdown';

const MODEL_NAME = 'models/gemini-2.5-flash-preview-05-20';
const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

const loadingSteps = [
  'Validating company name...',
  'Searching latest updates...',
  'Analyzing company culture...',
  'Collecting financial data...',
  'Compiling competitor insights...'
];

const CompanyOverview = () => {
  const [company, setCompany] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [infoSections, setInfoSections] = useState([]);
  const [activeTab, setActiveTab] = useState(null);
  const [currentStep, setCurrentStep] = useState(0);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    let stepTimer;
    if (loading && !success) {
      setCurrentStep(0);
      stepTimer = setInterval(() => {
        setCurrentStep(prev => {
          if (prev < loadingSteps.length - 1) return prev + 1;
          return prev;
        });
      }, 1200);
    }
    return () => clearInterval(stepTimer);
  }, [loading, success]);

  const handleGenerate = async () => {
    setError('');
    setInfoSections([]);
    setActiveTab(null);
    setSuccess(false);

    if (!company.trim()) {
      setError('Please enter a company name.');
      return;
    }

    setLoading(true);

    const genAI = new GoogleGenerativeAI(API_KEY);
    const model = genAI.getGenerativeModel({ model: MODEL_NAME });

    const prompt = `Provide detailed information about the company "${company}". Return the result ONLY in valid JSON format like this:
[
  {"section": "Overview", "content": "Brief overview..."},
  {"section": "Culture", "content": "Company culture..."},
  {"section": "Latest News", "content": "Recent news..."},
  {"section": "Key Facts", "content": "Facts: founding year, HQ, revenue..."},
  {"section": "Customer Reviews", "content": "Summary of reviews..."},
  {"section": "Financials", "content": "Revenue, profit, market cap..."},
  {"section": "Competitors", "content": "Main competitors..."}
]`;

    try {
      const result = await model.generateContent(prompt);
      const text = (await result.response.text()).trim();

      const jsonStart = text.indexOf('[');
      const jsonEnd = text.lastIndexOf(']');
      const jsonString = text.slice(jsonStart, jsonEnd + 1);
      const parsed = JSON.parse(jsonString);

      setTimeout(() => {
        setInfoSections(parsed);
        if (parsed.length > 0) setActiveTab(parsed[0].section);
        setLoading(false);
        setSuccess(true);
        setTimeout(() => setSuccess(false), 1500);
      }, 2000);
    } catch (err) {
      console.error(err);
      setError('Failed to fetch company information. Please try again.');
      setLoading(false);
    }
  };

  const iconsMap = {
    Overview: <FaBuilding />,
    Culture: <FaUsers />,
    "Latest News": <FaChartLine />,
    "Key Facts": <FaHandshake />,
    "Customer Reviews": <FaStar />,
    Financials: <FaChartLine />,
    Competitors: <FaUsers />,
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="min-h-50 px-6 py-10 max-w-4xl mx-auto mt-20 bg-white text-gray-900 rounded-lg shadow-lg"
    >
      <header className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
        <h1 className="text-3xl font-bold text-blue-600 flex items-center gap-3">
          <FaBuilding /> Company Research Assistant
        </h1>
      </header>

      <section className="mb-6 space-y-3 max-w-2xl">
        <input
          type="text"
          placeholder="Enter company name (e.g., Google, Tesla)"
          value={company}
          onChange={(e) => setCompany(e.target.value)}
          className="w-full p-3 rounded-lg border border-gray-300 text-lg focus:outline-none focus:ring-2 focus:ring-blue-300 bg-gray-100"
        />
        <button
          onClick={handleGenerate}
          disabled={loading}
          className={` flex items-center justify-center gap-3 px-5 mt-2 py-2 rounded-xl font-semibold shadow-md transition ${
            loading ? 'bg-gray-400 text-gray-700 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700 text-white'
          }`}
        >
          {loading ? (
            <>
              <FaSpinner className="animate-spin" /> Fetching...
            </>
          ) : (
            'Get Company Info'
          )}
        </button>
      </section>

      {error && (
        <p className="text-red-600 font-medium mb-6 text-base max-w-xl">
          {error}
        </p>
      )}

      {/* Loading Steps */}
      <AnimatePresence>
        {loading && !success && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="mb-6 text-center"
          >
            <FaSpinner className="animate-spin text-blue-600 text-3xl mx-auto mb-3" />
            <p className="text-lg font-medium text-gray-700">{loadingSteps[currentStep]}</p>
          </motion.div>
        )}

        {success && (
          <motion.div
            key="success"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex items-center justify-center gap-3 text-green-600 font-semibold text-lg mb-6"
          >
            <FaCheck className="text-2xl" /> Company Research Ready!
          </motion.div>
        )}
      </AnimatePresence>

      {infoSections.length > 0 && !loading && !success && (
        <div className="flex flex-col md:flex-row gap-4 max-w-full">
          <nav className="w-full md:w-1/4 border-r border-gray-300">
            <div className="flex md:flex-col flex-row overflow-x-auto md:overflow-visible gap-2 md:gap-0">
              {infoSections.map(({ section }) => (
                <button
                  key={section}
                  onClick={() => setActiveTab(section)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg md:rounded-none md:rounded-r-lg transition-all text-left border-l-4 ${
                    activeTab === section
                      ? 'bg-blue-600 text-white border-blue-600'
                      : 'hover:bg-gray-200 border-transparent text-gray-800'
                  }`}
                >
                  <span className="text-lg">{iconsMap[section] || null}</span>
                  <span className="text-sm font-medium">{section}</span>
                </button>
              ))}
            </div>
          </nav>

          <article className="flex-1 p-5 rounded-lg shadow-inner border border-gray-300 bg-gray-50 overflow-auto max-h-[600px]">
            {infoSections
              .filter(({ section }) => section === activeTab)
              .map(({ content }) => (
                <div
                  key={activeTab}
                  className="mt-3 prose prose-blue max-w-none text-base leading-relaxed"
                >
                  <Markdown>{content}</Markdown>
                </div>
              ))}
          </article>
        </div>
      )}
    </motion.div>
  );
};

export default CompanyOverview;
