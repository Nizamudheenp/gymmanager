import React from "react";
import { useStripe, useElements, PaymentElement } from "@stripe/react-stripe-js";
import { useNavigate } from "react-router-dom";

function CheckoutForm() {
  const stripe = useStripe();
  const elements = useElements();
  const navigate = useNavigate(); // ✅ React Router navigation
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
  
        alert("Payment Successful!");
        navigate("/user-dashboard/payment-success");
      } catch (updateError) {
        console.error("Error updating appointment:", updateError);
      }
    }
  };
  
  
  
  return (
    <form onSubmit={handleSubmit}>
      <PaymentElement />
      <button type="submit" disabled={!stripe}>Pay Now</button>
    </form>
  );
}

export default CheckoutForm;
