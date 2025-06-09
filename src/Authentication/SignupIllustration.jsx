import React from "react";
import { FaUserTie, FaRobot, FaMicrophone, FaComments } from "react-icons/fa";

const TypingDots = () => (
  <div className="flex space-x-1">
    {[...Array(3)].map((_, i) => (
      <span
        key={i}
        className="w-2 h-2 bg-gray-500 rounded-full animate-bounce"
        style={{ animationDelay: `${i * 0.2}s` }}
      />
    ))}
  </div>
);

const SignupIllustration = () => {
  return (
    <div className="hidden md:flex items-center justify-center p-6  max-w-3xl mx-auto">
      <div className="w-full max-w-3xl bg-white rounded-3xl shadow-2xl p-6 flex flex-col gap-6 relative">

        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-indigo-200 text-indigo-700 rounded-full flex items-center justify-center text-2xl shadow-md">
            <FaUserTie />
          </div>
          <div>
            <h2 className="text-xl font-bold text-indigo-800">You</h2>
            <p className="text-gray-500 text-sm">Candidate</p>
          </div>
        </div>

        <div className="flex flex-col gap-4 px-4">

          <div className="self-start max-w-xs bg-indigo-100 text-indigo-800 rounded-xl px-4 py-2 relative shadow-md">
            <p>Hi! I’m ready for my mock interview.</p>
            <div className="absolute -bottom-1.5 left-3 w-0 h-0 border-t-6 border-t-indigo-100 border-r-6 border-r-transparent"></div>
          </div>

          <div className="self-end max-w-xs bg-violet-100 text-violet-800 rounded-xl px-4 py-2 relative shadow-md">
            <p>Hello! Let's start with some common questions.</p>
            <div className="absolute -bottom-1.5 right-3 w-0 h-0 border-t-6 border-t-violet-100 border-l-6 border-l-transparent"></div>
          </div>

          <div className="self-start max-w-xs bg-indigo-100 text-indigo-800 rounded-xl px-4 py-2 flex items-center gap-2 shadow-md relative">
            <TypingDots />
            <span>I'm thinking...</span>
            <div className="absolute -bottom-1.5 left-3 w-0 h-0 border-t-6 border-t-indigo-100 border-r-6 border-r-transparent"></div>
          </div>

          <div className="self-end max-w-xs bg-violet-100 text-violet-800 rounded-xl px-4 py-2 flex items-center gap-2 shadow-md relative">
            <TypingDots />
            <span>Analyzing your answers...</span>
            <div className="absolute -bottom-1.5 right-3 w-0 h-0 border-t-6 border-t-violet-100 border-l-6 border-l-transparent"></div>
          </div>
        </div>

        <p className="text-center text-sm text-gray-600 leading-relaxed px-2">
          Practice realistic interviews with our AI that listens, responds, and gives helpful feedback.
        </p>

        <div className="flex justify-around items-center gap-4 mt-1">
          <div className="flex flex-col items-center gap-1">
            <div className="w-12 h-12 bg-purple-200 text-purple-700 rounded-full flex items-center justify-center text-xl shadow-md">
              <FaMicrophone />
            </div>
            <p className="text-xs text-gray-600">Speaking</p>
          </div>

          <div className="flex flex-col items-center gap-1">
            <div className="w-12 h-12 bg-blue-200 text-blue-700 rounded-full flex items-center justify-center text-xl shadow-md">
              <FaComments />
            </div>
            <p className="text-xs text-gray-600">Feedback</p>
          </div>

          <div className="flex flex-col items-center gap-1">
            <div className="w-12 h-12 bg-violet-200 text-violet-700 rounded-full flex items-center justify-center text-xl shadow-md">
              <FaRobot />
            </div>
            <p className="text-xs text-gray-600">AI Interviewer</p>
          </div>
        </div>

      </div>
    </div>
  );
};

export default SignupIllustration;
