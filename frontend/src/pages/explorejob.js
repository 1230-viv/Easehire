import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaBriefcase, FaMapMarkerAlt, FaCalendarAlt, FaTools } from "react-icons/fa";
import Navbar from "../components/navbar1";
import "../styles/explorejob.css";

const API_URL = "http://127.0.0.1:5000/jobs";

const ExploreJob = () => {
  const [jobs, setJobs] = useState([]);
  const [filteredJobs, setFilteredJobs] = useState([]);
  const [search, setSearch] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const response = await fetch(API_URL);
        if (!response.ok) throw new Error("Failed to fetch jobs");
        const data = await response.json();
        setJobs(data);
        setFilteredJobs(data);
      } catch (error) {
        console.error(error);
      }
    };
    fetchJobs();
  }, []);

  useEffect(() => {
    if (!search) {
      setFilteredJobs(jobs);
    } else {
      const filtered = jobs.filter((job) =>
        job?.title?.toLowerCase()?.includes(search.toLowerCase()) ||
        job?.location?.toLowerCase()?.includes(search.toLowerCase()) ||
        job?.skills?.toLowerCase()?.includes(search.toLowerCase())
      );
      setFilteredJobs(filtered);
    }
  }, [search, jobs]);

  return (
    <div className="explore-job">
      <Navbar />
      
      {/* Search and Filters */}
      <div className="search-filter-container">
        <input
          type="text"
          className="search-bar"
          placeholder="Search jobs..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <select className="filter-dropdown">
          <option>Location</option>
        </select>
        <select className="filter-dropdown">
          <option>Job Role</option>
        </select>
      </div>
      
      {/* Job Cards */}
      <div className="jobs-container">
        {filteredJobs.length > 0 ? (
          filteredJobs.map((job) => (
            <div className="job-card" key={job.id}>
              <h3><span className="react-icon">⚛️</span> {job.title}</h3>
              <p><FaBriefcase /> <strong>Job Type:</strong> {job.type}</p>
              <p><FaMapMarkerAlt /> <strong>Location:</strong> {job.location}</p>
              <p><FaCalendarAlt /> <strong>Posted:</strong> 1 week ago</p>
              <p><FaTools /> <strong>Skills:</strong> {job.skills}</p>
              <div className="buttons">
                <button className="read-more" onClick={() => navigate(`/job-details/${job.id}`)}>Read More</button>
                <button className="apply-now" onClick={() => navigate(`/empd`)}>Apply Now</button>
              </div>
            </div>
          ))
        ) : (
          <p>No jobs found</p>
        )}
      </div>
    </div>
  );
};

export default ExploreJob;