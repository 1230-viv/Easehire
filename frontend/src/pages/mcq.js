import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

const API_BASE_URL = process.env.REACT_APP_API_URL || "http://127.0.0.1:5000";

const ExamPage = () => {
  const { jobId } = useParams();
  const navigate = useNavigate();

  const [questions, setQuestions] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!jobId) {
      setError("❌ Job ID is missing in the URL.");
      setLoading(false);
      return;
    }

    const fetchMCQs = async () => {
      try {
        console.log(`Fetching MCQs for Job ID: ${jobId}`);
        const response = await axios.get(`${API_BASE_URL}/generate-mcq/${jobId}`);

        if (response.data.mcqs?.length > 0) {
          setQuestions(response.data.mcqs);
        } else {
          setError("⚠️ No MCQs found for this job.");
        }
      } catch (err) {
        console.error("MCQ Fetch Error:", err);
        setError("❌ Failed to load MCQs. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchMCQs();
  }, [jobId]);

  const handleOptionSelect = (option) => {
    setAnswers((prev) => ({ ...prev, [currentQuestion]: option }));
  };

  const isAllAnswered = () => questions.length > 0 && Object.keys(answers).length === questions.length;

  const calculateScore = () => {
    let score = 0;
    questions.forEach((q, index) => {
      const selected = answers[index]?.trim().toLowerCase();
      const correct = q.answer.trim().toLowerCase();
  
      // ✅ Fix: Match by first character (A, B, C, D)
      if (selected.charAt(0) === correct.charAt(0)) {
        score += 1;
      }
    });
    return score;
  };
  

  const handleSubmit = async () => {
    if (!isAllAnswered()) {
      alert("⚠️ Please answer all questions before submitting.");
      return;
    }

    const score = calculateScore();

    const employeeId = localStorage.getItem("employeeId");
    if (!employeeId) {
      alert("⚠️ Employee ID is missing.");
      return;
    }

    try {
      console.log(`📤 Submitting Score: ${score} for Employee ID: ${employeeId}`);

      const response = await axios.post(`${API_BASE_URL}/submit-mcq/${employeeId}`, { score });

      console.log("🔹 Submission Response:", response.data);
      alert("✅ MCQ submitted successfully!");
      navigate(`/results/${employeeId}`);
    } catch (err) {
      console.error("❌ Submission Error:", err);
      alert("❌ Failed to submit MCQ. Please try again.");
    }
  };

  if (loading) return <div className="loading">⏳ Loading MCQs...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="exam-container">
      <h2>MCQ Exam</h2>

      {questions.length > 0 ? (
        <>
          <div className="question-box">
            <h3>
              {currentQuestion + 1}. {questions[currentQuestion]?.question}
            </h3>
            <div className="options">
              {questions[currentQuestion]?.options.map((option, index) => (
                <label key={index}>
                  <input
                    type="radio"
                    name={`question-${currentQuestion}`}
                    value={option}
                    checked={answers[currentQuestion] === option}
                    onChange={() => handleOptionSelect(option)}
                  />
                  {option}
                </label>
              ))}
            </div>
          </div>

          <div className="nav-buttons">
            <button
              onClick={() => setCurrentQuestion((prev) => Math.max(prev - 1, 0))}
              disabled={currentQuestion === 0}
            >
              ⬅️ Prev
            </button>
            <button
              onClick={() => setCurrentQuestion((prev) => Math.min(prev + 1, questions.length - 1))}
              disabled={currentQuestion === questions.length - 1}
            >
              Next ➡️
            </button>
            <button onClick={handleSubmit} disabled={!isAllAnswered()}>
              ✅ Submit
            </button>
          </div>
        </>
      ) : (
        <p>⚠️ No MCQs available for this job.</p>
      )}
    </div>
  );
};

export default ExamPage;
