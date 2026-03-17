import React from "react";
import { useNavigate } from "react-router-dom";

function PaymentSuccess() {
  const navigate = useNavigate();

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        backgroundColor: "#1c1c1c",
        textAlign: "center",
        color: "#fff",
        flexDirection: "column"
      }}
    >
      <div
        style={{
          width: "100px",
          height: "100px",
          borderRadius: "50%",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          border: "2px dashed #28a745",
          backgroundColor: "rgba(40, 167, 69, 0.1)",
          marginBottom: "20px",
          animation: "fadeIn 0.5s ease-in-out"
        }}
      >
        <svg
          width="50px"
          height="50px"
          viewBox="0 0 24 24"
          fill="none"
          stroke="#28a745"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
          style={{ animation: "draw 1s ease-in-out forwards" }}
        >
          <polyline points="20 6 9 17 4 12"></polyline>
        </svg>
      </div>

      <h2 className="fw-bold" style={{ color: "#ffffff", letterSpacing: "1px" }}>Payment Successful</h2>
      <p style={{ fontSize: "16px", color: "rgba(255, 255, 255, 0.6)", maxWidth: "400px", lineHeight: "1.6" }}>
        Thank you for your payment. Your training session is now confirmed and added to your bookings.
      </p>

      <button
        className="btn btn-outline-warning fw-bold mt-4 rounded-pill"
        onClick={() => navigate("/user-dashboard/training")}
        style={{
          padding: "12px 30px",
          fontSize: "16px",
          transition: "0.3s",
          borderColor: "#ff8c00",
          color: "#ff8c00",
        }}
        onMouseOver={(e) => { e.target.style.background = "#ff8c00"; e.target.style.color = "#000"; e.target.style.boxShadow = "0 0 15px rgba(255, 140, 0, 0.4)"; }}
        onMouseOut={(e) => { e.target.style.background = "transparent"; e.target.style.color = "#ff8c00"; e.target.style.boxShadow = "none"; }}
      >
        Go to Training Dashboard
      </button>

      <style>
        {`
          @keyframes fadeIn {
            from { opacity: 0; transform: scale(0.8); }
            to { opacity: 1; transform: scale(1); }
          }

          @keyframes draw {
            0% { stroke-dasharray: 0, 100; }
            100% { stroke-dasharray: 100, 100; }
          }
        `}
      </style>
    </div>
  );
}

export default PaymentSuccess;
