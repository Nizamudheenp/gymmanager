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

  if (loading) return <Spinner animation="border" className="d-block mx-auto mt-4 text-warning" />;

  return (
    <Card  style={{
      backgroundColor: "transparent",
      color: "white",
      lineHeight: "22px",
      fontSize: "17px",
      border: "1px solid orange" 
    }}>
      <Card.Body >
        <Card.Title className="text-warning">Next Assigned Session</Card.Title>
        {nextSession ? (
          <>
            <Card.Text>
              <strong> {nextSession.sessionName}</strong> <br />
              <strong> Workout Type:</strong> {nextSession.workoutType} <br />
              <strong> Date:</strong> {new Date(nextSession.date).toLocaleString()}
            </Card.Text>
          </>
        ) : (
          <Alert variant="success" className="text-center">
             No upcoming sessions.
          </Alert>
        )}
      </Card.Body>
    </Card>
  );
}

export default UpcomingSessionWidget;
