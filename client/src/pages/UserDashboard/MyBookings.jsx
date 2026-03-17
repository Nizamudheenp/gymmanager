import React, { useEffect, useState } from "react";
import axios from "axios";

function MyBookings() {
  const [bookings, setBookings] = useState([]);
  const [error, setError] = useState("");
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/user/getbookings`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setBookings(response.data.appointments || []);
      } catch (error) {
        setError("Failed to fetch bookings.");
        setBookings([]);
      }
    };
    fetchBookings();
  }, [token]);

  return (
    <div className="container mt-4">  
  {error ? (
    <div className="alert alert-danger border-0 rounded-3 shadow-sm bg-dark text-danger" style={{ borderLeft: "4px solid #dc3545" }}>
      <i className="bi bi-exclamation-triangle-fill me-2"></i> {error}
    </div>
  ) : bookings.length === 0 ? (
    <div className="text-center p-5 rounded-4" style={{ background: "rgba(25, 25, 25, 0.4)", border: "1px dashed rgba(255,255,255,0.1)" }}>
      <i className="bi bi-calendar-x opacity-50" style={{ fontSize: "3rem", color: "#ff8c00" }}></i>
      <p className="text-secondary mt-3 mb-0 fs-5">No bookings found.</p>
    </div>
  ) : (
    <div className="row g-3 mt-2">
      {bookings.map((booking) => (
        <div key={booking._id} className="col-12 col-md-6 col-lg-4">
          <div className="card h-100 text-light shadow-sm w-100 border-0 position-relative overflow-hidden" 
            style={{ 
              minHeight: "350px",
              background: "rgba(25, 25, 25, 0.6)",
              backdropFilter: "blur(10px)",
              border: "1px solid rgba(255, 255, 255, 0.05)",
              borderRadius: "16px",
              transition: "transform 0.3s ease, box-shadow 0.3s ease",
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

            <div className="card-body d-flex flex-column justify-content-center align-items-center gap-3 position-relative z-1 text-center p-4">
              <div className="rounded-circle d-flex align-items-center justify-content-center mb-2" 
                style={{ width: "80px", height: "80px", background: "rgba(255, 255, 255, 0.05)", border: "1px solid rgba(255, 255, 255, 0.1)"}}>
                <i className="bi bi-person-fill" style={{ fontSize: "40px", color: "#ffffff", opacity: 0.8 }}></i>
              </div>
              
              <div>
                <h5 className="fw-bold mb-1 text-white">{booking.trainerId.username}</h5>
                <p 
                  style={{ color: "rgba(255, 255, 255, 0.6)", fontSize: "14px", letterSpacing: "1px", textTransform: "uppercase", fontWeight: "600" }}
                  className="mb-0"
                >
                  Trainer
                </p>
                <div className="text-secondary mt-1" style={{ fontSize: "0.9rem" }}>
                  <i className="bi bi-envelope me-2"></i>{booking.trainerId.email}
                </div>
              </div>

              <div className="w-100 mt-2 px-3">
                <div className="d-flex justify-content-between align-items-center text-secondary mb-2" style={{ fontSize: "14px" }}>
                  <span>Status</span>
                  <span 
                    className={`badge rounded-pill px-3 py-2 fw-bold text-uppercase`}
                    style={{ 
                      backgroundColor: booking.status === "Pending" ? "rgba(255, 255, 255, 0.05)" : "rgba(255, 140, 0, 0.2)",
                      color: booking.status === "Pending" ? "rgba(255, 255, 255, 0.5)" : "#ff8c00",
                      border: `1px solid ${booking.status === "Pending" ? "rgba(255, 255, 255, 0.1)" : "rgba(255, 140, 0, 0.5)"}`,
                      letterSpacing: "1px",
                      fontSize: "12px"
                    }}
                  >
                    {booking.status === "Pending" ? (
                      <><i className="bi bi-clock-history me-1"></i> Pending</>
                    ) : (
                      <><i className="bi bi-check2-all me-1"></i> Success</>
                    )}
                  </span>
                </div>
                <hr className="border-secondary opacity-25 my-2" />
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  )}
</div>



  );
}

export default MyBookings;
