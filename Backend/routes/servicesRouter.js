const express = require("express");
const router = express.Router();
const Page = require("../models/servicePage");
const auth = require("../middlewares/checkAuthetication");
const checkVendor = require("../middlewares/checkVendor");
const sharp = require("sharp");

const cloudinary = require("../config/cloudinary");

const Vendor = require("../models/vendors");
const uploadFromBuffer = require("../config/imageCompress");
const service = require("../models/service");
const User = require("../models/User");

router.get("/services/get", auth, checkVendor, async (req, res) => {
    try {
        const { id } = req.user;
        const user = await User.findById(id);
        if (user && user.onboardingDone === "no")
            return res.status(400).json({
                onboardingDone: "pending",
                message: "Please complete the onboarding process first before proceeding!",
            });
        if (user && user.onboardingDone === "pending")
            return res.status(400).json({
                onboardingDone: "pending",
                message: "Your application is under review!",
            });
        const vendor = await Vendor.findOne({ userId: req.user._id });
        if (!vendor) {
            return res.status(404).json({
                success: false,
                message: "Vendor not found",
            });
        }

        const services = await service.find({ vendorId: vendor._id });
        if (!services) {
            return res.status(404).json({
                success: false,
                error: "No services found",
            });
        }
        res.status(200).json({
            success: true,
            data: services,
        });
    } catch (error) {
        console.error("Error retrieving services:", error);
        res.status(500).json({
            success: false,
            message: "Server error",
            error: error.message,
        });
    }
});

router.get("/services/all", async (req, res) => {
    try {
        const services = await service.find({});

        if (services.length > 0)
            return res.status(200).json({
                data: services,
            });
        else {
            return res.status(400).json({ message: "No services found" });
        }
    } catch (error) {
        console.error("Error retrieving page:", error);
        res.status(500).json({
            success: false,
            error: "Failed to retrieve page",
        });
    }
});

router.put("/service/:id/edit", auth, checkVendor, async (req, res) => {
    try {
        const { id } = req.params;
        const {
            category,
            price,
            description,
            image: newImage,
            name,
            status,
        } = req.body;

        const existingService = await service.findById(id);
        if (!existingService) {
            return res.status(404).json({
                success: false,
                error: "Service not found",
            });
        }

        // Update any provided fields
        if (category) existingService.category = category;
        if (price) existingService.price = price;
        if (description) existingService.description = description;
        if (name) existingService.name = name;
        if (status) existingService.status = status;

        // Handle image update
        if (newImage && !newImage.startsWith("https")) {
            // Delete old image from Cloudinary
            if (existingService.image?.publicId) {
                await cloudinary.uploader.destroy(
                    existingService.image.publicId
                );
            }

            // Compress and upload new image
            const uploadedImage = await uploadFromBuffer(newImage);
            if (uploadedImage) {
                existingService.image = {
                    url: uploadedImage.secure_url,
                    publicId: uploadedImage.public_id,
                };
            }
        }

        await existingService.save();

        return res.status(200).json({
            success: true,
            message: "Service updated successfully",
            data: existingService,
        });
    } catch (error) {
        console.error("Error updating service:", error);
        res.status(500).json({
            success: false,
            error: "Failed to update service",
            details:
                process.env.NODE_ENV === "production"
                    ? undefined
                    : error.message,
        });
    }
});

router.delete("/service/:id/delete", auth, checkVendor, async (req, res) => {
    console.log("Deleting service with ID:", req.params.id);
    try {
        const existingService = await service.findById(req.params.id);
        if (!existingService) {
            return res.status(404).json({
                success: false,
                error: "Service not found",
            });
        }

        // Check if the image is from Cloudinary and delete it
        if (existingService.image.publicId) {
            await cloudinary.uploader.destroy(existingService.image.publicId);
        }

        const deletedService = await service.findByIdAndDelete(req.params.id);
        if (!deletedService) {
            return res.status(404).json({
                success: false,
                error: "Service not found",
            });
        }
        res.json({
            success: true,
            message: "Service deleted successfully",
        });
    } catch (error) {
        console.error("Error deleting service:", error);
        res.status(500).json({
            success: false,
            error: "Failed to delete service",
            details:
                process.env.NODE_ENV === "production"
                    ? undefined
                    : error.message,
        });
    }
});
router.post("/services/initialize", auth, checkVendor, async (req, res) => {
    try {
        console.log(req.body);
        const {
            category,
            price,
            description,
            image: base64Image,
            serviceName: name,
            status,
        } = req.body;

        const existingVendor = await Vendor.findOne({
            userId: req.user.id,
        });

        if (
            !category ||
            !price ||
            !description ||
            !base64Image ||
            !name ||
            !status
        )
            return res.status(400).json({
                message: "Please provide all the fields.",
            });

        if (!existingVendor) {
            return res.status(404).json({
                success: false,
                error: "Vendor not found",
            });
        }

        const vendorId = existingVendor._id;

        const existingService = await service.findOne({
            vendorId,
            serviceName: name,
        });

        if (existingService) {
            return res.status(400).json({
                success: false,
                message:
                    "A service with this name already exists for this vendor",
            });
        }
        let base64Data = base64Image;
        if (base64Image.url.startsWith("data:")) {
            base64Data = base64Image.url.split(",")[1];
        }
        const buffer = Buffer.from(base64Data, "base64");
        const compressedBuffer = await sharp(buffer)
            .resize({ width: 800 })
            .jpeg({ quality: 80 })
            .toBuffer();

        const imageUpload = await uploadFromBuffer(compressedBuffer);
        image = {
            publicId: imageUpload.public_id,
            url: imageUpload.secure_url,
        };

        const newService = new service({
            vendorId,
            serviceName: name,
            userId: req.user._id,
            category,
            price,
            description,
            image,
            status,
            tier: "basic",
            vendorName: existingVendor.businessDetails.businessName,
        });
        await newService.save();

        res.status(201).json({
            success: true,
            message: "Serive created successfully",
            data: newService,
        });
    } catch (error) {
        console.error("Error creating service:", error);

        if (error.code === 11000) {
            return res.status(400).json({
                success: false,
                error: "A service with this name already exists for this vendor",
            });
        }

        res.status(500).json({
            success: false,
            message: "Failed to create service",
            details:
                process.env.NODE_ENV === "production"
                    ? undefined
                    : error.message,
        });
    }
});

router.get(
    "/:id",

    async (req, res) => {
        try {
            console.log("here we re");
            const page = await Page.findOne({ userId: req.params.id });

            if (!page) {
                return res.status(404).json({
                    success: false,
                    error: "Page not found",
                });
            }

            res.json({
                success: true,
                data: page,
            });
        } catch (error) {
            console.error("Error retrieving page:", error);
            res.status(500).json({
                success: false,
                error: "Failed to retrieve page",
                details:
                    process.env.NODE_ENV === "production"
                        ? undefined
                        : error.message,
            });
        }
    }
);

// router.post("/initialize", auth, checkVendor, async (req, res) => {
//     try {
//         const { id: userId } = req.user;
//         const existingPage = await Page.findOne({ userId });
//         if (existingPage && existingPage.isInitialized)
//             return res.json({
//                 pageIsInitialized: true,
//                 message: "Page already initialized",
//             });

//         const newPage = new Page({
//             vendorId: req.user.id,
//             userId: req.user._id,
//             isInitialized: true,
//         });
//         await newPage.save();

//         res.status(201).json({
//             success: true,
//             message: "Page created successfully",
//             data: newPage,
//         });
//     } catch (error) {
//         console.error("Error creating page:", error);
//         res.status(500).json({
//             success: false,
//             error: "Failed to create page",
//             details:
//                 process.env.NODE_ENV === "production"
//                     ? undefined
//                     : error.message,
//         });
//     }
// });

// router.put("/edit/header", auth, checkVendor, async (req, res) => {
//     try {
//         const {
//             text,
//             imageUrl,
//             base64Image,
//             description,
//             gradientOpacity,
//             textColor,
//         } = req.body;

//         if (
//             !text ||
//             !description ||
//             !gradientOpacity ||
//             !textColor ||
//             (!base64Image && !imageUrl)
//         ) {
//             return res.status(400).json({
//                 success: false,
//                 error: "All fields are required.",
//             });
//         }

//         const existingPage = await Page.findOne({ userId: req.user._id });
//         if (!existingPage) {
//             return res.status(404).json({
//                 success: false,
//                 error: "Page not found",
//             });
//         }

//         const headerData = {
//             text,
//             description,
//             gradientOpacity,
//             textColor,
//         };

//         // Process image update
//         if (base64Image) {
//             // New image provided via base64 – delete previous Cloudinary image if any
//             if (
//                 existingPage.header &&
//                 existingPage.header.image &&
//                 existingPage.header.image.isCloudinary &&
//                 existingPage.header.image.publicId
//             ) {
//                 await cloudinary.uploader.destroy(
//                     existingPage.header.image.publicId
//                 );
//             }

//             let base64Data = base64Image;
//             if (base64Image.startsWith("data:")) {
//                 base64Data = base64Image.split(",")[1];
//             }
//             const buffer = Buffer.from(base64Data, "base64");
//             const compressedBuffer = await sharp(buffer)
//                 .resize({ width: 800 }) // Only width specified; height adjusts automatically.
//                 .jpeg({ quality: 80 })
//                 .toBuffer();

//             const imageUpload = await uploadFromBuffer(compressedBuffer);

//             headerData.image = {
//                 url: imageUpload.secure_url,
//                 publicId: imageUpload.public_id,
//                 isCloudinary: true,
//             };
//         } else if (imageUrl) {
//             // No new image provided; check if the provided URL is the same as the existing one.
//             if (
//                 existingPage.header &&
//                 existingPage.header.image &&
//                 existingPage.header.image.url === imageUrl
//             ) {
//                 // The URL is already in Cloudinary—keep the existing image object.
//                 headerData.image = existingPage.header.image;
//             } else {
//                 // A new external URL is provided.
//                 // If the previous image was from Cloudinary, delete it.
//                 if (
//                     existingPage.header &&
//                     existingPage.header.image &&
//                     existingPage.header.image.isCloudinary &&
//                     existingPage.header.image.publicId
//                 ) {
//                     await cloudinary.uploader.destroy(
//                         existingPage.header.image.publicId
//                     );
//                 }
//                 headerData.image = {
//                     url: imageUrl,
//                     publicId: "",
//                     isCloudinary: false,
//                 };
//             }
//         }

//         const updatedPage = await Page.findOneAndUpdate(
//             { userId: req.user._id },
//             { $set: { header: headerData } },
//             { new: true, runValidators: true }
//         );
//         console.log(updatedPage);

//         return res.json({
//             success: true,
//             message: "Header section updated successfully",
//             data: updatedPage,
//         });
//     } catch (error) {
//         console.error("Error updating header section:", error);
//         return res.status(500).json({
//             success: false,
//             error: "Failed to update header section",
//             details:
//                 process.env.NODE_ENV === "production"
//                     ? undefined
//                     : error.message,
//         });
//     }
// });

// router.put("/edit/about", auth, checkVendor, async (req, res) => {
//     try {
//         const { title, imageUrl, content, base64Image } = req.body;

//         if (!title || !content || (!base64Image && !imageUrl)) {
//             return res.status(400).json({
//                 success: false,
//                 message: "All fields are required.",
//             });
//         }

//         const existingPage = await Page.findOne({ userId: req.user._id });
//         if (!existingPage) {
//             return res.status(404).json({
//                 success: false,
//                 error: "Page not found",
//             });
//         }

//         const aboutData = {
//             title,
//             content,
//         };

//         if (base64Image) {
//             if (
//                 existingPage.about &&
//                 existingPage.about.image &&
//                 existingPage.about.image.isCloudinary &&
//                 existingPage.about.image.publicId
//             ) {
//                 await cloudinary.uploader.destroy(
//                     existingPage.about.image.publicId
//                 );
//             }

//             let base64Data = base64Image;
//             if (base64Image.startsWith("data:")) {
//                 base64Data = base64Image.split(",")[1];
//             }
//             const buffer = Buffer.from(base64Data, "base64");

//             const compressedBuffer = await sharp(buffer)
//                 .resize({ width: 800 })
//                 .jpeg({ quality: 80 })
//                 .toBuffer();

//             const imageUpload = await uploadFromBuffer(compressedBuffer);

//             aboutData.image = {
//                 url: imageUpload.secure_url,
//                 publicId: imageUpload.public_id,
//                 isCloudinary: true,
//             };
//         } else if (imageUrl) {
//             if (
//                 existingPage.about &&
//                 existingPage.about.image &&
//                 existingPage.about.image.url === imageUrl
//             ) {
//                 aboutData.image = existingPage.about.image;
//             } else {
//                 if (
//                     existingPage.about &&
//                     existingPage.about.image &&
//                     existingPage.about.image.isCloudinary &&
//                     existingPage.about.image.publicId
//                 ) {
//                     await cloudinary.uploader.destroy(
//                         existingPage.about.image.publicId
//                     );
//                 }
//                 aboutData.image = {
//                     url: imageUrl,
//                     publicId: "",
//                     isCloudinary: false,
//                 };
//             }
//         }

//         const page = await Page.findOneAndUpdate(
//             { userId: req.user._id },
//             { $set: { about: aboutData } },
//             { new: true, runValidators: true }
//         );

//         res.json({
//             success: true,
//             message: "About section updated successfully",
//             data: page,
//         });
//     } catch (error) {
//         console.error("Error updating about section:", error);
//         res.status(500).json({
//             success: false,
//             error: "Failed to update about section",
//             details:
//                 process.env.NODE_ENV === "production"
//                     ? undefined
//                     : error.message,
//         });
//     }
// });

// // -----------------------
// // Update Features Section
// // -----------------------
// router.put("/edit/features", auth, checkVendor, async (req, res) => {
//     try {
//         const { title, content, features, imageUrl, base64Image } = req.body;

//         if (!title || !content || !features || (!base64Image && !imageUrl)) {
//             return res.status(400).json({
//                 success: false,
//                 message: "All fields are required.",
//             });
//         }

//         const existingPage = await Page.findOne({ userId: req.user._id });
//         if (!existingPage) {
//             return res.status(404).json({
//                 success: false,
//                 error: "Page not found",
//             });
//         }

//         const transformedFeatures = Array.isArray(features)
//             ? features.map((feature) =>
//                   typeof feature === "string" ? { text: feature } : feature
//               )
//             : [];

//         const featuresData = {
//             title,
//             content,
//             features: transformedFeatures,
//         };

//         if (base64Image) {
//             if (
//                 existingPage.features &&
//                 existingPage.features.image &&
//                 existingPage.features.image.isCloudinary &&
//                 existingPage.features.image.publicId
//             ) {
//                 await cloudinary.uploader.destroy(
//                     existingPage.features.image.publicId
//                 );
//             }

//             let base64Data = base64Image;
//             if (base64Image.startsWith("data:")) {
//                 base64Data = base64Image.split(",")[1];
//             }
//             const buffer = Buffer.from(base64Data, "base64");

//             const compressedBuffer = await sharp(buffer)
//                 .resize({ width: 800 })
//                 .jpeg({ quality: 80 })
//                 .toBuffer();

//             const imageUpload = await uploadFromBuffer(compressedBuffer);

//             featuresData.image = {
//                 url: imageUpload.secure_url,
//                 publicId: imageUpload.public_id,
//                 isCloudinary: true,
//             };
//         } else if (imageUrl) {
//             if (
//                 existingPage.features &&
//                 existingPage.features.image &&
//                 existingPage.features.image.url === imageUrl
//             ) {
//                 featuresData.image = existingPage.features.image;
//             } else {
//                 if (
//                     existingPage.features &&
//                     existingPage.features.image &&
//                     existingPage.features.image.isCloudinary &&
//                     existingPage.features.image.publicId
//                 ) {
//                     await cloudinary.uploader.destroy(
//                         existingPage.features.image.publicId
//                     );
//                 }
//                 featuresData.image = {
//                     url: imageUrl,
//                     publicId: "",
//                     isCloudinary: false,
//                 };
//             }
//         }

//         const page = await Page.findOneAndUpdate(
//             { userId: req.user._id },
//             { $set: { features: featuresData } },
//             { new: true, runValidators: true }
//         );

//         return res.json({
//             success: true,
//             message: "Features section updated successfully",
//             data: page,
//         });
//     } catch (error) {
//         console.error("Error updating features section:", error);
//         return res.status(500).json({
//             success: false,
//             error: "Failed to update features section",
//             details:
//                 process.env.NODE_ENV === "production"
//                     ? undefined
//                     : error.message,
//         });
//     }
// });

// // Update Pricing Section
// router.put(
//     "/edit/pricing",
//     auth,
//     checkVendor,
//     // validateObjectId,
//     // validatePricing,
//     async (req, res) => {
//         try {
//             // Check if the page exists
//             const existingPage = await Page.findOne({
//                 userId: req.user._id,
//             });
//             if (!existingPage) {
//                 return res.status(404).json({
//                     success: false,
//                     error: "Page not found",
//                 });
//             }

//             let pricingData = {};

//             // Determine if pricing data is provided as an array or within a "cards" property.
//             if (Array.isArray(req.body)) {
//                 // If it's an array, transform it into an object with a "cards" property.
//                 pricingData.cards = req.body.map((card) => ({
//                     title: card.title,
//                     price: card.price,
//                     description: card.description,
//                     // Transform features array: wrap each string in an object with a "text" key.
//                     features: Array.isArray(card.features)
//                         ? card.features.map((feature) =>
//                               typeof feature === "string"
//                                   ? { text: feature }
//                                   : feature
//                           )
//                         : [],
//                 }));
//             } else if (req.body.cards && Array.isArray(req.body.cards)) {
//                 pricingData.cards = req.body.cards.map((card) => ({
//                     title: card.title,
//                     price: card.price,
//                     description: card.description,
//                     features: Array.isArray(card.features)
//                         ? card.features.map((feature) =>
//                               typeof feature === "string"
//                                   ? { text: feature }
//                                   : feature
//                           )
//                         : [],
//                 }));
//             } else {
//                 return res.status(400).json({
//                     success: false,
//                     message: "Invalid pricing data format.",
//                 });
//             }

//             // Update the pricing section with the transformed data
//             const page = await Page.findOneAndUpdate(
//                 { userId: req.user._id },
//                 { $set: { pricing: pricingData } },
//                 { new: true, runValidators: true }
//             );

//             return res.json({
//                 success: true,
//                 message: "Pricing section updated successfully",
//                 data: page,
//             });
//         } catch (error) {
//             console.error("Error updating pricing section:", error);
//             return res.status(500).json({
//                 success: false,
//                 error: "Failed to update pricing section",
//                 details:
//                     process.env.NODE_ENV === "production"
//                         ? undefined
//                         : error.message,
//             });
//         }
//     }
// );

// // Update How-It-Works Section
// router.put("/edit/how-it-works", auth, checkVendor, async (req, res) => {
//     try {
//         const { title, description, steps } = req.body;

//         // Validate required fields
//         if (
//             !title ||
//             !description ||
//             !Array.isArray(steps) ||
//             steps.length === 0
//         ) {
//             return res.status(400).json({
//                 success: false,
//                 message:
//                     "Title, description, and at least one step are required.",
//             });
//         }

//         // Validate that each step has both title and content
//         for (const [index, step] of steps.entries()) {
//             if (!step.title || !step.content) {
//                 return res.status(400).json({
//                     success: false,
//                     message: `Step ${index + 1} is missing a title or content.`,
//                 });
//             }
//         }

//         // Check if the page exists
//         const existingPage = await Page.findOne({
//             userId: req.user._id,
//         });
//         if (!existingPage) {
//             return res.status(404).json({
//                 success: false,
//                 message: "Page not found",
//             });
//         }

//         // Build the howItWorks data object based on your schema
//         const howItWorksData = { title, description, steps };

//         // Update the page's howItWorks section
//         const page = await Page.findOneAndUpdate(
//             { userId: req.user._id },
//             { $set: { howItWorks: howItWorksData } },
//             { new: true, runValidators: true }
//         );

//         return res.json({
//             success: true,
//             message: "How-It-Works section updated successfully",
//             data: page,
//         });
//     } catch (error) {
//         console.error("Error updating How-It-Works section:", error);
//         return res.status(500).json({
//             success: false,
//             message: "Failed to update How-It-Works section",
//             details:
//                 process.env.NODE_ENV === "production"
//                     ? undefined
//                     : error.message,
//         });
//     }
// });

// // Update page publish status
// router.put("/:id/publish", auth, checkVendor, async (req, res) => {
//     try {
//         const { isPublished } = req.body;

//         if (typeof isPublished !== "boolean") {
//             return res.status(400).json({
//                 success: false,
//                 error: "isPublished must be a boolean value",
//             });
//         }

//         // Find page first to check if it exists
//         const existingPage = await Page.findById(req.params.id);
//         if (!existingPage) {
//             return res.status(404).json({
//                 success: false,
//                 error: "Page not found",
//             });
//         }

//         const page = await Page.findByIdAndUpdate(
//             req.params.id,
//             { $set: { isPublished } },
//             { new: true, runValidators: true }
//         );

//         res.json({
//             success: true,
//             message: `Page ${
//                 isPublished ? "published" : "unpublished"
//             } successfully`,
//             data: page,
//         });
//     } catch (error) {
//         console.error("Error updating page publish status:", error);
//         res.status(500).json({
//             success: false,
//             error: "Failed to update page publish status",
//             details:
//                 process.env.NODE_ENV === "production"
//                     ? undefined
//                     : error.message,
//         });
//     }
// });

// // Update page active status
// router.put("/:id/activate", auth, checkVendor, async (req, res) => {
//     try {
//         const { isActive } = req.body;

//         if (typeof isActive !== "boolean") {
//             return res.status(400).json({
//                 success: false,
//                 error: "isActive must be a boolean value",
//             });
//         }

//         // Find page first to check if it exists
//         const existingPage = await Page.findById(req.params.id);
//         if (!existingPage) {
//             return res.status(404).json({
//                 success: false,
//                 error: "Page not found",
//             });
//         }

//         const page = await Page.findByIdAndUpdate(
//             req.params.id,
//             { $set: { isActive } },
//             { new: true, runValidators: true }
//         );

//         res.json({
//             success: true,
//             message: `Page ${
//                 isActive ? "activated" : "deactivated"
//             } successfully`,
//             data: page,
//         });
//     } catch (error) {
//         console.error("Error updating page active status:", error);
//         res.status(500).json({
//             success: false,
//             error: "Failed to update page active status",
//             details:
//                 process.env.NODE_ENV === "production"
//                     ? undefined
//                     : error.message,
//         });
//     }
// });

// router.delete(
//     "/:id",
//     auth,
//     checkVendor,
//     // validateObjectId,
//     async (req, res) => {
//         try {
//             // Find page first to check if it exists
//             const existingPage = await Page.findById(req.params.id);
//             if (!existingPage) {
//                 return res.status(404).json({
//                     success: false,
//                     error: "Page not found",
//                 });
//             }

//             await Page.findByIdAndDelete(req.params.id);

//             res.json({
//                 success: true,
//                 message: "Page deleted successfully",
//             });
//         } catch (error) {
//             console.error("Error deleting page:", error);
//             res.status(500).json({
//                 success: false,
//                 error: "Failed to delete page",
//                 details:
//                     process.env.NODE_ENV === "production"
//                         ? undefined
//                         : error.message,
//             });
//         }
//     }
// );

module.exports = router;
