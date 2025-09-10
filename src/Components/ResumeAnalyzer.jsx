import React, { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import {
  FaUpload,
  FaFileAlt,
  FaCheckCircle,
  FaExclamationTriangle,
  FaThumbsDown,
  FaThumbsUp,
  FaLightbulb,
  FaArrowUp,
  FaChevronDown,
  FaChevronUp,
  FaSpinner,
} from "react-icons/fa";
import { GoogleGenerativeAI } from "@google/generative-ai";
import * as pdfjsLib from "pdfjs-dist";
import { GlobalWorkerOptions } from "pdfjs-dist";
import workerSrc from "pdfjs-dist/build/pdf.worker.min.js?url";

GlobalWorkerOptions.workerSrc = workerSrc;

const MODEL_NAME = "models/gemini-2.5-flash-preview-05-20";
const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

const steps = [
  "Uploading resume...",
  "Extracting text from PDF...",
  "Parsing education and experience...",
  "Scanning keywords and skills...",
  "Analyzing ATS compatibility...",
  "Generating insights...",
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
        transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}
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

function ResumeAnalyzer() {
  const [resumeText, setResumeText] = useState("");
  const [responseJSON, setResponseJSON] = useState(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const fileInputRef = useRef(null);
  const [accordionOpen, setAccordionOpen] = useState({
    improvements: true,
    suggestions: true,
    weaknesses: true,
    strengths: true,
  });

  const toggleAccordion = (section) => {
    setAccordionOpen((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  const extractTextFromPDF = async (file) => {
    const arrayBuffer = await file.arrayBuffer();
    const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
    let text = "";
    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i);
      const content = await page.getTextContent();
      text += content.items.map((item) => item.str).join(" ") + "\n\n";
    }
    return text.trim();
  };

  const handleFileUpload = async (e) => {
    setError("");
    const file = e.target.files[0];
    if (!file) return;

    const fileType = file.type;

    try {
      if (fileType === "application/pdf") {
        const text = await extractTextFromPDF(file);
        setResumeText(text);
      } else if (
        fileType === "text/plain" ||
        fileType === "application/msword" ||
        fileType ===
          "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
      ) {
        const text = await file.text();
        setResumeText(text);
      } else {
        setError("Unsupported file format. Please upload PDF or TXT files.");
      }
    } catch (err) {
      setError("Failed to extract text from the uploaded file.");
      console.error(err);
    }
  };

  const handleAnalyze = async () => {
    if (!resumeText?.trim()) {
      setError("Please upload a resume before analyzing.");
      return;
    }

    setError("");
    setLoading(true);
    setResponseJSON(null);
    setSuccess(false);

    try {
      if (!API_KEY) {
        throw new Error(
          "Missing API key. Set VITE_GEMINI_API_KEY in your environment."
        );
      }

      const genAI = new GoogleGenerativeAI(API_KEY);
      const model = genAI.getGenerativeModel({ model: MODEL_NAME });

      const prompt = `You are an AI resume reviewer. Analyze the following resume text and respond ONLY with a JSON array containing one object exactly in this format:

[
  {
    "resumeScore": number (0 to 100),
    "atsCompatibility": number (0 to 100),
    "improvements": [array of plain strings],
    "suggestions": [array of plain strings],
    "weaknesses": [array of plain strings],
    "strengths": [array of plain strings],
    "recommendedRoles": [exactly 3 job role strings]
  }
] 

Resume:
${resumeText}`;

      const result = await model.generateContent(prompt);
      const raw = (await result.response.text()).trim();

      let parsed = null;
      try {
        parsed = JSON.parse(raw);
      } catch (err) {
        const jsonStart = raw.indexOf("[");
        const jsonEnd = raw.lastIndexOf("]");
        if (jsonStart !== -1 && jsonEnd !== -1 && jsonEnd > jsonStart) {
          const jsonString = raw.slice(jsonStart, jsonEnd + 1);
          parsed = JSON.parse(jsonString);
        } else {
          console.error("Raw model response (not JSON):", raw);
          throw new Error("Model did not return valid JSON.");
        }
      }

      setTimeout(() => {
        setLoading(false);
        setSuccess(true);
        setResponseJSON(parsed);
        setTimeout(() => setSuccess(false), 1500);
      }, steps.length * 2000);
    } catch (err) {
      console.error("Analyze error:", err);
      setError(err.message || "Error analyzing resume.");
      setLoading(false);
    }
  };

  const resetAll = () => {
    setResumeText("");
    setResponseJSON(null);
    setError("");
    setSuccess(false);
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

      <section className="mb-6 flex flex-col sm:flex-row items-center gap-4">
        <label
          htmlFor="file-upload"
          className={`flex items-center gap-2 cursor-pointer py-2 px-5 rounded shadow-sm transition select-none focus:outline-none focus:ring-2 ${
            resumeText.trim()
              ? "bg-green-700 hover:bg-green-800 text-white"
              : "bg-green-600 hover:bg-green-700 text-white"
          }`}
        >
          {resumeText.trim() ? (
            <>
              <FaCheckCircle className="text-white" />
              Resume Uploaded
            </>
          ) : (
            <>
              <FaUpload />
              Upload Resume (PDF or TXT)
            </>
          )}
        </label>
        <input
          id="file-upload"
          type="file"
          accept=".pdf,text/plain,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
          className="hidden"
          onChange={handleFileUpload}
          ref={fileInputRef}
        />

        <button
          onClick={handleAnalyze}
          disabled={loading || !resumeText.trim()}
          className={`flex items-center gap-2 px-6 py-2 rounded font-semibold transition ${
            loading
              ? "bg-gray-400 cursor-not-allowed"
              : resumeText.trim()
              ? "bg-blue-600 hover:bg-blue-700 text-white"
              : "bg-blue-300 cursor-not-allowed text-white"
          }`}
        >
          {loading ? (
            <>
              <FaSpinner className="animate-spin" /> Processing...
            </>
          ) : (
            <>
              <FaFileAlt /> Analyze Resume
            </>
          )}
        </button>

        {responseJSON && !loading && !success && (
          <button
            onClick={resetAll}
            className="flex items-center gap-2 ml-auto bg-red-600 hover:bg-red-700 text-white px-5 py-2 rounded font-semibold transition"
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

      {loading && <LoadingSteps />}

      {success && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
          className="flex flex-col items-center justify-center py-10"
        >
          <FaCheckCircle className="text-green-600 text-6xl mb-4" />
          <h2 className="text-2xl font-bold text-green-700">
            Resume Analysis Ready!
          </h2>
        </motion.div>
      )}

      {!loading && !success && responseJSON && (
        <section className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {responseJSON.map((result, idx) => (
            <React.Fragment key={idx}>
              <div className="p-6 rounded-lg shadow-md border bg-white border-gray-200 text-gray-900">
                <h3 className="text-2xl font-semibold mb-4 text-center flex justify-center items-center gap-2">
                  <FaCheckCircle /> Resume Score
                </h3>
                <p
                  className={`text-5xl font-bold text-center ${
                    result.resumeScore >= 80
                      ? "text-green-600"
                      : result.resumeScore >= 50
                      ? "text-yellow-600"
                      : "text-red-600"
                  }`}
                >
                  {result.resumeScore}%
                </p>
              </div>

              <div className="p-6 rounded-lg shadow-md border bg-white border-gray-200 text-gray-900">
                <h3 className="text-2xl font-semibold mb-4 text-center flex justify-center items-center gap-2">
                  <FaLightbulb /> ATS Compatibility
                </h3>
                <p
                  className={`text-5xl font-bold text-center ${
                    result.atsCompatibility >= 80
                      ? "text-green-600"
                      : result.atsCompatibility >= 50
                      ? "text-yellow-600"
                      : "text-red-600"
                  }`}
                >
                  {result.atsCompatibility}%
                </p>
              </div>

              <div className="p-6 rounded-lg shadow-md border col-span-full bg-purple-200 border-gray-200 text-gray-900">
                <h3 className="text-2xl font-semibold mb-4 text-center flex justify-center items-center gap-2">
                  <FaLightbulb /> Recommended Job Roles
                </h3>
                <div className="flex flex-wrap justify-center gap-4">
                  {result.recommendedRoles && result.recommendedRoles.length ? (
                    result.recommendedRoles.map((role, i) => (
                      <button
                        key={i}
                        onClick={() =>
                          window.open(
                            `https://www.linkedin.com/jobs/search/?keywords=${encodeURIComponent(
                              role
                            )}`,
                            "_blank"
                          )
                        }
                        className="px-6 py-2 rounded-full bg-purple-600 text-white font-semibold shadow-md hover:bg-purple-700 transition"
                      >
                        {role}
                      </button>
                    ))
                  ) : (
                    <p>No roles suggested.</p>
                  )}
                </div>
              </div>

              <div
                className="p-6 rounded-lg shadow-md border col-span-full bg-blue-200 border-gray-200 text-gray-900 cursor-pointer select-none"
                onClick={() => toggleAccordion("improvements")}
              >
                <h3 className="text-2xl font-semibold border-b border-gray-400 pb-2 mb-4 flex items-center justify-between">
                  <span className="flex items-center gap-2">
                    <FaThumbsDown /> Improvements
                  </span>
                  {accordionOpen.improvements ? (
                    <FaChevronUp />
                  ) : (
                    <FaChevronDown />
                  )}
                </h3>
                {accordionOpen.improvements && (
                  <ul className="list-disc list-inside space-y-1 text-xl max-h-60 overflow-y-auto">
                    {result.improvements.length ? (
                      result.improvements.map((item, i) => <li key={i}>{item}</li>)
                    ) : (
                      <li>No improvements noted.</li>
                    )}
                  </ul>
                )}
              </div>

              <div
                className="p-6 rounded-lg shadow-md border col-span-full bg-yellow-300 border-gray-200 text-gray-900 cursor-pointer select-none"
                onClick={() => toggleAccordion("suggestions")}
              >
                <h3 className="text-2xl font-semibold border-b border-gray-400 pb-2 mb-4 flex items-center justify-between">
                  <span className="flex items-center gap-2">
                    <FaExclamationTriangle /> Suggestions
                  </span>
                  {accordionOpen.suggestions ? (
                    <FaChevronUp />
                  ) : (
                    <FaChevronDown />
                  )}
                </h3>
                {accordionOpen.suggestions && (
                  <ul className="list-disc list-inside space-y-1 text-xl max-h-60 overflow-y-auto">
                    {result.suggestions.length ? (
                      result.suggestions.map((item, i) => <li key={i}>{item}</li>)
                    ) : (
                      <li>No suggestions noted.</li>
                    )}
                  </ul>
                )}
              </div>

              <div
                className="p-6 rounded-lg shadow-md border col-span-full bg-red-500 border-gray-200 text-white cursor-pointer select-none"
                onClick={() => toggleAccordion("weaknesses")}
              >
                <h3 className="text-2xl font-semibold border-b border-white pb-2 mb-4 flex items-center justify-between">
                  <span className="flex items-center gap-2">
                    <FaThumbsDown /> Weaknesses
                  </span>
                  {accordionOpen.weaknesses ? (
                    <FaChevronUp />
                  ) : (
                    <FaChevronDown />
                  )}
                </h3>
                {accordionOpen.weaknesses && (
                  <ul className="list-disc list-inside space-y-1 text-xl max-h-60 overflow-y-auto">
                    {result.weaknesses.length ? (
                      result.weaknesses.map((item, i) => <li key={i}>{item}</li>)
                    ) : (
                      <li>No weaknesses noted.</li>
                    )}
                  </ul>
                )}
              </div>

              <div
                className="p-6 rounded-lg shadow-md border col-span-full bg-teal-300 border-gray-200 text-gray-900 cursor-pointer select-none"
                onClick={() => toggleAccordion("strengths")}
              >
                <h3 className="text-2xl font-semibold border-b border-gray-400 pb-2 mb-4 flex items-center justify-between">
                  <span className="flex items-center gap-2">
                    <FaThumbsUp /> Strengths
                  </span>
                  {accordionOpen.strengths ? (
                    <FaChevronUp />
                  ) : (
                    <FaChevronDown />
                  )}
                </h3>
                {accordionOpen.strengths && (
                  <ul className="list-disc list-inside space-y-1 text-xl max-h-60 overflow-y-auto">
                    {result.strengths.length ? (
                      result.strengths.map((item, i) => <li key={i}>{item}</li>)
                    ) : (
                      <li>No strengths noted.</li>
                    )}
                  </ul>
                )}
              </div>
            </React.Fragment>
          ))}
        </section>
      )}
    </motion.div>
  );
}

export default ResumeAnalyzer;
