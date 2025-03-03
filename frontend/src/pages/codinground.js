import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import Editor from "@monaco-editor/react";
import '../styles/codinground.css';

const API_BASE_URL = process.env.REACT_APP_API_URL || "http://127.0.0.1:5000";

const CodingRound = () => {
  const { jobId } = useParams();
  const navigate = useNavigate();

  const [problem, setProblem] = useState(null);
  const [code, setCode] = useState("// Write your code here\n");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchProblem = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/coding-problem/${jobId}`);
        setProblem(response.data);
      } catch (err) {
        setError("Failed to load coding problem. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchProblem();
  }, [jobId]);

  const handleSubmit = async () => {
    try {
      const employeeId = localStorage.getItem("employeeId");
      if (!employeeId) {
        alert("Employee ID is missing.");
        return;
      }

      const response = await axios.post(`${API_BASE_URL}/submit-code/${employeeId}`, {
        jobId,
        code,
      });

      alert("Code submitted successfully!");
      navigate(`/results/${employeeId}`);
    } catch (err) {
      console.error("Submission Error:", err.message);
      alert("Failed to submit code.");
    }
  };

  if (loading) return <div>⏳ Loading Problem...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="coding-container">
      <h2>Coding Round</h2>
      {problem ? (
        <>
          <div className="problem-statement">
            <h3>{problem.title}</h3>
            <p>{problem.description}</p>
          </div>
          <Editor
            height="400px"
            defaultLanguage="javascript"
            value={code}
            onChange={(newValue) => setCode(newValue)}
          />
          <button onClick={handleSubmit}>Submit Code</button>
        </>
      ) : (
        <p>No coding problem available.</p>
      )}
    </div>
  );
};

export default CodingRound;
