import axios from "axios";
import React, { useEffect, useState } from "react";
import { Card, Button, Spinner, Badge, Container, Row, Col } from "react-bootstrap";
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";


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
      toast.success("Session request sent! Waiting for trainer approval");
      
      fetchSessions();
    } catch (error) {
      setBookingStatus((prev) => ({
        ...prev,
        [sessionId]: { loading: false, error: error.response?.data?.message || "Booking failed" },
      }));
    }
  };

  if (loading) return (
    <div className="d-flex justify-content-center align-items-center" style={{ minHeight: "200px" }}>
      <Spinner animation="border" variant="warning" />
    </div>
  );

  return (
    <Container className="mt-4 mb-5">
      <div className="text-center mb-5">
        <h2 className="text-white fw-bold mb-1">Available Training Sessions</h2>
        <p className="text-secondary">Join expert-led sessions to elevate your fitness journey</p>
      </div>

      {sessions.length === 0 ? (
        <div className="text-center p-5 rounded-4" style={{ background: "rgba(25, 25, 25, 0.4)", border: "1px dashed rgba(255,255,255,0.1)" }}>
          <i className="fa-solid fa-calendar-day opacity-50 mb-3" style={{ fontSize: "3rem", color: "#ffffff" }}></i>
          <p className="text-secondary fs-5 mb-0">No sessions available at the moment.</p>
        </div>
      ) : (
        <Row className="g-4">
          {sessions.map((session) => {
            const userBooking = session.bookings?.find((b) => b.userId === userId);
            const bookingStatusText = userBooking
              ? userBooking.status === "pending"
                ? "Pending"
                : userBooking.status === "approved"
                  ? "Approved"
                  : "Rejected"
              : "Not Requested";

            const currentTime = new Date();
            const sessionStartTime = new Date(session.date);
            const canJoin = userBooking?.status === "approved" && currentTime >= sessionStartTime;

            return (
              <Col key={session._id} xs={12} md={6} lg={4} xl={3}>
                <Card className="h-100 border-0 overflow-hidden shadow-lg position-relative"
                  style={{ 
                    background: "rgba(25, 25, 25, 0.6)",
                    backdropFilter: "blur(10px)",
                    border: "1px solid rgba(255, 255, 255, 0.05)",
                    borderRadius: "16px",
                  }}
                >
                  <div className="position-relative">
                    <Card.Img
                      variant="top"
                      src={session.image}
                      alt={session.sessionName}
                      style={{ height: "200px", objectFit: "cover" }}
                    />
                    <div className="position-absolute top-0 end-0 p-2">
                      <Badge 
                        pill 
                        className="px-3 py-2 fw-bold text-uppercase"
                        style={{ 
                          fontSize: "0.6rem",
                          letterSpacing: "0.5px",
                          background: bookingStatusText === "Approved" ? "rgba(40, 167, 69, 0.9)" : 
                                     bookingStatusText === "Pending" ? "rgba(255, 193, 7, 0.9)" : 
                                     "rgba(255, 255, 255, 0.1)",
                          backdropFilter: "blur(4px)",
                          color: bookingStatusText === "Pending" ? "#000" : "#fff",
                        }}
                      >
                        {bookingStatusText}
                      </Badge>
                    </div>
                  </div>

                  <Card.Body className="d-flex flex-column p-4">
                    <div className="mb-3">
                      <h5 className="text-white fw-bold mb-1">{session.sessionName}</h5>
                      <span className="text-secondary small fw-bold text-uppercase" style={{ letterSpacing: "1px", fontSize: "0.7rem" }}>
                        {session.workoutType}
                      </span>
                    </div>

                    <div className="text-secondary small d-flex flex-column gap-2 mb-4">
                      <div className="d-flex align-items-center">
                        <i className="fa-solid fa-calendar-day me-2" style={{ width: "16px", color: "#ff8c00" }}></i>
                        {new Date(session.date).toLocaleDateString([], { weekday: 'short', month: 'short', day: 'numeric' })}
                      </div>
                      <div className="d-flex align-items-center">
                        <i className="fa-solid fa-clock me-2" style={{ width: "16px", color: "#ff8c00" }}></i>
                        {new Date(session.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </div>
                      <div className="d-flex align-items-center">
                        <i className="fa-solid fa-user-tie me-2" style={{ width: "16px", color: "#ff8c00" }}></i>
                        {session.trainerId?.username || "Coach"}
                      </div>
                    </div>

                    <div className="mt-auto">
                      {canJoin ? (
                        <Button 
                          variant="success" 
                          className="w-100 fw-bold border-0 py-2 shadow-sm"
                          style={{ borderRadius: "8px" }}
                          onClick={() => navigate(`/user-dashboard/sessiondetailes/${session._id}`)}
                        >
                          <i className="fa-solid fa-play me-2"></i>Join Now
                        </Button>
                      ) : (
                        <Button
                          className="w-100 fw-bold border-0 py-2 shadow-sm"
                          style={{ 
                            background: bookingStatusText === "Not Requested" ? "#ff8c00" : "rgba(255, 255, 255, 0.05)",
                            color: bookingStatusText === "Not Requested" ? "#000" : "rgba(255, 255, 255, 0.5)",
                            borderRadius: "8px",
                            transition: "all 0.3s ease"
                          }}
                          onMouseOver={(e) => {
                            if (bookingStatusText === "Not Requested") {
                              e.currentTarget.style.transform = "translateY(-2px)";
                              e.currentTarget.style.boxShadow = "0 4px 15px rgba(255, 140, 0, 0.3)";
                            }
                          }}
                          onMouseOut={(e) => {
                            if (bookingStatusText === "Not Requested") {
                              e.currentTarget.style.transform = "translateY(0)";
                              e.currentTarget.style.boxShadow = "none";
                            }
                          }}
                          onClick={() => handleBookSession(session._id)}
                          disabled={bookingStatusText !== "Not Requested" || bookingStatus[session._id]?.loading}
                        >
                          {bookingStatus[session._id]?.loading ? (
                            <Spinner animation="border" size="sm" />
                          ) : (
                            <><i className={`fa-solid ${bookingStatusText === "Not Requested" ? "fa-paper-plane" : "fa-clock"} me-2`}></i>{bookingStatusText === "Not Requested" ? "Request to Join" : bookingStatusText}</>
                          )}
                        </Button>
                      )}
                      {bookingStatus[session._id]?.error && (
                        <p className="text-danger small mt-2 mb-0 text-center">
                          <i className="fa-solid fa-triangle-exclamation me-1"></i> {bookingStatus[session._id].error}
                        </p>
                      )}
                    </div>
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
