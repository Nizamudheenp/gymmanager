import axios from "axios";
import React, { useEffect, useState } from "react";
import { Card, Spinner, Alert } from "react-bootstrap";

function UpcomingSessionWidget() {
  const [nextSession, setNextSession] = useState(null);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchUpcomingSession();
  }, []);

  const fetchUpcomingSession = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/api/trainer/mysessions`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const sessions = response.data.sessions;

      const upcomingSessions = sessions
        .filter(session => new Date(session.date) > new Date())
        .sort((a, b) => new Date(a.date) - new Date(b.date));

      setNextSession(upcomingSessions.length > 0 ? upcomingSessions[0] : null);
    } catch (error) {
      console.error("Error fetching sessions:", error.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="text-center p-4"><Spinner animation="border" className="text-warning" /></div>;

  return (
    <div className="w-100">
      {nextSession ? (
        <div style={{ lineHeight: "1.6", fontSize: "1rem", color: "rgba(255, 255, 255, 0.8)" }}>
          <div className="mb-2" style={{ color: "#ff8c00", fontWeight: "700" }}>Next Assigned Session</div>
          <div style={{ background: "rgba(255, 255, 255, 0.05)", borderRadius: "10px", padding: "15px" }}>
            <div style={{ color: "#fff", fontWeight: "600", marginBottom: "5px" }}>{nextSession.sessionName}</div>
            <div style={{ fontSize: "0.9rem" }}>
              <span style={{ opacity: 0.6 }}>Workout Type:</span> {nextSession.workoutType}
            </div>
            <div style={{ fontSize: "0.9rem" }}>
              <span style={{ opacity: 0.6 }}>Date:</span> {new Date(nextSession.date).toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' })}
            </div>
          </div>
        </div>
      ) : (
        <div className="text-center p-4" style={{ background: "rgba(255, 255, 255, 0.03)", borderRadius: "10px", border: "1px dashed rgba(255, 255, 255, 0.1)" }}>
          <p className="mb-0" style={{ opacity: 0.6, fontSize: "0.9rem" }}>No upcoming sessions at the moment.</p>
        </div>
      )}
    </div>
  );
}

export default UpcomingSessionWidget;
