import React from "react";
import { useNavigate } from "react-router-dom";
import "../styles/ats.css"; // Make sure the CSS path is correct

const Ats = () => {
  const navigate = useNavigate();

  return (
    <div className="ats-container">
      {/* Navbar */}
      <div className="navbar">EaseHire</div>

      {/* Card Box */}
      <div className="ats-card">
        <div className="ats-score">
          <p>100% ATS Score Match</p>
        </div>
        <p className="ats-message">You are eligible for the next round</p>
        <button className="ats-next-btn" onClick={() => navigate("/")}>Next</button>
      </div>
    </div>
  );
};

export default Ats;