import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "../styles/ats.css";

const API_BASE_URL = process.env.REACT_APP_API_URL || "http://127.0.0.1:5000";

const Ats = () => {
  const navigate = useNavigate();
  const { employeeId } = useParams();
  const [atsScore, setAtsScore] = useState(null);
  const [jobId, setJobId] = useState(null); // Store Job ID
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchAtsScore = async () => {
    if (!employeeId) {
      setError("Employee ID is missing in the URL.");
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      console.log("Fetching ATS score for Employee ID:", employeeId);
      const response = await fetch(`${API_BASE_URL}/evaluate-resume/${employeeId}`);

      const data = await response.json();
      console.log("API Response:", data);

      if (response.ok && data.success) {
        setAtsScore(data.ats_score);
        setJobId(data.job_id); // Store job ID from API response
      } else {
        console.warn("ATS score not found, generating new score...");
        await generateAtsScore();
      }
    } catch (err) {
      console.error("Fetch Error:", err.message);
      setError("Failed to fetch ATS score.");
    } finally {
      setLoading(false);
    }
  };

  const generateAtsScore = async () => {
    setLoading(true);
    setError(null);

    try {
      console.log("Generating ATS score for Employee ID:", employeeId);

      // Fetch the resume data from the backend
      const resumeResponse = await fetch(`${API_BASE_URL}/get-resume/${employeeId}`);
      const resumeData = await resumeResponse.json();

      if (!resumeData.resume_pdf) {
        throw new Error("Resume PDF not found.");
      }

      const generateResponse = await fetch(`${API_BASE_URL}/generate-ats-score/${employeeId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ resume_pdf: resumeData.resume_pdf }),
      });

      const data = await generateResponse.json();
      console.log("ATS Score Generation Response:", data);

      if (generateResponse.ok && data.success) {
        setAtsScore(data.ats_score);
        setJobId(data.job_id); // Store job ID from generated score
      } else {
        throw new Error(data.message || "Failed to generate ATS score.");
      }
    } catch (err) {
      console.error("Generation Error:", err.message);
      setError("Error generating ATS score.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAtsScore();
  }, [employeeId]);

  const handleNext = () => {
    if (jobId) {
      navigate(`/mcq/${jobId}`); // Navigate to MCQ page with jobId
    } else {
      setError("Job ID is missing. Please try again.");
    }
  };

  return (
    <div className="ats-container">
      <div className="navbar">EaseHire</div>

      <div className="ats-card">
        {loading ? (
          <p>Loading ATS Score...</p>
        ) : error ? (
          <>
            <p className="error-message">{error}</p>
            <button className="retry-btn" onClick={fetchAtsScore}>Retry</button>
          </>
        ) : (
          <>
            <div className="ats-score" style={{ color: atsScore >= 70 ? "green" : "red" }}>
              <p>{atsScore !== null ? `${atsScore}% ATS Score Match` : "No score available."}</p>
            </div>
            <p className="ats-message">
              {atsScore !== null && atsScore >= 70
                ? "✅ You are eligible for the next round!"
                : "❌ Keep improving your resume."}
            </p>
          </>
        )}
        <button 
          className="ats-next-btn" 
          onClick={handleNext} 
          disabled={loading || !jobId}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default Ats;
