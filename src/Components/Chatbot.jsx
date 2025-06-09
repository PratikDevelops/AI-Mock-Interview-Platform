import React, { useState, useRef, useEffect } from 'react';
import { GoogleGenerativeAI } from '@google/generative-ai';
import {
  FaUser,
  FaRobot,
  FaSpinner,
  FaPaperPlane,
  FaTimes,
} from 'react-icons/fa';
import ReactMarkdown from 'react-markdown';

const ChatBot = ({ onClose }) => {
  const [userQuestion, setUserQuestion] = useState('');
  const [chatHistory, setChatHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const chatEndRef = useRef(null);

  const MODEL_NAME = 'gemini-2.5-flash-preview-04-17';
  const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
  const genAI = new GoogleGenerativeAI(API_KEY);
  const model = genAI.getGenerativeModel({ model: MODEL_NAME });

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatHistory]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!userQuestion.trim()) return;

    setLoading(true);
    setError('');

    const prompt = `You are a helpful and friendly AI chatbot. Answer this: "${userQuestion}"`;

    try {
      const result = await model.generateContent(prompt);
      const botResponse = (await result.response.text()).trim();

      setChatHistory((prev) => [
        ...prev,
        { sender: 'user', text: userQuestion },
        { sender: 'bot', text: botResponse },
      ]);
      setUserQuestion('');
    } catch (err) {
      console.error(err);
      setError('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-4 sm:right-6 w-[95%] sm:w-96 z-50 shadow-2xl border border-gray-200 bg-white rounded-xl flex flex-col overflow-hidden">
      <div className="bg-indigo-600 text-white p-4 font-semibold text-lg flex justify-between items-center">
        <div className="flex items-center gap-2">
          <FaRobot className="text-xl" />
          AI Assistant
        </div>
        <button onClick={onClose} aria-label="Close chatbot">
          <FaTimes className="text-white hover:text-red-300 text-lg" />
        </button>
      </div>

      <div className="h-96 overflow-y-auto px-4 py-3 space-y-3 bg-gray-50 text-sm scrollbar-thin scrollbar-thumb-gray-300">
        {chatHistory.length === 0 ? (
          <p className="text-gray-400 text-center mt-20">
            Start the conversation…
          </p>
        ) : (
          chatHistory.map((msg, i) => (
            <div
              key={i}
              className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`flex items-end gap-2 max-w-[80%] ${
                  msg.sender === 'user' ? 'flex-row-reverse' : ''
                }`}
              >
                <div className="mb-1">
                  {msg.sender === 'user' ? (
                    <FaUser className="text-blue-500" />
                  ) : (
                    <FaRobot className="text-indigo-600" />
                  )}
                </div>
                <div
                  className={`rounded-xl px-4 py-2 ${
                    msg.sender === 'user'
                      ? 'bg-blue-500 text-white rounded-br-none'
                      : 'bg-gray-200 text-gray-900 rounded-bl-none'
                  }`}
                >
                  {msg.sender === 'bot' ? (
                    <ReactMarkdown>{msg.text}</ReactMarkdown>
                  ) : (
                    msg.text
                  )}
                </div>
              </div>
            </div>
          ))
        )}
        <div ref={chatEndRef} />
      </div>

      <form
        onSubmit={handleSubmit}
        className="flex items-center gap-2 p-3 border-t bg-white"
      >
        <input
          type="text"
          className="flex-1 px-4 py-2 border border-gray-300 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          placeholder="Ask me anything..."
          value={userQuestion}
          onChange={(e) => setUserQuestion(e.target.value)}
        />
        <button
          type="submit"
          className="text-indigo-600 hover:text-indigo-800 p-2"
          disabled={loading}
        >
          {loading ? <FaSpinner className="animate-spin" /> : <FaPaperPlane />}
        </button>
      </form>

      {error && (
        <p className="text-red-500 text-center text-sm px-4 py-2">{error}</p>
      )}
    </div>
  );
};

export default ChatBot;
