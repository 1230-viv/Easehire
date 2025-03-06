import React from "react";
import "bootstrap-icons/font/bootstrap-icons.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUserCircle } from "@fortawesome/free-solid-svg-icons";
import "./header.css"; // Ensure proper styling is applied

const Headertittl = ({ title, userName }) => {
  return (
    <header className="header">
      <div className="header-left">
        <h1 className="page-title">{title}</h1>
      </div>
      <div className="header-center">
        <select className="job-filter">
          <option value="">Filter Jobs</option>
          <option value="fulltime">Full Time</option>
          <option value="parttime">Part Time</option>
          <option value="contract">Contract</option>
        </select>
      </div>
      <div className="header-right">
        <div className="user-profile">
                  <span className="user-name">{userName}</span>
                  <FontAwesomeIcon icon={faUserCircle} className="user-icon" />
                </div>
      </div>
    </header>
  );
};

export default Headertittl;