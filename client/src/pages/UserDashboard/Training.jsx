import React from "react";
import { Outlet } from "react-router-dom";
import "./Training.css";

function TrainingDashboard() {
  return (
    <div className="container mt-4 training-section">
      <Outlet />
    </div>
  );
}

export default TrainingDashboard;
