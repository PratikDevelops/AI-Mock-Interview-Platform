import React, { useState } from 'react';
import {
  FaBuilding, FaStar, FaChartLine, FaUsers, FaHandshake, FaSpinner
} from 'react-icons/fa';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { motion } from 'framer-motion';
import Markdown from 'react-markdown'; 

const MODEL_NAME = 'gemini-2.5-flash-preview-04-17';
const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

const CompanyOverview = () => {
  const [company, setCompany] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [infoSections, setInfoSections] = useState([]);
  const [activeTab, setActiveTab] = useState(null);

  const handleGenerate = async () => {
    setError('');
    setInfoSections([]);
    setActiveTab(null);

    if (!company.trim()) {
      setError('Please enter a company name.');
      return;
    }

    setLoading(true);

    const genAI = new GoogleGenerativeAI(API_KEY);
    const model = genAI.getGenerativeModel({ model: MODEL_NAME });

    const prompt = `Provide detailed information about the company "${company}". Return the result ONLY in valid JSON format like this:
[
  {
    "section": "Overview",
    "content": "Brief overview of the company..."
  },
  {
    "section": "Culture",
    "content": "Description of company culture..."
  },
  {
    "section": "Latest News",
    "content": "Recent news and developments..."
  },
  {
    "section": "Key Facts",
    "content": "Important facts such as founding year, headquarters, revenue, etc."
  },
  {
    "section": "Customer Reviews",
    "content": "Summary of customer reviews, ratings, and feedback."
  },
  {
    "section": "Financials",
    "content": "Information on revenue, profit, stock price, market cap, etc."
  },
  {
    "section": "Competitors",
    "content": "List and brief info about main competitors."
  }
]`;

    try {
      const result = await model.generateContent(prompt);
      const text = (await result.response.text()).trim();

      const jsonStart = text.indexOf('[');
      const jsonEnd = text.lastIndexOf(']');
      const jsonString = text.slice(jsonStart, jsonEnd + 1);
      const parsed = JSON.parse(jsonString);

      setInfoSections(parsed);
      if (parsed.length > 0) setActiveTab(parsed[0].section);
    } catch (err) {
      console.error(err);
      setError('Failed to fetch company information. Please try again.');
    } finally {
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

      {infoSections.length > 0 && (
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
