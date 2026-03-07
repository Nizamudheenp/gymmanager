import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";
import "./auth.css";
import { toast } from "react-toastify";

function UserRegister() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
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

    if (formErrors[name] || formErrors["height"] || formErrors["weight"] || formErrors["exerciseFrequency"]) {
      setFormErrors({ ...formErrors, [name]: "" });
    }
  };

  const validateForm = () => {
    const errors = {};
    if (!formData.username.trim()) {
      errors.username = "Username is required.";
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

    if (!formData.fitnessData.height) {
      errors.height = "Height is required.";
    }

    if (!formData.fitnessData.weight) {
      errors.weight = "Weight is required.";
    }

    if (!formData.fitnessData.exerciseFrequency) {
      errors.exerciseFrequency = "Select frequency.";
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/auth/userRegister`,
        formData
      );
      toast.success("Account created! Welcome to GYFIT.");
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
          className="user-register-box"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="login-card-header">
            <h2>User <span>Registration</span></h2>
            <p>Start your transformation today</p>
          </div>

          <form onSubmit={handleSubmit} noValidate className="login-form">
            <div className="form-row">
              <div className="auth-form-group">
                <label>Username</label>
                <input
                  type="text"
                  className={formErrors.username ? "auth-input-error" : ""}
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  placeholder="your name"
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
                <label>Height (cm)</label>
                <input
                  type="number"
                  className={formErrors.height ? "auth-input-error" : ""}
                  name="height"
                  value={formData.fitnessData.height}
                  onChange={handleChange}
                  placeholder="e.g. 175"
                />
                {formErrors.height && <span className="auth-field-error">{formErrors.height}</span>}
              </div>
            </div>

            <div className="form-row">
              <div className="auth-form-group">
                <label>Weight (kg)</label>
                <input
                  type="number"
                  className={formErrors.weight ? "auth-input-error" : ""}
                  name="weight"
                  value={formData.fitnessData.weight}
                  onChange={handleChange}
                  placeholder="e.g. 70"
                />
                {formErrors.weight && <span className="auth-field-error">{formErrors.weight}</span>}
              </div>

              <div className="auth-form-group">
                <label>Exercise Frequency</label>
                <select
                  className={formErrors.exerciseFrequency ? "auth-input-error" : ""}
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
                  <span className="auth-field-error">{formErrors.exerciseFrequency}</span>
                )}
              </div>
            </div>

            <motion.button
              type="submit"
              className="auth-submit-btn"
              disabled={loading}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              {loading ? "Creating Account..." : "Complete Registration"}
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

export default UserRegister;
