import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./auth.css"; 
import { toast } from "react-toastify";


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
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/auth/trainerRegister`,
        formDataToSend,
        { headers: { "Content-Type": "multipart/form-data" } }
      );
      toast.success(response.data.message);
      localStorage.removeItem("token");
      localStorage.removeItem("role");
      navigate("/login");
    } catch (error) {
      toast.error(error.response.message);    }
  };

  return (
    <div className="trainer-register-container p-3">
      <div className="trainer-register-box">
        <h2>Trainer Registration</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label">Full Name</label>
            <input
              type="text"
              className="form-control"
              name="username"
              value={formData.username}
              onChange={handleChange}
              required
              placeholder="Enter your name"
            />
          </div>
          <div className="mb-3">
            <label className="form-label">Email</label>
            <input
              type="email"
              className="form-control"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              placeholder="Enter your email"
            />
          </div>
          <div className="mb-3">
            <label className="form-label">Password</label>
            <input
              type="password"
              className="form-control"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              placeholder="Enter a strong password"
            />
          </div>
          <div className="mb-3">
            <label className="form-label">Years of Experience</label>
            <input
              type="number"
              className="form-control"
              name="experience"
              value={formData.experience}
              onChange={handleChange}
              required
              placeholder="Your experience in years"
            />
          </div>
          <div className="mb-3">
            <label className="form-label">Specialization</label>
            <input
              type="text"
              className="form-control"
              name="specialization"
              value={formData.specialization}
              onChange={handleChange}
              required
              placeholder="Your area of expertise"
            />
          </div>
          <div className="mb-3">
            <label className="form-label">Upload Certification</label>
            <input
              type="file"
              className="form-control"
              name="certifications"
              onChange={handleChange}
              required
            />
          </div>
          <button type="submit" className="btn btn-primary w-100">
            Register
          </button>
        </form>
      </div>
    </div>
  );
}

export default TrainerRegister;
