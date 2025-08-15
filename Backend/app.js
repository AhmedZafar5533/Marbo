require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const passport = require("passport");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const cors = require("cors");
const morgan = require("morgan");
const mongoSanitize = require("express-mongo-sanitize");
const cookieParser = require("cookie-parser");

const authRoutes = require("./routes/authRoutes");
const otpRoutes = require("./routes/otpRoutes");
const vendorRoutes = require("./routes/vendorRoutes");
const adminRoutes = require("./routes/adminRoutes");
const servicePageRouter = require("./routes/servicesRouter");
const subscriptionRouter = require("./routes/subscriptionRoutes");
const passwordResetRouter = require("./routes/forgetPasswordRoute");
const contactUsRoutes = require("./routes/contactUsRoutes");
const addProductsRouter = require("./routes/productroutes");
const moneyTransferRoutes = require("./routes/moneyTransfer");
const domesticStaffingRoutes = require("./routes/domesticStaffingRoutes");
const activeServices = require("./models/activeServices");

require("./config/local-auth");

const app = express();

// STEP 1: Trust proxy
app.set("trust proxy", "1");

// STEP 2: CORS (before webhook)
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

// STEP 3: Webhook FIRST - Direct approach with raw body
// Enhanced webhook handler for production debugging
app.post(
  "/api/webhook",
  express.raw({ type: "application/json" }),
  async (req, res) => {
    const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
    const payment = require("./models/payment");
    const MainOrder = require("./models/MainOrders");
    const ServiceOrder = require("./models/suborders");
    const cartSchema = require("./models/cartSchema");

    const sig = req.headers["stripe-signature"];
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

    // Enhanced logging for production debugging
    console.log("Production Webhook Debug:", {
      timestamp: new Date().toISOString(),
      hasSignature: !!sig,
      signatureLength: sig ? sig.length : 0,
      bodyType: typeof req.body,
      bodyLength: req.body ? req.body.length : 0,
      bodyIsBuffer: Buffer.isBuffer(req.body),
      contentType: req.headers["content-type"],
      userAgent: req.headers["user-agent"],
      webhookSecretSet: !!webhookSecret,
      webhookSecretPrefix: webhookSecret
        ? webhookSecret.substring(0, 8) + "..."
        : "not set",
      environment: process.env.NODE_ENV || "development",
    });

    // Verify environment variables
    if (!webhookSecret) {
      console.error("STRIPE_WEBHOOK_SECRET is not set!");
      return res.status(500).send("Webhook secret not configured");
    }

    if (!process.env.STRIPE_SECRET_KEY) {
      console.error("STRIPE_SECRET_KEY is not set!");
      return res.status(500).send("Stripe secret key not configured");
    }

    // Verify we have a Buffer
    if (!Buffer.isBuffer(req.body)) {
      console.error("Request body is not a Buffer:", {
        type: typeof req.body,
        constructor: req.body?.constructor?.name,
        sample: JSON.stringify(req.body).substring(0, 100),
      });
      return res.status(400).send("Invalid body format - expected Buffer");
    }

    // Verify signature exists
    if (!sig) {
      console.error("No Stripe signature found in headers");
      return res.status(400).send("Missing Stripe signature");
    }

    let event;
    try {
      event = stripe.webhooks.constructEvent(req.body, sig, webhookSecret);
      console.log("Webhook signature verified successfully:", event.type);
    } catch (err) {
      console.error("Webhook signature verification failed:", {
        error: err.message,
        signature: sig ? sig.substring(0, 20) + "..." : "none",
        bodySize: req.body.length,
        webhookSecret: webhookSecret
          ? webhookSecret.substring(0, 8) + "..."
          : "none",
      });
      return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    try {
      switch (event.type) {
        case "payment_intent.succeeded": {
          console.log("Processing payment_intent.succeeded...");
          const paymentIntent = event.data.object;

          if (!paymentIntent.metadata?.cartItems) {
            console.error("No cartItems in payment intent metadata");
            return res.status(400).send("Missing cart items metadata");
          }

          let itemData;
          try {
            itemData = JSON.parse(paymentIntent.metadata.cartItems);
          } catch (parseErr) {
            console.error("Failed to parse cart items:", parseErr.message);
            return res.status(400).send("Invalid cart items format");
          }

          console.log("Processing payment for items:", itemData.length);

          // Use Promise.all with better error handling
          const paymentResults = await Promise.allSettled(
            itemData.map(async (item) => {
              return payment.create({
                userId: item.userId,
                serviceId: item.serviceId,
                productId: item.productId,
                amount: item.amount,
                stipePaymentId: paymentIntent.id,
                status: paymentIntent.status,
                currency: paymentIntent.currency,
              });
            })
          );

          // Check for failed payments
          const failedPayments = paymentResults.filter(
            (result) => result.status === "rejected"
          );
          if (failedPayments.length > 0) {
            console.error(
              "Some payment records failed to create:",
              failedPayments
            );
          }

          // Update orders
          const mainOrderResult = await MainOrder.findOneAndUpdate(
            { userId: itemData[0].userId, isPaid: false },
            { isPaid: true },
            { new: true } 
          );

          console.log("Main order update result:", mainOrderResult);

          const serviceOrderResult = await ServiceOrder.updateMany(
            { userId: itemData[0].userId },
            { isPaid: true }
          );

          // Clear cart
          const cartResult = await cartSchema.deleteMany({
            userId: itemData[0].userId,
          });
          console.log("Cart cleared:", cartResult.deletedCount, "items");

          break;
        }

        case "payment_intent.payment_failed": {
          const failedIntent = event.data.object;
          console.log("Payment failed:", {
            id: failedIntent.id,
            error: failedIntent.last_payment_error?.message,
          });
          break;
        }

        default:
          console.log(`Unhandled event type: ${event.type}`);
      }
    } catch (err) {
      console.error("Error processing webhook event:", {
        error: err.message,
        stack: err.stack,
        eventType: event?.type,
      });
      return res.status(500).send("Internal Server Error");
    }

    console.log("Webhook processed successfully");
    res.status(200).json({ received: true });
  }
);

// STEP 4: Now apply JSON parsing for all other routes
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true, limit: "50mb" }));

// STEP 5: Database connection
mongoose
  .connect(process.env.DB_URL)
  .then(() => console.log("Database Connected"))
  .catch((err) => console.log("Database connection error:", err));

require("./config/local-auth")(passport);

// STEP 6: Other middleware
app.use(morgan("dev"));
app.use(mongoSanitize());
app.use(cookieParser());

// STEP 7: Session store setup
const store = MongoStore.create({
  mongoUrl: process.env.DB_URL,
  ttl: 24 * 60 * 60,
  autoRemove: "interval",
  autoRemoveInterval: 10,
});

store.on("error", (error) => {
  console.error("Session store error:", error);
});

store.on("destroy", async (sessionId) => {
  try {
    const sessionData = await mongoose.connection.db
      .collection("sessions")
      .findOne({ _id: sessionId });

    if (sessionData && sessionData.session) {
      const userId = sessionData.session.userId;
      if (userId) {
        const User = require("./models/User"); // Make sure User model is imported
        await User.findByIdAndUpdate(userId, { otpVerified: false });
      }
    }
  } catch (err) {
    console.error("Error in session destroy handler:", err);
  }
});

app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    store: store,
    cookie: {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 7 * 24 * 60 * 60 * 1000, // Fixed: was missing * 1000
    },
  })
);

app.use(passport.initialize());
app.use(passport.session());

// Root route
app.get("/", (req, res) => {
  res.json({ message: "Welcome to the backend", status: "running" });
});

// All other routes (after webhook)
app.use("/api/auth", authRoutes);
app.use("/api/otp", otpRoutes);
app.use("/api/vendor", vendorRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/subscription", subscriptionRouter);
app.use("/api/service-page", servicePageRouter);
app.use("/api/forget-password", passwordResetRouter);
app.use("/api/contact-us", contactUsRoutes);
app.use("/api/products", addProductsRouter);
app.use("/api/money", moneyTransferRoutes);
app.use("/api/domestic-staffing", domesticStaffingRoutes);
app.use("/api/holiday-lets", require("./routes/holidayLetsRoutes"));
app.use("/api/hotel-rooms", require("./routes/hotelRoutes"));
app.use("/api/clothing", require("./routes/clothingRoutes"));
app.use("/api/medical", require("./routes/medicalRoutes"));
app.use("/api/orders", require("./routes/orderRoutes"));
app.use("/api/cart", require("./routes/cartRoutes"));
app.use("/api/bill", require("./routes/billPaymentRoutes"));
app.use("/api/payment", require("./routes/paymentRoutes"));
app.use("/api/reviews", require("./routes/reviewRoutes"));
app.use("/api/checkout", require("./routes/checkoutRoutes"));

// Error handling middleware
app.use((err, req, res, next) => {
  console.error("Global error handler:", err);
  res.status(500).json({ error: "Internal server error" });
});

// Initialize services script
const scriptToRun = async () => {
  try {
    const serviceTitles = [
      "Groceries",
      "Interior Design",
      "Domestic Staffing",
      "Utility Payments",
      "Water Bill Payments",
      "School Fee Payments",
      "Traditional Clothing",
      "Holiday Lets",
      "Arts & Crafts",
      "Fashion Services",
      "Hotel Booking",
      "Medical Care",
      "Health Insurance",
      "Properties for Sale",
      "Rental Properties",
      "Land Acquisition",
      "Property Management",
      "Money Transfer Services",
      "Mortgage Services",
      "Banking Services",
      "Rent Collection",
      "Tech Supplies",
      "Telecom Services",
      "Construction Services",
      "Hardware Suppliers",
      "Agricultural Services",
      "Event Management",
    ];

    for (const title of serviceTitles) {
      await activeServices.findOneAndUpdate(
        { title },
        { title },
        { upsert: true, new: true }
      );
    }
    console.log("Services initialized successfully");
  } catch (error) {
    console.error("Error initializing services:", error);
  }
};

if (process.env.initialRun === "yes") {
  scriptToRun();
}

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Webhook endpoint: http://localhost:${PORT}/api/webhook`);
});
