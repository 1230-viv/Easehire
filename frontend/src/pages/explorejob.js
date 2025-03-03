import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBriefcase, faSearch } from "@fortawesome/free-solid-svg-icons";
import "../styles/explorejob.css";
import Navbar from "../components/navbar1";

const API_URL = "http://127.0.0.1:5000/jobs"; // Ensure this matches your backend

const ExploreJob = () => {
  const [jobs, setJobs] = useState([]);
  const [filteredJobs, setFilteredJobs] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        setLoading(true);
        const response = await fetch(API_URL);
        if (!response.ok) throw new Error("Failed to fetch jobs");

        const data = await response.json();
        console.log("API Response:", data);

        setJobs(data);
        setFilteredJobs(data);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchJobs();
  }, []);

  useEffect(() => {
    if (!search) {
      setFilteredJobs(jobs);
    } else {
      const filtered = jobs.filter(job =>
        job?.title?.toLowerCase()?.includes(search.toLowerCase()) ||
        job?.location?.toLowerCase()?.includes(search.toLowerCase()) ||
        job?.skills?.toLowerCase()?.includes(search.toLowerCase())
      );
      setFilteredJobs(filtered);
    }
  }, [search, jobs]);

  const handleApply = (jobId) => {
    navigate("/empd", { state: { jobId } });
  };

  return (
    <div className="explore-job-container">
      <Navbar />

      <div className="search-bar">
        <FontAwesomeIcon icon={faSearch} className="search-icon" />
        <input
          type="text"
          placeholder="Search by job title, location, or skills..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {loading ? (
        <p>Loading jobs...</p>
      ) : error ? (
        <p>Error: {error}</p>
      ) : (filteredJobs.length > 0 ? (
        <div className="job-cards-container">
          {filteredJobs.map((job) => (
            <div key={job.id} className="job-card">
              <FontAwesomeIcon icon={faBriefcase} className="job-icon" />
              <h3>{job.title}</h3>
              <p><strong>Job Type:</strong> {job.type}</p>
              <p><strong>Location:</strong> {job.location}</p>
              <p><strong>Skills:</strong> {job.skills}</p>
              <div className="job-buttons">
                <button className="read-more">Read More</button>
                <button className="apply-now" onClick={() => handleApply(job.id)}>Apply Now</button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p>No jobs found</p>
      ))}
    </div>
  );
};

export default ExploreJob;
