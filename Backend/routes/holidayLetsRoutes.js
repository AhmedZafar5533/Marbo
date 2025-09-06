const express = require("express");
const router = express.Router();
const Service = require("../models/service");
const propertyValidationSchema = require("../Validations/holidayLetsValidation");
const Property = require("../models/holidayLetsSchema");
const checkVendor = require("../middlewares/checkVendor");

const uploadFromBuffer = require("../Utils/imageCompress");
const sharp = require("sharp");

router.get("/get/dashboard", checkVendor, async (req, res) => {
  try {
    console.log(req.user._id);
    const service = await Service.findOne({
      userId: req.user._id,
      category: "Holiday Lets",
    });
    if (!service) {
      return res.status(404).json({
        message: "Service not found",
      });
    }
    const properties = await Property.find({
      serviceId: service._id,
    });
    if (!properties.length) {
      return res.status(404).json({ message: "No properties found" });
    }
    res.status(200).json({
      properties,
    });
  } catch (error) {
    console.error("Error getting properties:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
});

router.get("/get/all/:serviceId", async (req, res) => {
  try {
    const properties = await Property.find({
      serviceId: req.params.serviceId,
    });
    if (!properties.length) {
      return res.status(404).json({ message: "No properties found" });
    }
    res.status(200).json({
      properties,
    });
  } catch (error) {
    console.error("Error getting properties:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
});

router.get("/get/:propertyId", async (req, res) => {
  try {
    const property = await Property.findById(req.params.propertyId);
    if (!property) {
      return res.status(404).json({ message: "Property not found" });
    }
    console.log("Property found:", property);
    res.status(200).json({ property });
  } catch (error) {
    console.error("Error getting property:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
});

router.post("/add", checkVendor, async (req, res) => {
  try {
    console.log(req.body);
    const service = await Service.findOne({
      userId: req.user._id,
      category: "Holiday Lets",
    });
    if (!service)
      return res.status(404).json({ message: "Service not found!" });

    const { error } = propertyValidationSchema.validate(req.body);
    if (error) {
      console.log(error.details);
      return res.status(400).json({
        message: error.details[0].message,
      });
    }
    const {
      title,
      propertyType,
      pricePerNight,
      availability,
      maxGuests,
      bedrooms,
      bathrooms,
      propertySize,
      sizeUnit,
      description,
      features,
      images = ["adad", "adad"],
      addressLine1,
      addressLine2,
      city,
      stateRegion,
      postalCode,
      country,
      mapLink,
      minimumNights,
      cleaningFee,
      securityDeposit,
      checkinTime,
      checkoutTime,
      smokingPolicy,
      petPolicy,
      partyPolicy,
      quietHours,
      accessDescription,
      hostInteraction,
    } = req.body;

    const imagesUrlArray = [];

    if (req.body.images && req.body.images.length > 0) {
      for (let i = 0; i < req.body.images.length; i++) {
        const imageData = req.body.images[i].base64Image;
        let image = imageData;
        if (imageData.startsWith("data:")) {
          image = imageData.split(",")[1];
        }

        const buffer = Buffer.from(image, "base64");
        const compressedImage = await sharp(buffer)
          .resize({ width: 800 })
          .jpeg({ quality: 80 })
          .toBuffer();
        const newImage = await uploadFromBuffer(compressedImage);
        imagesUrlArray.push({
          imageUrl: newImage.secure_url,
          publicId: newImage.public_id,
        });
      }
    } else {
      return res.status(400).json({
        message: "Please provide at least one image for the product",
      });
    }

    const newProperty = await Property.create({
      ...req.body,
      serviceId: service._id,
      images: imagesUrlArray,
    });

    return res.status(201).json({
      message: "Property added successfully",
      data: newProperty,
    });
  } catch (error) {
    console.error("Error adding holiday property:", error);
    return res.status(500).json({
      message: "An error occurred while adding the property.",
    });
  }
});

module.exports = router;
