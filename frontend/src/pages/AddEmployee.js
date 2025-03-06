import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "../styles/employee.css";

const AddEmployee = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const jobId = location.state?.jobId || localStorage.getItem("jobId") || null;  // ✅ Ensure correct jobId is used

  const [employee, setEmployee] = useState({
    name: "",
    phoneNumber: "",
    email: "",
    pdf_resume: null,
    job_id: jobId, // ✅ Use jobId from URL or localStorage
  });

  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  // ✅ Store jobId in localStorage when component mounts
  useEffect(() => {
    if (jobId) {
      localStorage.setItem("jobId", jobId);
    }
  }, [jobId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEmployee((prevEmployee) => ({
      ...prevEmployee,
      [name]: value,
    }));
  };

  const handleFileChange = (e) => {
    if (e.target.files.length > 0) {
      setEmployee((prevEmployee) => ({
        ...prevEmployee,
        pdf_resume: e.target.files[0],
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    console.log("🔹 jobId from state or localStorage:", jobId);
    console.log("🔹 Employee object before submission:", employee);

    if (!employee.name || !employee.phoneNumber || !employee.email || !employee.pdf_resume) {
      setMessage("❌ All fields are required.");
      setLoading(false);
      return;
    }

    const formData = new FormData();
    formData.append("name", employee.name);
    formData.append("phone_number", employee.phoneNumber);
    formData.append("email", employee.email);
    formData.append("pdf_resume", employee.pdf_resume);
    formData.append("job_id", employee.job_id);  // ✅ Double-checking job_id

    try {
      const response = await fetch("http://127.0.0.1:5000/add-employee", {
        method: "POST",
        body: formData,
      });

      const result = await response.json();
      console.log("🔹 API Response:", result);

      if (response.ok && result.employee_id) {
        setMessage("✅ Employee added successfully!");

        // ✅ Storing values properly
        localStorage.setItem("employeeId", result.employee_id);
        localStorage.setItem("jobId", jobId);  // ✅ Ensuring jobId is stored correctly

        navigate(`/ats/${result.employee_id}`);
      } else {
        setMessage(result.message || "❌ Failed to add employee.");
      }
    } catch (error) {
      console.error("❌ Server Error:", error);
      setMessage("❌ Server error. Please try again later.");
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
        <input type="tel" name="phoneNumber" value={employee.phoneNumber} onChange={handleChange} required />

        <label>Email:</label>
        <input type="email" name="email" value={employee.email} onChange={handleChange} required />

        <label>Upload Resume:</label>
        <input type="file" accept="application/pdf" onChange={handleFileChange} required />

        <button type="submit" disabled={loading}>
          {loading ? "Submitting..." : "Submit"}
        </button>
      </form>
    </div>
  );
};

export default AddEmployee;
