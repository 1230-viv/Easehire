import React from 'react';
import Navbar from '../components/navbar';
import '../styles/home.css';
import robotGif from '../assets/bot.gif';
import jobIcon from '../assets/run.png'; // Ensure the path is correct

const Home = () => {
  return (
    <div>
      <Navbar />
      <div className="home-container">
        <div className="text-container">
          <h1>EaseHire is an AI-powered recruitment platform</h1>
          <p>
            EaseHire streamlines hiring by analyzing resumes, generating ATS scores, 
            and automating candidate screening. Find the best talent faster and make 
            data-driven hiring decisions effortlessly.
          </p>
          <a href="/expjob" className="apply-button">
            <img src={jobIcon} alt="Apply Job" />
            Explore Job
          </a>
        </div>
        
       
        <img src={robotGif} alt="Animated Robot" className="robot-gif" />
      </div>
    </div>
  );
};

export default Home;