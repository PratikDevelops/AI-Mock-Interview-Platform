import React, { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { FaUser, FaEnvelope, FaLock, FaRegCheckCircle } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";

import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  updateProfile,
} from "firebase/auth";

import { doc, setDoc, getDoc } from "firebase/firestore";
import { auth, googleProvider, db } from "../firebase";

import SignupIllustration from "./SignupIllustration";

const SignupPage = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // Get redirect path from location.state or default to /dashboard
  const from = location.state?.from || "/dashboard";

  const [isSignup, setIsSignup] = useState(true);
  const [name, setName] = useState("");
  const [role, setRole] = useState("candidate"); // default role
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);

  const validate = () => {
    const errs = {};
    if (isSignup && !name.trim()) errs.name = "Name is required";
    if (!email.trim()) errs.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(email)) errs.email = "Email is invalid";
    if (!password) errs.password = "Password is required";
    else if (password.length < 6) errs.password = "At least 6 characters";
    if (isSignup && confirmPassword !== password)
      errs.confirmPassword = "Passwords do not match";
    return errs;
  };

  const saveUserToFirestore = async (user, userRole) => {
    try {
      const userRef = doc(db, "users", user.uid);
      const userSnap = await getDoc(userRef);

      if (!userSnap.exists()) {
        await setDoc(userRef, {
          name: user.displayName || name || "",
          email: user.email || email || "",
          role: userRole,
        });
      }
    } catch (error) {
      console.error("Firestore error:", error);
      setErrors({ form: "Failed to save user data." });
      throw error;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const val = validate();
    setErrors(val);
    if (Object.keys(val).length) return;

    try {
      if (isSignup) {
        const uc = await createUserWithEmailAndPassword(auth, email, password);
        await updateProfile(uc.user, { displayName: name });
        await saveUserToFirestore(uc.user, role);
      } else {
        await signInWithEmailAndPassword(auth, email, password);
      }

      setSubmitted(true);

      setTimeout(() => {
        navigate(from, { replace: true });
      }, 1500);
    } catch (err) {
      console.error("Auth error:", err);
      let msg = "Something went wrong.";
      const code = err.code;
      if (code === "auth/email-already-in-use") msg = "Email already in use.";
      else if (code === "auth/user-not-found") msg = "User not found.";
      else if (code === "auth/wrong-password") msg = "Incorrect password.";
      else if (code === "auth/invalid-email") msg = "Invalid email format.";
      else if (err.message && err.message.includes("Firestore"))
        msg = "Failed to save user data.";
      setErrors({ form: msg });
    }
  };

  const handleGoogle = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;

      await saveUserToFirestore(user, "candidate");

      setSubmitted(true);

      setTimeout(() => {
        navigate(from, { replace: true });
      }, 1500);
    } catch (err) {
      console.error("Google sign-in error:", err);
      setErrors({ form: "Google sign-in failed." });
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 via-purple-50 to-indigo-50 px-4"
    >
      <div className="bg-white shadow-2xl rounded-xl max-w-5xl w-full grid md:grid-cols-2 overflow-hidden">
        <div className="bg-indigo-100 p-6 flex justify-center items-center">
          <div className="w-full h-72 md:h-auto">
            <SignupIllustration />
          </div>
        </div>
        <form onSubmit={handleSubmit} className="p-8 space-y-5">
          <h2 className="text-3xl font-bold text-indigo-700 text-center">
            {isSignup ? "Create Account" : "Welcome Back"}
          </h2>

          {submitted && (
            <div className="text-green-600 text-center flex justify-center items-center gap-2">
              <FaRegCheckCircle />
              {isSignup ? "Signup" : "Login"} successful! Redirecting...
            </div>
          )}
          {errors.form && (
            <p className="text-red-600 text-center">{errors.form}</p>
          )}

          {isSignup && (
            <>
              <div>
                <label className="block mb-1 font-medium">Name</label>
                <div className="relative">
                  <FaUser className="absolute left-3 top-3 text-gray-400" />
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className={`pl-10 w-full border px-3 py-2 rounded focus:outline-none focus:ring-2 ${
                      errors.name
                        ? "border-red-500 focus:ring-red-400"
                        : "border-gray-300 focus:ring-indigo-400"
                    }`}
                    placeholder="Your Name"
                  />
                </div>
                {errors.name && (
                  <p className="text-red-600 text-sm">{errors.name}</p>
                )}
              </div>

              <div>
                <label className="block mb-1 font-medium">Role</label>
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  className="w-full border px-3 py-2 rounded focus:outline-none focus:ring-2 border-gray-300 focus:ring-indigo-400"
                >
                  <option value="candidate">Candidate</option>
                  <option value="interviewer">Interviewer</option>
                </select>
              </div>
            </>
          )}

          <div>
            <label className="block mb-1 font-medium">Email</label>
            <div className="relative">
              <FaEnvelope className="absolute left-3 top-3 text-gray-400" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={`pl-10 w-full border px-3 py-2 rounded focus:outline-none focus:ring-2 ${
                  errors.email
                    ? "border-red-500 focus:ring-red-400"
                    : "border-gray-300 focus:ring-indigo-400"
                }`}
                placeholder="you@example.com"
              />
            </div>
            {errors.email && (
              <p className="text-red-600 text-sm">{errors.email}</p>
            )}
          </div>

          <div>
            <label className="block mb-1 font-medium">Password</label>
            <div className="relative">
              <FaLock className="absolute left-3 top-3 text-gray-400" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={`pl-10 w-full border px-3 py-2 rounded focus:outline-none focus:ring-2 ${
                  errors.password
                    ? "border-red-500 focus:ring-red-400"
                    : "border-gray-300 focus:ring-indigo-400"
                }`}
                placeholder="Enter password"
              />
            </div>
            {errors.password && (
              <p className="text-red-600 text-sm">{errors.password}</p>
            )}
          </div>

          {!isSignup && (
            <div className="text-right mb-4">
              <Link
                to="/forgot-password"
                className="text-indigo-600 hover:underline text-sm font-medium"
              >
                Forgot Password?
              </Link>
            </div>
          )}

          {isSignup && (
            <div>
              <label className="block mb-1 font-medium">Confirm Password</label>
              <div className="relative">
                <FaLock className="absolute left-3 top-3 text-gray-400" />
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className={`pl-10 w-full border px-3 py-2 rounded focus:outline-none focus:ring-2 ${
                    errors.confirmPassword
                      ? "border-red-500 focus:ring-red-400"
                      : "border-gray-300 focus:ring-indigo-400"
                  }`}
                  placeholder="Confirm password"
                />
              </div>
              {errors.confirmPassword && (
                <p className="text-red-600 text-sm">{errors.confirmPassword}</p>
              )}
            </div>
          )}

          <button
            type="submit"
            className="w-full bg-indigo-600 cursor-pointer text-white py-2 rounded font-semibold hover:bg-indigo-700 transition"
          >
            {isSignup ? "Sign Up" : "Login"}
          </button>

          <button
            type="button"
            onClick={handleGoogle}
            className="w-full flex items-center justify-center gap-3 border border-gray-300 bg-white text-gray-700 py-2 rounded shadow-sm hover:shadow-md transition-shadow duration-200 font-medium"
          >
            <FcGoogle className="w-6 h-6" />
            Sign in with Google
          </button>

          <div className="text-center mt-4">
            {isSignup ? "Already have an account?" : "Don't have an account?"}{" "}
            <button
              type="button"
              onClick={() => setIsSignup(!isSignup)}
              className="text-indigo-600 cursor-pointer hover:underline font-semibold"
            >
              {isSignup ? "Login" : "Sign Up"}
            </button>
          </div>
        </form>
      </div>
    </motion.div>
  );
};

export default SignupPage;
