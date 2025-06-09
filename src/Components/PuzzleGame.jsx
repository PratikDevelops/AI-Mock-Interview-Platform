import React, { useState, useEffect } from "react";
import { FaSmileBeam, FaSadTear, FaQuestionCircle } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import { questions } from "../assets/assets";

const categories = ["Math", "Riddle", "Logic"];

const fadeVariant = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  exit: { opacity: 0, y: -20, transition: { duration: 0.3 } },
};

const PuzzleGame = () => {
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [filteredQuestions, setFilteredQuestions] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [won, setWon] = useState(false);
  const [showQuestion, setShowQuestion] = useState(true);

  useEffect(() => {
    if (selectedCategory) {
      const filtered = questions.filter((q) => q.category === selectedCategory);
      setFilteredQuestions(filtered);
    }
  }, [selectedCategory]);

  const handleAnswer = (selectedOption) => {
    setShowQuestion(false);
    setTimeout(() => {
      const current = filteredQuestions[currentQuestion];
      if (selectedOption === current.answer) {
        if (currentQuestion === filteredQuestions.length - 1) {
          setWon(true);
        } else {
          setCurrentQuestion((prev) => prev + 1);
          setShowQuestion(true);
        }
      } else {
        setGameOver(true);
      }
    }, 300);
  };

  const resetGame = () => {
    setSelectedCategory(null);
    setFilteredQuestions([]);
    setCurrentQuestion(0);
    setGameOver(false);
    setWon(false);
    setShowQuestion(true);
  };

  useEffect(() => {
    if (won) {
      import("canvas-confetti").then((confetti) => {
        confetti.default({
          particleCount: 180,
          spread: 100,
          origin: { y: 0.6 },
        });
      });
    }
  }, [won]);

  const progress = ((currentQuestion + (won ? 1 : 0)) / filteredQuestions.length) * 100;
  const baseContainer = "flex flex-col items-center justify-center h-screen p-6 transition-all";

  if (!selectedCategory) {
    return (
      <div className={`${baseContainer} bg-gradient-to-br from-yellow-100 via-blue-100 to-pink-100`}>
        <motion.h1
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-3xl font-bold mb-6 text-gray-700"
        >
          Choose a Question Category
        </motion.h1>
        <div className="space-y-4 w-full max-w-md">
          {categories.map((cat) => (
            <motion.button
              key={cat}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setSelectedCategory(cat)}
              className="w-full py-4 bg-white text-gray-800 font-semibold rounded-xl shadow hover:bg-gray-100"
            >
              {cat}
            </motion.button>
          ))}
        </div>
      </div>
    );
  }

  const QuestionCard = () => {
  const current = filteredQuestions[currentQuestion];

  if (!current) return null;

  return (
    <motion.div
      key={currentQuestion}
      variants={fadeVariant}
      initial="hidden"
      animate="visible"
      exit="exit"
      className="bg-white text-gray-800 rounded-xl shadow-lg p-6 w-full max-w-lg"
    >
      <FaQuestionCircle size={40} className="text-blue-400 mb-4 animate-pulse" />
      <h2 className="text-2xl font-semibold mb-2 text-center">
        Question {currentQuestion + 1}
      </h2>
      <p className="text-lg mb-4 text-center">{current.question}</p>
      <div className="space-y-3">
        {current.options.map((option, idx) => (
          <motion.button
            whileTap={{ scale: 0.95 }}
            whileHover={{ scale: 1.03 }}
            onClick={() => handleAnswer(option)}
            key={idx}
            className="w-full py-3 bg-blue-100 text-blue-800 font-semibold rounded-lg hover:bg-blue-200 transition-all"
          >
            {option}
          </motion.button>
        ))}
      </div>
      <div className="mt-6">
        <div className="h-2 rounded-full bg-gray-200 overflow-hidden">
          <motion.div
            className="h-full bg-gradient-to-r from-green-300 to-green-500"
            style={{ width: `${progress}%` }}
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.5 }}
          />
        </div>
        <p className="text-sm text-gray-600 mt-1 text-center">
          {progress.toFixed(0)}% Complete
        </p>
      </div>
    </motion.div>
  );
};


  if (gameOver) {
    return (
      <div className={`${baseContainer} bg-gradient-to-br from-red-100 to-red-300 text-red-800`}>
        <motion.div initial={{ scale: 0.8 }} animate={{ scale: 1 }} transition={{ duration: 0.5 }}>
          <FaSadTear size={80} className="mb-4 animate-bounce" />
        </motion.div>
        <h2 className="text-3xl font-bold mb-4">Oops! You Lost</h2>
        <button
          onClick={resetGame}
          className="bg-white text-red-600 px-6 py-3 rounded-lg shadow hover:bg-red-100 transition"
        >
          Try Again
        </button>
      </div>
    );
  }

  if (won) {
    return (
      <div className={`${baseContainer} bg-gradient-to-br from-green-100 to-green-300 text-green-800`}>
        <motion.div initial={{ rotate: -10 }} animate={{ rotate: 10 }} transition={{ repeat: Infinity, duration: 1, repeatType: "reverse" }}>
          <FaSmileBeam size={90} className="mb-4" />
        </motion.div>
        <h2 className="text-3xl font-bold mb-4">🎉 You Win!</h2>
        <button
          onClick={resetGame}
          className="bg-white text-green-600 px-6 py-3 rounded-lg shadow hover:bg-green-100 transition"
        >
          Play Again
        </button>
      </div>
    );
  }

  return (
    <div className={`${baseContainer} bg-gradient-to-br from-blue-100 via-pink-100 to-yellow-100`}>
      <AnimatePresence mode="wait">
        {showQuestion && <QuestionCard key={currentQuestion} />}
      </AnimatePresence>
    </div>
  );
};

export default PuzzleGame;
