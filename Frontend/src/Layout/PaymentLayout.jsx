import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { useEffect, useState } from "react";
import CheckoutForm from "../Pages/checkoutPage";
import { useCartStore } from "../../Store/cartStore";

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);
const baseUrl = import.meta.env.VITE_BACKEND_URL || "http://localhost:3000";

const CheckoutPage = () => {
  const { cart } = useCartStore();
  const [clientSecret, setClientSecret] = useState("");

  useEffect(() => {
    if (cart.length === 0) return;

    const total = cart.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );

    fetch(`${baseUrl}/checkout/create-payment-intent`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ amount: total, cartItems: cart }),
    })
      .then((res) => res.json())
      .then((data) => {
        console.log("Client Secret:", data.clientSecret);
        setClientSecret(data.clientSecret);
      });
  }, [cart]);

  if (!clientSecret) return <div>Loading payment...</div>;

  return (
    <Elements stripe={stripePromise} options={{ clientSecret }}>
      <CheckoutForm />
    </Elements>
  );
};

export default CheckoutPage;
