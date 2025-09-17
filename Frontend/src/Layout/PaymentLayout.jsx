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
  const { cart, loading, getCart } = useCartStore();
  const { user } = useAuthStore();
  const [clientSecret, setClientSecret] = useState("");

  useEffect(() => {
    getCart();
  }, [getCart]);

  const total = useMemo(
    () => cart.reduce((sum, item) => sum + item.price * item.quantity, 0),
    [cart]
  );

  const cartDependency = useMemo(
    () =>
      JSON.stringify({
        email: user?.email,
        items: cart.map((item) => ({
          id: item.id,
          price: item.price,
          quantity: item.quantity,
        })),
      }),
    [cart, user?.email]
  );

  useEffect(() => {
    if (loading) return; // wait until finished loading
    if (cart.length === 0) return; // don't fetch if empty cart

    fetch(`${baseUrl}/checkout/create-payment-intent`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ amount: total, cartItems: cart }),
      credentials: "include",
    })
      .then((res) => res.json())
      .then((data) => {
        console.log("Client Secret:", data.clientSecret);
        setClientSecret(data.clientSecret);
      })
      .catch((error) => {
        console.error("Error creating payment intent:", error);
      });
  }, [loading, cartDependency, total]);

  // 1. While loading
  if (loading) return <LoadingSpinner />;

  // 2. After loading: cart is empty
  if (!loading && cart.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-64 text-center">
        <img
          src="/empty-cart.svg"
          alt="Empty Cart"
          className="w-32 h-32 mb-4 opacity-80"
        />
        <h2 className="text-xl font-semibold text-gray-700">
          Your cart is empty
        </h2>
        <p className="text-gray-500 mt-2">
          Looks like you haven’t added anything yet.
        </p>
      </div>
    );
  }

  // 3. Cart loaded & has items, but client secret not ready yet
  if (!clientSecret) return <LoadingSpinner />;

  // 4. Cart loaded & clientSecret ready
  return (
    <Elements stripe={stripePromise} options={{ clientSecret }}>
      <CheckoutForm />
    </Elements>
  );
};

export default CheckoutPage;
