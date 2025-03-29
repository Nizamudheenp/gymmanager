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
          backgroundColor: "#28a745",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          boxShadow: "0px 0px 15px rgba(40, 167, 69, 0.5)",
          marginBottom: "20px",
          animation: "fadeIn 0.5s ease-in-out"
        }}
      >
        <svg 
          width="60px" 
          height="60px" 
          viewBox="0 0 24 24" 
          fill="none" 
          stroke="white" 
          strokeWidth="3" 
          strokeLinecap="round" 
          strokeLinejoin="round"
          style={{ animation: "draw 1s ease-in-out forwards" }}
        >
          <polyline points="20 6 9 17 4 12"></polyline>
        </svg>
      </div>

      <h2 style={{ color: "#ffc107" }}>🎉 Payment Successful! 🎉</h2>
      <p style={{ fontSize: "18px" }}>Thank you for your payment. Your training session is now confirmed.</p>
      
      <button 
        className="btn btn-warning fw-bold mt-3"
        onClick={() => navigate("/user-dashboard/training")}
        style={{
          padding: "12px 20px",
          borderRadius: "5px",
          fontSize: "16px",
          transition: "0.3s",
          boxShadow: "0px 0px 10px rgba(255, 193, 7, 0.4)",
        }}
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
