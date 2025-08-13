const express = require("express");
const {
  domesticStaffingCreateSchema,
  domesticStaffingUpdateSchema,
} = require("../Validations/domesticStaffValidation");
const DomesticStaffing = require("../models/domesticStaffing");
const Service = require("../models/service");
const checkVendor = require("../middlewares/checkVendor");

const router = express.Router();

router.get("/get/dashboard", async (req, res) => {
  try {
    const service = await Service.findOne({
      userId: req.user._id,
      category: "Domestic Staffing",
    });
    if (!service) {
      return res.status(404).json({
        message: "Service not found",
      });
    }
    const domesticStaffing = await DomesticStaffing.find({
      serviceId: service._id,
    });
    res.status(200).json({
      success: true,
      count: domesticStaffing.length,
      domesticStaffing,
    });
  } catch (error) {
    console.error("Error getting domestic staffing:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
});

router.delete("/delete/:id", checkVendor, async (req, res) => {
  try {
    const domesticStaffing = await DomesticStaffing.findByIdAndDelete(
      req.params.id
    );
    if (!domesticStaffing) {
      return res.status(404).json({
        success: false,
        error: "Domestic staffing not found",
      });
    }
    res.json({
      success: true,
      message: "Domestic staffing deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting domestic staffing:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
});

router.put("/edit/:id", checkVendor, async (req, res) => {
  try {
    const domesticStaffing = await DomesticStaffing.findById(req.params.id);
    if (!domesticStaffing) {
      return res.status(404).json({ message: "Domestic staffing not found" });
    }
    const { error } = domesticStaffingUpdateSchema.validate(req.body);
    if (error) {
      return res.status(400).json({
        message: error.details[0].message,
      });
    }

    if (req.body.type) {
      domesticStaffing.type = req.body.type;
    }
    if (req.body.description) {
      domesticStaffing.description = req.body.description;
    }
    if (req.body.schedule) {
      domesticStaffing.schedule = req.body.schedule;
    }
    await domesticStaffing.save();

    res.status(200).json({
      message: "Domestic staffing updated successfully",
    });
  } catch (error) {
    console.error("Error getting domestic staffing:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
});

router.get("/get/:serviceId", async (req, res) => {
  try {
    const domesticStaffing = await DomesticStaffing.find({
      serviceId: req.params.serviceId,
    });
    if (!domesticStaffing) {
      return res.status(404).json({ message: "Domestic staffing not found" });
    }
    const serviceData = await Service.findById(req.params.serviceId)
      .select(
        "vendorId description rating serviceName vendorName image.url -_id "
      )
      .exec();
    res.status(200).json({
      success: true,
      count: domesticStaffing.length,
      serviceData,
      domesticStaffing,
    });
  } catch (error) {
    console.error("Error getting domestic staffing:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
});

router.post("/add", checkVendor, async (req, res) => {
  try {
    const service = await Service.findOne({
      userId: req.user._id,
      category: "Domestic Staffing",
    });
    if (!service) {
      return res.status(404).json({
        message: "Service not found",
      });
    }
    const { error } = domesticStaffingCreateSchema.validate(req.body);
    if (error) {
      return res.status(400).json({
        message: error.details[0].message,
      });
    }
    const { type, description, schedule } = req.body;
    console.log(service._id);
    const newDomescticStaffing = await DomesticStaffing.create({
      serviceId: service._id,
      type,
      description,
      schedule,
    });
    if (!newDomescticStaffing) {
      return res.status(500).json({
        message: "Failed to create domestic staffing",
      });
    }
    res.status(201).json({
      message: "Domestic staffing added successfully",
      data: newDomescticStaffing,
    });
  } catch (error) {
    console.error("Error in /add route:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

module.exports = router;
