import React, { useState } from "react";
import { FiMapPin, FiBriefcase, FiClock } from "react-icons/fi";
import { FaExternalLinkAlt, FaBuilding, FaSpinner, FaCheckCircle } from "react-icons/fa";
import { MdWork } from "react-icons/md";
import { motion, AnimatePresence } from "framer-motion";

const JobSearch = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [location, setLocation] = useState("");
  const [jobType, setJobType] = useState("");
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const [page, setPage] = useState(1);
  const [expandedJobId, setExpandedJobId] = useState(null);

  const fetchJobs = async (pageNum = 1) => {
    setLoading(true);
    setError("");
    setJobs([]);
    setSuccess(false);

    const query = `${searchTerm} ${jobType} ${location}`.trim();
    if (!query) {
      setError("Please enter a job title or keyword.");
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(
        `https://jsearch.p.rapidapi.com/search?query=${encodeURIComponent(
          query
        )}&page=${pageNum}&num_pages=1`,
        {
          method: "GET",
          headers: {
            "X-RapidAPI-Key": import.meta.env.VITE_RAPIDAPI_KEY,
            "X-RapidAPI-Host": "jsearch.p.rapidapi.com",
          },
        }
      );

      if (!response.ok) throw new Error(`API error: ${response.statusText}`);

      const data = await response.json();

      if (!data.data || data.data.length === 0) {
        setError("No jobs found for this search.");
        setJobs([]);
      } else {
        setJobs(data.data);
        // show success for 1.5s
        setTimeout(() => setSuccess(true), 500);
        setTimeout(() => setSuccess(false), 2000);
      }
    } catch (err) {
      setError(err.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setPage(1);
    fetchJobs(1);
  };

  const handlePageChange = (direction) => {
    const newPage = page + direction;
    if (newPage < 1) return;
    setPage(newPage);
    fetchJobs(newPage);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="max-w-5xl mx-auto mt-20 bg-white rounded-lg shadow-lg p-10 text-gray-900"
    >
      <header className="mb-10">
        <h1 className="text-4xl font-bold text-blue-600 flex items-center gap-3">
          <FaBuilding /> Job Search
        </h1>
      </header>

      <form onSubmit={handleSubmit} className="space-y-6">
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Job title or keyword"
          className="w-full p-4 rounded-lg border border-gray-300 bg-gray-100 text-lg focus:outline-none focus:ring-2 focus:ring-blue-300"
        />

        <input
          type="text"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          placeholder="Location (optional)"
          className="w-full p-4 rounded-lg border border-gray-300 bg-gray-100 text-lg focus:outline-none focus:ring-2 focus:ring-blue-300"
        />

        <select
          value={jobType}
          onChange={(e) => setJobType(e.target.value)}
          className="w-full p-4 rounded-lg border border-gray-300 bg-gray-100 text-lg focus:outline-none focus:ring-2 focus:ring-blue-300"
        >
          <option value="">Any Type</option>
          <option value="full-time">Full-time</option>
          <option value="part-time">Part-time</option>
          <option value="remote">Remote</option>
          <option value="contract">Contract</option>
        </select>

        <button
          type="submit"
          disabled={loading}
          className={`w-full py-4 rounded-lg font-semibold transition ${
            loading ? "bg-gray-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700 text-white"
          } flex justify-center items-center gap-3`}
        >
          {loading ? (
            <>
              <FaSpinner className="animate-spin" /> Searching...
            </>
          ) : (
            "Search Jobs"
          )}
        </button>
      </form>

      <AnimatePresence>
        {error && (
          <motion.p
            className="mt-6 text-red-600 font-semibold text-center"
            role="alert"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {error}
          </motion.p>
        )}

        {success && (
          <motion.div
            className="mt-6 flex items-center justify-center text-green-600 gap-2 font-semibold text-lg"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
          >
            <FaCheckCircle /> Jobs Found!
          </motion.div>
        )}
      </AnimatePresence>

      {!loading && jobs.length > 0 && (
        <>
          <div className="mt-12 grid gap-8 grid-cols-1 sm:grid-cols-2">
            {jobs.map((job) => {
              const isExpanded = expandedJobId === job.job_id;
              return (
                <motion.div
                  key={job.job_id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className="bg-gray-50 rounded-lg shadow-md p-6 hover:shadow-xl transition cursor-pointer"
                >
                  <div className="flex items-center mb-4 gap-4">
                    {job.employer_logo ? (
                      <img
                        src={job.employer_logo}
                        alt={`${job.employer_name} logo`}
                        className="w-14 h-14 object-contain rounded"
                      />
                    ) : (
                      <FaBuilding className="text-gray-400 text-4xl" />
                    )}
                    <div>
                      <h2 className="text-xl font-bold text-gray-800">
                        {job.job_title}
                      </h2>
                      <p className="text-gray-600">{job.employer_name || "Unknown Company"}</p>
                    </div>
                  </div>

                  <motion.div
                    animate={{ height: isExpanded ? "auto" : 60 }}
                    transition={{ duration: 0.3 }}
                    className="overflow-hidden text-gray-700 mb-2 text-sm leading-relaxed"
                  >
                    {isExpanded ? job.job_description || "No description available." : (job.job_description || "No description available.").slice(0, 150) + "..."}
                  </motion.div>

                  {job.job_description && job.job_description.length > 150 && (
                    <button
                      onClick={() => setExpandedJobId(isExpanded ? null : job.job_id)}
                      className="text-blue-600 font-semibold mb-4 hover:underline text-sm"
                    >
                      {isExpanded ? "Show Less" : "Read More"}
                    </button>
                  )}

                  <div className="flex flex-wrap text-sm text-gray-500 gap-4 mb-4">
                    {job.job_city && (
                      <span className="flex items-center gap-1">
                        <FiMapPin /> {job.job_city}, {job.job_country}
                      </span>
                    )}
                    {job.job_employment_type && (
                      <span className="flex items-center gap-1">
                        <FiBriefcase /> {job.job_employment_type}
                      </span>
                    )}
                    {job.job_posted_at_datetime_utc && (
                      <span className="flex items-center gap-1">
                        <FiClock />{" "}
                        {new Date(job.job_posted_at_datetime_utc).toLocaleDateString()}
                      </span>
                    )}
                    {job.job_salary && (
                      <span className="flex items-center gap-1">
                        <MdWork /> {job.job_salary}
                      </span>
                    )}
                  </div>

                  <a
                    href={job.job_apply_link || job.job_google_link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-blue-600 font-semibold hover:underline"
                  >
                    Apply Now <FaExternalLinkAlt />
                  </a>
                </motion.div>
              );
            })}
          </div>

          <div className="mt-10 flex justify-center items-center gap-6">
            <button
              onClick={() => handlePageChange(-1)}
              disabled={page <= 1 || loading}
              className={`px-6 py-3 rounded-lg font-semibold transition ${
                page <= 1 || loading
                  ? "bg-gray-300 cursor-not-allowed text-gray-500"
                  : "bg-gray-200 hover:bg-gray-300"
              }`}
            >
              Previous
            </button>
            <span className="text-lg font-medium text-gray-700">Page {page}</span>
            <button
              onClick={() => handlePageChange(1)}
              disabled={loading || jobs.length === 0}
              className="px-6 py-3 rounded-lg font-semibold bg-gray-200 hover:bg-gray-300 transition"
            >
              Next
            </button>
          </div>
        </>
      )}

      {loading && (
        <div className="fixed inset-0 bg-black/20 flex justify-center items-center z-50">
          <FaSpinner className="animate-spin text-blue-600 text-6xl" />
        </div>
      )}
    </motion.div>
  );
};

export default JobSearch;
