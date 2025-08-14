import React, { useState, useEffect } from "react";
import { useStripe, useElements, CardElement } from "@stripe/react-stripe-js";

import LoadingSpinner from "./LoadingSpinner";
import { useAuthStore } from "../../Store/authStore";

const PaymentForm = ({ orderData, onSuccess, onError }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [processing, setProcessing] = useState(false);
  const [clientSecret, setClientSecret] = useState("");

  // The original code had an issue that could cause an infinite re-render loop.
  // The problem arises if the props `orderData` (an object) or `onError` (a function)
  // are recreated on every render of the parent component.
  //
  // The fix is to move the payment intent creation logic directly into `useEffect`
  // and define a clear dependency array. This makes the data flow easier to follow.
  useEffect(() => {
    // Define the async function inside the effect to capture the current props and state.
    const createPaymentIntent = async () => {
      // Guard clause to prevent fetching if essential data like orderData or user is missing.
      if (!orderData) {
        console.log(
          "Missing orderData or user ID, skipping payment intent creation."
        );
        return;
      }

      try {
        // const response = await fetch(
        //   "http://localhost:3000/api/payment/create-payment-intent",
        //   {
        //     method: "POST",
        //     body: JSON.stringify({
        //       orderData,
        //       userId: user._id,
        //     }),
        //     headers: { "Content-Type": "application/json" },
        //   }
        // );

        const data = "ahmed";

        setClientSecret("ajlkjskljsk");
      } catch (error) {
        console.error("Error creating payment intent:", error);
        onError(error.message || "Failed to initialize payment");
      }
    };

    createPaymentIntent();
  }, [orderData, user?._id, onError]);

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!stripe || !elements || !clientSecret) {
      // Don't proceed if Stripe.js has not loaded or the payment intent is missing.
      return;
    }

    setProcessing(true);

    // Using `confirmCardPayment` is the correct method when using a standalone `CardElement`.
    const { error, paymentIntent } = await stripe.confirmCardPayment(
      clientSecret, // The client secret obtained from your server
      {
        payment_method: {
          card: elements.getElement(CardElement),
          billing_details: {
            // It's good practice to include billing details.
            name: user?.name || "Guest",
            email: user?.email,
          },
        },
      }
    );

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
      invalid: {
        color: "#9e2146",
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
