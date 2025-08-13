const express = require("express");
const router = express.Router();
const Page = require("../models/servicePage");
const auth = require("../middlewares/checkAuthetication");
const checkVendor = require("../middlewares/checkVendor");
const sharp = require("sharp");

const cloudinary = require("../config/cloudinary");

const Vendor = require("../models/vendors");
const uploadFromBuffer = require("../Utils/imageCompress");
const service = require("../models/service");
const User = require("../models/User");
const activeServices = require("../models/activeServices");

router.get("/services/get", auth, checkVendor, async (req, res) => {
  try {
    const { id } = req.user;
    const user = await User.findById(id);
    if (user && user.onboardingDone === "no")
      return res.status(400).json({
        onboardingDone: "pending",
        message:
          "Please complete the onboarding process first before proceeding!",
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

// todo: Have to validate the category params later on

//todo: apply this more efficient method for feching later

// router.get("/services/all/:category", async (req, res) => {
//     try {
//         const { category } = req.params;
//         const {
//             recommendedCursor,
//             basicCursor,
//             recommendedLimit = 6,
//             basicLimit = 6,
//         } = req.query;

//         const buildCursorQuery = (cursor) =>
//             cursor ? { _id: { $gt: new mongoose.Types.ObjectId(cursor) } } : {};

//         let recommendedServices = [];
//         let recommendedQuery = buildCursorQuery(recommendedCursor);
//         const tiers = ["Diamond", "Premium", "Silver"];

//         for (const tier of tiers) {
//             if (recommendedServices.length >= recommendedLimit) break;

//             const remaining = recommendedLimit - recommendedServices.length;
//             const tierServices = await Service.find({
//                 category,
//                 tier,
//                 ...recommendedQuery,
//             })
//                 .sort({ _id: 1 }) // Ensure order
//                 .limit(remaining);

//             recommendedServices = recommendedServices.concat(tierServices);

//             // If we got some services, update the cursor query
//             if (tierServices.length > 0) {
//                 recommendedQuery._id = {
//                     $gt: tierServices[tierServices.length - 1]._id,
//                 };
//             }
//         }

//         // Step 2: Basic Services
//         const basicServices = await Service.find({
//             category,
//             tier: "Basic",
//             ...buildCursorQuery(basicCursor),
//         })
//             .sort({ _id: 1 })
//             .limit(Number(basicLimit));

//         return res.status(200).json({
//             recommended: recommendedServices,
//             basic: basicServices,
//         });
//     } catch (error) {
//         console.error("Error fetching services:", error);
//         return res.status(500).json({
//             success: false,
//             message: "Failed to fetch services",
//         });
//     }
// });

router.get("/services/all/:category", async (req, res) => {
  try {
    console.log(req.params.category);
    const services = await service.find({
      category: req.params.category,
    });
    console.log(services);

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
      price,
      description,
      image: newImage,
      serviceName,
      status,
    } = req.body;

    const existingService = await service.findById(id);
    if (!existingService) {
      return res.status(404).json({
        success: false,
        error: "Service not found",
      });
    }

    if (price) existingService.price = price;
    if (description) existingService.description = description;
    if (serviceName) existingService.serviceName = serviceName;
    if (status) existingService.status = status;

    // Handle image update
    if (newImage && !newImage.url.startsWith("https")) {
      // Delete old image from Cloudinary
      if (existingService.image?.publicId) {
        await cloudinary.uploader.destroy(existingService.image.publicId);
      }

      let image = newImage.url;
      if (image.startsWith("data:")) {
        image = image.split(",")[1];
      }
      const buffer = Buffer.from(image, "base64");
      const compressedImage = await sharp(buffer)
        .resize({ width: 800 })
        .jpeg({ quality: 80 })
        .toBuffer();
      const uploadedImage = await uploadFromBuffer(compressedImage);
      existingService.image = {
        publicId: uploadedImage.public_id,
        url: uploadedImage.secure_url,
      };
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
        process.env.NODE_ENV === "production" ? undefined : error.message,
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
        process.env.NODE_ENV === "production" ? undefined : error.message,
    });
  }
});
router.post("/services/initialize", auth, checkVendor, async (req, res) => {
  try {
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

    if (!category || !price || !description || !base64Image || !name || !status)
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
        message: "A service with this name already exists for this vendor",
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

    res.status(500).json({
      success: false,
      message: "Failed to create service",
      details:
        process.env.NODE_ENV === "production" ? undefined : error.message,
    });
  }
});

router.get("/services/active/all", async (req, res) => {
  try {
    const services = await activeServices.find(
      { isActive: true },
      { _id: 0, title: 1 }
    );

    res.json({
      success: true,
      data: services,
    });
  } catch (error) {
    console.error("Error retrieving services:", error);
    res.status(500).json({
      success: false,
      error: "Failed to retrieve services",
      details:
        process.env.NODE_ENV === "production" ? undefined : error.message,
    });
  }
});

router.get("/service/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const serviceToFind = await service.findById(id);
    console.log(serviceToFind);
    if (!serviceToFind)
      return res.status(404).json({ message: "Service not found." });
    return res.status(200).json({
      success: true,
      data: serviceToFind,
    });
  } catch (error) {
    res.status(500).json({ message: "Internal server error." });
  }
});

module.exports = router;
