const express = require("express");
const Service = require("../models/service");
const checkVendor = require("../middlewares/checkVendor");
const roomValidationSchema = require("../Validations/hotelRoomValidation");
const router = express.Router();
const Room = require("../models/hotelSchema");

const uploadFromBuffer = require("../Utils/imageCompress");
const sharp = require("sharp");

router.get("/get/dashboard", checkVendor, async (req, res) => {
    try {
        const service = await Service.findOne({
            userId: req.user._id,
            category: "Hotel Booking",
        });
        if (!service) {
            return res.status(404).json({
                message: "Service not found",
            });
        }
        const rooms = await Room.find({ serviceId: service._id });
        res.status(200).json({
            rooms,
        });
    } catch (error) {
        console.error("Error getting rooms:", error);
        res.status(500).json({
            success: false,
            message: "Server error",
            error: error.message,
        });
    }
});

router.get("/get/all/:serviceId", checkVendor, async (req, res) => {
    try {
        const service = await Service.findOne({
            userId: req.user._id,
            category: "Hotel Booking",
        });
        if (!service) {
            return res.status(404).json({
                message: "Service not found",
            });
        }
        const rooms = await Room.find({ serviceId: req.params.serviceId });
        res.status(200).json({
            success: true,
            count: rooms.length,
            rooms,
        });
    } catch (error) {
        console.error("Error getting rooms:", error);
        res.status(500).json({
            success: false,
            message: "Server error",
            error: error.message,
        });
    }
});

router.get("/get/:roomId", checkVendor, async (req, res) => {
    try {
        const room = await Room.findById(req.params.roomId);
        if (!room) {
            return res.status(404).json({
                message: "Room not found",
            });
        }

        res.status(200).json({
            success: true,
            room,
        });
    } catch (error) {
        console.error("Error getting room:", error);
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
            category: "Hotel Booking",
        });
        if (!service) {
            return res.status(404).json({
                message: "Service not found",
            });
        }
        const { error } = roomValidationSchema.validate(req.body);
        if (error) {
            return res.status(400).json({
                message: error.details[0].message,
            });
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
        const newRoom = await Room.create({
            ...req.body,
            serviceId: service._id,
            images: imagesUrlArray,
        });
        if (!newRoom) {
            return res.status(500).json({
                message: "Failed to create room",
            });
        }
        res.status(201).json({
            message: "Room added successfully",
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: "Internal server error",
        });
    }
});

module.exports = router;
