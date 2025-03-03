import React from "react";
import "./navbar.css";
import logo from "../assets/logo.png"; 

const Navbar = () => {
  return (
    <nav className="navbar">
      <div className="logo">
        <img src={logo} alt="EaseHire Logo" />
        <a href="/"><span>EaseHire</span></a>
      </div>
    </nav>
  );
};

export default Navbar;