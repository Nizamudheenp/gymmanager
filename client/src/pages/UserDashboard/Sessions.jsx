import axios from "axios";
import React, { useEffect, useState } from "react";
import { Card, Button, Spinner, Badge, Container, Row, Col } from "react-bootstrap";
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";
function Sessions() {
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [bookingStatus, setBookingStatus] = useState({});
  const navigate = useNavigate(); 
  const token = localStorage.getItem("token");


  const userId = token ? jwtDecode(token).id : null;

  useEffect(() => {
    fetchSessions();
  }, []);

  const fetchSessions = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/api/user/getsessions`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setSessions(Array.isArray(response.data.sessions) ? response.data.sessions : []);
    } catch (error) {
      console.error("Error fetching sessions:", error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleBookSession = async (sessionId) => {
    try {
      setBookingStatus((prev) => ({ ...prev, [sessionId]: { loading: true, error: null } }));

      await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/user/booksession`,
        { sessionId },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setBookingStatus((prev) => ({ ...prev, [sessionId]: { loading: false, error: null } }));
      alert("Session request sent! Waiting for trainer approval.");
      fetchSessions();
    } catch (error) {
      setBookingStatus((prev) => ({
        ...prev,
        [sessionId]: { loading: false, error: error.response?.data?.message || "Booking failed" },
      }));
    }
  };

  if (loading) return <Spinner animation="border" className="d-block mx-auto mt-4" />;

  return (
    <Container className="mt-4">
      <h2 className="text-dark text-center">Available Sessions</h2>
      {sessions.length === 0 ? (
        <p className="text-muted">No available sessions.</p>
      ) : (
        <Row>
          {sessions.map((session) => {
            const userBooking = session.bookings.find((b) => b.userId === userId);
            const bookingStatusText = userBooking
              ? userBooking.status === "pending"
                ? "Pending Approval"
                : userBooking.status === "approved"
                  ? "Approved"
                  : "Rejected"
              : "Not Requested";

            const currentTime = new Date();
            const sessionStartTime = new Date(session.date);

            const canJoin = userBooking?.status === "approved" && currentTime >= sessionStartTime;


            return (
              <Col key={session._id} md={4} className="mb-3">
                <Card className="bg-dark text-white shadow">
                  <Card.Img
                    variant="top"
                    src={session.image}
                    alt="Session"
                    style={{ height: "250px", objectFit: "cover" }}
                  />
                  <Card.Body>
                    <Card.Title className="text-warning">{session.sessionName}</Card.Title>
                    <Card.Text>
                      <strong>Workout Type:</strong> {session.workoutType} <br />
                      <strong>Date:</strong> {new Date(session.date).toLocaleString()} <br />
                      <strong>Trainer:</strong> {session.trainerId?.username || "Unknown"}
                    </Card.Text>
                    <Badge
                      bg={
                        bookingStatusText === "Approved"
                          ? "success"
                          : bookingStatusText === "Pending Approval"
                            ? "warning"
                            : "secondary"
                      }
                    >
                      {bookingStatusText}
                    </Badge>
                    {canJoin ? (
                      <Button variant="success" className="mt-2 w-100" onClick={()=> navigate(`/user-dashboard/sessiondetailes/${session._id}`)}>
                        Join Session
                      </Button>
                    ) : (
                      <Button
                        variant="outline-warning"
                        className="mt-2 w-100"
                        onClick={() => handleBookSession(session._id)}
                        disabled={bookingStatusText !== "Not Requested" || bookingStatus[session._id]?.loading}
                      >
                        {bookingStatus[session._id]?.loading ? "Requesting..." : "Request to Join"}
                      </Button>
                    )}


                    {bookingStatus[session._id]?.error && <p className="text-danger mt-2">{bookingStatus[session._id]?.error}</p>}
                  </Card.Body>
                </Card>
              </Col>
            );
          })}
        </Row>
      )}
    </Container>
  );
}

export default Sessions;
