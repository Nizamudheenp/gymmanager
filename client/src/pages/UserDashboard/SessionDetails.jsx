import axios from "axios";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Container, Button, Card, Spinner } from "react-bootstrap";

function SessionDetails() {
  const { sessionId } = useParams();
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchSessionDetails();
  }, []);

  const fetchSessionDetails = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/api/user/getsessiondetails/${sessionId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setSession(response.data);
    } catch (error) {
      console.error("Error fetching session details:", error.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading)
    return <Spinner animation="border" className="d-block mx-auto mt-4 text-warning" />;

  if (!session)
    return <p className="text-danger text-center mt-4">Session not found</p>;

  return (
    <Container className="mt-4">
      <Card className="bg-dark text-white shadow-lg p-4">
        <h2 className="text-warning text-center">{session.sessionName}</h2>
        <p className="text-center">
          <strong>Trainer:</strong> {session.trainerId?.username}
        </p>

        <h4 className="text-warning mt-4">Assigned Workouts</h4>

        {session.workouts.length > 0 ? (
          session.workouts.map((workout) => (
            <Card key={workout._id} className="mb-3 bg-secondary text-white shadow-sm">
              <Card.Body>
                <Card.Title className="text-warning">{workout.exercise}</Card.Title>
                <Card.Text>
                  <strong>Sets:</strong> {workout.sets} | <strong>Reps:</strong> {workout.reps}
                </Card.Text>

                {/* Meeting Link  */}
                {workout.meetingLink && (
                  <a
                    href={workout.meetingLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-warning w-100 mb-2"
                  >
                    📅 Join Meeting
                  </a>
                )}

                <Button variant="outline-warning" className="w-100">
                  Mark as Done
                </Button>
              </Card.Body>
            </Card>
          ))
        ) : (
          <p className="text-light">No workouts assigned yet...</p>
        )}
      </Card>
    </Container>
  );
}

export default SessionDetails;
