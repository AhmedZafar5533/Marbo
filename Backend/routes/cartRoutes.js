const express = require("express");
const checkAuth = require("../middlewares/checkAuthetication");
const cartSchema = require("../models/cartSchema");
const { cartValidationSchema } = require("../Validations/cartValidation");

const router = express.Router();

// Get cart items
router.get("/get", checkAuth, async (req, res) => {
  try {
    const cartItems = await cartSchema.find({ userId: req.user._id });
    if (cartItems.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Cart is empty",
        cartItems: [],
      });
    }
    res.status(200).json({ success: true, cartItems });
  } catch (error) {
    console.error("Error getting cart items:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
});

// Add item to cart
router.post("/add", checkAuth, async (req, res) => {
  try {
    const { product } = req.body;

    if (!product) {
      return res.status(400).json({
        success: false,
        message: "Product data is required",
      });
    }
    const { error } = cartValidationSchema.validate({
      name: product.name,
      price: product.price,
      quantity: product.quantity || 1,
      imageUrl: product.imageUrl,
      typeOf: product.typeOf,
    });

    if (error) {
      return res.status(400).json({
        success: false,
        message: error.details[0].message,
      });
    }

    let existingCartItem;

    if (product.productId) {
      console.log(product.productId);
      existingCartItem = await cartSchema.findOne({
        productId: product.productId,
        userId: req.user._id,
      });
    } else if (product.serviceId) {
      existingCartItem = await cartSchema.findOne({
        serviceId: product.serviceId,
        userId: req.user._id,
      });
    } else {
      return res.status(400).json({
        success: false,
        message: "Product must have either productId or serviceId",
      });
    }
    console.log("Existing cart item:", existingCartItem);

    if (existingCartItem && existingCartItem.category !== "product") {
      return res.status(400).json({
        success: false,
        message: "This cart item can only be added once.",
      });
    }

    if (existingCartItem) {
      console.log(existingCartItem.quantity);
      existingCartItem.quantity += product.quantity || 1;
      await existingCartItem.save();

      return res.status(200).json({
        success: true,
        cartItem: existingCartItem,
        message: "Cart updated successfully",
      });
    } else {
      console.log("Creating new cart item");
      const cartItemData = {
        userId: req.user._id,
        name: product.name,
        category: product.typeOf,
        price: product.price,
        quantity: product.quantity || 1,
        imageUrl: product.imageUrl,
      };
      if (product.productId) {
        cartItemData.productId = product.productId;
      }
      if (product.serviceId) {
        cartItemData.serviceId = product.serviceId;
      }

      const newCartItem = await cartSchema.create(cartItemData);

      res.status(201).json({
        success: true,
        message: "Item added to cart successfully",
        cartItem: newCartItem,
      });
    }
  } catch (error) {
    console.error("Error adding to cart:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
});

// Remove item from cart
router.post("/remove", checkAuth, async (req, res) => {
  try {
    const { productId } = req.body;

    if (!productId) {
      return res.status(400).json({
        success: false,
        message: "Product ID is required",
      });
    }

    // Try to find and remove by productId or serviceId or _id
    const deletedItem = await cartSchema.findOneAndDelete({
      $and: [
        { userId: req.user._id },
        {
          $or: [
            { productId: productId },
            { serviceId: productId },
            { _id: productId },
          ],
        },
      ],
    });

    if (!deletedItem) {
      return res.status(404).json({
        success: false,
        message: "Item not found in cart",
      });
    }

    res.status(200).json({
      success: true,
      message: "Item removed from cart successfully",
    });
  } catch (error) {
    console.error("Error removing from cart:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
});

router.post("/update", checkAuth, async (req, res) => {
  try {
    const { productId, quantity } = req.body;

    if (!productId || quantity === undefined) {
      return res.status(400).json({
        success: false,
        message: "Product ID and quantity are required",
      });
    }

    if (quantity < 0) {
      return res.status(400).json({
        success: false,
        message: "Quantity cannot be negative",
      });
    }

    // If quantity is 0, remove the item
    if (quantity === 0) {
      const deletedItem = await cartSchema.findOneAndDelete({
        $and: [
          { userId: req.user._id },
          {
            $or: [
              { productId: productId },
              { serviceId: productId },
              { _id: productId },
            ],
          },
        ],
      });

      if (!deletedItem) {
        return res.status(404).json({
          success: false,
          message: "Item not found in cart",
        });
      }

      return res.status(200).json({
        success: true,
        message: "Item removed from cart",
      });
    }

    // Update quantity
    const updatedItem = await cartSchema.findOneAndUpdate(
      {
        $and: [
          { userId: req.user._id },
          {
            $or: [
              { productId: productId },
              { serviceId: productId },
              { _id: productId },
            ],
          },
        ],
      },
      { quantity: quantity },
      { new: true }
    );

    if (!updatedItem) {
      return res.status(404).json({
        success: false,
        message: "Item not found in cart",
      });
    }

    res.status(200).json({
      success: true,
      message: "Quantity updated successfully",
      cartItem: updatedItem,
    });
  } catch (error) {
    console.error("Error updating cart:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
});

// Clear entire cart
router.post("/clear", checkAuth, async (req, res) => {
  try {
    const result = await cartSchema.deleteMany({ userId: req.user._id });

    res.status(200).json({
      success: true,
      message: `Cart cleared successfully. ${result.deletedCount} items removed.`,
    });
  } catch (error) {
    console.error("Error clearing cart:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
});

// Sync cart when user logs in
router.post("/sync", checkAuth, async (req, res) => {
  try {
    const { cartItems } = req.body;

    if (!cartItems || !Array.isArray(cartItems)) {
      return res.status(400).json({
        success: false,
        message: "Cart items array is required",
      });
    }

    // Get existing cart items from database
    const existingItems = await cartSchema.find({ userId: req.user._id });
    const syncedItems = [];

    // Process each item from localStorage
    for (const item of cartItems) {
      let existingItem;

      // Find existing item in database
      if (item.productId) {
        existingItem = existingItems.find(
          (dbItem) =>
            dbItem.productId &&
            dbItem.productId.toString() === item.productId.toString()
        );
      } else if (item.serviceId) {
        existingItem = existingItems.find(
          (dbItem) =>
            dbItem.serviceId &&
            dbItem.serviceId.toString() === item.serviceId.toString()
        );
      }

      if (existingItem) {
        // Update existing item with higher quantity
        existingItem.quantity = Math.max(
          existingItem.quantity,
          item.quantity || 1
        );
        await existingItem.save();
        syncedItems.push(existingItem);
      } else {
        // Create new item
        const cartItemData = {
          userId: req.user._id,
          name: item.name,
          price: item.price,
          quantity: item.quantity || 1,
          imageUrl: item.imageUrl,
        };

        if (item.productId) {
          cartItemData.productId = item.productId;
        }
        if (item.serviceId) {
          cartItemData.serviceId = item.serviceId;
        }

        const newItem = await cartSchema.create(cartItemData);
        syncedItems.push(newItem);
      }
    }

    // Get all cart items after sync
    const allCartItems = await cartSchema.find({ userId: req.user._id });

    res.status(200).json({
      success: true,
      message: "Cart synced successfully",
      cartItems: allCartItems,
    });
  } catch (error) {
    console.error("Error syncing cart:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
});

module.exports = router;
