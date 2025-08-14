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
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

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
const payment = require("./models/payment");
const MainOrder = require("./models/MainOrders");
const ServiceOrder = require("./models/suborders");
const cartSchema = require("./models/cartSchema");

require("./config/local-auth");

const app = express();

app.post(
  "/api/webhook",
  express.raw({ type: "application/json" }),
  async (req, res) => {
    const sig = req.headers["stripe-signature"];
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

    let event;
    try {
      event = stripe.webhooks.constructEvent(req.body, sig, webhookSecret);
    } catch (err) {
      console.error("Webhook signature verification failed:", err.message);
      return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    switch (event.type) {
      case "payment_intent.succeeded": {
        const paymentIntent = event.data.object;
        const itemData = JSON.parse(paymentIntent.metadata.cartItems);
        const paymentMethod = paymentIntent.payment_method;
        console.log("this is the payment method", paymentMethod, itemData[0]);
        itemData.map(async (item) => {
          await payment.create({
            userId: item.userId,
            serviceId: item.serviceId,
            productId: item.productId,
            amount: item.amount,
            stipePaymentId: paymentIntent.id,
            status: paymentIntent.status,
            currency: paymentIntent.currency,
          });
        });
        await MainOrder.updateOne(
          {
            userId: itemData[0].userId,
          },
          {
            isPaid: true,
          }
        );
        await ServiceOrder.updateMany(
          {
            userId: itemData[0].userId,
          },
          {
            isPaid: true,
          }
        );

        const result = await cartSchema.deleteMany({
          userId: itemData[0].userId,
        });
        console.log("Cart items deleted:", result.deletedCount, result);
        break;
      }

      case "payment_intent.payment_failed": {
        const failedIntent = event.data.object;
        console.log(
          " Payment failed:",
          failedIntent.id,
          failedIntent.last_payment_error?.message
        );
        // TODO: Notify user, log error, etc.
        break;
      }

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    res.json({ received: true });
  }
);

app.use(express.json());

app.set("trust proxy", "1");

mongoose
  .connect(process.env.DB_URL)
  .then(() => console.log("Database Connected"))
  .catch((err) => console.log(err));

require("./config/local-auth")(passport);

app.use(morgan("dev"));
app.use(mongoSanitize());
app.use(cookieParser());

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

const store = MongoStore.create({
  mongoUrl: process.env.DB_URL,
  ttl: 24 * 60 * 60,
  autoRemove: "interval",
  autoRemoveInterval: 10,
});

store.on("destroy", async (sessionId) => {
  try {
    const sessionData = await mongoose.connection.db
      .collection("sessions")
      .findOne({ _id: sessionId });

    if (sessionData && sessionData.session) {
      const userId = sessionData.session.userId;
      if (userId) {
        await User.findByIdAndUpdate(userId, { otpVerified: false });
      }
    }
  } catch (err) {
    console.error(err);
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
      maxAge: 7 * 24 * 1000 * 60 * 60,
    },
  })
);

app.use(passport.initialize());
app.use(passport.session());

app.get("/", (req, res) => {
  res.send("Welcome to the backend");
});

// app.post(
//   "/api/checkout/webhook",
//   express.raw({ type: "application/json" }),
//   checkoutWebhook
// );

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

const scriptToRun = async () => {
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
    await activeServices.create({ title });
  }
};

if (process.env.initialRun === "yes") {
  scriptToRun();
}

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
