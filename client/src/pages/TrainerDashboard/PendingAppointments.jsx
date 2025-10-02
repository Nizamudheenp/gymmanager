import axios from "axios";
import React, { useEffect, useState } from "react";
import { Spinner, Alert } from "react-bootstrap";

function PendingAppointments() {
  const [pendingCount, setPendingCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchPendingCount();
  }, []);

  const fetchPendingCount = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/api/trainer/mysessions`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const count = response.data.sessions.reduce(
        (total, session) =>
          total +
          session.bookings.filter((booking) => booking.status === "pending")
            .length,
        0
      );

      setPendingCount(count);
    } catch (error) {
      console.error("Error fetching pending bookings:", error.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading)
    return (
      <div className="d-flex justify-content-center mt-4">
        <Spinner animation="border" variant="warning" />
      </div>
    );

  return (
    <div className="container mt-3">
      {pendingCount > 0 ? (
        <Alert
          className="text-center fw-bold"
          style={{
            backgroundColor: "#1c1c1c",
            color: "#f8f9fa",
            fontSize: "18px",
            border: "2px solid #ff8c00",
            borderRadius: "8px",
          }}
        >
          🟠 You have <span style={{ color: "#ff8c00" }}>{pendingCount}</span>{" "}
          new session booking requests.
        </Alert>
      ) : (
        <Alert
          className="text-center fw-semibold"
          style={{
            backgroundColor: "#1c1c1c",
            color: "#ff8c00",
            fontSize: "18px",
            border: "2px solid #ff8c00",
            borderRadius: "8px",
          }}
        >
          No new booking requests.
        </Alert>
      )}
    </div>
  );
}

export default PendingAppointments;
