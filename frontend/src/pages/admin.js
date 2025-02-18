import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEdit, faTrashAlt } from "@fortawesome/free-regular-svg-icons";
import { addJob, fetchJobs, deleteJob } from "../services/addjob.js"; // Import API functions

import '../styles/admindashboard.css';

const Admin = () => {
  const [message, setMessage] = useState("");
  const [jobs, setJobs] = useState([]); // Stores fetched job listings
  const [jobTitle, setJobTitle] = useState("");
  const [jobType, setJobType] = useState("");
  const [location, setLocation] = useState("");
  const [skills, setSkills] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem("token");
      const res = await fetch("http://127.0.0.1:5000/protected", {
        headers: { Authorization: token },
      });

      const data = await res.json();
      setMessage(data.message || "Access Denied");
    };

    fetchData();
    loadJobs(); // Fetch job listings from backend
  }, []);

  const loadJobs = async () => {
    const jobList = await fetchJobs();
    setJobs(jobList);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  const handleJobSubmit = async (e) => {
    e.preventDefault();
    const jobData = { jobTitle, jobType, location, skills, jobDescription };
    const response = await addJob(jobData);

    if (response.success) {
      alert("Job added successfully!");
      loadJobs(); // Refresh job list
      setJobTitle("");
      setJobType("");
      setLocation("");
      setSkills("");
      setJobDescription("");
    } else {
      alert("Failed to add job");
    }
  };

  const handleDeleteJob = async (jobId) => {
    const response = await deleteJob(jobId);
    if (response.success) {
      alert("Job deleted successfully!");
      loadJobs();
    } else {
      alert("Failed to delete job");
    }
  };

  return (
    <div className="job-management-container">
      <div className="sidebar">
        <div className="sidebar-logo">
          <h2>EaseHire</h2>
        </div>
        <nav>
          <ul>
            <li><a href="/">Home</a></li>
            <li className="active"><a href="#">Job Management</a></li>
            <li><a href="#">Applicant Tracking</a></li>
            <li><a href="#">Help Center</a></li>
          </ul>
        </nav>
        <div className="logout">
          <button onClick={handleLogout}>Logout</button>
        </div>
      </div>

      <div className="main-content">
        <header>
          <div className="header-left">
            <h1 className="page-title">Job Management</h1>
          </div>
          <div className="header-center">
            <input type="text" className="search-bar" placeholder="Search..." />
          </div>
          <div className="header-right">
            <div className="user-profile">
              <span className="user-name">Hr Name</span>
              <img src="assets/avtar.png" alt="Avatar" className="avatar" />
            </div>
          </div>
        </header>

        <div className="content-container">
          <div className="add-job-section">
            <h2>Add Job</h2>
            <form onSubmit={handleJobSubmit}>
              <div className="form-row">
                <input 
                  type="text" 
                  placeholder="Job Title" 
                  value={jobTitle} 
                  onChange={(e) => setJobTitle(e.target.value)} 
                  required 
                />
                <select value={jobType} onChange={(e) => setJobType(e.target.value)} required>
                  <option value="">Select Job Type</option>
                  <option value="fulltime">Full Time</option>
                  <option value="parttime">Part Time</option>
                  <option value="contract">Contract</option>
                </select>
                <input 
                  type="text" 
                  placeholder="Location" 
                  value={location} 
                  onChange={(e) => setLocation(e.target.value)} 
                  required 
                />
              </div>
              <div className="form-group">
                <input 
                  type="text" 
                  placeholder="Required Skills" 
                  value={skills} 
                  onChange={(e) => setSkills(e.target.value)} 
                  required 
                />
              </div>
              <div className="form-group">
                <textarea 
                  placeholder="Job Description" 
                  value={jobDescription} 
                  onChange={(e) => setJobDescription(e.target.value)} 
                  required 
                />
              </div>
              <button type="submit" className="btn-post-job">Post Job</button>
            </form>
          </div>

          <div className="recent-jobs-section">
            <h2>Recently Posted Jobs</h2>
            <table>
              <thead>
                <tr>
                  <th>Job Id</th>
                  <th>Job Title</th>
                  <th>View</th>
                  <th>Edit</th>
                  <th>Delete Job</th>
                </tr>
              </thead>
              <tbody>
                {jobs.map((job, index) => (
                  <tr key={index}>
                    <td>{job.id}</td>
                    <td>{job.title}</td>
                    <td><a href="#"><FontAwesomeIcon icon={faEye} /></a></td>
                    <td><a href="#"><FontAwesomeIcon icon={faEdit} /></a></td>
                    <td><button onClick={() => handleDeleteJob(job.id)}><FontAwesomeIcon icon={faTrashAlt} /></button></td>
                  </tr>
                ))}
              </tbody>
            </table>
            
          </div>
        </div>
      </div>
    </div>
  );
};

export default Admin;
