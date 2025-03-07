import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser, faEnvelope, faPhone } from "@fortawesome/free-solid-svg-icons";
import Sidebar from "../../components/admin/Sidebar";

import "../../styles/result.css"; // Ensure the CSS file is linked correctly

const Result = () => {
const { id: employeeId } = useParams(); 
  const [candidate, setCandidate] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Fetching the specific employee data from the backend
    const fetchEmployeeData = async () => {
      if (!employeeId) {
        console.error("Employee ID is undefined.");
        return;
      }

      try {
        const response = await fetch(`http://127.0.0.1:5000/employee/${employeeId}`, {
          method: 'GET',  // Explicitly set the GET method
        });

        if (!response.ok) {
          throw new Error(`Server responded with status ${response.status}`);
        }

        const data = await response.json();
        console.log("Employee Data:", data);  // Log the response
        setCandidate(data);  // Set the fetched data
      } catch (error) {
        console.error("Error fetching employee data:", error);
        setError(error.message);  // Optionally display the error message
      }
    };

    fetchEmployeeData();
  }, [employeeId]);  // Rerun if employeeId changes

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!candidate) {
    return <div>Loading...</div>; // Show a loading indicator while data is being fetched
  }

  // Check for null or undefined properties in candidate object
  const getSafeValue = (value, defaultValue = "Not Available") => {
    return value === null || value === undefined ? "null" : value;
  };

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <Sidebar />

      <div className="result-container">
        {/* Candidate Details */}
        <div className="section basic-info">
          <h2>Candidate Details</h2>
          <div className="info-row">
            <div className="info-item">
              <FontAwesomeIcon icon={faUser} className="icon" />
              <span>{getSafeValue(candidate.name)}</span>
            </div>
            <div className="info-item">
              <FontAwesomeIcon icon={faPhone} className="icon" />
              <span>{getSafeValue(candidate.phone_number)}</span>
            </div>
            <div className="info-item">
              <FontAwesomeIcon icon={faEnvelope} className="icon" />
              <span>{getSafeValue(candidate.email)}</span>
            </div>
          </div>
        </div>

        {/* ATS & MCQ Scores */}
        <div className="section scores">
          <h2>Scores</h2>
          <div className="score-container">
            <div className="score-box">
              <h3>ATS Score</h3>
              <p>{getSafeValue(candidate.ats_score) + "%"}</p>
            </div>
            <div className="score-box">
              <h3>MCQ Score</h3>
              <p>{getSafeValue(candidate.mcq_score, "Not Available") + "/10"}</p>
            </div>
          </div>
        </div>

        {/* Problem Statement & Code */}
        <div className="section coding">
          <h2>Problem Statement</h2>
          <p className="problem-statement">{getSafeValue(candidate.problem_statement)}</p>

          <h2>Submitted Code</h2>
          <pre className="code-block">
            {getSafeValue(candidate.code)}
          </pre>

          <h2>Code Execution Result</h2>
          <pre className="code-result">
            {getSafeValue(candidate.code_result)}
          </pre>
        </div>
      </div>
    </div>
  );
};

export default Result;
