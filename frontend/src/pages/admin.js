import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEdit, faTrashAlt, faSearch, faBell } from "@fortawesome/free-solid-svg-icons";
import { addJob, fetchJobs, deleteJob } from "../services/addjob.js"; // Import API functions
import Navbar2 from "../components/navbar2.js";
import '../styles/admin.css';

const Admin = () => {
  const [message, setMessage] = useState("");
  const [jobs, setJobs] = useState([]); // Stores fetched job listings
  const [jobTitle, setJobTitle] = useState("");
  const [jobType, setJobType] = useState("");
  const [location, setLocation] = useState("");
  const [skills, setSkills] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedJob, setSelectedJob] = useState(null);

  const avatarImage = "/path/to/avatar.png"; // Placeholder image
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

  const handleViewJob = (job) => {
    setSelectedJob(job);
    setShowDetailModal(true);
  };

  const handleEditJob = (job) => {
    alert(`Edit job: ${job.title}`);
  };

  return (
    <div className="admin-container">
      <Navbar2 />
      <div className="admin-content">
        <header className="admin-header">
          <h1>Job Management</h1>
          <div className="search-container">
            <FontAwesomeIcon icon={faSearch} className="search-icon" />
            <input type="text" placeholder="Search Here" className="search-input" />
          </div>
          <div className="user-profile">
            <FontAwesomeIcon icon={faBell} className="notification-icon" />
            <span>Admin</span>
            <img src={avatarImage} alt="Avatar" className="avatar" />
          </div>
        </header>

        <div className="add-job-section">
          <h2>Add Job</h2>
          <form onSubmit={handleJobSubmit}>
            <div className="form-row">
              <input type="text" placeholder="Job Title" value={jobTitle} onChange={(e) => setJobTitle(e.target.value)} required />
              <select value={jobType} onChange={(e) => setJobType(e.target.value)} required>
                <option value="">Job Type</option>
                <option value="fulltime">Full Time</option>
                <option value="parttime">Part Time</option>
                <option value="contract">Contract</option>
              </select>
              <input type="text" placeholder="Location" value={location} onChange={(e) => setLocation(e.target.value)} required />
            </div>
            <input type="text" placeholder="Required Skills" value={skills} onChange={(e) => setSkills(e.target.value)} required />
            <textarea placeholder="Job Description" value={jobDescription} onChange={(e) => setJobDescription(e.target.value)} required />
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
                <th>Delete</th>
              </tr>
            </thead>
            <tbody>
              {jobs.map((job) => (
                <tr key={job.id}>
                  <td>{job.id}</td>
                  <td>{job.title}</td>
                  <td>
                    <FontAwesomeIcon icon={faEye} onClick={() => handleViewJob(job)} className="action-icon" />
                  </td>
                  <td>
                    <FontAwesomeIcon icon={faEdit} onClick={() => handleEditJob(job)} className="action-icon" />
                  </td>
                  <td>
                    <button onClick={() => handleDeleteJob(job.id)} className="delete-btn">
                      <FontAwesomeIcon icon={faTrashAlt} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {showDetailModal && selectedJob && (
          <div className="modal">
            <div className="modal-content">
              <h2>{selectedJob.title}</h2>
              <p><strong>Type:</strong> {selectedJob.type}</p>
              <p><strong>Location:</strong> {selectedJob.location}</p>
              <p><strong>Skills:</strong> {selectedJob.skills}</p>
              <p><strong>Description:</strong> {selectedJob.description}</p>
              <button onClick={() => setShowDetailModal(false)}>Close</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Admin;
