import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./auth.css";
import { toast } from "react-toastify";


function UserRegister() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    fitnessData: {
      height: "",
      weight: "",
      exerciseFrequency: "",
    },
  });

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (["height", "weight", "exerciseFrequency"].includes(name)) {
      setFormData({
        ...formData,
        fitnessData: { ...formData.fitnessData, [name]: value },
      });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/auth/userRegister`,
        formData
      );
      toast.success(response.data.message);
      localStorage.removeItem("token");
      localStorage.removeItem("role");
      navigate("/login");
    } catch (error) {
      toast.error(error.response.message);

    }
  };

  return (
    <div className="user-register-container p-3" style={{ background: "rgba(0, 0, 0, 0.8)" }}>
      <div className="user-register-box">
        <h2 style={{ color: '#ff8c00', fontWeight: 'bold', textAlign: 'center' }}>
          New User Registration
        </h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label">User Name</label>
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
          <h5>Fitness Details</h5>
          <div className="mb-3">
            <label className="form-label">Height (cm)</label>
            <input
              type="number"
              className="form-control"
              name="height"
              value={formData.fitnessData.height}
              onChange={handleChange}
              required
              placeholder="Your height in cm"
            />
          </div>
          <div className="mb-3">
            <label className="form-label">Weight (kg)</label>
            <input
              type="number"
              className="form-control"
              name="weight"
              value={formData.fitnessData.weight}
              onChange={handleChange}
              required
              placeholder="Your weight in kg"
            />
          </div>
          <div className="mb-3">
            <label className="form-label">Exercise Frequency</label>
            <select
              className="form-control bg-dark text-light"
              name="exerciseFrequency"
              value={formData.fitnessData.exerciseFrequency}
              onChange={handleChange}
              required
            >
              <option value="">Select</option>
              <option value="Rarely">Rarely</option>
              <option value="1-2 times a week">1-2 times a week</option>
              <option value="3-5 times a week">3-5 times a week</option>
              <option value="Daily">Daily</option>
            </select>
          </div>
          <button type="submit" className="btn btn-primary w-100">
            Register
          </button>
        </form>
      </div>
    </div>
  );
}

export default UserRegister;
