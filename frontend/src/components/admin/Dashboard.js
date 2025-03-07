import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faCloudDownloadAlt, faPlusCircle, faPencilAlt, faTrash } from "@fortawesome/free-solid-svg-icons";
import "./Dashboard.css";
import Headertittl from "../../components/admin/Header.js";

const Dashboard = () => {
  const navigate = useNavigate(); 
  const [employees, setEmployees] = useState([]);

  useEffect(() => {
    fetch("http://localhost:5000/employees")
      .then((response) => response.json())
      .then((data) => setEmployees(data))
      .catch((error) => console.error("Error fetching employees:", error));
  }, []);

  const handleDownload = (base64, name) => {
    const link = document.createElement("a");
    link.href = `data:application/pdf;base64,${base64}`;
    link.download = `${name}_Resume.pdf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="dashboard-container">
      <Headertittl title="Dash Board" userName="Addya"></Headertittl>

      <section className="content">
        <div className="top-section">
          <div className="recent-candidates">
            <h2>Recently Applied Candidates</h2>
            <table>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Job Role</th>
                  <th>ATS Score</th>
                </tr>
              </thead>
              <tbody>   
                {employees.slice(0, 3).map((emp) => (
                  <tr key={emp.id}>
                    <td>{emp.name}</td> 
                    <td>{emp.job_title}</td>
                    <td> {emp.ats_score}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="job-management">
      <h2>Job Management</h2>
      <div className="button-container"> 
      <button className="btn btn-primary" onClick={() => navigate("/job-management")}>
  <FontAwesomeIcon icon={faPlusCircle} /> Post Job
</button>
<button className="btn btn-warning" onClick={() => navigate("/job-management")}>
  <FontAwesomeIcon icon={faPencilAlt} /> Edit Job
</button>
<button className="btn btn-danger" onClick={() => navigate("/ManageJobsPage")}>
  <FontAwesomeIcon icon={faTrash} /> Delete Job
</button>

      </div>
    </div>
        </div>

        <div className="candidates-resume">
          <h2>Candidates Resume</h2>
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>ATS Score</th>
                <th>View</th>
                <th>Download</th>
              </tr>
            </thead>
            <tbody>
              {employees.map((emp) => (
                <tr key={emp.id}>
                  <td>{emp.name}</td>
                  <td>{emp.ats_score}%</td>
                  <td>
                    <a href={`data:application/pdf;base64,${emp.pdf_resume}`} target="_blank" rel="noopener noreferrer">
                      <FontAwesomeIcon icon={faEye} />
                    </a>
                  </td>
                  <td>
                    <button onClick={() => handleDownload(emp.pdf_resume, emp.name)}>
                      <FontAwesomeIcon icon={faCloudDownloadAlt} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
};

export default Dashboard;