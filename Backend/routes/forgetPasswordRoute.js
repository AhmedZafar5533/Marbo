const jwt = require("jsonwebtoken");
const express = require("express");
const router = express.Router();
const User = require("../models/User");
const {
    passwordResetEmailSchema,
    newPasswordSchema,
} = require("../Validations/resetPasswordSchema");
const { sendPasswordResetEmail } = require("../Utils/mailer");

const RESET_SECRET = process.env.Jwt_Secret || "super_secret_reset_key";
const RESET_TOKEN_EXPIRY = "5m";
const COOKIE_EXPIRY = 5 * 60 * 1000; // Same as JWT expiration (in milliseconds)

router.post("/send/reset/link", async (req, res) => {
    const { email } = req.body;

    // Validate input
    if (!email) {
        return res.status(400).json({ message: "Email is required" });
    }

    const { error } = passwordResetEmailSchema.validate(req.body);
    if (error) {
        return res.status(400).json({ message: error.details[0].message });
    }

    try {
        const lowerCasedEmail = email.toLowerCase().trim();
        const user = await User.findOne({ email: lowerCasedEmail });

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // Generate reset token
        const resetToken = jwt.sign(
            { id: user._id, email: user.email },
            RESET_SECRET,
            { expiresIn: RESET_TOKEN_EXPIRY }
        );

        // Create reset URL (adjust frontend URL as needed)
        const resetLink = `http://localhost:5173/reset-password/${resetToken}`;

        // Send password reset email with reset link
        await sendPasswordResetEmail(user, resetLink, RESET_TOKEN_EXPIRY);

        // Store JWT in a secure cookie with expiration
        res.cookie("resetToken", resetToken, {
            httpOnly: true,
            secure: true, // Use secure cookies only in production
            sameSite: "Strict",
            maxAge: COOKIE_EXPIRY, // The cookie expires after the same duration as the token
        });

        res.status(200).json({ message: "Reset link sent to your email." });
    } catch (error) {
        console.error("Forgot Password Error:", error);
        res.status(500).json({ message: "Server error" });
    }
});

router.post("/reset", async (req, res) => {
    const { newPassword, confirmPassword } = req.body;

    // Validate inputs
    const { error } = newPasswordSchema.validate({
        newPassword,
        confirmPassword,
    });
    if (error) {
        return res.status(400).json({ message: error.details[0].message });
    }

    try {
        // Get JWT from cookie
        const token = req.cookies.resetToken;
        console.log(token)
        if (!token) {
            return res
                .status(400)
                .json({ message: "Token not found or expired" });
        }

        // Verify the token
        const decoded = jwt.verify(token, RESET_SECRET); // This will check for expiration as well

        // Find user by ID
        const user = await User.findById(decoded.id);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // Update user password
        user.password = newPassword;
        await user.save();

        // Clear the reset token cookie
        res.clearCookie("resetToken");

        res.status(200).json({ message: "Password reset successful." });
    } catch (error) {
        console.error("Reset Password Error:", error);
        return res.status(400).json({ message: "Invalid or expired token" });
    }
});

module.exports = router;
