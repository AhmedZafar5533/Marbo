const { tourValidationSchema } = require("../Validations/tourValidation");
const Tour = require("../models/toursSchema");
const Service = require("../models/service");

const uploadFromBuffer = require("../Utils/imageCompress");
const sharp = require("sharp");
const checkVendor = require("../middlewares/checkVendor");
const mainProduct = require("../models/mainProduct");

const router = require("express").Router();

router.post("/add", checkVendor, async (req, res) => {
  try {
    const serviceExists = await Service.findOne({
      userId: req.user._id,
      category: "Tours",
    });

    if (!serviceExists) {
      return res
        .status(400)
        .json({ message: "Please create a service profile first" });
    }

    const { error } = tourValidationSchema.validate(req.body);
    let imagesUrlArray = [];
    if (error) {
      console.log(error);
      return res.status(400).json({ message: error.details[0].message });
    }
    if (req.body.images && req.body.images.length > 0) {
      for (let i = 0; i < req.body.images.length; i++) {
        const imageData = req.body.images[i];
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

    const newTour = await Tour.create({
      ...req.body,
      images: imagesUrlArray,
      serviceId: serviceExists._id,
    });
    if (!newTour) {
      return res.status(500).json({ message: "Failed to add tour" });
    }

    res.status(201).json({ message: "Tour added successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Failed to add tour" });
  }
});

router.get("/:type/:country/:id", async (req, res) => {
  try {
    let category;
    if (req.params.type === "group") {
      category = "smallGroupTour";
    } else if (req.params.type === "properties") {
      category = "luxuryProperties";
    } else if (req.params.type === "private") {
      category = "privateTours";
    } else if (req.params.type === "guides") {
      category = "guides";
    } else if (req.params.type === "cruises") {
      category = "cruises";
    } else {
      return res.status(400).json({ message: "Invalid category" });
    }

    const data = await mainProduct.find({
      productType: "Tour",
      country: req.params.country,
      category: category,
      serviceId: req.params.id,
    });

    console.log(data);
    if (!data.length) return res.status(404).json({ message: "No data found" });
    res.status(200).json(data);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Failed to fetch data" });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const data = await Tour.findById(req.params.id);
    if (!data) {
      return res.status(404).json({ message: "Tour not found" });
    }
    console.log(data);
    res.status(200).json(data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

router.get("/countries-available/:id", async (req, res) => {
  try {
    const data = await mainProduct.distinct("country", {
      serviceId: req.params.id,
    });

    if (!data || data.length === 0) {
      return res
        .status(404)
        .json({ message: "No countries found for this service" });
    }

    res.status(200).json(data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

router.get("/get/dashboard", checkVendor, async (req, res) => {
  try {
    console.log(req.user);
    const service = await Service.findOne({
      userId: req.user._id,
      category: "Tours",
    });
    console.log(service);
    if (!service) {
      return res.status(404).json({ message: "Service not found" });
    }
    const tours = await mainProduct.find({ serviceId: service._id });
    console.log(tours);
    if (!tours.length) {
      return res.status(404).json({ message: "No tours found" });
    }
    res.status(200).json({
      tours,
    });
  } catch (error) {
    console.error("Error getting tours:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
});

module.exports = router;
