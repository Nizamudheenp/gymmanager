import React, { useState } from "react";
import { useStripe, useElements, PaymentElement } from "@stripe/react-stripe-js";
import { useNavigate } from "react-router-dom";

function CheckoutForm() {
  const stripe = useStripe();
  const elements = useElements();
  const navigate = useNavigate(); 
  const [paymentSuccess, setPaymentSuccess] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!stripe || !elements) return;

    const { error, paymentIntent } = await stripe.confirmPayment({
      elements,
      confirmParams: {},
      redirect: "if_required",
    });

    if (error) {
      console.error("Payment Error:", error.message);
    } else {
      try {
        const token = localStorage.getItem("token");
        await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/payments/confirm-payment`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ paymentIntentId: paymentIntent.id }),
        });

        setPaymentSuccess(true);

        setTimeout(() => navigate("/user-dashboard/payment-success"), 3000);
      } catch (updateError) {
        console.error("Error updating appointment:", updateError);
      }
    }
  };

  return (
    <div>
      {paymentSuccess && (
        <div className="alert alert-success text-center" role="alert">
          Payment Successful! Redirecting...
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <PaymentElement />
        </div>
        <button type="submit" disabled={!stripe} className="btn btn-warning w-100 fw-bold">
          Pay Now
        </button>
      </form>
    </div>
  );
}

export default CheckoutForm;
