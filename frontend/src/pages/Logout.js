import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Logout = () => {
  const navigate = useNavigate();

  useEffect(() => {
    console.log("Logging out..."); // Debugging ke liye
    localStorage.removeItem("token"); // Token delete karo
    navigate("/"); // Home pe redirect karo
  }, [navigate]);

  return null; // UI dikhane ki zaroorat nahi
};

export default Logout;
