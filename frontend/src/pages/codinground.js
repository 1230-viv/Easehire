import React, { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import Editor from "@monaco-editor/react";
import "../styles/codinground.css";

const API_BASE_URL = process.env.REACT_APP_API_URL || "http://127.0.0.1:8000";

const CodingRound = () => {
  const { jobId } = useParams();
  const navigate = useNavigate();
  const editorRef = useRef(null);

  const [problem, setProblem] = useState(null);
  const [language, setLanguage] = useState("python");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [output, setOutput] = useState("");

  const defaultCode = {
    python: "",
    javascript: "",
    java: "",
    cpp: "",
  };

  const [code, setCode] = useState(defaultCode[language]);

  useEffect(() => {
    const fetchProblem = async () => {
      try {
        const employeeId = localStorage.getItem("employeeId");
        if (!employeeId) {
          setError("⚠️ Employee ID is missing.");
          setLoading(false);
          return;
        }

        const response = await axios.get(`${API_BASE_URL}/coding/generate-coding/${employeeId}/${jobId}`);
        setProblem(response.data.problem);
      } catch (err) {
        console.error("Error fetching problem:", err);
        setError("⚠️ Failed to load coding problem. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchProblem();
  }, [jobId]);

  const handleLanguageChange = (e) => {
    const newLang = e.target.value;
    setLanguage(newLang);
    setCode(defaultCode[newLang]);
  };

  const handleCodeChange = (newValue) => {
    setCode(newValue);
  };

  const handleEditorDidMount = (editor) => {
    editorRef.current = editor;
    setTimeout(() => editor.layout(), 300);
  };

  const handleRunCode = async () => {
    try {
      setOutput("⏳ Running your code...");

      const response = await axios.post(`${API_BASE_URL}/coding/execute-code`, {
        language,
        code,
      });

      setOutput(response.data.output || "⚠️ No output received.");
    } catch (err) {
      console.error("Execution Error:", err);
      setOutput(`❌ Execution failed: ${err.response?.data?.error || err.message}`);
    }
  };

  const handleSubmitCode = async () => {
    try {
      const employeeId = localStorage.getItem("employeeId");
      if (!employeeId) {
        alert("⚠️ Employee ID is missing.");
        return;
      }

      const response = await axios.post(`${API_BASE_URL}/coding/submit-code`, {
        employeeId,
        code,
        language,
      });

      if (response.data.status === "PASS") {
        setOutput("✅ Congratulations! You Passed the Coding Round.");
      } else {
        setOutput("❌ Sorry! Your Output Did Not Match the Expected Output.");
      }

      // Navigate to results/end page after submission
      setTimeout(() => {
        navigate("/coding/result", { state: { result: response.data.status } });
      }, 2000);

    } catch (err) {
      console.error("Submission Error:", err);
      setOutput(`❌ Submission failed: ${err.response?.data?.error || err.message}`);
    }
  };

  const handleReset = () => {
    setCode(defaultCode[language]);
    setOutput("");
  };

  if (loading) return <div className="loading">⏳ Loading Problem...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="coding-container">
      <div className="problem-container">
        <h3>{problem.title}</h3>
        <p>{problem.description}</p>

        <div className="problem-details">
          <strong>📥 Input Format:</strong>
          <p>{problem.input_format}</p>

          <strong>📤 Output Format:</strong>
          <p>{problem.output_format}</p>

          {problem.constraints && (
            <>
              <strong>⚠️ Constraints:</strong>
              <ul>
                {problem.constraints.map((constraint, index) => (
                  <li key={index}>{constraint}</li>
                ))}
              </ul>
            </>
          )}

          <strong>🔍 Example Test Cases:</strong>
          {problem.examples?.length > 0 ? (
            problem.examples.map((example, index) => (
              <div key={index} className="example-case">
                <pre>
                  <strong>Input:</strong> {example.input}
                  <br />
                  <strong>Output:</strong> {example.output}
                </pre>
              </div>
            ))
          ) : (
            <p>No test cases provided.</p>
          )}
        </div>
      </div>

      <div className="editor-container">
        <Editor
          height="300px"
          width="100%"
          language={language}
          value={code}
          onChange={handleCodeChange}
          theme="vs-dark"
          options={{ fontSize: 16 }}
          onMount={handleEditorDidMount}
        />

        <div className="controls">
          <select className="language-select" onChange={handleLanguageChange} value={language}>
            <option value="python">Python</option>
            <option value="javascript">JavaScript</option>
            <option value="java">Java</option>
            <option value="cpp">C++</option>
          </select>

          <button className="run-btn" onClick={handleRunCode}>▶️ Run Code</button>
          <button className="submit-btn" onClick={handleSubmitCode}>🚀 Submit Code</button>
          <button className="reset-btn" onClick={handleReset}>🔄 Reset</button>
        </div>

        {output && (
          <div className="output-container">
            <strong>📌 Output:</strong>
            <pre>{output}</pre>
          </div>
        )}
      </div>
    </div>
  );
};

export default CodingRound;
