import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { loginSuccess, logout } from "../redux/slices/AuthSlice";

const SessionManager = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");
    const verified = localStorage.getItem("verified") === "true";

    if (token && role) {
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        const expiryTime = payload.exp * 1000;
        const currentTime = Date.now();
        const timeLeft = expiryTime - currentTime;

        if (timeLeft <= 0) {
          dispatch(logout());
          toast.error("Session expired. Please login again.");
          navigate("/login");
        } else {
          dispatch(loginSuccess({ token, role, verified }));

          const timer = setTimeout(() => {
            dispatch(logout());
            toast.error("Session expired. Please login again.");
            navigate("/login");
          }, timeLeft);

          return () => clearTimeout(timer);
        }
      } catch (error) {
        dispatch(logout());
        navigate("/login");
      }
    }
  }, [dispatch, navigate]);

  return null;
};

export default SessionManager;
