const Contact = require("../models/contactUs");

const express = require("express");
const router = express.Router();
const contactUsSchema = require("../Validations/contactUs");

router.post("/user", async (req, res) => {
    try {
        const reason = req.body.reason;
        let contactBody = req.body;
        // const reason = req.body.reason || req.body.otherReason;
        if (reason === "other")
            contactBody = {
                email: req.body.email,
                reason: req.body.otherReason,
                message: req.body.message,
            };
        else
            contactBody = {
                email: req.body.email,
                reason: req.body.reason,
                message: req.body.message,
            };
        console.log(contactBody);

        const { error } = contactUsSchema.validate(contactBody);

        if (error) {
            console.log(error);
            return res.status(400).json({ message: error.details[0].message });
        }
        console.log("Contact Us data:", req.body);
        const { email, message } = req.body;
        if (!email || !message || !reason) {
            return res.status(400).json({ message: "All fields are required" });
        }
        const newContactFromUser = new Contact({
            email: email,
            reason: reason,
            message: message,
        });
        await newContactFromUser.save();
        res.status(200).json({
            message: "Your message has been sent successfully.",
        });
    } catch (error) {
        res.status(500).json({
            message: "Error sending message. Please try again!",
        });
    }
});

module.exports = router;
