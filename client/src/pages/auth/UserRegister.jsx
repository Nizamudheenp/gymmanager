import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./auth.css";
import { toast } from "react-toastify";
import logoimg from "../../assets/gyfit-logo.png";

function UserRegister() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    fitnessData: { height: "", weight: "", exerciseFrequency: "" },
  });

  const [formErrors, setFormErrors] = useState({});

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

  const validateForm = () => {
    const errors = {};
    if (!formData.username.trim()) {
      errors.username = "Username is required.";
    } else if (formData.username.trim().length < 3) {
      errors.username = "Username must be at least 3 characters.";
    }

    if (!formData.email) {
      errors.email = "Email is required.";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = "Enter a valid email.";
    }

    if (!formData.password) {
      errors.password = "Password is required.";
    } else if (formData.password.length < 3) {
      errors.password = "Password must be at least 3 characters.";
    }

    if (!formData.fitnessData.height) {
      errors.height = "Height is required.";
    } else if (Number(formData.fitnessData.height) <= 0) {
      errors.height = "Height must be a positive number.";
    }

    if (!formData.fitnessData.weight) {
      errors.weight = "Weight is required.";
    } else if (Number(formData.fitnessData.weight) <= 0) {
      errors.weight = "Weight must be a positive number.";
    }

    if (!formData.fitnessData.exerciseFrequency) {
      errors.exerciseFrequency = "Select exercise frequency.";
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
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
      toast.error(error.response?.data?.message || "Registration failed");
    }
  };

  return (
    <div className="register-layout">
      <div className="register-left">
        <img src={logoimg} alt="Register" className="register-img" />
      </div>

      <div className="register-right">
        <div className="user-register-box">
          <h2>New User Registration</h2>
          <form onSubmit={handleSubmit} noValidate>
            <div className="form-row">
              <div className="mb-3 col">
                <label className="form-label">Username</label>
                <input
                  type="text"
                  className={`form-control ${
                    formErrors.username ? "input-error" : ""
                  }`}
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  placeholder="Enter your name"
                />
                {formErrors.username && (
                  <p className="field-error">{formErrors.username}</p>
                )}
              </div>

              <div className="mb-3 col">
                <label className="form-label">Email</label>
                <input
                  type="email"
                  className={`form-control ${
                    formErrors.email ? "input-error" : ""
                  }`}
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Enter your email"
                />
                {formErrors.email && (
                  <p className="field-error">{formErrors.email}</p>
                )}
              </div>
            </div>

            <div className="form-row">
              <div className="mb-3 col">
                <label className="form-label">Password</label>
                <input
                  type="password"
                  className={`form-control ${
                    formErrors.password ? "input-error" : ""
                  }`}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Enter password"
                />
                {formErrors.password && (
                  <p className="field-error">{formErrors.password}</p>
                )}
              </div>

              <div className="mb-3 col">
                <label className="form-label">Height (cm)</label>
                <input
                  type="number"
                  className={`form-control ${
                    formErrors.height ? "input-error" : ""
                  }`}
                  name="height"
                  value={formData.fitnessData.height}
                  onChange={handleChange}
                  placeholder="Height in cm"
                />
                {formErrors.height && (
                  <p className="field-error">{formErrors.height}</p>
                )}
              </div>
            </div>

            <div className="form-row">
              <div className="mb-3 col">
                <label className="form-label">Weight (kg)</label>
                <input
                  type="number"
                  className={`form-control ${
                    formErrors.weight ? "input-error" : ""
                  }`}
                  name="weight"
                  value={formData.fitnessData.weight}
                  onChange={handleChange}
                  placeholder="Weight in kg"
                />
                {formErrors.weight && (
                  <p className="field-error">{formErrors.weight}</p>
                )}
              </div>

              {/* Exercise Frequency */}
              <div className="mb-3 col">
                <label className="form-label">Exercise Frequency</label>
                <select
                  className={`form-control ${
                    formErrors.exerciseFrequency ? "input-error" : ""
                  } bg-dark text-light`}
                  name="exerciseFrequency"
                  value={formData.fitnessData.exerciseFrequency}
                  onChange={handleChange}
                >
                  <option value="">Select</option>
                  <option value="Rarely">Rarely</option>
                  <option value="1-2 times a week">1-2 times a week</option>
                  <option value="3-5 times a week">3-5 times a week</option>
                  <option value="Daily">Daily</option>
                </select>
                {formErrors.exerciseFrequency && (
                  <p className="field-error">{formErrors.exerciseFrequency}</p>
                )}
              </div>
            </div>

            <button type="submit" className="btn btn-primary w-100">
              Register
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default UserRegister;
