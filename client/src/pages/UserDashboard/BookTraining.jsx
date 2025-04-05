import React, { useEffect, useState } from "react";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";
import { Container, Row, Col, Card, Button } from "react-bootstrap"; 

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
      <h3 className="text-dark">Available Trainers</h3>
      {bookingMessage && <p className="mt-3 text-center text-danger">{bookingMessage}</p>}

      {loading ? (
        <p className="text-warning">Loading trainers...</p>
      ) : error ? (
        <p className="text-danger">{error}</p>
      ) : trainers.length === 0 ? (
        <p className="text-secondary">No trainers available.</p>
      ) : (
        <Row className="mt-3 g-3"> 
          {trainers.map((trainer) => (
            <Col key={trainer._id} xs={12} sm={6} md={4} lg={3} className="d-flex"> 
              <Card className="bg-dark text-light shadow-sm p-3 w-100 d-flex flex-column justify-content-between border-secondary" style={{ minHeight: "170px" }}>
                <Card.Body>
                  <Card.Title className="text-warning">{trainer.username}</Card.Title>
                  <Card.Text className="text-light">{trainer.specialization}</Card.Text>
                </Card.Body>
                <Button variant="warning" className="fw-bold text-dark w-100" onClick={() => handleBooking(trainer._id)}>
                  Book & Pay
                </Button>
              </Card>
            </Col>
          ))}
        </Row>
      )}
    </Container>
  );
}

export default BookTraining;
