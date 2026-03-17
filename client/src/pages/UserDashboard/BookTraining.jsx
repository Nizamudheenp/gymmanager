import React, { useEffect, useState } from "react";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";
import { Container, Row, Col, Card, Button, Spinner } from "react-bootstrap";

function BookTraining() {
  const [trainers, setTrainers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [bookingMessage, setBookingMessage] = useState("");
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchTrainers = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/api/user/availabletrainers`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setTrainers(response.data.trainers);
        console.log(response.data.trainers);
      } catch (error) {
        setError("Failed to fetch trainers.");
      } finally {
        setLoading(false);
      }
    };
    fetchTrainers();
  }, [token]);

  useEffect(() => {
    const deleteUnpaidAppointments = async () => {
      try {
        if (!token) return;

        await axios.delete(`${import.meta.env.VITE_BACKEND_URL}/api/user/cleanup`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        console.log("Pending and canceled appointments deleted.");
      } catch (error) {
        console.error("Error deleting unpaid appointments:", error);
      }
    };

    deleteUnpaidAppointments();
  }, [token]);

  const handleBooking = async (trainerId) => {
    try {
      if (!token) throw new Error("No token found. Please log in.");
      const decodedToken = jwtDecode(token);
      const userId = decodedToken.id;
      if (!userId) throw new Error("Invalid token. User ID missing.");

      const appointmentResponse = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/user/booktrainer`,
        { trainerId },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (!appointmentResponse.data.appointment?._id) {
        throw new Error("Appointment creation failed.");
      }

      const newAppointmentId = appointmentResponse.data.appointment._id;

      // Create Payment Intent
      const paymentResponse = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/payments/create-payment-intent`,
        {
          amount: 2000,
          userId,
          trainerId,
          appointmentId: newAppointmentId,
          method: "Stripe",
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      navigate(`/user-dashboard/payment/${newAppointmentId}`, {
        state: { clientSecret: paymentResponse.data.clientSecret },
      });
    } catch (error) {
      console.error("Booking Error:", error.response?.data || error.message);
      setBookingMessage(error.response?.data?.message || "Booking failed.");
    }
  };

  return (
    <Container className="mt-4">
      {bookingMessage && <p className="mt-3 text-center text-danger">{bookingMessage}</p>}

      {loading ? (
        <Spinner animation="border" className="d-block mx-auto mt-4 text-dark" />
      ) : error ? (
        <p className="text-danger">{error}</p>
      ) : trainers.length === 0 ? (
        <p className="text-secondary">No trainers available.</p>
      ) : (
        <Row className="mt-3 g-4">
          {trainers.map((trainer) => (
            <Col key={trainer._id} xs={12} sm={12} md={6} lg={4} className="d-flex">
              <Card className="text-light shadow w-100 d-flex flex-column justify-content-between border-0 position-relative overflow-hidden" 
                style={{ 
                  minHeight: "350px", 
                  background: "rgba(25, 25, 25, 0.6)",
                  backdropFilter: "blur(10px)",
                  border: "1px solid rgba(255, 255, 255, 0.05)",
                  borderRadius: "16px",
                  transition: "transform 0.3s ease, box-shadow 0.3s ease",
                  cursor: "pointer"
                }}
                onMouseOver={(e) => { e.currentTarget.style.transform = "translateY(-5px)"; e.currentTarget.style.boxShadow = "0 10px 30px rgba(0, 0, 0, 0.5)"; e.currentTarget.style.border = "1px solid rgba(255, 255, 255, 0.15)"; }}
                onMouseOut={(e) => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "none"; e.currentTarget.style.border = "1px solid rgba(255, 255, 255, 0.05)"; }}
              >
                <div 
                  className="position-absolute w-100 h-50 top-0 start-0 z-0" 
                  style={{ 
                    background: "linear-gradient(180deg, rgba(255,255,255,0.05) 0%, rgba(25,25,25,0) 100%)",
                    pointerEvents: "none"
                  }} 
                />
                
                <Card.Body className="d-flex flex-column justify-content-center align-items-center gap-3 position-relative z-1 text-center p-4">
                  <div className="rounded-circle d-flex align-items-center justify-content-center mb-2" 
                    style={{ width: "80px", height: "80px", background: "rgba(255, 255, 255, 0.05)", border: "1px solid rgba(255, 255, 255, 0.1)"}}>
                    <i className="bi bi-person-fill" style={{ fontSize: "40px", color: "#ffffff", opacity: 0.8 }}></i>
                  </div>
                  
                  <div>
                    <h5 className="fw-bold mb-1 text-white">{trainer.username}</h5>
                    <Card.Text 
                      style={{ color: "rgba(255, 255, 255, 0.6)", fontSize: "14px", letterSpacing: "1px", textTransform: "uppercase", fontWeight: "600" }}
                      className="mb-0"
                    >
                      {trainer.specialization}
                    </Card.Text>
                  </div>
                  
                  <div className="w-100 mt-2 px-3">
                    <div className="d-flex justify-content-between text-secondary" style={{ fontSize: "14px" }}>
                      <span>Session Rate</span>
                      <span className="text-light fw-bold">$20.00</span>
                    </div>
                    <hr className="border-secondary opacity-25 my-2" />
                  </div>
                </Card.Body>
                
                <div className="p-3 position-relative z-1">
                  <Button 
                    variant="outline-warning" 
                    className="w-100 fw-bold rounded-pill" 
                    style={{ 
                      padding: "12px",
                      borderColor: "#ff8c00",
                      color: "#ff8c00",
                      transition: "all 0.3s ease"
                    }}
                    onMouseOver={(e) => { e.target.style.background = "#ff8c00"; e.target.style.color = "#000"; e.target.style.boxShadow = "0 0 15px rgba(255, 140, 0, 0.4)"; }}
                    onMouseOut={(e) => { e.target.style.background = "transparent"; e.target.style.color = "#ff8c00"; e.target.style.boxShadow = "none"; }}
                    onClick={() => handleBooking(trainer._id)}
                  >
                    <i className="bi bi-calendar-plus me-2"></i> Book & Pay
                  </Button>
                </div>
              </Card>
            </Col>
          ))}
        </Row>
      )}
    </Container>
  );
}

export default BookTraining;
