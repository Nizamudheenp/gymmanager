import React, { useEffect, useState } from "react";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";

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

      //Create Payment Intent
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
    <div className="container mt-4">
      <h3 className="text-dark">Available Trainers</h3>
      {bookingMessage && <p className="mt-3 text-center text-danger">{bookingMessage}</p>}

      {loading ? (
        <p className="text-warning">Loading trainers...</p>
      ) : error ? (
        <p className="text-danger">{error}</p>
      ) : trainers.length === 0 ? (
        <p className="text-secondary">No trainers available.</p>
      ) : (
        <div className="row mt-3 g-3"> 
          {trainers.map((trainer) => (
            <div key={trainer._id} className="col-12 col-sm-6 col-md-4 col-lg-3 d-flex">
          <div className="card bg-dark text-light shadow-sm p-3 w-100 d-flex flex-column justify-content-between border-secondary" style={{ minHeight: "170px" }}>
          <h5  className="text-warning" >{trainer.username}</h5>
                <p className="text-light"> {trainer.specialization}</p>
                <button
                  className="btn btn-warning btn-sm w-100 fw-bold text-dark"
                  onClick={() => handleBooking(trainer._id)}
                >
                  Book & Pay
                </button>
              </div>
            </div>
          ))}
        </div>
      )}


    </div>
  );
}

export default BookTraining;
