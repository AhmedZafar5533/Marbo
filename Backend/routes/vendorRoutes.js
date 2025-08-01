const express = require("express");
const router = express.Router();
const Vendor = require("../models/vendors");
const auth = require("../middlewares/checkAuthetication");
const path = require("path");
const checkAuthetication = require("../middlewares/checkAuthetication");
const uploadFromBuffer = require("../Utils/imageCompress");
const sharp = require("sharp");
const User = require("../models/User");

router.post("/initialize", checkAuthetication, async (req, res) => {
  try {
    const isVendor = await User.findById(req.user.id);
    console.log(isVendor);
    if (isVendor.role !== "vendor") {
      return res.status(400).json({
        message: "User is not a vendor",
      });
    }
    const existingVendor = await Vendor.findOne({ userId: req.user.id });

    console.log("existingVendor", existingVendor);

    if (existingVendor) {
      return res.json({
        isInititialized: true,
        newVendor: false,
        vendorData: existingVendor,
      });
    }

    const newVendor = new Vendor({
      userId: req.user.id,
    });

    await newVendor.save();

    res.status(201).json({
      success: true,
      newVendor: true,
      message: "Vendor onboarding initialized",
    });
  } catch (error) {
    console.error("Error initializing vendor onboarding:", error);
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
});

router.post("/business-details", checkAuthetication, async (req, res) => {
  try {
    const {
      businessName,
      legalBusinessName,
      businessType,
      businessIndustry,
      registrationNumber,
    } = req.body;

    if (
      !businessName ||
      !legalBusinessName ||
      !businessType ||
      !businessIndustry ||
      !registrationNumber
    ) {
      return res.status(400).json({
        success: false,
        message: "Please provide all required business details",
      });
    }

    const duplicateVendor = await Vendor.findOne({
      "businessDetails.registrationNumber": registrationNumber,
      userId: { $ne: req.user.id },
    });

    if (duplicateVendor) {
      return res.status(400).json({
        message: "Registration number already exists",
      });
    }

    const vendor = await Vendor.findOneAndUpdate(
      { userId: req.user.id },
      {
        businessDetails: {
          businessName,
          legalBusinessName,
          businessType,
          businessIndustry,
          registrationNumber,
        },
      },
      { new: true }
    );

    if (!vendor) {
      return res.status(404).json({
        message: "Vendor profile not found.",
      });
    }

    res.status(200).json({
      success: true,
      message: "Business details saved successfully",
      nextStep: "ownerDetails",
      vendor,
    });
  } catch (error) {
    console.error("Error saving business details:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
});

router.post("/business-contact", checkAuthetication, async (req, res) => {
  try {
    const { businessEmail, businessPhone, website } = req.body;
    if (!businessEmail || !businessPhone)
      return res.status(400).json({
        success: false,
        message: "Please provide all required owner details",
      });

    const duplicateEmail = await Vendor.findOne({
      "businessContact.businessEmail": businessEmail,
      userId: { $ne: req.user.id },
    });

    if (duplicateEmail) {
      return res.status(400).json({
        message:
          "Business email already registered. Please use a different email.",
      });
    }
    // Find and update vendor
    const vendor = await Vendor.findOneAndUpdate(
      { userId: req.user.id },
      {
        businessContact: {
          businessEmail,
          businessPhone,
          website: website || "",
        },
      },
      { new: true }
    );

    if (!vendor) {
      return res.status(404).json({
        success: false,
        message: "Vendor profile not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Business contact details saved successfully",
      vendor,
    });
  } catch (error) {
    console.error("Error saving contact person details:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
});

router.post("/owner-details", checkAuthetication, async (req, res) => {
  try {
    const {
      name,
      dateOfBirth,
      nationality,
      identificationType,
      identificationNumber,
      ownerDocumentPhoto,
      ownerPhoto,
    } = req.body;

    if (
      !name ||
      !dateOfBirth ||
      !nationality ||
      !identificationType ||
      !identificationNumber ||
      !ownerPhoto ||
      !ownerDocumentPhoto
    ) {
      return res.status(400).json({
        success: false,
        message: "Please provide all required owner details",
      });
    }

    // Handle owner photo
    // let ownerPhotoUrl;
    // // Check if the photo is already a URL (not starting with data:)
    if (ownerPhoto.startsWith("http://") || ownerPhoto.startsWith("https://")) {
      // If it's already a URL, use it directly
      ownerPhotoUrl = ownerPhoto;
    } else {
      // Process and upload the image
      let base64Data = ownerPhoto;
      if (ownerPhoto.startsWith("data:")) {
        base64Data = ownerPhoto.split(",")[1];
      }
      const buffer = Buffer.from(base64Data, "base64");
      const compressedBuffer = await sharp(buffer)
        .resize({ width: 800 })
        .jpeg({ quality: 80 })
        .toBuffer();

      const ownerImageUpload = await uploadFromBuffer(compressedBuffer);
      ownerPhotoUrl = ownerImageUpload.secure_url;
    }

    // Handle owner document photo
    let ownerDocumentPhotoUrl;
    // Check if the document photo is already a URL
    if (
      ownerDocumentPhoto.startsWith("http://") ||
      ownerDocumentPhoto.startsWith("https://")
    ) {
      // If it's already a URL, use it directly
      ownerDocumentPhotoUrl = ownerDocumentPhoto;
    } else {
      // Process and upload the document image
      let base64DocumentData = ownerDocumentPhoto;
      if (ownerDocumentPhoto.startsWith("data:")) {
        base64DocumentData = ownerDocumentPhoto.split(",")[1];
      }
      const documentBuffer = Buffer.from(base64DocumentData, "base64");
      const compressedDocumentBuffer = await sharp(documentBuffer)
        .resize({ width: 800 })
        .jpeg({ quality: 80 })
        .toBuffer();

      const ownerDocumentImageUpload = await uploadFromBuffer(
        compressedDocumentBuffer
      );
      ownerDocumentPhotoUrl = ownerDocumentImageUpload.secure_url;
    }

    const vendor = await Vendor.findOneAndUpdate(
      { userId: req.user.id },
      {
        ownerDetails: {
          name,
          dateOfBirth,
          nationality,
          identificationType,
          identificationNumber,
          // ownerPhoto: "jssdkfjsdfl",
          // ownerDocumentPhoto: "sfuousdosdk",
          ownerPhoto: ownerPhotoUrl,
          ownerDocumentPhoto: ownerDocumentPhotoUrl,
        },
      },
      { new: true }
    );

    if (!vendor) {
      return res.status(404).json({
        success: false,
        message: "Vendor profile not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Owner details saved successfully",
      nextStep: "contactPerson",
      vendor,
    });
  } catch (error) {
    console.error("Error saving owner details:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
});

router.post("/contact-person", auth, async (req, res) => {
  try {
    const { name, phone, email, title } = req.body;

    // Validate required fields
    if (!name || !phone || !email) {
      return res.status(400).json({
        success: false,
        message: "Please provide all required contact person details",
      });
    }

    const vendor = await Vendor.findOneAndUpdate(
      { userId: req.user.id },
      {
        contactPerson: {
          name,
          phone,
          email,
          title: title || "",
        },
      },
      { new: true }
    );

    if (!vendor) {
      return res.status(404).json({
        success: false,
        message: "Vendor profile not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Contact person details saved successfully",
      nextStep: "businessAddress",
      vendor,
    });
  } catch (error) {
    console.error("Error saving contact person details:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
});

// Step 4: Add business address
router.post("/business-address", auth, async (req, res) => {
  try {
    const { street, city, state, zip, country } = req.body;

    // Validate required fields
    if (!street || !city || !state || !zip || !country) {
      return res.status(400).json({
        success: false,
        message: "Please provide all required address details",
      });
    }

    // Find and update vendor
    const vendor = await Vendor.findOneAndUpdate(
      { userId: req.user.id },
      {
        businessAddress: {
          street,
          city,
          state,
          zip,
          country,
        },
      },
      { new: true }
    );

    if (!vendor) {
      return res.status(404).json({
        success: false,
        message: "Vendor profile not found",
      });
    }

    await User.findByIdAndUpdate(req.user.id, {
      onboardingDone: "pending",
    });

    await Vendor.findByIdAndUpdate(req.user.id, {
      status: "Pending",
    });

    res.status(200).json({
      success: true,
      message:
        "Business address saved successfully. Your vendor application is now under review.",
      vendor,
      completed: true,
    });
  } catch (error) {
    console.error("Error saving business address:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
});

module.exports = router;
