import React, { useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import Editor from "@monaco-editor/react";
import "../styles/codinground.css";

const API_BASE_URL = process.env.REACT_APP_API_URL || "http://127.0.0.1:5000";

const CodingRound = () => {
  const { jobId } = useParams();
  const editorRef = useRef(null);

  const [problem, setProblem] = useState(null);
  const [language, setLanguage] = useState("python"); // Default language
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [output, setOutput] = useState(""); // Stores execution output

  const defaultCode = {
    python: "# Write your code here\n",
    javascript: "// Write your code here\n",
    java: "// Write your code here\n",
    cpp: "// Write your code here\n",
  };

  const [code, setCode] = useState(
    localStorage.getItem(`userCode-${language}`) || defaultCode[language]
  );

  useEffect(() => {
    const fetchProblem = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/generate-coding/${jobId}`);
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
    setCode(localStorage.getItem(`userCode-${newLang}`) || defaultCode[newLang]);
  };

  const handleCodeChange = (newValue) => {
    setCode(newValue);
    localStorage.setItem(`userCode-${language}`, newValue);
  };

  const handleEditorDidMount = (editor) => {
    editorRef.current = editor;
    setTimeout(() => editor.layout(), 300);
  };

  const handleSubmit = async () => {
    try {
      const employeeId = localStorage.getItem("employeeId");
      if (!employeeId) {
        alert("⚠️ Employee ID is missing.");
        return;
      }

      const response = await axios.post(`${API_BASE_URL}/execute-code`, {
        jobId,
        employeeId, // Make sure Employee ID is sent
        code,
        language,
      });

      setOutput(response.data.output || "⚠️ No output received.");
    } catch (err) {
      console.error("Execution Error:", err.message);
      setOutput("❌ Failed to execute code. Please check your syntax.");
    }
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

          <button className="submit-btn" onClick={handleSubmit}>
            🚀 Run Code
          </button>
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
