import React from "react";
import "./navbar.css";
import logo from "../assets/logo.png"; // Go one level up

const Navbar = () => {
  return (
    <nav className="navbar">
      <div className="logo">
        <img src={logo} alt="EaseHire Logo" />
        <span>EaseHire</span>
      </div>
      <ul className="nav-links">
        <li><a href="/">Home</a></li>
        <li><a href="/about">About us</a></li>
        <li><a href="/contact">Contact</a></li>
        <li><a href="/login">Admin</a></li>
      </ul>
    </nav>
  );
};

export default Navbar;