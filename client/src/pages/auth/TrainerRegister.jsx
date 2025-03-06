import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function TrainerRegister() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    experience: "",
    specialization: "",
    certifications: null,
  });

  const handleChange = (e) => {
    if (e.target.name === "certifications") {
      setFormData({ ...formData, certifications: e.target.files[0] });
    } else {
      setFormData({ ...formData, [e.target.name]: e.target.value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formDataToSend = new FormData();
    Object.keys(formData).forEach((key) => {
      formDataToSend.append(key, formData[key]);
    });

    try {
      const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/auth/trainerRegister`, formDataToSend, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      alert(response.data.message);
      localStorage.removeItem("token");
      localStorage.removeItem("role");
      navigate("/login");  
    } catch (error) {
      alert(error.response?.data?.message || "Registration failed");
    }
  };

  return (
    <div className="container mt-5">
      <h2 className="text-center">Trainer Registration</h2>
      <form onSubmit={handleSubmit} className="mt-4">
        <div className="mb-3">
          <label className="form-label">Full Name</label>
          <input type="text" className="form-control" name="username" value={formData.username} onChange={handleChange} required />
        </div>
        <div className="mb-3">
          <label className="form-label">Email</label>
          <input type="email" className="form-control" name="email" value={formData.email} onChange={handleChange} required />
        </div>
        <div className="mb-3">
          <label className="form-label">Password</label>
          <input type="password" className="form-control" name="password" value={formData.password} onChange={handleChange} required />
        </div>
        <div className="mb-3">
          <label className="form-label">Years of Experience</label>
          <input type="number" className="form-control" name="experience" value={formData.experience} onChange={handleChange} required />
        </div>
        <div className="mb-3">
          <label className="form-label">Specialization</label>
          <input type="text" className="form-control" name="specialization" value={formData.specialization} onChange={handleChange} required />
        </div>
        <div className="mb-3">
          <label className="form-label">Upload Certification</label>
          <input type="file" className="form-control" name="certifications" onChange={handleChange} required />
        </div>
        <button type="submit" className="btn btn-primary w-100">Register</button>
      </form>
    </div>
  );
}

export default TrainerRegister;
