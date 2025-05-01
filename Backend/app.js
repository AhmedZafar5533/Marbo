const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
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
require("./config/local-auth");

dotenv.config();
const app = express();

mongoose
    .connect(process.env.DB_URL)
    .then(() => console.log("Database Connected"))
    .catch((err) => console.log(err));

require("./config/local-auth")(passport);

app.use(express.json({ limit: "5mb" }));
app.use(mongoSanitize());
app.use(morgan("dev"));
app.use(cookieParser());

app.use(
    cors({
        origin: process.env.FRONTEND_URL || "http://localhost:5173",
        credentials: true,
    })
);
const store = MongoStore.create({
    mongoUrl: process.env.DB_URL,
    ttl: 24 * 60 * 60,
    autoremove: "interval",
    autoRemoveInterval: 10,
});

store.on("destroy", async (sessionId) => {
    try {
        console.log(`Session expired: ${sessionId}`);
        const sessionData = await mongoose.connection.db
            .collection("sessions")
            .findOne({ _id: sessionId });

        if (sessionData && sessionData.session) {
            const userId = sessionData.session.userId;
            if (userId) {
                await User.findByIdAndUpdate(userId, { otpVerified: false });
                console.log(`Reset otpVerified for user: ${userId}`);
            }
        }
    } catch (err) {
        console.error("Error resetting otpVerified on session expiry:", err);
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
            maxAge: 24 * 1000 * 60 * 60,
        },
    })
);

app.use(passport.initialize());
app.use(passport.session());

app.get("/", (req, res) => {
    res.send("Welcome to the backend");
});

app.use("/api/auth", authRoutes);
app.use("/api/otp", otpRoutes);
app.use("/api/vendor", vendorRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/subscription", subscriptionRouter);
app.use("/api/service-page", servicePageRouter);
app.use("/api/forget-password", passwordResetRouter);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
