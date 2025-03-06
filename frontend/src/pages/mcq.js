import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import "../styles/mcq.css";
import Navbar from "../components/navbar1";

const API_BASE_URL = process.env.REACT_APP_API_URL || "http://127.0.0.1:5000";

const ExamPage = () => {
  const { jobId } = useParams();
  const navigate = useNavigate();
  const [questions, setQuestions] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!jobId) {
      setError("❌ Job ID is missing in the URL.");
      setLoading(false);
      return;
    }

    const fetchMCQs = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/generate-mcq/${jobId}`);
        setQuestions(response.data.mcqs || []);
        if (!response.data.mcqs?.length) {
          setError("⚠️ No MCQs found for this job.");
        }
      } catch (err) {
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
    return questions.reduce((score, q, index) => {
      return q.answer.trim().toLowerCase().charAt(0) === answers[index]?.trim().toLowerCase().charAt(0)
        ? score + 1
        : score;
    }, 0);
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

    setSubmitting(true);
    try {
      await axios.post(`${API_BASE_URL}/submit-mcq/${employeeId}/${jobId}`, { score });
      alert("✅ MCQ submitted successfully! Proceeding to the coding round...");
      navigate(`/coding/${employeeId}/${jobId}`);
    } catch (err) {
      alert("❌ Failed to submit MCQ. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <div className="loading">⏳ Loading MCQs...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="exam-container">
      <Navbar />
      <h2>MCQ Round</h2>
      <div className="content-wrapper">
        <div className="question-map">
          {questions.map((_, index) => (
            <button
              key={index}
              className={`question-number ${currentQuestion === index ? "active" : ""}`}
              onClick={() => setCurrentQuestion(index)}
            >
              {index + 1}
            </button>
          ))}
        </div>
        <div className="question-section">
          <div className="question-box">
            <h3>{currentQuestion + 1}. {questions[currentQuestion]?.question}</h3>
            <div className="options">
              {questions[currentQuestion]?.options.map((option, index) => (
                <label key={index} className="option-label">
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
            <button onClick={handleSubmit} disabled={!isAllAnswered() || submitting}>
              {submitting ? "Submitting..." : "✅ Submit"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExamPage;
