import React, { useState } from "react";
import BookTraining from "./BookTraining";
import MyBookings from "./MyBookings";
import "./Training.css"
import UserWorkouts from "./Workouts";


function TrainingDashboard() {
  const [selectedWidget, setSelectedWidget] = useState(null);

  return (
    <div className="container mt-4 training-section">
      <h2 className="text-center">Training Section</h2>

      {/* Training Widgets  */}
      {!selectedWidget && (
        <div className="row mt-4">
          <div className="col-md-6">
            <div className="card p-3 shadow-sm training-card" onClick={() => setSelectedWidget("book")}>
              <h4>📅 Book Training</h4>
              <p>Find and book training sessions with trainers.</p>
            </div>
          </div>

          <div className="col-md-6">
            <div className="card p-3 shadow-sm training-card" onClick={() => setSelectedWidget("bookings")}>
              <h4>📋 My Bookings</h4>
              <p>View and manage your booked training sessions.</p>
            </div>
          </div>

          <div className="col-md-6">
            <div className="card p-3 shadow-sm training-card" onClick={() => setSelectedWidget("workouts")}>
              <h4>📋 My Workouts</h4>
              <p>Engade with your trainer assigned workoutes.</p>
            </div>
          </div>
        </div>
      )}

      {/* Display Selected Widget */}
      {selectedWidget === "book" && <BookTraining />}
      {selectedWidget === "bookings" && <MyBookings />}
      {selectedWidget === "workouts" && <UserWorkouts />}


    </div>
  );
}

export default TrainingDashboard;
