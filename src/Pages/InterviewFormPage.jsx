import React, { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { FaBriefcase } from "react-icons/fa";

import { db, auth } from "../firebase";
import { collection, addDoc } from "firebase/firestore";

const MODEL_NAME = 'models/gemini-2.5-flash-preview-05-20';
const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

const interviewTypes = [
  { id: "behavioral", label: "Behavioral" },
  { id: "technical", label: "Technical" },
  { id: "hr", label: "HR" },
  { id: "aptitude", label: "Aptitude" },
  { id: "coding", label: "Coding" },
];

const InterviewFormPage = () => {
  const [name, setName] = useState("");
  const [position, setPosition] = useState("");
  const [skills, setSkills] = useState("");
  const [experience, setExperience] = useState("");
  const [portfolio, setPortfolio] = useState("");
  const [selectedInterviewTypes, setSelectedInterviewTypes] = useState([]);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const toggleInterviewType = (id) => {
    setSelectedInterviewTypes((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const validate = () => {
    const newErrors = {};
    if (!name.trim()) newErrors.name = "Name is required";
    if (!position.trim()) newErrors.position = "Position is required";
    if (!skills.trim()) newErrors.skills = "Please enter your skills";
    if (!experience.trim()) newErrors.experience = "Experience is required";
    if (selectedInterviewTypes.length === 0)
      newErrors.interviewTypes = "Please select at least one interview type";
    return newErrors;
  };

  const buildPrompt = () => {
    const typesText = selectedInterviewTypes
      .map((typeId) => {
        const typeObj = interviewTypes.find((t) => t.id === typeId);
        if (!typeObj) return "";
        switch (typeObj.id) {
          case "behavioral":
            return "- Behavioral questions (e.g., teamwork, communication)";
          case "technical":
            return "- Technical questions related to the position";
          case "hr":
            return "- HR questions (e.g., motivation, company culture)";
          case "aptitude":
            return "- Aptitude questions (logical reasoning, quantitative)";
          case "coding":
            return "- Coding or programming problems";
          default:
            return "";
        }
      })
      .filter(Boolean)
      .join("\n");

    return `
My name is ${name}. I want to prepare for a ${position} interview.
My skills are: ${skills}. I have ${experience} years of experience.
The interview types I want to focus on are:
${typesText}

Generate 5 interview questions and answers in JSON format like this:
[
  {
    "question": "Your question?",
    "answer": "Your answer."
  }
]
Only return valid JSON.
    `;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const validationErrors = validate();
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length > 0) {
      const firstErrorField = Object.keys(validationErrors)[0];
      const field = document.querySelector(`[name="${firstErrorField}"]`);
      if (field) field.focus();
      return;
    }

    const user = auth.currentUser;
    if (!user || !user.uid) {
      alert("You must be logged in to submit the interview.");
      return;
    }

    setLoading(true);

    try {
      const prompt = buildPrompt();

      const genAI = new GoogleGenerativeAI(API_KEY);
      const model = genAI.getGenerativeModel({ model: MODEL_NAME });
      const result = await model.generateContent(prompt);

      const rawText = (await result.response.text()).trim();

      const cleanJson = rawText.replace(/^```json|```$/g, "").trim();

      let parsed;
      try {
        parsed = JSON.parse(cleanJson);
      } catch (err) {
        console.error("❌ Failed to parse AI response:", err, cleanJson);
        alert("AI response could not be parsed. Please try again.");
        setLoading(false);
        return;
      }

      const submissionData = {
        userId: user.uid,
        name,
        position,
        skills,
        experience,
        portfolio,
        selectedInterviewTypes,
        questions: parsed,
        timestamp: new Date(),
      };

      console.log("🔥 Submission Data:", submissionData);

      await addDoc(collection(db, "interview_submissions"), submissionData);
      navigate("/dashboard/start-interview", {
        state: { name, position, skills, experience, portfolio, Question: parsed },
      });
    } catch (error) {
      alert("Failed to generate questions or save data. Please try again.");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    if (window.confirm("Are you sure you want to reset the form?")) {
      setName("");
      setPosition("");
      setSkills("");
      setExperience("");
      setPortfolio("");
      setSelectedInterviewTypes([]);
      setErrors({});
    }
  };

  const progress =
    [name, position, skills, experience].filter(Boolean).length / 4 +
    (selectedInterviewTypes.length > 0 ? 1 : 0);
  const progressPercent = (progress / 5) * 100;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="max-w-3xl mx-auto mt-16 p-8 rounded-lg shadow-md bg-white"
    >
      <h1 className="text-3xl font-semibold mb-4 text-indigo-700 text-center flex items-center justify-center gap-2">
        <FaBriefcase /> Prepare for Your Interview
      </h1>

      <div className="h-2 w-full bg-gray-200 rounded-full mb-6">
        <div
          className="h-full bg-indigo-600 rounded-full transition-all duration-500"
          style={{ width: `${progressPercent}%` }}
        />
      </div>

      <div className="mb-6">
        <label className="block font-medium mb-2">Select Interview Types (choose one or more):</label>
        <div className="flex flex-wrap gap-3">
          {interviewTypes.map(({ id, label }) => {
            const selected = selectedInterviewTypes.includes(id);
            return (
              <button
                key={id}
                type="button"
                onClick={() => toggleInterviewType(id)}
                className={`px-4 py-2 rounded-full border transition-colors duration-200
                  ${
                    selected
                      ? "bg-indigo-600 text-white border-indigo-600"
                      : "bg-white text-indigo-600 border-indigo-400 hover:bg-indigo-100"
                  }
                `}
              >
                {label}
              </button>
            );
          })}
        </div>
        {errors.interviewTypes && (
          <p className="text-red-600 text-sm mt-1">{errors.interviewTypes}</p>
        )}
      </div>

      <form onSubmit={handleSubmit} noValidate>
        <div className="mb-4">
          <label htmlFor="name" className="block font-medium mb-1">
            Your Name
          </label>
          <input
            id="name"
            name="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className={`w-full p-2 border rounded ${
              errors.name ? "border-red-500" : "border-gray-300"
            }`}
            placeholder="Enter your full name"
            required
          />
          {errors.name && <p className="text-red-600 text-sm mt-1">{errors.name}</p>}
        </div>

        <div className="mb-4">
          <label htmlFor="position" className="block font-medium mb-1">
            Position You Are Applying For
          </label>
          <input
            id="position"
            name="position"
            value={position}
            onChange={(e) => setPosition(e.target.value)}
            className={`w-full p-2 border rounded ${
              errors.position ? "border-red-500" : "border-gray-300"
            }`}
            placeholder="e.g., Frontend Developer"
            required
          />
          {errors.position && <p className="text-red-600 text-sm mt-1">{errors.position}</p>}
        </div>

        <div className="mb-4">
          <label htmlFor="skills" className="block font-medium mb-1">
            Your Skills (comma separated)
          </label>
          <input
            id="skills"
            name="skills"
            value={skills}
            onChange={(e) => setSkills(e.target.value)}
            className={`w-full p-2 border rounded ${
              errors.skills ? "border-red-500" : "border-gray-300"
            }`}
            placeholder="e.g., React, Node.js, MongoDB"
            required
          />
          {errors.skills && <p className="text-red-600 text-sm mt-1">{errors.skills}</p>}
        </div>

        <div className="mb-4">
          <label htmlFor="experience" className="block font-medium mb-1">
            Years of Experience
          </label>
          <input
            id="experience"
            name="experience"
            type="number"
            min="0"
            step="0.1"
            value={experience}
            onChange={(e) => setExperience(e.target.value)}
            className={`w-full p-2 border rounded ${
              errors.experience ? "border-red-500" : "border-gray-300"
            }`}
            placeholder="e.g., 2.5"
            required
          />
          {errors.experience && <p className="text-red-600 text-sm mt-1">{errors.experience}</p>}
        </div>

        <div className="mb-6">
          <label htmlFor="portfolio" className="block font-medium mb-1">
            Portfolio URL (optional)
          </label>
          <input
            id="portfolio"
            name="portfolio"
            type="url"
            value={portfolio}
            onChange={(e) => setPortfolio(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded"
            placeholder="https://yourportfolio.com"
          />
        </div>

        <div className="flex gap-4">
          <button
            type="submit"
            disabled={loading}
            className={`bg-indigo-600 text-white px-6 py-2 rounded hover:bg-indigo-700 transition ${
              loading ? "cursor-not-allowed opacity-70" : ""
            }`}
          >
            {loading ? "Generating..." : "Generate Interview Questions"}
          </button>
          <button
            type="button"
            onClick={handleReset}
            disabled={loading}
            className="bg-gray-300 text-gray-800 px-6 py-2 rounded hover:bg-gray-400 transition"
          >
            Reset
          </button>
        </div>
      </form>
    </motion.div>
  );
};

export default InterviewFormPage;
