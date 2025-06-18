const express = require("express");
const router = express.Router();
const Doctors = require("../models/doctorsSchema");
const Service = require("../models/service");
const checkVendor = require("../middlewares/checkVendor");
const { doctorsValidationSchema } = require("../Validations/doctorsValidation");

router.get("/get/dashboard", async (req, res) => {
    try {
        const service = await Service.findOne({
            userId: req.user._id,
            category: "Medical Care",
        });
        if (!service) {
            return res.status(404).json({
                message: "Service not found",
            });
        }
        const doctors = await Doctors.find({ serviceId: service._id });
        res.status(200).json({
            success: true,
            count: doctors.length,
            doctors,
        });
    } catch (error) {
        console.error("Error getting doctors:", error);
        res.status(500).json({
            success: false,
            message: "Server error",
            error: error.message,
        });
    }
});

router.get("/get/all/:serviceId", async (req, res) => {
    try {
        const doctors = await Doctors.find({ serviceId: req.params.serviceId });
        const serviceData = await Service.findById(req.params.serviceId)
            .select("vendorId description rating serviceName vendorName -_id ")
            .exec();
        console.log(doctors);
        res.status(200).json({
            success: true,
            count: doctors.length,
            doctors,
            serviceData,
        });
    } catch (error) {
        console.error("Error getting doctors:", error);
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
            category: "Medical Care",
        });
        if (!service) {
            return res.status(404).json({
                message: "Related service not found",
            });
        }
        console.log(req.body);
        const { error } = doctorsValidationSchema.validate(req.body);
        if (error) {
            return res.status(400).json({
                success: false,
                message: error.details[0].message,
            });
        }

        const newDoctors = await Doctors.create({
            type: req.body.typeName,
            description: req.body.description,
            schedule: req.body.scheduleTypes,
            serviceId: service._id,
        });
        if (!newDoctors) {
            return res.status(500).json({
                message: "Failed to create doctors",
            });
        }
        res.status(201).json({
            message: "Doctors added successfully",
            data: newDoctors,
        });
    } catch (error) {
        console.error("Error adding doctors:", error);
        res.status(500).json({
            success: false,
            message: "Server error",
            error: error.message,
        });
    }
});

module.exports = router;
