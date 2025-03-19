import React from "react";
import { useNavigate } from "react-router-dom";

function PaymentSuccess() {
  const navigate = useNavigate();

  return (
    <div className="text-center">
      <h2>🎉 Payment Successful! 🎉</h2>
      <p>Thank you for your payment. Your training session is now confirmed.</p>
      <button className="btn btn-primary" onClick={() => navigate("/user-dashboard/training")}>
        Go to Training Dashboard
      </button>
    </div>
  );
}

export default PaymentSuccess;
