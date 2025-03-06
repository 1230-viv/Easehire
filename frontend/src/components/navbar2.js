import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import { Briefcase, Users, HelpCircle, LogOut } from "lucide-react";
import "./navbar2.css"; // Importing the CSS file
import easehireLogo from "../assets/logo.png"; // Importing the logo

const Navbar2 = () => {
  const [active, setActive] = useState("Job Management");
  const navigate = useNavigate(); // Initialize navigate function

  const menuItems = [
    { name: "Job Management", icon: <Briefcase size={20} />, link: "/admin" },
    { name: "Applicant Tracking", icon: <Users size={20} />, link: "/admin/app_track" },
    { name: "Help Center", icon: <HelpCircle size={20} />, link: "#" },
  ];

  const handleLogout = () => {
    localStorage.removeItem("token"); // Remove authentication token
    navigate("/"); // Redirect to homepage
  };

  return (
    <div className="sidebar">
      {/* Brand Logo */}
      <div className="logo-container">
        <img src={easehireLogo} alt="EaseHire Logo" className="logo" />
        <span className="brand-name">EaseHire</span>
      </div>

      {/* Menu Items */}
      <nav className="menu">
        {menuItems.map((item) => (
          <a
            key={item.name}
            href={item.link}
            onClick={() => setActive(item.name)}
            className={`menu-item ${active === item.name ? "active" : ""}`} // Fixed template literal syntax
          >
            {item.icon} <span>{item.name}</span>
          </a>
        ))}
      </nav>

      {/* Logout Button */}
      <button className="logout" onClick={handleLogout}>
        <LogOut size={20} /> <span>Log Out</span>
      </button>
    </div>
  );
};

export default Navbar2;
