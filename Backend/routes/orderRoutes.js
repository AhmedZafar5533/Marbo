const Service = require("../models/service");
const Order = require("../models/orders");
const express = require("express");
const checkAuthetication = require("../middlewares/checkAuthetication");

const router = express.Router();

router.post("/add", checkAuthetication, async (req, res) => {
  try {
    // Log the received body for debugging purposes
    console.log(req.body);

    // Ensure the request body contains the items and summary
    const { items, summary } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({ message: "No items in the order" });
    }

    // Find all uncompleted orders for the user
    let existingOrders = await Order.find({
      userId: req.user._id,
      isPaid: false,
      status: { $ne: "Completed" }, // Ensure the order is not completed
    });

    if (existingOrders.length > 0) {
      let orderUpdated = false;

      // Iterate through all uncompleted orders
      for (let existingOrder of existingOrders) {
        let itemUpdated = false;

        // Iterate through the items being added
        for (let newItem of items) {
          // Check if the product already exists in the order's items array
          const existingItemIndex = existingOrder.items.findIndex(
            (item) => item.id === newItem.id
          );

          if (existingItemIndex !== -1) {
            // If product exists, update the quantity and total price
            existingOrder.items[existingItemIndex].quantity += newItem.quantity;
            existingOrder.items[existingItemIndex].totalPrice =
              existingOrder.items[existingItemIndex].unitPrice *
              existingOrder.items[existingItemIndex].quantity;

            itemUpdated = true;
          } else {
            // If the product doesn't exist, add it to the items array
            existingOrder.items.push(newItem);
          }
        }

        if (itemUpdated) {
          // Recalculate the order summary after updating items
          const itemCount = existingOrder.items.reduce(
            (sum, item) => sum + item.quantity,
            0
          );
          const subtotal = existingOrder.items.reduce(
            (sum, item) => sum + item.totalPrice,
            0
          );
          const tax = subtotal * summary.taxRate; // Use taxRate from the summary
          const totalPrice = subtotal + tax;

          // Update the order summary
          existingOrder.summary = {
            itemCount,
            shipping: summary.shipping || 0, // Use provided shipping or default to 0
            subtotal,
            tax,
            totalPrice,
          };

          await existingOrder.save(); // Save the updated order
          orderUpdated = true;
          break; // Exit loop once the order has been updated
        }
      }

      if (orderUpdated) {
        return res.status(200).json({ message: "Order updated successfully." });
      }
    }

    // If no uncompleted order exists, create a new one
    const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);
    const subtotal = items.reduce((sum, item) => sum + item.totalPrice, 0);
    const tax = subtotal * summary.taxRate; // Use taxRate from the summary
    const totalPrice = subtotal + tax;

    const newOrder = await Order.create({
      userId: req.user._id,
      items: items, // Store the items in the order
      summary: {
        itemCount,
        shipping: summary.shipping || 0, // Use provided shipping or default to 0
        subtotal,
        tax,
        totalPrice,
      },
      status: "Processing",
      isPaid: false, // Assuming the order is not paid initially
    });

    if (!newOrder)
      return res
        .status(400)
        .json({ message: "Error saving order. Please try again" });

    res
      .status(201)
      .json({ message: "Order saved successfully.", order: newOrder });
  } catch (error) {
    console.log("Error in order routes", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

module.exports = router;
