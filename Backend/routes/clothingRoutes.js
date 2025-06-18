const express = require("express");
const router = express.Router();
const Clothing = require("../models/clothingSchema");
const Service = require("../models/service");
const checkVendor = require("../middlewares/checkVendor");
const uploadFromBuffer = require("../Utils/imageCompress");
const sharp = require("sharp");
const clothingValidationSchema = require("../Validations/clothingValidation");

router.get("/get/all/:serviceId", async (req, res) => {
    try {
        console.log(req.params.serviceId);
        const clothing = await Clothing.find({
            serviceId: req.params.serviceId,
        });
        if (!clothing.length) {
            return res.status(404).json({ message: "No clothing found" });
        }
        res.status(200).json({
            success: true,
            count: clothing.length,
            clothing,
        });
    } catch (error) {
        console.error("Error getting clothing:", error);
        res.status(500).json({
            success: false,
            message: "Server error",
            error: error.message,
        });
    }
});

router.get("/get/dashboard", async (req, res) => {
    try {
        const service = await Service.findOne({
            userId: req.user._id,
            category: "Fashion Services",
        });
        console.log()

        if (!service) {
            return res.status(404).json({ message: "Service not found" });
        }

        const clothing = await Clothing.find({
            serviceId: service._id,
        });
        if (!clothing.length) {
            return res.status(404).json({ message: "No clothing found" });
        }
        res.status(200).json({
            success: true,
            count: clothing.length,
            clothing,
        });
    } catch (error) {
        console.error("Error getting clothing:", error);
        res.status(500).json({
            success: false,
            message: "Server error",
            error: error.message,
        });
    }
});

router.get("/get/:clothingId", async (req, res) => {
    try {
        const clothing = await Clothing.findOne({
            _id: req.params.clothingId,
        });
        if (!clothing) {
            return res.status(404).json({ message: "Clothing not found" });
        }
        res.status(200).json({
            success: true,
            clothing,
        });
    } catch (error) {
        console.error("Error getting clothing:", error);
        res.status(500).json({
            success: false,
            message: "Server error",
            error: error.message,
        });
    }
});

router.post("/add", checkVendor, async (req, res) => {
    try {
        const validService = await Service.findOne({
            userId: req.user._id,
            category: "Fashion Services",
        });
        if (!validService) {
            return res.status(404).json({ message: "Service not found" });
        }

        const { error } = clothingValidationSchema.validate(req.body);
        if (error) {
            return res.status(400).json({ message: error.details[0].message });
        }

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
        const newClothing = await Clothing.create({
            ...req.body,
            serviceId: validService._id,
            images: imagesUrlArray,
        });
        if (!newClothing) {
            return res.status(500).json({
                message: "Failed to add clothing",
            });
        }
        res.status(201).json({
            success: true,
            message: "Clothing added successfully",
        });
    } catch (error) {
        console.error("Error adding clothing:", error);
        res.status(500).json({
            success: false,
            message: "Server error",
            error: error.message,
        });
    }
});

module.exports = router;
