import React from "react";
import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";

const ProtectedRoute = ({ role, children }) => {
  const { token, role: userRole,verified } = useSelector((state) => state.auth);

  if (!token || userRole !== role) {
    return <Navigate to="/login" />;
  }
  if (role === "trainer" && !verified) {
    return <Navigate to="/login" />;
  }

  return children;
};

export default ProtectedRoute;
