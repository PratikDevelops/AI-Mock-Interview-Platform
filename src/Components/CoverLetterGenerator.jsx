import React, { useState } from 'react';
import {
  FaFileAlt,
  FaLightbulb,
  FaArrowUp,
  FaPenFancy,
  FaSpinner,
  FaCopy,
  FaCheck,
} from 'react-icons/fa';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { motion } from 'framer-motion';

const MODEL_NAME = 'gemini-2.5-flash-preview-04-17';
const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

const CoverLetterGenerator = () => {
  const [jobTitle, setJobTitle] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [additionalInfo, setAdditionalInfo] = useState('');
  const [coverLetter, setCoverLetter] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);

  const handleGenerate = async () => {
    setError('');
    setCoverLetter('');
    setCopied(false);

    if (!jobTitle.trim() || !companyName.trim()) {
      setError('Please enter both Job Title and Company Name.');
      return;
    }

    setLoading(true);

    const genAI = new GoogleGenerativeAI(API_KEY);
    const model = genAI.getGenerativeModel({ model: MODEL_NAME });

    const prompt = `You are an AI cover letter writer. Generate a professional, concise, and personalized cover letter for the following job application details. Format it with proper paragraph spacing. Return ONLY a JSON object in this format:

{
  "coverLetter": "full text with paragraphs and clean line breaks, no markdown"
}

Job Title: ${jobTitle}
Company Name: ${companyName}
Additional Information: ${additionalInfo.trim() || 'N/A'}
`;

    try {
      const result = await model.generateContent(prompt);
      const text = (await result.response.text()).trim();

      const jsonStart = text.indexOf('{');
      const jsonEnd = text.lastIndexOf('}');
      const jsonString = text.slice(jsonStart, jsonEnd + 1);
      const parsed = JSON.parse(jsonString);
      setCoverLetter(parsed.coverLetter);
    } catch (err) {
      console.error(err);
      setError('Error generating cover letter.');
    } finally {
      setLoading(false);
    }
  };

  const resetAll = () => {
    setJobTitle('');
    setCompanyName('');
    setAdditionalInfo('');
    setCoverLetter('');
    setError('');
    setCopied(false);
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(coverLetter);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="min-h-50 px-6 py-10 max-w-4xl mx-auto mt-20 bg-white text-gray-900 rounded-lg shadow-lg"
    >
      <header className="flex justify-between items-center mb-10">
        <h1 className="text-4xl font-bold flex items-center gap-3 text-blue-600">
          <FaPenFancy /> AI Cover Letter Generator
        </h1>
      </header>

      <section className="mb-8 space-y-5">
        <input
          type="text"
          placeholder="Job Title"
          value={jobTitle}
          onChange={(e) => setJobTitle(e.target.value)}
          className="w-full p-3 rounded-lg border border-gray-300 text-lg focus:outline-none focus:ring-2 focus:ring-blue-300 bg-gray-100"
        />
        <input
          type="text"
          placeholder="Company Name"
          value={companyName}
          onChange={(e) => setCompanyName(e.target.value)}
          className="w-full p-3 rounded-lg border border-gray-300 text-lg focus:outline-none focus:ring-2 focus:ring-blue-300 bg-gray-100"
        />
        <textarea
          rows={5}
          placeholder="Additional information (skills, experience, achievements)"
          value={additionalInfo}
          onChange={(e) => setAdditionalInfo(e.target.value)}
          className="w-full p-3 rounded-lg border border-gray-300 text-lg focus:outline-none focus:ring-2 focus:ring-blue-300 bg-gray-100"
        />
      </section>

      <section className="mb-8 flex flex-wrap items-center gap-4">
        <button
          onClick={handleGenerate}
          disabled={loading}
          className={`flex items-center gap-2 px-6 py-2 rounded font-semibold transition ${
            loading
              ? 'bg-gray-400 cursor-not-allowed'
              : 'bg-blue-600 hover:bg-blue-700 text-white'
          }`}
        >
          {loading ? (
            <>
              <FaSpinner className="animate-spin" /> Generating...
            </>
          ) : (
            <>
              <FaFileAlt /> Generate Cover Letter
            </>
          )}
        </button>

        {coverLetter && (
          <button
            onClick={resetAll}
            className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-5 py-2 rounded font-semibold transition focus:outline-none focus:ring-2 focus:ring-red-400"
          >
            <FaArrowUp /> New Letter
          </button>
        )}
      </section>

      {error && (
        <p className="text-red-500 font-semibold mb-4 text-lg" role="alert">
          {error}
        </p>
      )}

      {coverLetter && (
        <section
          id="cover-letter-result"
          className="relative p-6 rounded-lg shadow-md border whitespace-pre-line bg-gray-50 border-gray-300 text-gray-900"
        >
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-semibold text-blue-600 flex items-center gap-2">
              <FaLightbulb /> Generated Cover Letter
            </h2>
            <button
              onClick={copyToClipboard}
              className="flex items-center gap-2 text-sm bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded transition"
            >
              {copied ? (
                <>
                  <FaCheck /> Copied
                </>
              ) : (
                <>
                  <FaCopy /> Copy
                </>
              )}
            </button>
          </div>
          <p className="text-lg leading-relaxed whitespace-pre-wrap">{coverLetter}</p>
        </section>
      )}
    </motion.div>
  );
};

export default CoverLetterGenerator;
