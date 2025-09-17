// server.js
const express = require("express");
const checkAuthetication = require("../middlewares/checkAuthetication");
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

const router = express.Router();

router.post("/create-payment-intent", checkAuthetication, async (req, res) => {
  try {
    const { amount, cartItems } = req.body;
    console.log(cartItems);
    console.log(req.user);
    const data = cartItems.map((item) => ({
      productId: item.productId,
      serviceId: item.serviceId,
      amount: item.price * item.quantity,
    }));
    console.log("Data to be sent to Stripe:", data);
    const paymentIntent = await stripe.paymentIntents.create({
      amount: amount * 100,
      currency: "usd",

      metadata: {
        email: req.user.email,
        userId: JSON.stringify(req.user._id),
        cartItems: JSON.stringify(data),
      },
      automatic_payment_methods: {
        enabled: true,
      },
    });
    console.log("Payment Intent created:", paymentIntent.client_secret);
    res.send({
      clientSecret: paymentIntent.client_secret,
    });
  } catch (error) {
    console.error("Error creating payment intent:", error);
    res.status(400).send({
      error: {
        message: error.message,
      },
    });
  }
});

module.exports = router;
