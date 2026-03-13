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
    <div className="w-100">
      {pendingCount > 0 ? (
        <div 
          style={{
            background: "rgba(255, 140, 0, 0.1)",
            color: "#fff",
            padding: "20px",
            borderRadius: "15px",
            textAlign: "center",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "10px"
          }}
        >
          <div style={{ fontSize: "2rem" }}>🔔</div>
          <div style={{ fontSize: "1.1rem", fontWeight: "600" }}>
            You have <span style={{ color: "#ff8c00", fontSize: "1.3rem" }}>{pendingCount}</span> pending requests
          </div>
          <p style={{ opacity: 0.7, fontSize: "0.9rem", marginBottom: 0 }}>Review and approve them in your session manager.</p>
        </div>
      ) : (
        <div 
          style={{
            background: "rgba(255, 255, 255, 0.03)",
            color: "rgba(255, 255, 255, 0.5)",
            padding: "20px",
            borderRadius: "15px",
            textAlign: "center",
            border: "1px dashed rgba(255, 255, 255, 0.1)"
          }}
        >
          <p className="mb-0">No new booking requests at this time.</p>
        </div>
      )}
    </div>
  );
}

export default PendingAppointments;
