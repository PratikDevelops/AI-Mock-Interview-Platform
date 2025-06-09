import React from "react";
import { FaUserTie } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const BookInterviewSection = () => {
  const navigate = useNavigate();

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-20">
      <section
        id="expert-booking"
        className="bg-gradient-to-r from-purple-200 via-indigo-200 to-purple-200 py-12 my-16 shadow-lg text-indigo-900 scroll-mt-24 rounded-2xl"
      >
        <div className="container mx-auto px-4 sm:px-6 md:px-10 lg:px-20 rounded-3xl">
          <div className="flex flex-col md:flex-row items-center justify-between gap-10">
            <div className="flex flex-col md:flex-row items-center md:items-start gap-6 md:gap-8 w-full">
              <div className="p-4 sm:p-5 bg-indigo-400 rounded-full shadow-lg text-white flex-shrink-0">
                <FaUserTie className="w-12 h-12 sm:w-16 sm:h-16" />
              </div>
              <div className="text-center md:text-left w-full">
                <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold mb-3 leading-tight">
                  Book a One-on-One Interview with Experts
                </h2>
                <p className="text-base sm:text-lg md:text-xl font-medium leading-relaxed max-w-md mx-auto md:mx-0">
                  Get personalized advice and feedback from industry professionals to boost your career confidence and skills.
                </p>
              </div>
            </div>
            <div className="w-full md:w-auto mt-6 md:mt-0 flex justify-center md:justify-start">
              <button
                onClick={() =>
                  navigate("/signup", { state: { from: "/dashboard/expert-booking" } })
                }
                className="bg-indigo-700 hover:bg-indigo-800 text-white font-bold px-6 sm:px-10 md:px-12 py-3 sm:py-3.5 md:py-4 rounded-full text-base sm:text-lg md:text-xl shadow-lg transition w-full sm:w-auto whitespace-nowrap"
              >
                Book Now
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default BookInterviewSection;
