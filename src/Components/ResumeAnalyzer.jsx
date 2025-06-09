import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import {
  FaUpload,
  FaFileAlt,
  FaCheckCircle,
  FaExclamationTriangle,
  FaThumbsDown,
  FaThumbsUp,
  FaLightbulb,
  FaArrowUp,
} from 'react-icons/fa';

import { GoogleGenerativeAI } from '@google/generative-ai';
import * as pdfjsLib from 'pdfjs-dist';
import { GlobalWorkerOptions } from 'pdfjs-dist';
import workerSrc from 'pdfjs-dist/build/pdf.worker.min.js?url';

GlobalWorkerOptions.workerSrc = workerSrc;

const MODEL_NAME = 'gemini-2.5-flash-preview-04-17';
const API_KEY = import.meta.env.VITE_GEMINI_API_KEY; // Demo only

function ResumeAnalyzer() {
  const [resumeText, setResumeText] = useState('');
  const [responseJSON, setResponseJSON] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const fileInputRef = useRef(null);

  const extractTextFromPDF = async (file) => {
    const arrayBuffer = await file.arrayBuffer();
    const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
    let text = '';
    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i);
      const content = await page.getTextContent();
      text += content.items.map((item) => item.str).join(' ') + '\n\n';
    }
    return text.trim();
  };

  const handleFileUpload = async (e) => {
    setError('');
    const file = e.target.files[0];
    if (!file) return;

    const fileType = file.type;

    try {
      if (fileType === 'application/pdf') {
        const text = await extractTextFromPDF(file);
        setResumeText(text);
      } else if (
        fileType === 'text/plain' ||
        fileType === 'application/msword' ||
        fileType ===
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
      ) {
        const text = await file.text();
        setResumeText(text);
      } else {
        setError('Unsupported file format. Please upload PDF or TXT files.');
      }
    } catch (err) {
      setError('Failed to extract text from the uploaded file.');
      console.error(err);
    }
  };

  const handleAnalyze = async () => {
    if (!resumeText.trim()) {
      setError('Please enter or upload a resume before analyzing.');
      return;
    }
    setError('');
    setLoading(true);
    setResponseJSON(null);

    const genAI = new GoogleGenerativeAI(API_KEY);
    const model = genAI.getGenerativeModel({ model: MODEL_NAME });

    const prompt = `You are an AI resume reviewer. Analyze the following resume text and respond ONLY with a JSON array containing one object exactly in this format:

[
  {
    "resumeScore": number (0 to 100),
    "atsCompatibility": number (0 to 100),
    "improvements": [array of plain strings without markdown or special characters],
    "suggestions": [array of plain strings without markdown or special characters],
    "weaknesses": [array of plain strings without markdown or special characters],
    "strengths": [array of plain strings without markdown or special characters]
  }
]

Important:
- Do NOT include any markdown formatting such as *, **, bullet points, or numbering.
- Do NOT include any explanations, notes, or extra text.
- Return ONLY the JSON array, nothing else.

Resume:
${resumeText}`;

    try {
      const result = await model.generateContent(prompt);
      const text = (await result.response.text()).trim();

      const jsonStart = text.indexOf('[');
      const jsonEnd = text.lastIndexOf(']');
      const jsonString = text.slice(jsonStart, jsonEnd + 1);

      setResponseJSON(JSON.parse(jsonString));
    } catch (err) {
      console.error(err);
      setError('Error analyzing resume.');
    } finally {
      setLoading(false);
    }
  };

  const resetAll = () => {
    setResumeText('');
    setResponseJSON(null);
    setError('');
    if (fileInputRef.current) {
      fileInputRef.current.value = null;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="min-h-50 px-6 py-10 mt-20 max-w-5xl mx-auto bg-white text-gray-900 rounded-lg shadow-xl"
    >
      <header className="flex justify-between items-center mb-8">
        <h1 className="text-3xl text-blue-600 font-bold">AI Resume Analyzer</h1>
      </header>

      <section className="mb-6">
        <input
          type="text"
          placeholder="Paste your resume text here"
          value={resumeText}
          onChange={(e) => setResumeText(e.target.value)}
          className="w-full p-4 rounded border font-mono text-xl bg-gray-100 border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-600 text-gray-900"
        />
      </section>

      <section className="mb-6 flex flex-col sm:flex-row items-center gap-4">
        <label
          htmlFor="file-upload"
          className="flex items-center gap-2 cursor-pointer bg-green-600 hover:bg-green-700 text-white py-2 px-5 rounded shadow-sm transition select-none focus:outline-none focus:ring-2 focus:ring-green-600"
        >
          <FaUpload /> Upload Resume (PDF or TXT)
        </label>
        <input
          id="file-upload"
          type="file"
          accept=".pdf,text/plain"
          className="hidden"
          onChange={handleFileUpload}
          ref={fileInputRef}
        />

        <button
          onClick={handleAnalyze}
          disabled={loading}
          className={`flex items-center gap-2 px-6 py-2 rounded font-semibold transition ${loading
              ? 'bg-gray-400 cursor-not-allowed'
              : 'bg-blue-600 hover:bg-blue-700 text-white'
            }`}
        >
          {loading ? 'Analyzing...' : <><FaFileAlt /> Analyze Resume</>}
        </button>

        {responseJSON && (
          <button
            onClick={resetAll}
            className="flex items-center gap-2 ml-auto bg-red-600 hover:bg-red-700 text-white px-5 py-2 rounded font-semibold transition focus:outline-none focus:ring-2 focus:ring-red-400"
          >
            <FaArrowUp /> Upload Another Resume
          </button>
        )}
      </section>

      {error && (
        <p className="text-red-500 font-semibold mb-4" role="alert">
          {error}
        </p>
      )}

      {responseJSON && (
        <section className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {responseJSON.map((result, idx) => (
            <React.Fragment key={idx}>
              <div className="p-6 rounded-lg shadow-md border bg-white border-gray-200 text-gray-900">
                <h3 className="text-2xl font-semibold mb-4 text-center flex justify-center items-center gap-2">
                  <FaCheckCircle /> Resume Score
                </h3>
                <p className={`text-5xl font-bold text-center ${result.resumeScore >= 80
                    ? 'text-green-600'
                    : result.resumeScore >= 50
                      ? 'text-yellow-600'
                      : 'text-red-600'
                  }`}>
                  {result.resumeScore}%
                </p>
              </div>

              <div className="p-6 rounded-lg shadow-md border bg-white border-gray-200 text-gray-900">
                <h3 className="text-2xl font-semibold mb-4 text-center flex justify-center items-center gap-2">
                  <FaLightbulb /> ATS Compatibility
                </h3>
                <p className={`text-5xl font-bold text-center ${result.atsCompatibility >= 80
                    ? 'text-green-600'
                    : result.atsCompatibility >= 50
                      ? 'text-yellow-600'
                      : 'text-red-600'
                  }`}>
                  {result.atsCompatibility}%
                </p>
              </div>


              <div className="p-6 rounded-lg shadow-md border col-span-full bg-blue-200 border-gray-200 text-gray-900">
                <h3 className="text-2xl font-semibold border-b border-gray-400 pb-2 mb-4 flex items-center gap-2">
                  <FaThumbsDown /> Improvements
                </h3>
                <ul className="list-disc list-inside space-y-1 text-xl max-w-full max-h-60 overflow-y-auto">
                  {result.improvements.length ? result.improvements.map((item, i) => (
                    <li key={i} className="leading-relaxed">{item}</li>
                  )) : <li>No improvements noted.</li>}
                </ul>
              </div>

              {/* Suggestions */}
              <div className="p-6 rounded-lg shadow-md border col-span-full bg-yellow-300 border-gray-200 text-gray-900">
                <h3 className="text-2xl font-semibold border-b border-gray-400 pb-2 mb-4 flex items-center gap-2">
                  <FaExclamationTriangle /> Suggestions
                </h3>
                <ul className="list-disc list-inside space-y-1 text-xl max-w-full max-h-60 overflow-y-auto">
                  {result.suggestions.length ? result.suggestions.map((item, i) => (
                    <li key={i} className="leading-relaxed">{item}</li>
                  )) : <li>No suggestions noted.</li>}
                </ul>
              </div>

              {/* Weaknesses */}
              <div className="p-6 rounded-lg shadow-md border col-span-full bg-red-500 border-gray-200 text-white">
                <h3 className="text-2xl font-semibold border-b border-white pb-2 mb-4 flex items-center gap-2">
                  <FaThumbsDown /> Weaknesses
                </h3>
                <ul className="list-disc list-inside space-y-1 text-xl max-w-full max-h-60 overflow-y-auto">
                  {result.weaknesses.length ? result.weaknesses.map((item, i) => (
                    <li key={i} className="leading-relaxed">{item}</li>
                  )) : <li>No weaknesses noted.</li>}
                </ul>
              </div>

              {/* Strengths */}
              <div className="p-6 rounded-lg shadow-md border col-span-full bg-teal-300 border-gray-200 text-gray-900">
                <h3 className="text-2xl font-semibold border-b border-gray-400 pb-2 mb-4 flex items-center gap-2">
                  <FaThumbsUp /> Strengths
                </h3>
                <ul className="list-disc list-inside space-y-1 text-xl max-w-full max-h-60 overflow-y-auto">
                  {result.strengths.length ? result.strengths.map((item, i) => (
                    <li key={i} className="leading-relaxed">{item}</li>
                  )) : <li>No strengths noted.</li>}
                </ul>
              </div>
            </React.Fragment>
          ))}
        </section>
      )}
    </motion.div>
  );
}

export default ResumeAnalyzer;
