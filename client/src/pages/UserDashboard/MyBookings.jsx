import React, { useEffect, useState } from "react";
import axios from "axios";

function MyBookings() {
  const [bookings, setBookings] = useState([]);
  const [error, setError] = useState("");
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/user/getbookings`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setBookings(response.data.appointments || []);
      } catch (error) {
        setError("Failed to fetch bookings.");
        setBookings([]);
      }
    };
    fetchBookings();
  }, [token]);

  return (
    <div className="container mt-4">  
  {error ? (
    <p className="text-danger">{error}</p>
  ) : bookings.length === 0 ? (
    <p className="text-secondary">No bookings found.</p>
  ) : (
    <ul className="list-group mt-3">
      {bookings.map((booking) => (
        <li key={booking._id} className="list-group-item d-flex justify-content-between align-items-center bg-dark text-light">
          <span className="p-3">
            <strong style={{ color: "#ff8c00"}}>Trainer : </strong> {booking.trainerId.username} <br />
            <strong style={{ color: "#ff8c00"}}>Email : </strong> {booking.trainerId.email}
          </span>
          <span style={{width:"100px", minWidth:"100px"}} className={`btn ${booking.status === "Pending" ? "bg-warning text-dark" : "bg-success"}`}>
            {booking.status}
          </span>
        </li>
      ))}
    </ul>
  )}
</div>



  );
}

export default MyBookings;
