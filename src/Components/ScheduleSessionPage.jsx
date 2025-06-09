import React, { useState } from "react";
import { auth, db } from "../firebase";
import { collection, addDoc, Timestamp } from "firebase/firestore";
import { useNavigate } from "react-router-dom";

const ScheduleSessionPage = () => {
  const navigate = useNavigate();
  const [candidateId, setCandidateId] = useState("");
  const [scheduledTime, setScheduledTime] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleSchedule = async (e) => {
    e.preventDefault();

    const user = auth.currentUser;

    if (!user) {
      setError("You must be logged in to schedule a session.");
      return;
    }

    if (!candidateId || !scheduledTime) {
      setError("All fields are required.");
      return;
    }

    try {
      const sessionRef = collection(db, "sessions");

      await addDoc(sessionRef, {
        interviewerId: user.uid,
        candidateId: candidateId,
        scheduledAt: Timestamp.fromDate(new Date(scheduledTime)),
        feedback: "",
        status: "scheduled",
      });

      setMessage("Session scheduled successfully!");
      setError("");
      setCandidateId("");
      setScheduledTime("");

      setTimeout(() => navigate("/dashboard"), 2000);
    } catch (err) {
      console.error("Error scheduling session:", err);
      setError("Failed to schedule session. Try again.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="bg-white shadow-xl rounded-lg p-8 max-w-md w-full">
        <h2 className="text-2xl font-bold mb-4 text-center text-indigo-700">
          Schedule Interview Session
        </h2>

        {message && (
          <p className="text-green-600 text-center font-semibold mb-4">
            {message}
          </p>
        )}
        {error && (
          <p className="text-red-600 text-center font-semibold mb-4">{error}</p>
        )}

        <form onSubmit={handleSchedule} className="space-y-4">
          <div>
            <label className="block mb-1 font-medium">Candidate ID</label>
            <input
              type="text"
              value={candidateId}
              onChange={(e) => setCandidateId(e.target.value)}
              className="w-full border px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-indigo-400"
              placeholder="Enter candidate user ID"
            />
          </div>

          <div>
            <label className="block mb-1 font-medium">Schedule Date & Time</label>
            <input
              type="datetime-local"
              value={scheduledTime}
              onChange={(e) => setScheduledTime(e.target.value)}
              className="w-full border px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-indigo-400"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-indigo-600 text-white py-2 rounded hover:bg-indigo-700 transition"
          >
            Schedule Session
          </button>
        </form>
      </div>
    </div>
  );
};

export default ScheduleSessionPage;
