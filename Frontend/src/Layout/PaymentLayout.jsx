import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { useEffect, useState, useMemo } from "react";
import CheckoutForm from "../Pages/checkoutPage";
import { useCartStore } from "../../Store/cartStore";
import LoadingSpinner from "../components/LoadingSpinner";
import { useAuthStore } from "../../Store/authStore";

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);
const baseUrl = import.meta.env.VITE_BACKEND_URL || "http://localhost:3000";

const CheckoutPage = () => {
  const { cart } = useCartStore();
  const { user } = useAuthStore();
  const [clientSecret, setClientSecret] = useState("");

  // Create a stable dependency by memoizing cart serialization
  const cartDependency = useMemo(
    () =>
      JSON.stringify(
        user?.email,
        cart.map((item) => ({
          id: item.id,
          price: item.price,
          quantity: item.quantity,
        }))
      ),
    [cart]
  );

  // Calculate total in useMemo to avoid recalculation
  const total = useMemo(
    () => cart.reduce((sum, item) => sum + item.price * item.quantity, 0),
    [cart]
  );

  useEffect(() => {
    if (cart.length === 0) return;

    fetch(`${baseUrl}/checkout/create-payment-intent`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ amount: total, cartItems: cart }),
    })
      .then((res) => res.json())
      .then((data) => {
        console.log("Client Secret:", data.clientSecret);
        setClientSecret(data.clientSecret);
      })
      .catch((error) => {
        console.error("Error creating payment intent:", error);
      });
  }, [cartDependency, total]);

  if (!clientSecret) return <LoadingSpinner />;

  return (
    <Elements stripe={stripePromise} options={{ clientSecret }}>
      <CheckoutForm />
    </Elements>
  );
};

export default CheckoutPage;
