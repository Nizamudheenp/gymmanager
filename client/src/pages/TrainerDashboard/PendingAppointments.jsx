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

      const count = response.data.sessions.reduce((total, session) => 
        total + session.bookings.filter(booking => booking.status === "pending").length
      , 0);

      setPendingCount(count);
    } catch (error) {
      console.error("Error fetching pending bookings:", error.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <Spinner animation="border" className="d-block mx-auto mt-4 text-warning" />;

  return (
    <div>
      {pendingCount > 0 ? (
        <Alert className="text-center"
        style={{
          backgroundColor: "transparent",
          color: "white",
          lineHeight: "10px",
          fontSize: "20px",
          border: "1px solid orange" 
        }}>
           You have <strong>{pendingCount}</strong> new session booking requests.
        </Alert>
      ) : (
        <Alert variant="success" className="text-center">
           No new booking requests.
        </Alert>
      )}
    </div>
  );
}

export default PendingAppointments;
