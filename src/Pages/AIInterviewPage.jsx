import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Vapi from "@vapi-ai/web";
import { GoogleGenerativeAI } from "@google/generative-ai";
import {
  FaUserCircle,
  FaRobot,
  FaPhoneSlash,
  FaMicrophone,
  FaVideo,
  FaClock,
} from "react-icons/fa";
import { motion } from "framer-motion";

const AIVideoInterview = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const [interviewEnded, setInterviewEnded] = useState(false);
  const [feedback, setFeedback] = useState("");
  const [loadingFeedback, setLoadingFeedback] = useState(false);
  const [conversationLog, setConversationLog] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState("");
  const [isUserSpeaking, setIsUserSpeaking] = useState(false);
  const [isAiSpeaking, setIsAiSpeaking] = useState(false);

  const vapi = new Vapi(import.meta.env.VITE_VAPI_API_KEY);

  if (
    !state ||
    !state.name ||
    !state.position ||
    !Array.isArray(state.Question)
  ) {
    return (
      <div className="text-center mt-20 text-red-600 font-semibold">
        Missing or invalid interview data.
      </div>
    );
  }

  const { name, position, skills, experience, portfolio, Question } = state;

  const assistantOptions = (name, position, formattedQuestions) => ({
    name: "AI Recruiter",
    firstMessage: `Hi ${name}, how are you? Ready for your interview on ${position}?`,
    transcriber: {
      provider: "deepgram",
      model: "nova-2",
      language: "en-US",
    },
    voice: {
      provider: "playht",
      voiceId: "jennifer",
    },
    model: {
      provider: "openai",
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: `
You are an AI voice assistant conducting interviews.
Your job is to ask candidates provided interview questions, assess their responses.
Begin the conversation with a friendly introduction, setting a relaxed yet professional tone. Example:
"Hey there! Welcome to your ${position} interview. Let’s get started with a few questions!"
Ask one question at a time and wait for the candidate’s response before proceeding. Keep the questions clear and concise. Below are the questions to ask one by one:
Questions: ${formattedQuestions}
If the candidate struggles, offer hints or rephrase the question without giving away the answer. Example:
"Need a hint? Think about how React tracks component updates!"
Provide brief, encouraging feedback after each answer. Example:
"Nice! That’s a solid answer."
"Hmm, not quite! Want to try again?"
Keep the conversation natural and engaging—use casual phrases like "Alright, next up..." or "Let’s tackle a tricky one!"
After 5–7 questions, wrap up the interview smoothly by summarizing their performance. Example:
"That was great! You handled some tough questions well. Keep sharpening your skills!"
End on a positive note:
"Thanks for chatting! Hope to see you crushing projects soon!"
Key Guidelines:
✔️ Be friendly, engaging, and witty 🖋️
✔️ Keep responses short and natural, like a real conversation
✔️ Adapt based on the candidate’s confidence level
✔️ Ensure the interview remains focused on ${position}
`.trim(),
        },
      ],
    },
  });

  const startCall = () => {
    const formattedQuestions = Question.map(
      (q, i) => `${i + 1}. ${q.question}`
    ).join("\n");

    vapi.start(assistantOptions(name, position, formattedQuestions));
  };

  useEffect(() => {
    startCall();

    vapi.on("speech-start", (e) => {
      if (e.speaker === "user") setIsUserSpeaking(true);
      if (e.speaker === "assistant") setIsAiSpeaking(true);
    });

    vapi.on("speech-end", (e) => {
      if (e.speaker === "user") setIsUserSpeaking(false);
      if (e.speaker === "assistant") setIsAiSpeaking(false);
    });

    vapi.on("message", (message) => {
      if (message.type === "text" && message.source === "assistant") {
        setCurrentQuestion(message.message);
      }

      if (message.type === "transcript") {
        setConversationLog((prev) => [
          ...prev,
          { question: currentQuestion, answer: message.transcript },
        ]);
      }
    });

    return () => {
      vapi.stop();
    };
  }, []);

  const generateFeedback = async () => {
    setLoadingFeedback(true);
    try {
      const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY);
      const model = genAI.getGenerativeModel({
        model: "models/gemini-2.5-flash-preview-05-20",
      });

      const transcriptText = conversationLog
        .map(
          (entry, i) =>
            `Q${i + 1}: ${entry.question}\nA: ${entry.answer || "No answer provided"}`
        )
        .join("\n\n");

      const prompt = `
You are an expert recruiter AI. Given the following interview transcript, analyze the candidate's answers for the role of ${position} and provide detailed feedback.

Please respond ONLY with a JSON object containing:
- strengths: a brief summary of strengths
- improvements: areas of improvement
- communicationClarityScore: a score from 1 to 10
- relevanceScore: a score from 1 to 10
- overallScore: a score from 1 to 10
- detailedFeedback: a concise paragraph summary

Transcript:
${transcriptText}

Example JSON format:
{
  "strengths": "Good technical knowledge and clear explanations.",
  "improvements": "Needs to improve time management and elaborate answers.",
  "communicationClarityScore": 8,
  "relevanceScore": 7,
  "overallScore": 7,
  "detailedFeedback": "Overall, the candidate shows good understanding of core concepts but can benefit from clearer, more concise answers."
}
      `.trim();

      const result = await model.generateContent(prompt);
      const rawText = await result.response.text();

      let parsed;
      try {
        parsed = JSON.parse(rawText);
      } catch {
        const jsonMatch = rawText.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          try {
            parsed = JSON.parse(jsonMatch[0]);
          } catch (innerErr) {
            throw new Error("Failed to parse JSON extracted from AI response.");
          }
        } else {
          throw new Error("No JSON found in AI response.");
        }
      }

      const keys = [
        "strengths",
        "improvements",
        "communicationClarityScore",
        "relevanceScore",
        "overallScore",
        "detailedFeedback",
      ];
      const hasAllKeys = keys.every((k) => k in parsed);
      if (!hasAllKeys) {
        setFeedback("Feedback generated but incomplete format received.");
        return {
          strengths: "",
          improvements: "",
          communicationClarityScore: null,
          relevanceScore: null,
          overallScore: null,
          detailedFeedback:
            "Feedback generated but some expected fields are missing.",
        };
      }

      const clampScore = (score) =>
        typeof score === "number" ? Math.min(10, Math.max(1, score)) : null;

      parsed.communicationClarityScore = clampScore(parsed.communicationClarityScore);
      parsed.relevanceScore = clampScore(parsed.relevanceScore);
      parsed.overallScore = clampScore(parsed.overallScore);

      setFeedback(parsed);
      return parsed;
    } catch (error) {
      setFeedback("Unable to generate feedback at this time.");
      return {
        strengths: "",
        improvements: "",
        communicationClarityScore: null,
        relevanceScore: null,
        overallScore: null,
        detailedFeedback: "Unable to generate feedback at this time.",
      };
    } finally {
      setLoadingFeedback(false);
    }
  };

  const endInterview = async () => {
    setInterviewEnded(true);
    vapi.stop();

    const newFeedback = await generateFeedback();
    navigate("/dashboard/feedback", {
      state: {
        transcript: conversationLog,
        feedback: newFeedback,
      },
    });
  };

  return (
    <motion.div
      className="px-6 py-10 flex flex-col items-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="flex items-center gap-3 mb-8">
        <FaClock className="text-purple-600 text-xl" />
        <h2 className="text-3xl font-bold text-purple-800">AI Interview Interface</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-6xl mb-8">
        <motion.div
          whileHover={{ scale: 1.02 }}
          className="bg-white backdrop-blur-lg rounded-2xl overflow-hidden shadow-xl relative h-[400px] flex flex-col items-center justify-center border border-purple-100"
        >
          <FaUserCircle
            className={`text-purple-500 text-8xl mb-3 ${
              isUserSpeaking ? "animate-pulse" : ""
            }`}
          />
          <span className="text-gray-700 font-semibold text-lg">You</span>
          <div className="absolute top-4 right-4 flex gap-3">
            <FaMicrophone
              className="text-gray-400 hover:text-purple-600 transition"
              size={20}
            />
            <FaVideo
              className="text-gray-400 hover:text-purple-600 transition"
              size={20}
            />
          </div>
        </motion.div>

        <motion.div
          whileHover={{ scale: 1.02 }}
          className="bg-white backdrop-blur-lg rounded-2xl overflow-hidden shadow-xl relative h-[400px] flex flex-col items-center justify-center border border-purple-100"
        >
          <FaRobot
            className={`text-blue-500 text-8xl mb-3 ${
              isAiSpeaking ? "animate-pulse" : ""
            }`}
          />
          <span className="text-gray-700 font-semibold text-lg">AI Interviewer</span>
          <div className="absolute top-4 right-4 flex gap-3">
            <FaMicrophone
              className="text-gray-400 hover:text-blue-600 transition"
              size={20}
            />
            <FaVideo
              className="text-gray-400 hover:text-blue-600 transition"
              size={20}
            />
          </div>
        </motion.div>
      </div>

      <div className="flex flex-wrap gap-3 mb-6">
        <span className="bg-purple-200 text-purple-800 text-sm font-semibold px-4 py-2 rounded-full">
          Name: {name}
        </span>
        <span className="bg-green-200 text-green-800 text-sm font-semibold px-4 py-2 rounded-full">
          Position: {position}
        </span>
        <span className="bg-blue-200 text-blue-800 text-sm font-semibold px-4 py-2 rounded-full">
          Skills: {skills}
        </span>
        <span className="bg-yellow-200 text-yellow-800 text-sm font-semibold px-4 py-2 rounded-full">
          Experience: {experience} {experience > 1 ? "years" : "year"}
        </span>
      </div>

      {!interviewEnded ? (
        <motion.button
          onClick={endInterview}
          whileTap={{ scale: 0.95 }}
          className="mt-4 bg-red-500 hover:bg-red-600 text-white px-6 py-3 rounded-full flex items-center gap-3 text-lg font-semibold shadow-lg transition"
        >
          <FaPhoneSlash />
          End Interview
        </motion.button>
      ) : (
        <motion.p
          className="mt-4 text-red-600 text-xl font-semibold"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          Interview Ended.
        </motion.p>
      )}

      {interviewEnded && (
        <div className="w-full max-w-4xl mt-10">
          <h3 className="text-xl font-semibold text-green-700 mb-4">Feedback Summary</h3>
          {loadingFeedback ? (
            <p className="text-gray-500">Generating feedback...</p>
          ) : (
            <div className="bg-white p-5 border border-green-200 rounded-xl shadow text-gray-800 whitespace-pre-line">
              {typeof feedback === "string" ? (
                feedback
              ) : feedback && feedback.detailedFeedback ? (
                <>
                  <p><strong>Strengths:</strong> {feedback.strengths}</p>
                  <p><strong>Improvements:</strong> {feedback.improvements}</p>
                  <p><strong>Communication Clarity Score:</strong> {feedback.communicationClarityScore}</p>
                  <p><strong>Relevance Score:</strong> {feedback.relevanceScore}</p>
                  <p><strong>Overall Score:</strong> {feedback.overallScore}</p>
                  <p><strong>Summary:</strong> {feedback.detailedFeedback}</p>
                </>
              ) : (
                "No feedback available."
              )}
            </div>
          )}
        </div>
      )}
    </motion.div>
  );
};

export default AIVideoInterview;
