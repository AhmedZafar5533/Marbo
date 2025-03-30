const express = require("express");
const router = express.Router();
const Subscription = require("../models/subscription");
const auth = require("../middlewares/checkAuthetication");
const vendors = require("../models/vendors");

router.post("/subscribe", auth, async (req, res) => {
    try {
        const vendor = await vendors.findOne({ userId: req.user._id });
        console.log(vendor);
        if (!vendor)
            return res
                .status(400)
                .json({ message: "Venodr is not registered" });

        const { type, billing, price } = req.body;
        console.log(req.body);
        console.log("here we are");
        if (!type) {
            return res
                .status(400)
                .json({ message: "Subscription Type is required" });
        }
        const existingSubscription = await Subscription.findOne({
            userId: req.user._id,
        });
        if (existingSubscription) {
            return res.status(400).json({ message: "Already Subscribed" });
        }
        const newSubscription = new Subscription({
            userId: req.user._id,
            vendorId: vendor._id,
            billingCycle: billing,
            price: price,
            subscriptionType: type,
        });
        await newSubscription.save();
        res.status(201).json({ message: "Subscribed Successfully" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});
router.get("/subscriptions", auth, async (req, res) => {
    try {
        
        const subscriptions = await Subscription.findOne({ userId: req.user._id });
        console.log(subscriptions);
        res.json(subscriptions);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.put("/unsubscribe", auth, async (req, res) => {
    try {
        const subscription = await Subscription.findOneAndDelete({
            vendorId: req.body.vendorId,
            userId: req.user._id,
        });
        if (!subscription) {
            return res.status(400).json({ message: "Subscription not found" });
        }
        res.json({ message: "Unsubscribed Successfully" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.put("/updateSubscription", auth, async (req, res) => {
    try {
        const subscription = await Subscription.findOneAndUpdate(
            {
                vendorId: req.body.vendorId,
                userId: req.user._id,
            },
            req.body,
            { new: true }
        );
        if (!subscription) {
            return res.status(400).json({ message: "Subscription not found" });
        }
        res.json(subscription);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
