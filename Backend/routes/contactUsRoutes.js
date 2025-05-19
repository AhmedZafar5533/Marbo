const Contact = require("../models/contactUs");

const express = require("express");
const router = express.Router();

router.post("/user", async (req, res) => {
    try {
        const { email, message, reason } = req.body;
        if (!email || !message || !reason) {
            return res.status(400).json({ message: "All fields are required" });
        }
        const newContactFromUser = new Contact({
            email: email,
            reason: reason,
            message: message,
        });
        await newContactFromUser.save();
        res.status(200).json({message: "Your message has been sent successfully."})
    } catch (error) {
        res.status(500).json({message: "Error sending message. Please try again!"})
    }
});
