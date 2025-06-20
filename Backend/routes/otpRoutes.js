const express = require("express");
const crypto = require("crypto");
const bcrypt = require("bcrypt");
const Otp = require("../models/Otp");
const User = require("../models/User");
const { sendOtpEmail } = require("../Utils/mailer");
const { otpSchema } = require("../Validations/otpSchema");

const router = express.Router();

router.get("/gen-otp", async (req, res) => {
    try {
        if (!req.user) return res.status(401).json({ message: "Unauthorized" });
        const { _id: userId } = req.user;
        console.log(userId);

        let otpDoc = await Otp.findOne({ userId });

        if (otpDoc) {
            const resetTime = new Date(
                otpDoc.resetTime.getTime() + 30 * 60 * 1000
            );
            if (new Date() > resetTime) {
                await Otp.deleteOne({ userId });
                otpDoc = null;
            }
        }

        if (otpDoc && otpDoc.generationAttempts >= 5) {
            return res.status(400).json({
                message:
                    "OTP generation limit reached. Please wait 5 minutes before trying again.",
            });
        }

        delete req.session.otpBlocked;

        const length = 6;
        const min = Math.pow(10, length - 1);
        const max = Math.pow(10, length) - 1;
        const newOtp = crypto.randomInt(min, max + 1).toString();
        console.log(newOtp);
        const hashedOtp = await bcrypt.hash(newOtp, 10);

        if (otpDoc) {
            otpDoc.otp = hashedOtp;
            otpDoc.attempts = 0;
            otpDoc.generationAttempts += 1;
            await otpDoc.save();
        } else {
            const newOtpDoc = new Otp({
                userId: userId,
                otp: hashedOtp,
                generationAttempts: 1,
                resetTime: new Date(Date.now() + 30 * 60 * 1000),
            });
            await newOtpDoc.save();
        }

        await sendOtpEmail(req.user.email, newOtp);

        return res.status(200).json({
            message: "OTP generated and sent successfully",
        });
    } catch (err) {
        console.error("Error in /gen-otp:", err);

        // Only one response sent from here
        return res.status(500).json({
            message: "Internal server error while generating OTP",
        });
    }
});

router.post("/verify-otp", async (req, res) => {
    try {
        if (req.session.otpBlocked) {
            return res.status(400).json({
                message:
                    "Maximum verification attempts reached. Please generate a new OTP.",
                authenticationStatus: false,
            });
        }

        if (!req.user) return res.status(401).json({ message: "Unauthorized" });
        const { error } = otpSchema.validate(req.body);
        if (error) {
            return res.status(400).json({ message: error.details[0].message });
        }
        const { _id: userId } = req.user;
        const { otp } = req.body;
        const otpDoc = await Otp.findOne({ userId: userId });

        if (!otpDoc) {
            return res.status(400).json({
                message: "OTP not generated or expired",
                authenticationStatus: false,
            });
        }

        const otpExpiry = new Date(otpDoc.createdAt.getTime() + 5 * 60 * 1000);
        if (new Date() > otpExpiry) {
            await Otp.deleteOne({ userId });
            return res.status(400).json({
                message: "OTP expired, please generate a new one",
                authenticationStatus: false,
            });
        }

        if (otpDoc.attempts >= 5) {
            req.session.otpBlocked = true;
            return res.status(400).json({
                message:
                    "Maximum verification attempts reached. Please generate a new OTP.",
                authenticationStatus: false,
            });
        }

        const isMatch = await bcrypt.compare(otp, otpDoc.otp);
        console.log(isMatch);
        if (!isMatch) {
            otpDoc.attempts += 1;
            await otpDoc.save();
            return res
                .status(400)
                .json({ message: "Invalid OTP", authenticationStatus: false });
        }

        await User.findByIdAndUpdate(userId, {
            otpVerified: true,
            signedOtp: true,
        });

        await Otp.deleteOne({ userId });
        delete req.session.otpBlocked;
        res.clearCookie("redirectToOtp");
        res.status(200).json({
            message: "OTP verified successfully",
            authenticationStatus: true,
            data: req.user,
            otpRequired: false,
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({
            message: "Internal server error while verifying OTP",
        });
    }
});
module.exports = router;
