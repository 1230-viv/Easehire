import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSave, faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import Headertittl from "../../components/admin/Header.js";
import "../../components/admin/JobManagement.css";
import { updateJob } from "../../services/addjob"; // ✅ Import updateJob function

const API_URL = "http://127.0.0.1:5000"; // Backend URL

const JobEdit = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [jobData, setJobData] = useState({
    jobTitle: "",
    jobType: "",
    location: "",
    skills: "",
    jobDescription: "",
  });

  // ✅ Fetch job details
  useEffect(() => {
    const fetchJobDetails = async () => {
      try {
        const response = await fetch(`${API_URL}/jobs/${id}`);

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        console.log("Fetched Job Data:", data); // Debugging
        setJobData(data);
      } catch (error) {
        console.error("Error fetching job details:", error);
      }
    };

    fetchJobDetails();
  }, [id]);

  // ✅ Handle input change
  const handleChange = (e) => {
    setJobData({ ...jobData, [e.target.id]: e.target.value });
  };

  // ✅ Update job details using imported function
  const handleUpdateJob = async () => {
    const result = await updateJob(id, jobData);
    if (result.success) {
      alert("Job updated successfully!");
      navigate("/job-management"); // Redirect back
    } else {
      alert("Failed to update job.");
      console.error(result.error);
    }
  };

  return (
    <div className="main-content">
      <Headertittl title="Edit Job" userName="Admin" />

      <div className="content-container">
        <button className="btn btn-secondary mb-3" onClick={() => navigate("/job-management")}>
          <FontAwesomeIcon icon={faArrowLeft} /> Back
        </button>

        <div className="add-job-section">
          <h2>Edit Job</h2>
          <div className="form-row">
            <input
              type="text"
              id="jobTitle"
              placeholder="Job Title"
              value={jobData.jobTitle}
              onChange={handleChange}
            />
            <select id="jobType" value={jobData.jobType} onChange={handleChange}>
              <option value="">Select Job Type</option>
              <option value="fulltime">Full Time</option>
              <option value="parttime">Part Time</option>
              <option value="contract">Contract</option>
            </select>
            <input
              type="text"
              id="location"
              placeholder="Location"
              value={jobData.location}
              onChange={handleChange}
            />
          </div>
          <input
            type="text"
            id="skills"
            placeholder="Required Skills"
            value={jobData.skills}
            onChange={handleChange}
          />
          <textarea
            id="jobDescription"
            rows="4"
            placeholder="Job Description"
            value={jobData.jobDescription}
            onChange={handleChange}
          />
          <button className="btn-post-job" onClick={handleUpdateJob}>
            <FontAwesomeIcon icon={faSave} /> Save Changes
          </button>
        </div>
      </div>
    </div>
  );
};

export default JobEdit;
