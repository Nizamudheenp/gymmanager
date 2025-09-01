import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { loginUser, clearError } from "../../redux/slices/AuthSlice";
import "./auth.css";
import { toast } from "react-toastify";
import logoimg from "../../assets/gyfit-logo.png";

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
      toast.success("Login Successful!");
    }
  }, [role, token, verified, navigate]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
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
    } else if (formData.password.length < 3) {
      errors.password = "Password must be at least 3 characters long.";
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
    <div className="login-layout">
{/* left column */}
      <div className="login-left">
        <img src={logoimg} alt="Login" className="login-img" />
      </div>

{/* Right column */}
      <div className="login-right">
        <div className="login-box m-3">
          <h2>Login</h2>

          {error?.message && <p className="error-message">{error.message}</p>}
          {unverifiedError && (
            <p className="error-message">{unverifiedError}</p>
          )}

          <form onSubmit={handleSubmit} noValidate>
            <div className="mb-3">
              <label className="form-label">Email</label>
              <input
                type="email"
                className={`form-control ${
                  formErrors.email ? "input-error" : ""
                }`}
                placeholder="enter your email"
                name="email"
                value={formData.email}
                onChange={handleChange}
              />
              {formErrors.email && (
                <p className="field-error">{formErrors.email}</p>
              )}
            </div>

            <div className="mb-3">
              <label className="form-label">Password</label>
              <input
                type="password"
                className={`form-control ${
                  formErrors.password ? "input-error" : ""
                }`}
                placeholder="enter your password"
                name="password"
                value={formData.password}
                onChange={handleChange}
              />
              {formErrors.password && (
                <p className="field-error">{formErrors.password}</p>
              )}
            </div>

            <button
              type="submit"
              className="btn btn-primary w-100"
              disabled={loading}
            >
              {loading ? "Logging in..." : "Login"}
            </button>

            <p className="mt-3 text-center">
              Don't have an account?
              <span
                style={{
                  color: "#007bff",
                  cursor: "pointer",
                  textDecoration: "underline",
                  marginLeft: "5px",
                }}
                onClick={() => navigate("/what-brings-you-here")}
              >
                Register
              </span>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Login;
