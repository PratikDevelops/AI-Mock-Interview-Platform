import React, { useState } from "react";
import { FaEnvelope, FaUser, FaCommentDots } from "react-icons/fa";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "../firebase";

const ContactUs = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!name.trim() || !email.trim() || !message.trim()) {
      setError("Please fill in all the fields.");
      return;
    }

    setLoading(true);

    try {
      await addDoc(collection(db, "contacts"), {
        name,
        email,
        message,
        createdAt: serverTimestamp(),
      });

      setSuccess("Thanks for contacting us! We'll get back to you soon.");
      setName("");
      setEmail("");
      setMessage("");
    } catch (err) {
      setError("Failed to send message. Please try again.");
      console.error(err);
    }

    setLoading(false);
  };

  return (
    <section id="contact" className="relative py-24 px-6 md:px-12 lg:px-20 overflow-hidden">

      <div className="max-w-4xl mx-auto bg-white rounded-3xl  p-8 sm:p-12 z-10 relative">
        <h2 className="text-4xl font-extrabold text-center text-indigo-700 mb-8 relative inline-block">
          Contact Us
          <span className="block h-1 w-20 bg-gradient-to-r from-[#7366ff] to-[#a57bff] mt-2 mx-auto rounded-full"></span>
        </h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="flex items-center border-b-2 border-indigo-300 py-2 px-2 bg-gray-50 rounded-md">
            <FaUser className="text-indigo-600 mr-3" />
            <input
              type="text"
              placeholder="Your Name"
              className="w-full bg-transparent outline-none text-gray-700 placeholder-indigo-400"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          <div className="flex items-center border-b-2 border-indigo-300 py-2 px-2 bg-gray-50 rounded-md">
            <FaEnvelope className="text-indigo-600 mr-3" />
            <input
              type="email"
              placeholder="Your Email"
              className="w-full bg-transparent outline-none text-gray-700 placeholder-indigo-400"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="flex items-start border-b-2 border-indigo-300 py-2 px-2 bg-gray-50 rounded-md">
            <FaCommentDots className="text-indigo-600 mr-3 mt-2" />
            <textarea
              placeholder="Your Message"
              className="w-full bg-transparent outline-none text-gray-700 placeholder-indigo-400 resize-none"
              rows="5"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            />
          </div>

          {error && <p className="text-red-600 font-semibold text-center">{error}</p>}
          {success && <p className="text-green-600 font-semibold text-center">{success}</p>}

          <div className="text-center">
            <button
              type="submit"
              disabled={loading}
              className={`bg-[#7366ff] hover:bg-[#5e54d9] text-white font-semibold px-8 py-3 rounded-full shadow-xl text-lg transition duration-300 ease-in-out ${
                loading ? "opacity-70 cursor-not-allowed" : ""
              }`}
            >
              {loading ? "Sending..." : "Send Message"}
            </button>
          </div>
        </form>
      </div>
    </section>
  );
};

export default ContactUs;
