import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./auth.css";
import { toast } from "react-toastify";
import logoimg from "../../assets/gyfit-logo.jpg";

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

  const [formErrors, setFormErrors] = useState({});

  const handleChange = (e) => {
    if (e.target.name === "certifications") {
      setFormData({ ...formData, certifications: e.target.files[0] });
    } else {
      setFormData({ ...formData, [e.target.name]: e.target.value });
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

    if (!formData.experience) {
      errors.experience = "Experience is required.";
    } else if (Number(formData.experience) <= 0) {
      errors.experience = "Experience must be a positive number.";
    }

    if (!formData.specialization.trim()) {
      errors.specialization = "Specialization is required.";
    }

    if (!formData.certifications) {
      errors.certifications = "Certification file is required.";
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

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
      toast.error(error.response?.data?.message || "Registration failed");
    }
  };

  return (
    <div className="register-layout">
      {/* Left image column */}
      <div className="register-left">
        <img src={logoimg} alt="Register" className="register-img" />
      </div>

      {/* Right form column */}
      <div className="register-right">
        <div className="trainer-register-box">
          <h2>New Trainer Registration</h2>
          <form onSubmit={handleSubmit} noValidate>
            <div className="form-row">
              {/* Username */}
              <div className="mb-3 col">
                <label className="form-label">Full Name</label>
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

              {/* Email */}
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
              {/* Password */}
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

              {/* Experience */}
              <div className="mb-3 col">
                <label className="form-label">Years of Experience</label>
                <input
                  type="number"
                  className={`form-control ${
                    formErrors.experience ? "input-error" : ""
                  }`}
                  name="experience"
                  value={formData.experience}
                  onChange={handleChange}
                  placeholder="Experience in years"
                />
                {formErrors.experience && (
                  <p className="field-error">{formErrors.experience}</p>
                )}
              </div>
            </div>

            <div className="form-row">
              <div className="mb-3 col">
                <label className="form-label">Specialization</label>
                <input
                  type="text"
                  className={`form-control ${
                    formErrors.specialization ? "input-error" : ""
                  }`}
                  name="specialization"
                  value={formData.specialization}
                  onChange={handleChange}
                  placeholder="Area of expertise"
                />
                {formErrors.specialization && (
                  <p className="field-error">{formErrors.specialization}</p>
                )}
              </div>

              <div className="mb-3 col">
                <label className="form-label">Upload Certification</label>
                <input
                  type="file"
                  className={`form-control ${
                    formErrors.certifications ? "input-error" : ""
                  }`}
                  name="certifications"
                  onChange={handleChange}
                />
                {formErrors.certifications && (
                  <p className="field-error">{formErrors.certifications}</p>
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

export default TrainerRegister;
