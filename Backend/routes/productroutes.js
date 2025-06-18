const express = require("express");
const checkVendor = require("../middlewares/checkVendor");
const Product = require("../models/products");
const {
    productSchemaJoi: productSchema,
} = require("../Validations/productValiadtionSchema");
const Service = require("../models/service");

const uploadFromBuffer = require("../Utils/imageCompress");
const sharp = require("sharp");

const router = express.Router();

router.post("/add", checkVendor, async (req, res) => {
    try {
        const service = await Service.findOne({
            userId: req.user._id,
            category: "Groceries",
        }).exec();
        if (!service) {
            return res.status(404).json({ message: "Service not found" });
        }
        const { error } = await productSchema.validate({
            productName: req.body.productName,
            category: req.body.category,
            price: req.body.price,
            description: req.body.description,
            features: req.body.features,
            quantity: req.body.quantity,
            images: req.body.images,
        });
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

        const product = await Product.create({
            serviceId: service._id,
            productName: req.body.productName,
            category: req.body.category,
            price: req.body.price,
            description: req.body.description,
            images: imagesUrlArray,
            quantity: req.body.quantity,
            features: req.body.features,
            vendorId: req.user._id,
        });

        res.status(200).json({
            // product,
            message: "Product added successfully",
        });
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: "Internal server error" });
    }
});

router.get("/get/inventory", checkVendor, async (req, res) => {
    try {
        const service = await Service.findOne({ userId: req.user._id });
        if (!service) {
            return res.status(404).json({ message: "Service not found" });
        }

        const products = await Product.find({ serviceId: service._id }).exec();
        console.log("Products found:", products);
        if (!products || products.length === 0) {
            return res.status(404).json({ message: "No products found" });
        }

        res.status(200).json({ products });
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: "Internal server error" });
    }
});

router.get("/get/:serviceId", async (req, res) => {
    try {
        const service = await Service.findById(req.params.serviceId).exec();
        if (!service) {
            return res.status(404).json({ message: "Service not found" });
        }
        const products = await Product.find({ serviceId: service._id }).exec();
        console.log("Products found for service:", products);
        if (!products || products.length === 0) {
            return res.status(404).json({ message: "No products found" });
        }
        res.status(200).json({ products });
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: "Internal server error" });
    }
});

router.get("/get/product/:id", async (req, res) => {
    try {
        const validProduct = await Product.findById(req.params.id)
            .populate("serviceId")
            .exec();

        const formattedServceData = {
            id: validProduct.serviceId._id,
            status: validProduct.serviceId.status,
            image: validProduct.serviceId.image.url,
            vendorName: validProduct.serviceId.vendorName,
            venorId: validProduct.serviceId.vendorId,
        };
        if (validProduct.serviceId) {
            validProduct.serviceId = formattedServceData;
        }
        if (!validProduct) {
            return res.status(404).json({ message: "Product not found" });
        }
        console.log("Valid product found:", validProduct);
        res.status(200).json({ product: validProduct });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal server error" });
    }
});

module.exports = router;
