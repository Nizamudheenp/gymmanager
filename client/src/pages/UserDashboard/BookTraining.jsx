import React, { useEffect, useState } from "react";
import axios from "axios";

function BookTraining() {
  const [trainers, setTrainers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [bookingMessage,setBookingMessage] = useState("")
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

  const bookTrainer = async (trainerId) =>{
    try {
       const response = await axios.post( `${import.meta.env.VITE_BACKEND_URL}/api/user/booktrainer`,
        { trainerId },
        { headers: { Authorization: `Bearer ${token}` } }) 
        setBookingMessage(response.data.message);
    } catch (error) {
        setBookingMessage(error.response?.data?.message || "Booking failed."); 
    }
  }

  return (
    <div>
      <h3>Available Trainers</h3>
      
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
                <button className="btn btn-success btn-sm w-100" onClick={()=>{
                    bookTrainer(trainer._id)
                }}>Book</button>
              </div>
            </div>
          ))}
        </div>
      )}
      {bookingMessage && <p className="mt-3 text-center">{bookingMessage}</p>}
    </div>
  );
}

export default BookTraining;
