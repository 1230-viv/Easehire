import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faTrashAlt, faUsers } from "@fortawesome/free-solid-svg-icons"; 
import "../styles/emptrack.css";

const EmpTrack = () => {
  const [employees, setEmployees] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const storedEmployees = JSON.parse(localStorage.getItem("employees")) || [];
    setEmployees(storedEmployees);
  }, []);

  const handleDeleteEmployee = (id) => {
    const updatedEmployees = employees.filter((emp) => emp.id !== id);
    setEmployees(updatedEmployees);
    localStorage.setItem("employees", JSON.stringify(updatedEmployees));
  };

  return (
    <div className="emp-management-container">
      {/* Sidebar Navigation */}
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

      {/* Main Content */}
      <div className="main-content">
        <h1><FontAwesomeIcon icon={faUsers} className="title-icon" /> Employee Tracking</h1>

        {/* Employee List */}
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
                <th>Delete</th>
              </tr>
            </thead>
            <tbody>
              {employees.length > 0 ? (
                employees.map((emp) => (
                  <tr key={emp.id}>
                    <td>{emp.id}</td>
                    <td>{emp.name}</td>
                    <td>{emp.contact}</td>
                    <td>{emp.email}</td>
                    <td>
                      <a href={emp.pdf} target="_blank" rel="noopener noreferrer">
                        <FontAwesomeIcon icon={faEye} className="view-icon" />
                      </a>
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
    </div>
  );
};

export default EmpTrack;