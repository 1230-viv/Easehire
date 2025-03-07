import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faTrashAlt, faUsers } from "@fortawesome/free-solid-svg-icons"; 
import { fetchEmployees, deleteEmployee } from "../services/employeeService.js"; // Import API functions
import "../styles/emptrack.css";

const EmpTrack = () => {
  const [employees, setEmployees] = useState([]);
  const [selectedPdf, setSelectedPdf] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    loadEmployees(); // Fetch employee data from backend
  }, []);

  const loadEmployees = async () => {
    const employeeList = await fetchEmployees();
    setEmployees(employeeList);
  };

  const handleDeleteEmployee = async (id) => {
    const response = await deleteEmployee(id);
    if (response.success) {
      alert("Employee deleted successfully!");
      loadEmployees(); // Refresh employee list
    } else {
      alert("Failed to delete employee");
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
      setSelectedPdf(URL.createObjectURL(pdfBlob));  // Set URL to state
    } catch (error) {
      console.error("Error fetching resume:", error);
    }
  };
  

  return (
    <div className="emp-management-container">
      <div className="sidebar">
        <h2>EaseHire</h2>
        <nav>
          <ul>
            <li><a href="/">Home</a></li>
            <li><a href="/admin">Job Management</a></li>
            <li className="active"><a href="/admin/app_track">Employee Tracking</a></li>
            <li><a href="#">Help Center</a></li>
          </ul>
        </nav>
        <button onClick={() => navigate("/")}>Logout</button>
      </div>

      <div className="main-content">
        <h1><FontAwesomeIcon icon={faUsers} className="title-icon" /> Employee Tracking</h1>
        <div className="employee-list">
          <h2>Employee Records</h2>
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
              {employees.length > 0 ? (
                employees.map((emp) => (
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
                      <button onClick={() => handleDeleteEmployee(emp.id)}>
                        <FontAwesomeIcon icon={faTrashAlt} className="delete-icon" />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6">No employee records available</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
      {selectedPdf && (
        <div className="pdf-sidebar">
          <button className="close-btn" onClick={() => setSelectedPdf(null)}>X</button>
          <iframe src={selectedPdf} title="Employee PDF" className="pdf-viewer" />
        </div>
      )}
    </div>
  );
};

export default EmpTrack;
