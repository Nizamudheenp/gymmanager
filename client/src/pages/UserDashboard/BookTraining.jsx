import React, { useEffect, useState } from "react";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom"; // ✅ Import useNavigate

function BookTraining() {
  const [trainers, setTrainers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [bookingMessage, setBookingMessage] = useState("");
  const navigate = useNavigate(); // ✅ Initialize navigate
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

  const handleBooking = async (trainerId) => {
    try {
      if (!token) throw new Error("No token found. Please log in.");
      const decodedToken = jwtDecode(token);
      const userId = decodedToken.id;
      if (!userId) throw new Error("Invalid token. User ID missing.");

      // Step 1: Book the Trainer
      const appointmentResponse = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/user/booktrainer`,
        { trainerId },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (!appointmentResponse.data.appointment?._id) {
        throw new Error("Appointment creation failed.");
      }

      const newAppointmentId = appointmentResponse.data.appointment._id;

      // Step 2: Create Payment Intent
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

      // ✅ Redirect to the Updated Payment Page URL
      navigate(`/user-dashboard/payment/${newAppointmentId}`, {
        state: { clientSecret: paymentResponse.data.clientSecret },
      });
    } catch (error) {
      console.error("Booking Error:", error.response?.data || error.message);
      setBookingMessage(error.response?.data?.message || "Booking failed.");
    }
  };

  return (
    <div>
      <h3>Available Trainers</h3>
      {bookingMessage && <p className="mt-3 text-center text-danger">{bookingMessage}</p>}

      {loading ? (
        <p>Loading trainers...</p>
      ) : error ? (
        <p className="text-danger">{error}</p>
      ) : trainers.length === 0 ? (
        <p>No trainers available.</p>
      ) : (
        <div className="row mt-3">
          {trainers.map((trainer) => (
            <div key={trainer._id} className="col-md-6">
              <div className="card shadow-sm p-3 mb-3">
                <h5>{trainer.username}</h5>
                <p>Specialization: {trainer.specialization}</p>
                <button
                  className="btn btn-success btn-sm w-100"
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
