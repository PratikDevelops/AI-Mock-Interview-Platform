import React, { useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { getAuth, sendPasswordResetEmail } from "firebase/auth";
import { FaEnvelope, FaRegCheckCircle } from "react-icons/fa";
import SignupIllustration from "./SignupIllustration";

const ForgotPassword = () => {
  const auth = getAuth();
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");

    try {
      await sendPasswordResetEmail(auth, email);
      setMessage("✅ Password reset email sent! Check your inbox.");
    } catch (err) {
      if (err.code === "auth/user-not-found") {
        setError("No account found with this email.");
      } else if (err.code === "auth/invalid-email") {
        setError("Please enter a valid email address.");
      } else {
        setError("Failed to send reset email. Try again.");
      }
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 via-purple-50 to-indigo-50 px-4"
    >
      <div className="bg-white shadow-2xl rounded-xl max-w-4xl w-full grid md:grid-cols-2 overflow-hidden">
        {/* Left Illustration */}
        <div className="bg-indigo-100 p-6 flex justify-center items-center">
          <div className="w-full h-72 md:h-auto">
            <SignupIllustration/>
          </div>
        </div>

        {/* Right Form Section */}
        <form
          onSubmit={handleResetPassword}
          className="p-8 flex flex-col justify-center space-y-6"
        >
          <h2 className="text-3xl font-bold text-indigo-700 text-center mb-2">
            Reset Your Password
          </h2>

          {message && (
            <div className="text-green-600 flex items-center gap-2 justify-center">
              <FaRegCheckCircle />
              {message}
            </div>
          )}
          {error && (
            <div className="text-red-600 text-center">{error}</div>
          )}

          <div>
            <label className="block mb-1 font-medium">Email</label>
            <div className="relative">
              <FaEnvelope className="absolute left-3 top-3 text-gray-400" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="pl-10 w-full border border-gray-300 px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-indigo-400"
                placeholder="you@example.com"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-indigo-600 text-white py-2 rounded font-semibold hover:bg-indigo-700 transition"
          >
            Send Reset Email
          </button>

          <div className="text-center text-sm">
            <Link
              to="/signup"
              className="text-indigo-600 hover:underline font-medium"
            >
              Back to Login / Signup
            </Link>
          </div>
        </form>
      </div>
    </motion.div>
  );
};

export default ForgotPassword;
