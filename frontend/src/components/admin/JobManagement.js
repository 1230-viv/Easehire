import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash, faPlus, faEdit } from "@fortawesome/free-solid-svg-icons";
import Headertittl from "../../components/admin/Header.js";
import "./JobManagement.css";

const API_URL = "http://localhost:5000"; // Change this if hosted elsewhere

const JobManagement = () => {
  const navigate = useNavigate();
  const [jobs, setJobs] = useState([]);
  const [jobData, setJobData] = useState({
    jobTitle: "",
    jobType: "",
    location: "",
    skills: "",
    jobDescription: "",
  });

  // ✅ Fetch jobs from the backend
  useEffect(() => {
    axios.get(`${API_URL}/jobs`)
      .then((response) => setJobs(response.data))
      .catch((error) => console.error("Error fetching jobs:", error));
  }, []);

  // ✅ Handle input change
  const handleChange = (e) => {
    setJobData({ ...jobData, [e.target.id]: e.target.value });
  };

  // ✅ Post a new job
  const postJob = () => {
    axios.post(`${API_URL}/add-job`, jobData)
      .then(() => {
        alert("Job added successfully!");
        window.location.reload(); // Refresh job list
      })
      .catch(() => alert("Failed to add job."));
  };

  // ✅ Delete a job
  const deleteJob = (id) => {
    axios.delete(`${API_URL}/delete-job/${id}`)
      .then(() => {
        alert("Job deleted successfully!");
        setJobs(jobs.filter(job => job.id !== id)); // Update UI
      })
      .catch(() => alert("Failed to delete job."));
  };

  return (
    <div className="main-content">
      <Headertittl title="Job Management" userName="Admin" />
      
      <div className="content-container">
        <div className="add-job-section">
          <h2>Add Job</h2>
          <div className="form-row">
            <input type="text" id="jobTitle" placeholder="Job Title" onChange={handleChange} />
            <select id="jobType" onChange={handleChange}>
              <option value="">Select Job Type</option>
              <option value="fulltime">Full Time</option>
              <option value="parttime">Part Time</option>
              <option value="contract">Contract</option>
            </select>
            <input type="text" id="location" placeholder="Location" onChange={handleChange} />
          </div>
          <input type="text" id="skills" placeholder="Required Skills" onChange={handleChange} />
          <textarea id="jobDescription" rows="4" placeholder="Job Description" onChange={handleChange} />
          <button className="btn-post-job" onClick={postJob}>
            <FontAwesomeIcon icon={faPlus} /> Post Job
          </button>
        </div>

        <div className="recent-jobs-section">
          <h2>Recently Posted Jobs</h2>
          <table>
            <thead>
              <tr>
                <th>Job Id</th>
                <th>Job Title</th>
                <th>Edit</th>
                <th>Delete</th>
              </tr>
            </thead>
            <tbody>
              {jobs.map((job) => (
                <tr key={job.id}>
                  <td>{job.id}</td>
                  <td>{job.title}</td>
                  <td>
                  <button
                    className="btn btn-link"
                    onClick={() => navigate(`/edit-job/${job.id}`)}
                  >
                    <FontAwesomeIcon icon={faEdit} />
                  </button>
                  </td>
                  <td>
                    <button className="btn btn-link text-danger" onClick={() => deleteJob(job.id)}>
                      <FontAwesomeIcon icon={faTrash} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default JobManagement;
