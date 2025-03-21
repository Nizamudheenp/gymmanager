import React, { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import Payment from "./Payment";
import axios from "axios";

function PaymentPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const { appointmentId } = useParams();
  const [clientSecret, setClientSecret] = useState(location.state?.clientSecret || "");

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
      <div>
        <h2>Loading Payment Details...</h2>
      </div>
    );
  }

  return (
    <div>
      <h2>Complete Payment</h2>
      <Payment clientSecret={clientSecret} appointmentId={appointmentId} />
    </div>
  );
}

export default PaymentPage;
