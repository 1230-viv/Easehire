import React from 'react';
import Navbar from '../components/navbar';
import '../styles/contactus.css';
import { FaUser, FaPhone, FaQuestionCircle } from 'react-icons/fa';
import contactImage from "../assets/con4.png"; // ✅ Add correct image path

const ContactUs = () => {
  return (
    <div> 
       <Navbar /> 
    <div className="contact-container">
      <h2 className="contact-title">Contact Us</h2>
      
      <div className="contact-box">
        {/* Left: Form Section */}
        <div className="form-section">
          <div className="input-box">
            <FaUser className="icon" />
            <input type="text" placeholder="Name" />
          </div>

          <div className="input-box">
            <FaPhone className="icon" />
            <input type="text" placeholder="Contact no" />
          </div>

          <div className="input-box">
            <FaQuestionCircle className="icon" />
            <input type="text" placeholder="Your Query" />
          </div>

          {/* Submit Button */}
          <button className="submit-btn">Submit</button>
        </div>

        {/* Right: Image Section */}
        <div className="image-section">
          <img src={contactImage} alt="Contact Us" />
        </div>
      </div>

      <p className="contact-footer">Our Team will contact you shortly</p>
    </div>
    </div>
  );
};

export default ContactUs;