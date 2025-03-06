import React from 'react';
import Navbar from '../components/navbar';
import '../styles/aboutus.css';
import robotGif from '../assets/bott.gif';

const AboutUs = () => {
  return (
    <div>
      <Navbar />
      <div className="about-container">
        <div className="about-text">
          <h2>About Us</h2>
          <h3>Revolutionizing Hiring with AI</h3>
          <p>
            At EaseHire, we are redefining the recruitment process with AI-driven automation. 
            Our platform streamlines resume screening, generates ATS scores, and enables 
            recruiters to make data-driven hiring decisions effortlessly.
          </p>
          <p>
            With advanced AI models, we analyze candidate profiles, match them with job roles, 
            and ensure an unbiased, efficient, and seamless hiring experience. From automated 
            shortlisting to proctored assessments, EaseHire empowers recruiters to hire smarter 
            and faster.
          </p>
        </div>
        <img src={robotGif} alt="Animated Robot" className="robot-gif" />
      </div>
    </div>
  );
};

export default AboutUs;