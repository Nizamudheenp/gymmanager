import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { loginUser, clearError } from "../../redux/slices/AuthSlice";
import "./auth.css";
import { toast } from "react-toastify";

function Login() {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [formErrors, setFormErrors] = useState({});
  const [unverifiedError, setUnverifiedError] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error, role, token, verified } = useSelector(
    (state) => state.auth
  );

  useEffect(() => {
    dispatch(clearError());
    setUnverifiedError("");
    setFormErrors({});
  }, [formData.email, formData.password, dispatch]);

  useEffect(() => {
    if (token && role) {
      if (role === "user") navigate("/user-dashboard");
      if (role === "trainer") {
        if (!verified) {
          return setUnverifiedError(
            "Your account is not verified yet. Please wait for admin approval."
          );
        } else {
          navigate("/trainer-dashboard");
        }
      }
      if (role === "admin") navigate("/admin-dashboard");
      toast.success("Welcome back to GYFIT!");
    }
  }, [role, token, verified, navigate]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (formErrors[e.target.name]) {
      setFormErrors({ ...formErrors, [e.target.name]: "" });
    }
  };

  const validateForm = () => {
    const errors = {};
    if (!formData.email) {
      errors.email = "Email is required.";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = "Enter a valid email.";
    }

    if (!formData.password) {
      errors.password = "Password is required.";
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    dispatch(loginUser(formData));
  };

  return (
    <div className="login-page-container">
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

      <main className="login-main-content">
        <motion.div
          className="login-glass-card"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        >
          <div className="login-card-header">
            <h2>Welcome <span>Back</span></h2>
            <p>Continue your transformation journey</p>
          </div>

          <form onSubmit={handleSubmit} noValidate className="login-form">
            <AnimatePresence mode='wait'>
              {(error?.message || unverifiedError) && (
                <motion.div
                  className="auth-error-box"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                >
                  <p>{error?.message || unverifiedError}</p>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="auth-form-group">
              <label>Email Address</label>
              <input
                type="email"
                className={formErrors.email ? "auth-input-error" : ""}
                placeholder="example@mail.com"
                name="email"
                value={formData.email}
                onChange={handleChange}
              />
              {formErrors.email && <span className="auth-field-error">{formErrors.email}</span>}
            </div>

            <div className="auth-form-group">
              <label>Password</label>
              <input
                type="password"
                className={formErrors.password ? "auth-input-error" : ""}
                placeholder="your password"
                name="password"
                value={formData.password}
                onChange={handleChange}
              />
              {formErrors.password && <span className="auth-field-error">{formErrors.password}</span>}
            </div>

            <motion.button
              type="submit"
              className="auth-submit-btn"
              disabled={loading}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              {loading ? "Authenticating..." : "Login to Profile"}
            </motion.button>

            <div className="auth-card-footer">
              <p>Don't have an account? <span onClick={() => navigate("/what-brings-you-here")}>Get Started</span></p>
            </div>
          </form>
        </motion.div>
      </main>
    </div>
  );
}

export default Login;
