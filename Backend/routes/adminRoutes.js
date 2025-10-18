const express = require("express");
const router = express.Router();
const auth = require("../middlewares/checkAuthetication");
const Vendor = require("../models/vendors");
const checkAdmin = require("../middlewares/checkAdmin");
const User = require("../models/User");
const activeServices = require("../models/activeServices");
const payment = require("../models/payment");
const MainOrder = require("../models/MainOrders");
const reviews = require("../models/reviews");

router.get("/pending-vendors", auth, checkAdmin, async (req, res) => {
  try {
    const pendingVendors = await Vendor.find({
      status: { $in: ["Pending", "Under Review"] },
    }).sort({ createdAt: -1 });
    console.log(pendingVendors);
    res.status(200).json({
      success: true,
      count: pendingVendors.length,
      vendors: pendingVendors,
    });
  } catch (error) {
    console.error("Error getting pending vendors:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
});

router.get("/approved-vendors", auth, checkAdmin, async (req, res) => {
  try {
    const approvedVendors = await Vendor.find({
      status: "Approved",
    }).sort({ createdAt: -1 });

    if (!approvedVendors.length) {
      return res.status(404).json({
        success: false,
        message: "No approved vendors found",
      });
    }

    return res.status(200).json({
      success: true,
      count: approvedVendors.length,
      vendors: approvedVendors,
    });
  } catch (error) {
    console.error("Error getting approved vendors:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
});

router.get("/vendor-details/:id", auth, checkAdmin, async (req, res) => {
  try {
    console.log(req.params.id);
    const { id } = req.params;
    console.log(id);
    const vendorDetails = await Vendor.findById(id);
    if (!vendorDetails)
      return res.status(404).json({
        message: "Vendor Not Found",
      });
    console.log("not gettting error");
    res.status(200).json({
      vendor: vendorDetails,
    });
  } catch (error) {
    console.log("gettting error");
    console.log("error getting details", error);
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
});

router.post("/change-vendor-status/:id", auth, checkAdmin, async (req, res) => {
  try {
    const { status, vendorId } = req.body;
    console.log(req.body);
    if (!["Approved", "Rejected"].includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid status value",
      });
    }

    const vendor = await Vendor.findByIdAndUpdate(
      vendorId,
      {
        status: status,
      },
      { new: true }
    );

    if (!vendor) {
      return res.status(404).json({
        success: false,
        message: "Vendor not found",
      });
    }

    if (status === "Rejected") {
      await User.findByIdAndUpdate(vendor.userId, {
        onboardingDone: "no",
      });
    }
    if (status === "Approved") {
      console.log("approved");
      await User.findByIdAndUpdate(vendor.userId, {
        onboardingDone: "yes",
      });
    }

    res.status(200).json({
      success: true,
      message: `Vendor status updated to ${status}`,
      vendor,
    });
  } catch (error) {
    res.status(500).json({
      message: "Internal Server Error",
    });
  }
});

router.get("/services/manage/all", auth, checkAdmin, async (req, res) => {
  try {
    const services = await activeServices.find({}).lean();
    res.status(200).json({
      success: true,
      count: services.length,
      services,
    });
  } catch (error) {
    res.status(500).json({
      message: "Internal Server Error",
    });
  }
});

router.put(
  "/manage/services/:serviceId",
  auth,
  checkAdmin,
  async (req, res) => {
    console.log("hello");
    try {
      const { title, isActiveStatus } = req.body;
      console.log(req.body);
      const service = await activeServices.findByIdAndUpdate(
        req.params.serviceId,
        {
          title,
          isActive: isActiveStatus,
        },
        { new: true }
      );
      console.log(service);
      res.status(200).json({
        message: "Service updated successfully",
      });
    } catch (error) {
      res.status(500).json({
        message: "Internal Server Error",
      });
    }
  }
);

router.get("/payments", checkAdmin, async (req, res) => {
  try {
    const payments = await payment.find({}).sort({ createdAt: -1 }).lean();
    res.status(200).json({
      success: true,
      data: payments,
    });
  } catch (error) {
    console.error("Error fetching payments:", error);
    res.status(500).json({
      success: false,
      error: "Failed to retrieve payments",
    });
  }
});

router.get("/orders", checkAdmin, async (req, res) => {
  try {
    const orders = await MainOrder.find({}).sort({ createdAt: -1 }).lean();
    res.status(200).json({
      success: true,
      data: orders,
    });
  } catch (error) {
    console.error("Error fetching orders:", error);
    res.status(500).json({
      success: false,
      error: "Failed to retrieve orders",
    });
  }
});

router.get("/reviews", checkAdmin, async (req, res) => {
  try {
    const reviewData = await reviews.find({}).sort({ createdAt: -1 }).lean();
    res.status(200).json({
      success: true,
      data: reviewData,
    });
  } catch (error) {
    console.error("Error fetching reviews:", error);
    res.status(500).json({
      success: false,
      error: "Failed to retrieve reviews",
    });
  }
});

// router.put("/admin/update-status/:id", auth, async (req, res) => {
//     try {
//         const { status, notes } = req.body;
//         if (
//             !["Pending", "Approved", "Rejected",].includes(
//                 status
//             )
//         ) {
//             return res.status(400).json({
//                 success: false,
//                 message: "Invalid status value",
//             });
//         }

//         const vendor = await Vendor.findByIdAndUpdate(
//             req.params.id,
//             {
//                 status,
//                 $push: {
//                     adminNotes: {
//                         updatedBy: req.user.id,
//                         updatedAt: new Date(),
//                     },
//                 },
//             },
//             { new: true }
//         );

//         if (!vendor) {
//             return res.status(404).json({
//                 success: false,
//                 message: "Vendor not found",
//             });
//         }

//         res.status(200).json({
//             success: true,
//             message: `Vendor status updated to ${status}`,
//             vendor,
//         });
//     } catch (error) {
//         console.error("Error updating vendor status:", error);
//         res.status(500).json({
//             success: false,
//             message: "Server error",
//             error: error.message,
//         });
//     }
// });

module.exports = router;
