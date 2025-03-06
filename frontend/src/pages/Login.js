import { useState } from "react";
import { useNavigate } from "react-router-dom";
import '../styles/login.css';
import Navbar1 from "../components/navbar1";
import illustration from "../assets/login.png"; // ✅ Illustration image
import userIcon from "../assets/aa.png"; // ✅ Username icon
import passIcon from "../assets/ab.png"; // ✅ Password icon
import backIcon from "../assets/ac.png"; // ✅ Back button image

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleBack = () => {
    navigate(-1); // ✅ Go back to the previous page
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch("http://127.0.0.1:5000/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      const data = await res.json();

      if (res.ok && data.token) {
        localStorage.setItem("token", data.token); // Store token
        navigate("/admin"); // Redirect to Admin Page
      } else {
        alert("Invalid credentials");
      }
    } catch (error) {
      console.error("Login error:", error);
    }
  };

  return (
    <div>
      <Navbar1 />
   
    <div>
      <div className="login-container">
        
        {/* Back Button */}
        <div className="back-button" onClick={handleBack}>
          <img src={backIcon} alt="Back" />
        </div>

        {/* Left Section - Illustration */}
        <div className="left-section">
          <img src={illustration} alt="EaseHire AI Illustration" />
        </div>

        {/* Right Section - Login Box */}
        <form onSubmit={handleSubmit} className="login-box">
          <h2>Admin Login</h2>

          <div className="input-group">
            <img src={userIcon} alt="User Icon" className="input-icon" />
            <input
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>

          <div className="input-group">
            <img src={passIcon} alt="Password Icon" className="input-icon" />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button type="submit">Login</button>
        </form>
      </div>
    </div>
    </div>
  );
};

export default Login;