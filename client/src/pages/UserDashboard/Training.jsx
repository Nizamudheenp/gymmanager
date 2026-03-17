import React, { useState } from "react";
import BookTraining from "./BookTraining";
import MyBookings from "./MyBookings";
import "./Training.css"
import UserWorkouts from "./Workouts";

import trainigbg_1 from "../../assets/240_F_269967154_79LtfDL0RXbErnMLucstEAF64B7e9i86.jpg"
import trainingbg_2 from "../../assets/240_F_538576949_2MaY4QZFTP4ChIuNBlbM97xzecLwS2Un.jpg"
import trainigbg_3 from "../../assets/240_F_230498348_TD6e54VQLY7fWbcvhGgiFaRk7XuDNqth.jpg"

function TrainingDashboard() {
  const [selectedWidget, setSelectedWidget] = useState(null);

  return (
    <div className="container mt-4 training-section">
      {/* Training Widgets */}
      {!selectedWidget && (
        <div className="row mt-4">
          <div className="col-12 col-md-6 col-lg-4 mb-4">
            <div className="card p-3 shadow-sm training-card position-relative overflow-hidden" onClick={() => setSelectedWidget("book")} 
              style={{ 
                backgroundImage: `linear-gradient(to bottom, rgba(0, 0, 0, 0.3), rgba(0, 0, 0, 0.8)), url(${trainigbg_1})`, 
                backgroundSize: 'cover',
                backgroundPosition: 'center'}} >
              <div className="card-content position-relative z-1 text-center w-100">
                <h4 className="text-uppercase fw-bold text-white mb-2" style={{ textShadow: "0 2px 4px rgba(0,0,0,0.8)" }}>Book Training</h4>
                <p className="text-light opacity-75 mb-0">Find and book training sessions with trainers.</p>
              </div>
            </div>
          </div>

          <div className="col-12 col-md-6 col-lg-4 mb-4">
            <div className="card p-3 shadow-sm training-card position-relative overflow-hidden" onClick={() => setSelectedWidget("bookings")}
              style={{ 
                backgroundImage: `linear-gradient(to bottom, rgba(0, 0, 0, 0.3), rgba(0, 0, 0, 0.8)), url(${trainingbg_2})`, 
                backgroundSize: 'cover',
                backgroundPosition: 'center'}}>
              <div className="card-content position-relative z-1 text-center w-100">
                <h4 className="text-uppercase fw-bold text-white mb-2" style={{ textShadow: "0 2px 4px rgba(0,0,0,0.8)" }}>My Bookings</h4>
                <p className="text-light opacity-75 mb-0">View and manage your booked training sessions.</p>
              </div>
            </div>
          </div>

          <div className="col-12 col-md-6 col-lg-4 mb-4">
            <div className="card p-3 shadow-sm training-card position-relative overflow-hidden" onClick={() => setSelectedWidget("workouts")}
              style={{ 
                backgroundImage: `linear-gradient(to bottom, rgba(0, 0, 0, 0.3), rgba(0, 0, 0, 0.8)), url(${trainigbg_3})`, 
                backgroundSize: 'cover',
                backgroundPosition: 'center'}}>
              <div className="card-content position-relative z-1 text-center w-100">
                <h4 className="text-uppercase fw-bold text-white mb-2" style={{ textShadow: "0 2px 4px rgba(0,0,0,0.8)" }}>My Workouts</h4>
                <p className="text-light opacity-75 mb-0">Engage with your trainer assigned workouts.</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Selected Widget */}
      {selectedWidget === "book" && <BookTraining />}
      {selectedWidget === "bookings" && <MyBookings />}
      {selectedWidget === "workouts" && <UserWorkouts />}
    </div>
  );
}

export default TrainingDashboard;
