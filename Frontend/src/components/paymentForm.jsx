import React, { useState, useEffect } from "react";
import { useStripe, useElements, CardElement } from "@stripe/react-stripe-js";

import LoadingSpinner from "./LoadingSpinner";
import { useAuthStore } from "../../Store/authStore";

const PaymentForm = ({ orderData, onSuccess, onError }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [processing, setProcessing] = useState(false);
  const [clientSecret, setClientSecret] = useState("");
  const { user } = useAuthStore();

  useEffect(() => {
    createPaymentIntent();
  }, []);

  const createPaymentIntent = async () => {
    try {
      const response = await fetch(
        "http://localhost:3000/api/payment/create-payment-intent",
        {
          method: "POST",
          body: JSON.stringify({
            orderData,
            userId: user._id,
          }),
          headers: { "Content-Type": "application/json" },
        }
      );

      setClientSecret(await response.data.clientSecret);
    } catch (error) {
      console.error("Error creating payment intent:", error);
      onError("Failed to initialize payment");
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!stripe || !elements || !clientSecret) {
      return;
    }

    setProcessing(true);

    const { error, paymentIntent } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: `${window.location.origin}/payment-success`,
      },
      redirect: "if_required",
    });

    if (error) {
      console.error("Payment failed:", error);
      onError(error.message);
    } else if (paymentIntent.status === "succeeded") {
      onSuccess(paymentIntent);
    }

    setProcessing(false);
  };

  const cardElementOptions = {
    style: {
      base: {
        fontSize: "16px",
        color: "#424770",
        "::placeholder": {
          color: "#aab7c4",
        },
      },
    },
  };

  if (!clientSecret) {
    return <LoadingSpinner />;
  }

  return (
    <form onSubmit={handleSubmit} className="payment-form">
      <div className="card-element-container">
        <CardElement options={cardElementOptions} />
      </div>

      <button
        type="submit"
        disabled={!stripe || processing}
        className="payment-button"
      >
        {processing ? "Processing..." : `Pay $10`}
      </button>
    </form>
  );
};

export default PaymentForm;
