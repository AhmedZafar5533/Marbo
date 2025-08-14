const express = require("express");

const cartSchema = require("../models/cartSchema");
const MainOrder = require("../models/MainOrders");
const ServiceOrder = require("../models/suborders");
const checkAuthentication = require("../middlewares/checkAuthetication");

const router = express.Router();

router.post("/add", checkAuthentication, async (req, res) => {
  try {
    const cartItems = await cartSchema.find({ userId: req.user._id });

    if (cartItems.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Cart is empty",
      });
    }

    await MainOrder.deleteMany({ userId: req.user._id, isPaid: false });
    await ServiceOrder.deleteMany({ userId: req.user._id, isPaid: false });

    const serviceMap = {};
    let grandTotal = 0;
    let totalItemCount = 0;

    cartItems.forEach((item) => {
      if (!serviceMap[item.serviceId]) {
        serviceMap[item.serviceId] = [];
      }
      serviceMap[item.serviceId].push(item);

      grandTotal += item.price * item.quantity;
      totalItemCount += item.quantity;
    });

    // Create main order
    const mainOrder = new MainOrder({
      userId: req.user._id,
      subtotal: grandTotal,
      itemCount: totalItemCount,
      status: "pending",
      isPaid: false,
    });

    await mainOrder.save();

    const serviceOrders = [];

    // Create service-specific orders
    for (const [serviceId, items] of Object.entries(serviceMap)) {
      const itemCount = items.reduce((sum, i) => sum + i.quantity, 0);
      const subtotal = items.reduce((sum, i) => sum + i.price * i.quantity, 0);
      console.log(items);

      const serviceOrder = new ServiceOrder({
        mainOrderId: mainOrder._id,
        serviceId,
        userId: req.user._id,
        items: items.map((i) => ({
          productId: i.productId,
          name: i.name,
          quantity: i.quantity,
          unitPrice: i.price,
          category: i.category,
          totalPrice: i.price * i.quantity,
          imageUrl: i.imageUrl,
        })),
        itemCount,
        subtotal,
        subDetails: req.body.subDetails?.[serviceId] || {}, // Flexible extra data
      });

      await serviceOrder.save();
      serviceOrders.push(serviceOrder);
    }

    res.status(201).json({
      success: true,
      message: "Order created successfully",
      mainOrder,
      serviceOrders,
    });
  } catch (error) {
    console.error("Error creating order:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
});

router.get("/get", checkAuthentication, async (req, res) => {
  try {
    const orders = await ServiceOrder.find({ userId: req.user._id }).sort({
      createdAt: -1,
    });
    if (orders.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No orders found",
      });
    }

    res.status(200).json({
      success: true,
      data: orders,
    });
  } catch (error) {
    console.error("Error fetching orders:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
});

module.exports = router;
