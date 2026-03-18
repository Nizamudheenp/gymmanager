import React from "react";
import { useNavigate } from "react-router-dom";
import "./Training.css";

import trainigbg_1 from "../../assets/240_F_269967154_79LtfDL0RXbErnMLucstEAF64B7e9i86.jpg";
import trainingbg_2 from "../../assets/240_F_538576949_2MaY4QZFTP4ChIuNBlbM97xzecLwS2Un.jpg";
import trainigbg_3 from "../../assets/240_F_230498348_TD6e54VQLY7fWbcvhGgiFaRk7XuDNqth.jpg";

function TrainingMenu() {
  const navigate = useNavigate();

  return (
    <div className="row mt-5">
      <div className="col-12 col-md-6 col-lg-4 mb-4">
        <div
          className="card p-3 shadow-sm training-card position-relative overflow-hidden"
          onClick={() => navigate("/user-dashboard/training/book")}
          style={{
            backgroundImage: `linear-gradient(to bottom, rgba(0, 0, 0, 0.3), rgba(0, 0, 0, 0.8)), url(${trainigbg_1})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            cursor: 'pointer'
          }}
        >
          <div className="card-content position-relative z-1 text-center w-100">
            <h4 className="text-uppercase fw-bold text-white mb-2" style={{ textShadow: "0 2px 4px rgba(0,0,0,0.8)" }}>Book Training</h4>
            <p className="text-light opacity-75 mb-0">Find and book training sessions with trainers.</p>
          </div>
        </div>
      </div>

      <div className="col-12 col-md-6 col-lg-4 mb-4">
        <div
          className="card p-3 shadow-sm training-card position-relative overflow-hidden"
          onClick={() => navigate("/user-dashboard/training/bookings")}
          style={{
            backgroundImage: `linear-gradient(to bottom, rgba(0, 0, 0, 0.3), rgba(0, 0, 0, 0.8)), url(${trainingbg_2})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            cursor: 'pointer'
          }}
        >
          <div className="card-content position-relative z-1 text-center w-100">
            <h4 className="text-uppercase fw-bold text-white mb-2" style={{ textShadow: "0 2px 4px rgba(0,0,0,0.8)" }}>My Bookings</h4>
            <p className="text-light opacity-75 mb-0">View and manage your booked training sessions.</p>
          </div>
        </div>
      </div>

      <div className="col-12 col-md-6 col-lg-4 mb-4">
        <div
          className="card p-3 shadow-sm training-card position-relative overflow-hidden"
          onClick={() => navigate("/user-dashboard/training/workouts")}
          style={{
            backgroundImage: `linear-gradient(to bottom, rgba(0, 0, 0, 0.3), rgba(0, 0, 0, 0.8)), url(${trainigbg_3})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            cursor: 'pointer'
          }}
        >
          <div className="card-content position-relative z-1 text-center w-100">
            <h4 className="text-uppercase fw-bold text-white mb-2" style={{ textShadow: "0 2px 4px rgba(0,0,0,0.8)" }}>My Workouts</h4>
            <p className="text-light opacity-75 mb-0">Engage with your trainer assigned workouts.</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default TrainingMenu;
