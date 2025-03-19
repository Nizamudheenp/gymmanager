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
    <div>
      <h3>My Trainer Bookings</h3>
      {error ? (
        <p className="text-danger">{error}</p>
      ) : bookings.length === 0 ? (
        <p>No bookings found.</p>
      ) : (
        <ul className="list-group mt-3">
          {bookings.map((booking) => (
            <li key={booking._id} className="list-group-item d-flex justify-content-between align-items-center">
              <span>
                <strong>Trainer:</strong> {booking.trainerId.username} <br />
                <strong>Email:</strong> {booking.trainerId.email}
              </span>
              <span className="badge bg-primary">{booking.status}</span>
            </li>
          ))}
        </ul>
      )}
    </div>


  );
}

export default MyBookings;
