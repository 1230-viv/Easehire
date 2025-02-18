import React from "react";


const Navbar = () => {
  return (
    <div className="navbarcontainer">
      <div className="logo">
        <img src="assets/logo.png" alt="Logo" />
      </div>
      <ul className="nav-items">
        <a href="/"><li>Home</li></a>
        <li>About Us</li>
        <li>Our Team</li>
        <a href="/login"><li>Admin</li></a>
      </ul>
    </div>
  );
};

export default Navbar;