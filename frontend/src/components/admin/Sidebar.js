import React from "react";
import { NavLink, useNavigate } from "react-router-dom"; // ✅ Fix: useNavigate import kiya
import "./Sidebar.css";

const Sidebar = () => {
  const navigate = useNavigate(); // ✅ Fix: navigate define kiya

  return (
    <div className="sidebar">
      <div className="sidebar-logo">
        <h2>EaseHire</h2>
      </div>
      <nav>
        <ul>
          <li>
            <NavLink to="/AdminHome" className={({ isActive }) => (isActive ? "active" : "")}>
              🏠 Home
            </NavLink>
          </li>
          <li>
            <NavLink to="/job-management" className={({ isActive }) => (isActive ? "active" : "")}>
              📋 Job Management
            </NavLink>
          </li>
          <li>
            <NavLink to="/applicant-tracking" className={({ isActive }) => (isActive ? "active" : "")}>
              🔍 Applicant Tracking
            </NavLink>
          </li>
          <li>
            <NavLink to="/help" className={({ isActive }) => (isActive ? "active" : "")}>
              ❓ Help Center
            </NavLink>
          </li>
        </ul>
      </nav>

      {/* ✅ Fixed Logout Button */}
      <div className="logout">
        <button 
          className="logout-btn" 
          onClick={() => {
              localStorage.removeItem("token"); // ✅ Token remove karo
              navigate("/"); // ✅ Home pe redirect karo
          }}
        >
          🚪 Log Out
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
