// const Service = require("../models/service");
const Order = require("../models/orders");
const express = require("express");
const checkAuthetication = require("../middlewares/checkAuthetication");
const cartSchema = require("../models/cartSchema");

const router = express.Router();

router.get("/get", checkAuthetication, async (req, res) => {
  try {
    const cartItems = await cartSchema.find({ userId: req.user._id });
    if (cartItems.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Cart is empty",
        cartItems: [],
      });
    }

    const orderDataToSend = cartItems.map((item) => ({
      price: item.price,
      name: item.name,
      imageUrl: item.imageUrl,
      quantity: item.quantity,
    }));

    res.status(200).json({ success: true, items: orderDataToSend });
  } catch (error) {
    console.error("Error getting cart items:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
});

module.exports = router;
