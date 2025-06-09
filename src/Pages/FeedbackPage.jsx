import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import ReactMarkdown from "react-markdown";
import { motion } from "framer-motion";
import { FaArrowLeft, FaUserCheck } from "react-icons/fa";
import { HiOutlineDocumentText } from "react-icons/hi";
import { MdFeedback } from "react-icons/md";
import { BiErrorAlt } from "react-icons/bi";

const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

const ScoreBar = ({ label, score }) => (
  <div className="mb-4">
    <div className="flex justify-between mb-1 font-semibold text-gray-700">
      <span>{label}</span>
      <span>{score ?? "N/A"}/10</span>
    </div>
    <div className="w-full bg-gray-300 rounded-full h-5 overflow-hidden shadow-inner">
      <div
        className="bg-purple-600 h-5 rounded-full transition-all duration-500"
        style={{ width: score ? `${(score / 10) * 100}%` : "0%" }}
      />
    </div>
  </div>
);

const FeedbackPage = () => {
  const { state } = useLocation();
  const navigate = useNavigate();

  if (
    !state ||
    !state.transcript ||
    !state.feedback ||
    (typeof state.feedback !== "object" && typeof state.feedback !== "string")
  ) {
    return (
      <motion.div
        className="text-center mt-20 text-red-600 font-semibold text-lg px-4"
        initial="hidden"
        animate="visible"
        variants={fadeInUp}
      >
        <div className="flex justify-center mb-4">
          <BiErrorAlt className="text-5xl text-red-500" />
        </div>
        Feedback data not found. Please return to the dashboard.
        <div className="mt-6">
          <button
            onClick={() => navigate("/dashboard")}
            className="inline-flex items-center gap-3 bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 transition focus:outline-none focus:ring-2 focus:ring-purple-500"
          >
            <FaArrowLeft /> Back to Dashboard
          </button>
        </div>
      </motion.div>
    );
  }

  const { transcript, feedback } = state;

  if (typeof feedback === "string") {
    return (
      <motion.div
        className="p-6 md:p-10 max-w-6xl mx-auto"
        initial="hidden"
        animate="visible"
        variants={fadeInUp}
        transition={{ duration: 0.6 }}
      >
        <header className="mb-10">
          <h1 className="text-4xl font-extrabold text-purple-900 mb-3 flex items-center gap-3">
            <FaUserCheck className="text-purple-600" /> AI Interview Feedback
          </h1>
          <p className="text-gray-700 text-lg">
            Here's a detailed summary of your interview performance.
          </p>
        </header>

        {/* Feedback Summary */}
        <section className="mb-14">
          <h2 className="text-3xl font-semibold text-green-700 mb-4 flex items-center gap-3">
            <MdFeedback className="text-green-600" /> Feedback Summary
          </h2>
          <div className="bg-green-50 border border-green-300 p-7 rounded-lg text-gray-900 shadow-md whitespace-pre-line leading-relaxed text-base">
            <ReactMarkdown>{feedback}</ReactMarkdown>
          </div>
        </section>

        {/* Transcript */}
        <section className="mb-16">
          <h2 className="text-3xl font-semibold text-purple-800 mb-6 flex items-center gap-3">
            <HiOutlineDocumentText className="text-purple-600" /> Interview Transcript
          </h2>
          <div className="space-y-7">
            {transcript.map((entry, i) => (
              <motion.div
                key={i}
                className="bg-white border border-gray-300 p-7 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * i }}
              >
                <p className="text-lg font-semibold text-blue-900 mb-3">
                  <span className="text-blue-700">Q{i + 1}:</span> {entry.question}
                </p>
                <p className="text-gray-800 leading-relaxed text-base">
                  <span className="font-semibold text-purple-700">Your Answer:</span>{" "}
                  {entry.answer || (
                    <span className="italic text-gray-400">No answer provided.</span>
                  )}
                </p>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Navigation */}
        <div className="text-center">
          <button
            onClick={() => navigate("/dashboard")}
            className="inline-flex items-center gap-3 bg-purple-700 text-white px-7 py-3 rounded-lg font-semibold shadow-lg hover:bg-purple-800 transition focus:outline-none focus:ring-2 focus:ring-purple-600"
          >
            <FaArrowLeft /> Back to Dashboard
          </button>
        </div>
      </motion.div>
    );
  }

  const {
    strengths,
    improvements,
    communicationClarityScore,
    relevanceScore,
    overallScore,
    detailedFeedback,
  } = feedback;

  return (
    <motion.div
      className="p-6 md:p-10 max-w-6xl mx-auto"
      initial="hidden"
      animate="visible"
      variants={fadeInUp}
      transition={{ duration: 0.7 }}
    >
      <header className="mb-12">
        <h1 className="text-4xl font-extrabold text-purple-900 mb-4 flex items-center gap-3">
          <FaUserCheck className="text-purple-600" /> AI Interview Feedback
        </h1>
        <p className="text-gray-700 text-lg max-w-3xl">
          Here's a detailed summary of your interview performance.
        </p>
      </header>

      {/* Scores */}
      <section className="mb-10">
        <h2 className="text-3xl font-semibold text-purple-700 mb-6 flex items-center gap-3">
          Scores
        </h2>
        <ScoreBar label="Communication Clarity" score={communicationClarityScore} />
        <ScoreBar label="Relevance of Responses" score={relevanceScore} />
        <ScoreBar label="Overall Interview Score" score={overallScore} />
      </section>

      <section className="mb-14">
        <h2 className="text-3xl font-semibold text-green-700 mb-5 flex items-center gap-3">
          <MdFeedback className="text-green-600" /> Detailed Feedback
        </h2>
        <div className="bg-green-50 border border-green-300 p-7 rounded-lg text-gray-900 shadow-md leading-relaxed text-base">
          <ReactMarkdown>{detailedFeedback}</ReactMarkdown>
        </div>
      </section>

      <section className="mb-14 grid md:grid-cols-2 gap-10">
  <div>
    <h3 className="text-2xl font-semibold text-blue-700 mb-4">Strengths</h3>
    <div className="bg-blue-50 border border-blue-300 p-6 rounded-lg text-blue-900 shadow-md whitespace-pre-line leading-relaxed text-base min-h-[120px]">
      <ReactMarkdown>
        {typeof strengths === "string" ? strengths : "No strengths identified."}
      </ReactMarkdown>
    </div>
  </div>
  <div>
    <h3 className="text-2xl font-semibold text-red-700 mb-4">Areas of Improvement</h3>
    <div className="bg-red-50 border border-red-300 p-6 rounded-lg text-red-900 shadow-md whitespace-pre-line leading-relaxed text-base min-h-[120px]">
      <ReactMarkdown>
        {typeof improvements === "string" ? improvements : "No improvements identified."}
      </ReactMarkdown>
    </div>
  </div>
</section>



      {/* Navigation */}
      <div className="text-center">
        <button
          onClick={() => navigate("/dashboard")}
          className="inline-flex items-center gap-3 bg-purple-700 text-white px-7 py-3 rounded-lg font-semibold shadow-lg hover:bg-purple-800 transition focus:outline-none focus:ring-2 focus:ring-purple-600"
        >
          <FaArrowLeft /> Back to Dashboard
        </button>
      </div>
    </motion.div>
  );
};

export default FeedbackPage;
