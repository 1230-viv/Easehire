import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/employee.css";

const AddEmployee = () => {
  const navigate = useNavigate();
  const [employee, setEmployee] = useState({
    name: "",
    phoneNumber: "",  // 🔹 Matches backend key "phone_number"
    email: "",
    resume: null,  // 🔹 Matches backend key "resume_pdf"
  });

  const [message, setMessage] = useState(""); // Success/Error messages
  const [loading, setLoading] = useState(false); // Loading state

  // Handle text input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setEmployee((prevEmployee) => ({
      ...prevEmployee,
      [name]: value,
    }));
  };
  

  // Handle file selection (PDF Upload)
  const handleFileChange = (e) => {
    if (e.target.files.length > 0) {
      setEmployee((prevEmployee) => ({
        ...prevEmployee,
        pdf_resume: e.target.files[0],
      }));
    }
  };
  

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");
  
    console.log("Employee Data Before Submit:", employee); // Debugging output
  
    if (!employee.name || !employee.number || !employee.email || !employee.pdf_resume) {
      setMessage("All fields are required.");
      setLoading(false);
      return;
    }
  
    const formData = new FormData();
    formData.append("name", employee.name);
    formData.append("number", employee.number);
    formData.append("email", employee.email);
    formData.append("pdf_resume", employee.pdf_resume);
  
    try {
      const response = await fetch("http://127.0.0.1:5000/add-employee", {
        method: "POST",
        body: formData,
      });
  
      const result = await response.json();
      if (response.ok) {
        setMessage("Employee added successfully!");
        setTimeout(() => navigate("/"), 2000);
      } else {
        setMessage(result.message || "Failed to add employee.");
      }
    } catch (error) {
      console.error("Error:", error);
      setMessage("Server error. Please try again later.");
    } finally {
      setLoading(false);
    }
  };
  
    

  return (
    <div className="form-container">
      <h2>Add Employee</h2>
      {message && <p className={`message ${message.startsWith("✅") ? "success" : "error"}`}>{message}</p>}

      <form onSubmit={handleSubmit}>
  <label>Name:</label>
  <input type="text" name="name" value={employee.name} onChange={handleChange} required />

  <label>Phone Number:</label>
  <input type="tel" name="number" value={employee.number} onChange={handleChange} required />

  <label>Email:</label>
  <input type="email" name="email" value={employee.email} onChange={handleChange} required />

  <label>Upload PDF:</label>
  <input type="file" accept="application/pdf" onChange={handleFileChange} required />

  <button type="submit" disabled={loading}>
    {loading ? "Submitting..." : "Submit"}
  </button>
</form>

    </div>
  );
};

export default AddEmployee;
