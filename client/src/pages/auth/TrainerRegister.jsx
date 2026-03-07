import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import axios from "axios";
import "./auth.css";
import { toast } from "react-toastify";

function TrainerRegister() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
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

    if (formErrors[e.target.name]) {
      setFormErrors({ ...formErrors, [e.target.name]: "" });
    }
  };

  const validateForm = () => {
    const errors = {};
    if (!formData.username.trim()) {
      errors.username = "Full name is required.";
    }

    if (!formData.email) {
      errors.email = "Email is required.";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = "Enter a valid email.";
    }

    if (!formData.password) {
      errors.password = "Password is required.";
    } else if (formData.password.length < 6) {
      errors.password = "Password must be at least 6 characters.";
    }

    if (!formData.experience) {
      errors.experience = "Experience is required.";
    }

    if (!formData.specialization.trim()) {
      errors.specialization = "Specialization is required.";
    }

    if (!formData.certifications) {
      errors.certifications = "Certification is required.";
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
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
      toast.success("Trainer application submitted! Wait for admin approval.");
      localStorage.removeItem("token");
      localStorage.removeItem("role");
      navigate("/login");
    } catch (error) {
      toast.error(error.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="register-layout">
      <div className="login-background-overlay"></div>

      <motion.div
        className="back-to-home-btn"
        initial={{ x: -20, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        whileHover={{ x: -5 }}
        onClick={() => navigate("/")}
      >
        <i className="fas fa-chevron-left"></i>
        <span>Back to Home</span>
      </motion.div>

      <div className="register-right">
        <motion.div
          className="trainer-register-box"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="login-card-header">
            <h2>Trainer <span>Registration</span></h2>
            <p>Join our elite team of fitness experts</p>
          </div>

          <form onSubmit={handleSubmit} noValidate className="login-form">
            <div className="form-row">
              <div className="auth-form-group">
                <label>Full Name</label>
                <input
                  type="text"
                  className={formErrors.username ? "auth-input-error" : ""}
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  placeholder="full name"
                />
                {formErrors.username && <span className="auth-field-error">{formErrors.username}</span>}
              </div>

              <div className="auth-form-group">
                <label>Email</label>
                <input
                  type="email"
                  className={formErrors.email ? "auth-input-error" : ""}
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="example@mail.com"
                />
                {formErrors.email && <span className="auth-field-error">{formErrors.email}</span>}
              </div>
            </div>

            <div className="form-row">
              <div className="auth-form-group">
                <label>Password</label>
                <input
                  type="password"
                  className={formErrors.password ? "auth-input-error" : ""}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="your password"
                />
                {formErrors.password && <span className="auth-field-error">{formErrors.password}</span>}
              </div>

              <div className="auth-form-group">
                <label>Years of Experience</label>
                <input
                  type="number"
                  className={formErrors.experience ? "auth-input-error" : ""}
                  name="experience"
                  value={formData.experience}
                  onChange={handleChange}
                  placeholder="e.g. 5"
                />
                {formErrors.experience && <span className="auth-field-error">{formErrors.experience}</span>}
              </div>
            </div>

            <div className="form-row">
              <div className="auth-form-group">
                <label>Specialization</label>
                <input
                  type="text"
                  className={formErrors.specialization ? "auth-input-error" : ""}
                  name="specialization"
                  value={formData.specialization}
                  onChange={handleChange}
                  placeholder="e.g. Yoga, HIIT"
                />
                {formErrors.specialization && <span className="auth-field-error">{formErrors.specialization}</span>}
              </div>

              <div className="auth-form-group">
                <label>Upload Resume</label>
                <input
                  type="file"
                  className={formErrors.certifications ? "auth-input-error" : ""}
                  name="certifications"
                  onChange={handleChange}
                  accept=".pdf,.doc,.docx"
                />
                {formErrors.certifications && <span className="auth-field-error">{formErrors.certifications}</span>}
              </div>
            </div>

            <motion.button
              type="submit"
              className="auth-submit-btn"
              disabled={loading}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              {loading ? "Submitting Application..." : "Apply to Join"}
            </motion.button>

            <div className="auth-card-footer">
              <p>Back to <span onClick={() => navigate("/login")}>Login</span></p>
            </div>
          </form>
        </motion.div>
      </div>
    </div>
  );
}

export default TrainerRegister;
