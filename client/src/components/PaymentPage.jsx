import React, { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import Payment from "./Payment";
import axios from "axios";

function PaymentPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const { appointmentId } = useParams();
  const [clientSecret, setClientSecret] = useState(location.state?.clientSecret || "");
  const amount = 2000; 

  useEffect(() => {
    if (!clientSecret) {
      const token = localStorage.getItem("token");
      axios
        .get(`${import.meta.env.VITE_BACKEND_URL}/api/payments/get-client-secret/${appointmentId}`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((response) => setClientSecret(response.data.clientSecret))
        .catch(() => navigate("/user-dashboard"));
    }
  }, [appointmentId, clientSecret, navigate]);

  if (!clientSecret) {
    return (
      <div className="d-flex justify-content-center align-items-center vh-100">
        <h2 className="text-warning">Loading Payment Details...</h2>
      </div>
    );
  }

  return (
    <div className="container mt-5">
      <div className="card p-4 bg-dark text-light shadow-sm">
        <h2 className="text-center text-warning mb-4">Complete Your Payment</h2>
        <div className="text-center">
          <p className="fs-4">
            Amount to Pay: <span className="fw-bold text-success">${(amount / 100).toFixed(2)}</span>
          </p>
        </div>
        <Payment clientSecret={clientSecret} />
      </div>
    </div>
  );
}

export default PaymentPage;
