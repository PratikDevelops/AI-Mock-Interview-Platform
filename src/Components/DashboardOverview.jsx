import React, { useEffect, useState } from "react";
import {
  FaRedoAlt,
  FaCommentDots,
  FaPlay,
  FaSearch,
  FaListAlt,
  FaChartBar,
  FaQuoteRight,
  FaUserTie,
  FaComments,
  FaPlayCircle,
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

import {
  collection,
  onSnapshot,
  query,
  orderBy,
  where,
} from "firebase/firestore";
import { db, auth } from "../firebase";
import { onAuthStateChanged } from "firebase/auth";

const tipsList = [
  "Practice mock interviews daily!",
  "Focus on behavioral questions using the STAR method.",
  "Master fundamentals instead of just frameworks.",
  "Keep your resume updated after every mock.",
  "Use ChatGPT to simulate interviews!",
];

const DashboardOverview = () => {
  const [interviews, setInterviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");
  const [selectedInterview, setSelectedInterview] = useState(null);
  const [tipIndex, setTipIndex] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const interval = setInterval(() => {
      setTipIndex((prev) => (prev + 1) % tipsList.length);
      // No need for tipIndex in dependency array since we use functional update
    }, 7000);
    return () => {
      clearInterval(interval);
    };
  }, []);

  useEffect(() => {
    setLoading(true);

    // Listen to Firebase auth state changes
    const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
      if (user) {
        console.log("User logged in:", user.uid);

        // Build Firestore query
        const q = query(
          collection(db, "interview_submissions"),
          where("userId", "==", user.uid),
          orderBy("date", "desc")
        );

        // Listen to Firestore data
        const unsubscribeSnapshot = onSnapshot(
          q,
          (snapshot) => {
            const interviewsData = snapshot.docs.map((doc) => {
              const data = doc.data();
              return {
                id: doc.id,
                company: data.company || "",
                position: data.position || "",
                date: data.date || "",
                status: data.status || "Pending",
                score: data.score ?? null,
                feedback: data.feedback || "",
                tips: data.tips || "",
              };
            });
            setInterviews(interviewsData);
            setLoading(false);
            console.log("Interviews state updated:", interviewsData);
          },
          (error) => {
            console.error("Error fetching interviews:", error);
            setLoading(false);
          }
        );

        return () => unsubscribeSnapshot();
      } else {
        console.error("User not logged in. Cannot fetch interviews.");
        setInterviews([]);
        setLoading(false);
      }
    });

    // Cleanup auth listener on unmount
    return () => unsubscribeAuth();
  }, []);

  const filteredInterviews = interviews.filter((i) => {
    const match =
      i.company.toLowerCase().includes(search.toLowerCase()) ||
      i.position.toLowerCase().includes(search.toLowerCase());
    const statusMatch = filter === "all" || i.status.toLowerCase() === filter;
    return match && statusMatch;
  });

  const completed = interviews.filter((i) => i.status === "Completed").length;
  const pending = interviews.filter((i) => i.status === "Pending").length;

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <h2 className="text-3xl font-bold text-center text-indigo-700 mb-8 flex items-center justify-center gap-2">
        <FaListAlt /> Interview Dashboard
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
        <div className="bg-blue-100 text-blue-800 p-4 rounded-lg flex items-center justify-between shadow">
          <div>
            <p className="text-sm font-semibold">Total Interviews</p>
            <h3 className="text-2xl font-bold">{interviews.length}</h3>
          </div>
          <FaChartBar className="text-3xl" />
        </div>
        <div className="bg-green-100 text-green-800 p-4 rounded-lg flex items-center justify-between shadow">
          <div>
            <p className="text-sm font-semibold">Completed</p>
            <h3 className="text-2xl font-bold">{completed}</h3>
          </div>
          <FaChartBar className="text-3xl" />
        </div>
        <div className="bg-yellow-100 text-yellow-800 p-4 rounded-lg flex items-center justify-between shadow">
          <div>
            <p className="text-sm font-semibold">Pending</p>
            <h3 className="text-2xl font-bold">{pending}</h3>
          </div>
          <FaChartBar className="text-3xl" />
        </div>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={tipIndex}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.5 }}
          className="bg-indigo-50 text-indigo-800 p-4 rounded-md flex items-center gap-3 mb-8 shadow"
        >
          <FaQuoteRight className="text-2xl" />
          <p className="text-sm font-semibold">{tipsList[tipIndex]}</p>
        </motion.div>
      </AnimatePresence>

      <div className="flex flex-wrap justify-between items-center gap-4 mb-6">
        <div className="flex flex-wrap gap-4 items-center">
          <button
            onClick={() => {
              navigate("/dashboard/interview-form");
            }}
            className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-3 rounded shadow flex items-center gap-2 text-base font-semibold"
          >
            <FaPlayCircle className="text-lg" />
            Take Interview
          </button>
          <span className="text-gray-600 text-sm ml-3">
            Choose interview type or take an interview now
          </span>
        </div>

        <div className="flex gap-2 items-center">
          <input
            type="text"
            placeholder="Search..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="border border-gray-300 px-3 py-2 rounded text-sm"
          />
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="border border-gray-300 px-2 py-2 rounded text-sm"
          >
            <option value="all">All</option>
            <option value="completed">Completed</option>
            <option value="pending">Pending</option>
          </select>
        </div>
      </div>

      {loading ? (
        <p className="text-center text-gray-500 py-8">Loading interviews...</p>
      ) : filteredInterviews.length === 0 ? (
        <div className="text-center py-10 text-gray-500">
          <p className="text-lg flex items-center justify-center gap-2">
            <FaSearch /> No interviews found.
          </p>
          <p className="text-sm mt-1">
            Try searching different keywords or add new interviews.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredInterviews.map((i) => (
            <div
              key={i.id}
              className="border p-5 rounded-lg shadow hover:shadow-lg transition"
            >
              <div className="flex justify-between mb-2">
                <div>
                  <h3 className="text-lg font-bold text-indigo-800">
                    {i.position} @ {i.company}
                  </h3>
                  <p className="text-sm text-gray-500">Date: {i.date}</p>
                </div>
                <span
                  className={`text-xs font-semibold px-2 py-1 rounded-full ${
                    i.status === "Completed"
                      ? "bg-green-100 text-green-700"
                      : "bg-yellow-100 text-yellow-800"
                  }`}
                >
                  {i.status}
                </span>
              </div>

              {i.score !== null && (
                <div className="mt-2">
                  <p className="text-sm text-gray-600 font-medium">Score</p>
                  <div className="w-full bg-gray-200 h-3 rounded">
                    <div
                      className="bg-blue-600 h-3 rounded"
                      style={{ width: `${i.score}%` }}
                    ></div>
                  </div>
                  <p className="text-sm mt-1">{i.score}%</p>
                </div>
              )}

              <div className="mt-4 flex flex-wrap gap-3">
                <button
                  onClick={() => setSelectedInterview(i)}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2 rounded flex items-center gap-2 text-base font-semibold"
                >
                  <FaCommentDots />
                  View Feedback
                </button>
                <button
                  onClick={() => alert("Retaking...")}
                  className="bg-green-600 hover:bg-green-700 text-white px-5 py-2 rounded flex items-center gap-2 text-base font-semibold"
                >
                  <FaRedoAlt />
                  Retake
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {selectedInterview && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full relative">
            <button
              className="absolute top-2 right-3 text-xl"
              onClick={() => setSelectedInterview(null)}
            >
              &times;
            </button>
            <h3 className="text-xl font-bold mb-2 text-indigo-700">
              {selectedInterview.position} @ {selectedInterview.company}
            </h3>
            <p className="text-sm mb-1 text-gray-600">
              Date: {selectedInterview.date}
            </p>
            <p className="text-sm mb-1">
              <strong>Status:</strong> {selectedInterview.status}
            </p>
            <p className="text-sm mt-2 mb-2">
              <strong>Feedback:</strong>{" "}
              {selectedInterview.feedback || "No feedback available."}
            </p>
            <p className="text-sm text-gray-700">
              <strong>Improvement Tips:</strong> {selectedInterview.tips}
            </p>
          </div>
        </div>
      )}

      <button
        onClick={() => navigate("/dashboard/interview")}
        className="fixed bottom-6 right-6 bg-indigo-600 text-white p-5 rounded-full shadow-lg hover:bg-indigo-700 transition z-50"
        title="Start Interview"
      >
        <FaPlay />
      </button>
    </div>
  );
};

export default DashboardOverview;
