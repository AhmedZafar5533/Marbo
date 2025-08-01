const express = require("express");
const passport = require("passport");
const User = require("../models/User");
const checkAuthetication = require("../middlewares/checkAuthetication");
const checkAdmin = require("../middlewares/checkAdmin");
const checkVendor = require("../middlewares/checkVendor");

const {
    signupSchema,
    loginSchema,
} = require("../Validations/loginSignUpSchema");

const router = express.Router();

router.get("/check", checkAuthetication, async (req, res) => {
    const { password, ...safeUser } = req.user.toObject();
    res.status(200).json({
        user: safeUser,
        isAuthenticated: true,
        otpRequired: false,
    });
});

router.get(
    "/check-vendor",
    checkAuthetication,
    checkVendor,
    async (req, res) => {
        const { password, ...safeUser } = req.user.toObject();
        res.status(200).json({
            user: safeUser,
            isAuthenticated: true,
            otpRequired: false,
        });
    }
);

router.get("/check-admin", checkAuthetication, checkAdmin, (req, res) => {
    const { password, ...safeUser } = req.user.toObject();
    res.status(200).json({
        user: safeUser,
        isAuthenticated: true,
        otpRequired: false,
    });
});

router.post("/signup", async (req, res) => {
    const { error } = signupSchema.validate(req.body);
    if (error) {
        console.log(error);
        return res.status(400).json({ message: error.details[0].message });
    }

    const { username, email, password, confirmPassword, role } = req.body;
    const lowerCasedUsernmae = username.toLowerCase();
    const lowerCasedEmail = email.toLowerCase().trim();
    console.log(req.body);

    if (password !== confirmPassword) {
        return res.status(400).json({ message: "Passwords do not match" });
    }

    try {
        const users = await User.find({
            $or: [{ username: lowerCasedUsernmae }, { email: lowerCasedEmail }],
        });

        const usernameExists = users.some(
            (user) => user.username === lowerCasedUsernmae
        );
        const emailExists = users.some(
            (user) => user.email === lowerCasedEmail
        );

        if (usernameExists || emailExists) {
            const messages = {};
            if (usernameExists) messages.username = "Username already in use";
            if (emailExists) messages.email = "Email already registered";
            console.log(messages);
            return res.status(400).json({ errorMessages: messages });
        }
        let user;
        console.log("here we are");
        if (role === "customer") {
            user = new User({
                username: lowerCasedUsernmae,
                email: lowerCasedEmail,
                password,
                onboardingDone: "yes",
                role: "customer",
            });
            await user.save();
        } else if (role === "vendor") {
            user = new User({
                username: lowerCasedUsernmae,
                email: lowerCasedEmail,
                password,
                onboardingDone: "no",
                role: "vendor",
            });
            await user.save();
        }

        req.logIn(user, async (err) => {
            if (err) {
                return res.status(500).json({ message: "Login failed" });
            }
            try {
                req.session._id = user._id;
                await User.findByIdAndUpdate(user._id, { otpVerified: false });
                res.cookie("redirectToOtp", "true", {
                    httpOnly: true,
                    secure: true,
                    sameSite: "Strict",
                    maxAge: 7 * 60 * 1000,
                });

                return res.status(201).json({
                    otpRequired: true,
                    authenticationStatus: false,
                    message: "User created successfully",
                });
            } catch (sessionErr) {
                console.error(sessionErr);
                return res
                    .status(500)
                    .json({ message: "Session regeneration failed" });
            }
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
    }
});

router.post("/login", (req, res, next) => {
    const { error } = loginSchema.validate(req.body);
    if (error) {
        return res.status(400).json({ message: error.details[0].message });
    }

    req.session.regenerate((err) => {
        if (err)
            return res
                .status(500)
                .json({ message: "Session regeneration failed" });

        passport.authenticate("local", (err, user, info) => {
            if (err) return next(err);
            if (!user) return res.status(401).json({ message: info.message });

            req.logIn(user, async (err) => {
                if (err) return next(err);
                req.session._id = user._id;
                if (!user.signedOtp) {
                    await User.findByIdAndUpdate(user._id, {
                        otpVerified: false,
                    });
                    res.cookie("redirectToOtp", "true", {
                        httpOnly: true,
                        secure: true,
                        sameSite: "Strict",
                        maxAge: 7 * 60 * 1000,
                    });

                    return res.status(403).json({
                        otpRequired: true,
                        authenticationStatus: false,
                        message: "Account not verified",
                    });
                }
                await User.findByIdAndUpdate(user._id, { otpVerified: true });

                res.status(200).json({
                    otpRequired: false,
                    authenticationStatus: true,
                    user: {
                        _id: user._id,
                        username: user.username,
                        email: user.email,
                        role: user.role,
                        prfilePic: user.prfilePic,
                    },
                });
            });
        })(req, res, next);
    });
});

router.get("/logout", async (req, res) => {
    if (!req.user) {
        return res.status(401).json({ message: "Unauthorized" });
    }
    await User.findByIdAndUpdate(req.user._id, {
        otpVerified: false,
    });
    req.logout((err) => {
        if (err) return res.status(500).json({ message: "Logout failed" });

        req.session.destroy(() => {
            res.clearCookie("connect.sid", { path: "/" });
            res.status(200).json({ message: "Logged out successfully" });
        });
    });
});

module.exports = router;
