import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { loginUser } from "../../redux/slices/AuthSlice";
import "./auth.css"; // Import the CSS file

function Login() {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [unverifiedError, setUnverifiedError] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error, role, token, verified } = useSelector((state) => state.auth);

  useEffect(() => {
    if (token && role) {
      if (role === "user") navigate("/user-dashboard");
      if (role === "trainer") {
        if (!verified) {
          setUnverifiedError("Your account is not verified yet. Please wait for admin approval.");
        } else {
          navigate("/trainer-dashboard");
        }
      }
      if (role === "admin") navigate("/admin-dashboard");
    }
  }, [role, token, verified, navigate]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    dispatch(loginUser(formData));
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <h2>Login</h2>

        {error && <p className="error-message">{error}</p>}
        {unverifiedError && <p className="error-message">{unverifiedError}</p>}

        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label">Email</label>
            <input type="email" className="form-control" placeholder="enter your email" name="email" value={formData.email} onChange={handleChange} required />
          </div>
          <div className="mb-3">
            <label className="form-label">Password</label>
            <input type="password" className="form-control" placeholder="enter your password" name="password" value={formData.password} onChange={handleChange} required />
          </div>
          <button type="submit" className="btn btn-primary w-100" disabled={loading}>
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default Login;
