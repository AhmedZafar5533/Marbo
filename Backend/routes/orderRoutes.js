const Service = require("../models/service");

const Order = require("../models/orders");

const express = require("express");
const checkAuthetication = require("../middlewares/checkAuthetication");

const router = express.Router();

router.post("/add/:serviceId", checkAuthetication, async (req, res) => {
    try {
        const service = await Service.findOne({
            _id: req.params.serviceId,
        });
        if (!service)
            return res.status(404).json({ message: "Service not found" });
        const newOrder = await Order.create({
            ...req.body,
            userId: req.user._id,
            serviceId: service._id,
            vendorId: service.vendorId,
            serviceName: service.serviceName,
            status: "Processing",
            isPaind: false,
            category: service.category,
        });
        if (!newOrder)
            return res
                .status(400)
                .json({ message: "Error saving order. Please try again" });

        res.status(201).json({ message: "Order saved successfully." });
    } catch (error) {
        console.log("Error in order routes", error);
        res.status(500).json({ message: "Internal server error" });
    }
});

module.exports = router;
