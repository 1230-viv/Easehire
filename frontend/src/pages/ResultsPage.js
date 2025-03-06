import React from "react";
import { useNavigate } from "react-router-dom";
import "../styles/ResultPage.css"; // Import the separate CSS file
import Navbar from "../components/navbar1";

const ResultPage = () => {
  const navigate = useNavigate();

  return (
    <>
    <Navbar />
    <div className="result-container">
      <div className="result-box">
        <h1>Shortlisted Candidates Will Be Declared Soon</h1>
        <p>Stay tuned for further updates. We appreciate your patience.</p>
        <button onClick={() => navigate("/")} className="home-button">
          Back to Home
        </button>
      </div>
    </div>
    </>
  );
};

export default ResultPage;
