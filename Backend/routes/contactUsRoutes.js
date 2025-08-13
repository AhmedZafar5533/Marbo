const Contact = require("../models/contactUs");

const express = require("express");
const router = express.Router();
const contactUsSchema = require("../Validations/contactUs");
const checkAdmin = require("../middlewares/checkAdmin");
const {  sendReplyEmail } = require("../Utils/mailer");

router.post("/user", async (req, res) => {
  try {
    const reason = req.body.reason;

    let contactBody = req.body;
    const userId = req.user ? req.user._id : null;

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
      useId: userId,
      email: email,
      reason: reason,
      message: message,
    });
    await newContactFromUser.save();
    res.status(201).json({
      message: "Your message has been sent successfully.",
    });
  } catch (error) {
    res.status(500).json({
      message: "Error sending message. Please try again!",
    });
  }
});

router.get("/get/all", checkAdmin, async (req, res) => {
  try {
    const contacts = await Contact.find({}).sort({ createdAt: -1 }).lean();
    res.status(200).json({
      success: true,
      data: contacts,
    });
  } catch (error) {
    console.error("Error fetching contacts:", error);
    res.status(500).json({
      success: false,
      error: "Failed to retrieve contacts",
    });
  }
});

router.delete("/delete/:id", checkAdmin, async (req, res) => {
  try {
    const contactId = req.params.id;
    const contact = await Contact.findByIdAndDelete(contactId);
    if (!contact) {
      return res.status(404).json({ message: "Contact not found" });
    }

    res.status(200).json({ message: "Contact deleted successfully" });
  } catch (error) {
    console.error("Error deleting contact:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

router.post("/reply/:id", checkAdmin, async (req, res) => {
  try {
    const contactId = req.params.id;
    const reply = req.body.reply;
    console.log("Replying to contact:", contactId, reply);
    const contact = await Contact.findById(contactId);
    if (!contact) {
      return res.status(404).json({ message: "Contact not found" });
    }
    contact.reply = reply;
    contact.replied = true;

    await sendReplyEmail({
      email: contact.email,
      reply: reply,
      reason: contact.reason,
      message: contact.message,
    });
    await contact.save();

    res.status(200).json({ message: "Reply sent successfully" });
  } catch (error) {
    console.error("Error replying to contact:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

module.exports = router;
