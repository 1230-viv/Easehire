import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { 
  faEye, faTrashAlt, faUsers, 
  faCheckCircle, faTimesCircle, faHourglassHalf, faUserCircle ,faEdit
} from "@fortawesome/free-solid-svg-icons";
import { fetchEmployees, deleteEmployee } from "../../services/employeeService";
import { fetchJobs } from "../../services/addjob.js";
import Result from "../../pages/admin/Result";  // Adjust the path based on the location

import "../../styles/emptrack.css"; // Ensure correct path
const EmployeeList = () => {
  const navigate = useNavigate(); 
  const [employees, setEmployees] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [selectedJob, setSelectedJob] = useState("");
  const [selectedPdf, setSelectedPdf] = useState(null);
  const [selectedCandidate, setSelectedCandidate] = useState(null); // State to hold selected candidate
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    
    loadEmployees();
    loadJobs();
  }, [selectedJob]);  // Re-run this effect when selectedJob changes

  const loadEmployees = async () => {
    try {
      const employeeList = await fetchEmployees();
      setEmployees(employeeList);
    } catch (error) {
      console.error("Error fetching employees:", error);
      alert("Failed to load employee data.");
    } finally {
      setLoading(false);
    }
  };

  const loadJobs = async () => {
    try {
      const jobList = await fetchJobs();
      setJobs(jobList);
    } catch (error) {
      console.error("Error fetching jobs:", error);
    }
  };

  const handleDeleteEmployee = async (id) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this employee?");
    if (!confirmDelete) return;

    try {
      const response = await deleteEmployee(id);
      if (response.success) {
        alert("Employee deleted successfully!");
        loadEmployees();
      } else {
        alert("Failed to delete employee.");
      }
    } catch (error) {
      console.error("Error deleting employee:", error);
      alert("An error occurred while deleting the employee.");
    }
  };

  const handleViewResume = async (id) => {
    try {
      const response = await fetch(`http://127.0.0.1:5000/employee-resume/${id}`);
      const data = await response.json();
      
      if (data.success === false) {
        alert("Failed to fetch resume.");
        return;
      }

      // Convert Base64 to a Blob and create an Object URL
      const pdfBlob = new Blob([Uint8Array.from(atob(data.resume_pdf), c => c.charCodeAt(0))], { type: "application/pdf" });
      setSelectedPdf(URL.createObjectURL(pdfBlob));
    } catch (error) {
      console.error("Error fetching resume:", error);
    }
  };

  const getResultIcon = (result) => {
    if (result === "pass") {
      return <FontAwesomeIcon icon={faCheckCircle} className="blue-icon" title="Passed" />;
    } else if (result === "fail") {
      return <FontAwesomeIcon icon={faTimesCircle} className="blue-icon" title="Failed" />;
    } else {
      return <FontAwesomeIcon icon={faHourglassHalf} className="blue-icon" title="Pending" />;
    }
  };

  const handleViewResult = (candidate) => {
    setSelectedCandidate(candidate);
    navigate(`/results/${candidate.id}`); // Navigate to result page with employee ID
  };

  return (
    <div className="main-container">
      <div className={`main-content ${selectedPdf ? "with-sidebar" : ""}`}>
        
        {/* Header Section */}
        <div className="header-app">
          <h1>
            <FontAwesomeIcon icon={faUsers} className="title-icon" /> Employee Tracking
          </h1>

          <div className="right-section">
            {/* Filter Section */}
            <div className="filter-container">
              <label>Select Job: </label>
              <select value={selectedJob} onChange={(e) => setSelectedJob(e.target.value)}>
                <option value="">All Jobs</option>
                {jobs.map((job) => (
                  <option key={job.id} value={job.title}>{job.title}</option>
                ))}
              </select>
            </div>

            {/* HR Section */}
            <div className="hr-info">
              <FontAwesomeIcon icon={faUserCircle} className="avatar-icon" />
              <span className="hr-name">Admin</span>
            </div>
          </div>
        </div>

        {/* Employee List Section */}
        <div className="employee-list">
          <h2>Employee Records</h2>
          <div className="employee-table">
            {loading ? (
              <p>Loading employees...</p>
            ) : (
              <table>
                <thead>
                  <tr>
                    <th>Emp ID</th>
                    <th>Name</th>
                    <th>Contact</th>
                    <th>Email</th>
                    <th>View PDF</th>
                    <th>Result</th>
                    <th>Delete</th>
                  </tr>
                </thead>
                <tbody>
                  {employees.filter(emp => !selectedJob || (emp.job && emp.job.title === selectedJob)).length > 0 ? (
                    employees
                      .filter(emp => !selectedJob || (emp.job && emp.job.title === selectedJob))
                      .map((emp) => (
                        <tr key={emp.id}>
                          <td>{emp.id}</td>
                          <td>{emp.name}</td>
                          <td>{emp.phone_number}</td>
                          <td>{emp.email}</td>
                        
                          <td>
                            <button onClick={() => handleViewResume(emp.id)}>
                              <FontAwesomeIcon icon={faEye} className="view-icon" />
                            </button>
                          </td>
                          <td>
                            <button
                              className="btn btn-link"
                              onClick={() => handleViewResult(emp)}
                            >
                              <FontAwesomeIcon icon={faEdit} />
                            </button>
                          </td>
                          <td>
                            <button onClick={() => handleDeleteEmployee(emp.id)}>
                              <FontAwesomeIcon icon={faTrashAlt} className="delete-icon" />
                            </button>
                          </td>
                        </tr>
                      ))
                  ) : (
                    <tr>
                      <td colSpan="8">No employees found for the selected job.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>

      {/* PDF Viewer Sidebar */}
      {selectedPdf && (
        <div className="pdf-sidebar">
          <button className="close-btn" onClick={() => setSelectedPdf(null)}>X</button>
          <iframe src={selectedPdf} title="Employee PDF" className="pdf-viewer" />
        </div>
      )}

      {/* Result Modal/Section */}
      {selectedCandidate && (
        <div className="result-modal">
          <div className="result-content">
            <button className="close-btn" onClick={() => setSelectedCandidate(null)}>X</button>
            <Result candidate={selectedCandidate} />
          </div>
        </div>
      )}
    </div>
  );
};

export default EmployeeList;
