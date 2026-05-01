import React, { useEffect, useState, useRef } from "react";
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

// ✅ Fix 1 — correct Gemini model name
const MODEL_NAME = "gemini-flash-lite-latest";

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
  const [callStatus, setCallStatus] = useState("connecting");

  const vapiRef = useRef(null);
  const hasEndedRef = useRef(false);
  const conversationLogRef = useRef([]);
  const currentQuestionRef = useRef("");

  if (!vapiRef.current) {
    vapiRef.current = new Vapi(import.meta.env.VITE_VAPI_API_KEY);
  }
  const vapi = vapiRef.current;

  if (!state || !state.name || !state.position || !Array.isArray(state.Question)) {
    return (
      <div className="text-center mt-20 text-red-600 font-semibold">
        Missing or invalid interview data.
      </div>
    );
  }

  const { name, position, skills, experience, Question } = state;

  const assistantOptions = (name, position, formattedQuestions) => ({
    name: "AI Recruiter",
    firstMessage: `Hi ${name}, how are you? Ready for your interview on ${position}?`,
    transcriber: {
      provider: "deepgram",
      model: "nova-2",
      language: "en-US",
    },
    // ✅ Fix 2 — switched from unreliable PlayHT to ElevenLabs
    voice: {
      provider: "11labs",
      voiceId: "21m00Tcm4TlvDq8ikWAM", // Rachel — stable default voice
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
"Hey there! Welcome to your ${position} interview. Let's get started with a few questions!"
Ask one question at a time and wait for the candidate's response before proceeding. Keep the questions clear and concise. Below are the questions to ask one by one:
Questions: ${formattedQuestions}
If the candidate struggles, offer hints or rephrase the question without giving away the answer. Example:
"Need a hint? Think about how React tracks component updates!"
Provide brief, encouraging feedback after each answer. Example:
"Nice! That's a solid answer."
"Hmm, not quite! Want to try again?"
Keep the conversation natural and engaging—use casual phrases like "Alright, next up..." or "Let's tackle a tricky one!"
After 5–7 questions, wrap up the interview smoothly by summarizing their performance. Example:
"That was great! You handled some tough questions well. Keep sharpening your skills!"
End on a positive note:
"Thanks for chatting! Hope to see you crushing projects soon!"
Key Guidelines:
✔️ Be friendly, engaging, and witty
✔️ Keep responses short and natural, like a real conversation
✔️ Adapt based on the candidate's confidence level
✔️ Ensure the interview remains focused on ${position}
`.trim(),
        },
      ],
    },
  });

  const generateFeedback = async () => {
    const log = conversationLogRef.current;
    console.log("[Feedback] Generating feedback. Conversation log:", log);
    setLoadingFeedback(true);
    try {
      const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY);
      const model = genAI.getGenerativeModel({ model: MODEL_NAME });

      const transcriptText = log
        .map(
          (entry, i) =>
            `Q${i + 1}: ${entry.question}\nA: ${entry.answer || "No answer provided"}`
        )
        .join("\n\n");

      console.log("[Feedback] Transcript sent to Gemini:\n", transcriptText);

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
${transcriptText || "No transcript available."}

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
      console.log("[Feedback] Raw Gemini response:", rawText);

      let parsed;
      try {
        parsed = JSON.parse(rawText);
      } catch {
        console.warn("[Feedback] Direct JSON parse failed, trying regex extraction");
        const jsonMatch = rawText.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          try {
            parsed = JSON.parse(jsonMatch[0]);
          } catch (innerErr) {
            console.error("[Feedback] Regex JSON parse also failed:", innerErr);
            throw new Error("Failed to parse JSON from AI response.");
          }
        } else {
          throw new Error("No JSON found in AI response.");
        }
      }

      console.log("[Feedback] Parsed feedback:", parsed);

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
        console.warn("[Feedback] Missing keys in parsed feedback:", parsed);
        setFeedback("Feedback generated but incomplete format received.");
        return {
          strengths: "",
          improvements: "",
          communicationClarityScore: null,
          relevanceScore: null,
          overallScore: null,
          detailedFeedback: "Feedback generated but some expected fields are missing.",
        };
      }

      const clampScore = (score) =>
        typeof score === "number" ? Math.min(10, Math.max(1, score)) : null;

      parsed.communicationClarityScore = clampScore(parsed.communicationClarityScore);
      parsed.relevanceScore = clampScore(parsed.relevanceScore);
      parsed.overallScore = clampScore(parsed.overallScore);

      console.log("[Feedback] Final feedback:", parsed);
      setFeedback(parsed);
      return parsed;
    } catch (error) {
      console.error("[Feedback] Error generating feedback:", error);
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

  const handleCallEnd = async () => {
    if (hasEndedRef.current) {
      console.log("[Interview] handleCallEnd already called, skipping duplicate");
      return;
    }
    hasEndedRef.current = true;
    console.log("[Interview] Handling call end...");
    setInterviewEnded(true);
    setCallStatus("ended");
    setIsUserSpeaking(false);
    setIsAiSpeaking(false);

    try {
      vapi.stop();
    } catch (e) {
      console.warn("[Interview] vapi.stop() error (safe to ignore):", e);
    }

    const newFeedback = await generateFeedback();
    console.log("[Interview] Navigating to feedback with:", newFeedback);
    navigate("/dashboard/feedback", {
      state: {
        transcript: conversationLogRef.current,
        feedback: newFeedback,
      },
    });
  };

  const endInterview = () => {
    console.log("[Interview] End Interview button clicked");
    handleCallEnd();
  };

  useEffect(() => {
    console.log("[Vapi] Starting call for:", name, "| Position:", position);
    const formattedQuestions = Question.map(
      (q, i) => `${i + 1}. ${q.question}`
    ).join("\n");
    console.log("[Vapi] Questions:\n", formattedQuestions);

    vapi.start(assistantOptions(name, position, formattedQuestions));

    vapi.on("call-start", () => {
      console.log("[Vapi] Call started");
      setCallStatus("active");
    });

    vapi.on("call-end", () => {
      console.log("[Vapi] call-end event fired");
      handleCallEnd();
    });

    vapi.on("speech-start", () => {
      console.log("[Vapi] User speech started");
      setIsUserSpeaking(true);
    });

    vapi.on("speech-end", () => {
      console.log("[Vapi] User speech ended");
      setIsUserSpeaking(false);
    });

    vapi.on("assistant-speech-start", () => {
      console.log("[Vapi] Assistant speech started");
      setIsAiSpeaking(true);
    });

    vapi.on("assistant-speech-end", () => {
      console.log("[Vapi] Assistant speech ended");
      setIsAiSpeaking(false);
    });

    // ✅ Fix 3 — handle status-update errors (e.g. playht-unknown-error)
    vapi.on("message", (message) => {
      console.log("[Vapi] Message received:", message);

      if (message.type === "status-update" && message.status === "ended") {
        console.error("[Vapi] status-update ended. Reason:", message.endedReason);
        const nonFatalReasons = ["customer-ended-call", "assistant-ended-call"];
        if (message.endedReason && !nonFatalReasons.includes(message.endedReason)) {
          console.error("[Vapi] Provider/fatal error detected:", message.endedReason);
          hasEndedRef.current = true; // block handleCallEnd from running
          setCallStatus("error");
          setInterviewEnded(true);
          try { vapi.stop(); } catch (e) { /* ignore */ }
          return;
        }
      }

      if (message.type === "text" && message.source === "assistant") {
        console.log("[Vapi] Assistant question:", message.message);
        currentQuestionRef.current = message.message;
        setCurrentQuestion(message.message);
      }

      if (message.type === "transcript") {
        const entry = {
          question: currentQuestionRef.current,
          answer: message.transcript,
        };
        console.log("[Vapi] Transcript entry logged:", entry);
        conversationLogRef.current = [...conversationLogRef.current, entry];
        setConversationLog((prev) => [...prev, entry]);
      }
    });

    vapi.on("error", (error) => {
      console.error("[Vapi] Error event received:", error);
      if (
        error?.errorMsg === "Meeting has ended" ||
        error?.error?.msg === "Meeting has ended"
      ) {
        console.warn("[Vapi] Ejection detected — treating as normal call end");
        handleCallEnd();
      } else {
        console.error("[Vapi] Unexpected Vapi error:", error?.errorMsg || error);
        setCallStatus("error");
      }
    });

    return () => {
      console.log("[Vapi] useEffect cleanup");
      try {
        vapi.stop();
      } catch (e) {
        console.warn("[Vapi] cleanup stop error:", e);
      }
    };
  }, []);

  return (
    <motion.div
      className="px-6 py-10 flex flex-col items-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="flex items-center gap-3 mb-4">
        <FaClock className="text-purple-600 text-xl" />
        <h2 className="text-3xl font-bold text-purple-800">AI Interview Interface</h2>
      </div>

      {/* Call status badge */}
      <div className="mb-6 text-sm font-medium">
        {callStatus === "connecting" && (
          <span className="text-yellow-600 animate-pulse">⏳ Connecting to interviewer...</span>
        )}
        {callStatus === "active" && (
          <span className="text-green-600">🟢 Call Active</span>
        )}
        {callStatus === "ended" && (
          <span className="text-gray-500">🔴 Call Ended — Generating feedback...</span>
        )}
        {callStatus === "error" && (
          <div className="flex flex-col items-center gap-2">
            <span className="text-red-600">⚠️ Interview failed to start due to a provider error.</span>
            <button
              onClick={() => navigate("/dashboard")}
              className="text-sm bg-red-100 hover:bg-red-200 text-red-700 px-4 py-1.5 rounded-full transition"
            >
              ← Go Back & Retry
            </button>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-6xl mb-8">
        {/* User card */}
        <motion.div
          whileHover={{ scale: 1.02 }}
          className="bg-white backdrop-blur-lg rounded-2xl overflow-hidden shadow-xl relative h-[400px] flex flex-col items-center justify-center border border-purple-100"
        >
          <FaUserCircle
            className={`text-purple-500 text-8xl mb-3 transition-all ${
              isUserSpeaking ? "animate-pulse scale-110" : ""
            }`}
          />
          <span className="text-gray-700 font-semibold text-lg">You</span>
          {isUserSpeaking && (
            <span className="text-xs text-purple-500 mt-1 animate-pulse">Speaking...</span>
          )}
          <div className="absolute top-4 right-4 flex gap-3">
            <FaMicrophone className="text-gray-400 hover:text-purple-600 transition" size={20} />
            <FaVideo className="text-gray-400 hover:text-purple-600 transition" size={20} />
          </div>
        </motion.div>

        {/* AI card */}
        <motion.div
          whileHover={{ scale: 1.02 }}
          className="bg-white backdrop-blur-lg rounded-2xl overflow-hidden shadow-xl relative h-[400px] flex flex-col items-center justify-center border border-purple-100"
        >
          <FaRobot
            className={`text-blue-500 text-8xl mb-3 transition-all ${
              isAiSpeaking ? "animate-pulse scale-110" : ""
            }`}
          />
          <span className="text-gray-700 font-semibold text-lg">AI Interviewer</span>
          {isAiSpeaking && (
            <span className="text-xs text-blue-500 mt-1 animate-pulse">Speaking...</span>
          )}
          <div className="absolute top-4 right-4 flex gap-3">
            <FaMicrophone className="text-gray-400 hover:text-blue-600 transition" size={20} />
            <FaVideo className="text-gray-400 hover:text-blue-600 transition" size={20} />
          </div>
        </motion.div>
      </div>

      {/* Info badges */}
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

      {/* End button */}
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
          {callStatus === "error" ? "Interview failed. Please retry." : "Interview Ended. Generating feedback..."}
        </motion.p>
      )}

      {/* Inline feedback fallback */}
      {interviewEnded && callStatus !== "error" && (
        <div className="w-full max-w-4xl mt-10">
          <h3 className="text-xl font-semibold text-green-700 mb-4">Feedback Summary</h3>
          {loadingFeedback ? (
            <p className="text-gray-500 animate-pulse">Generating feedback...</p>
          ) : (
            <div className="bg-white p-5 border border-green-200 rounded-xl shadow text-gray-800 whitespace-pre-line">
              {typeof feedback === "string" ? (
                feedback
              ) : feedback && feedback.detailedFeedback ? (
                <>
                  <p><strong>Strengths:</strong> {feedback.strengths}</p>
                  <p className="mt-2"><strong>Improvements:</strong> {feedback.improvements}</p>
                  <p className="mt-2"><strong>Communication Clarity Score:</strong> {feedback.communicationClarityScore}/10</p>
                  <p className="mt-2"><strong>Relevance Score:</strong> {feedback.relevanceScore}/10</p>
                  <p className="mt-2"><strong>Overall Score:</strong> {feedback.overallScore}/10</p>
                  <p className="mt-2"><strong>Summary:</strong> {feedback.detailedFeedback}</p>
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