const express = require("express");
const checkAuth = require("../middlewares/checkAuthetication");
const Bill = require("../models/billsFeeData");
const billValidationSchema = require("../Validations/billingFeeFileSchema");
const uploadFromBuffer = require("../Utils/imageCompress");
const sharp = require("sharp");
const service = require("../models/service");

const cloudinary = require("../config/cloudinary");

const router = express.Router();

router.post("/upload/:type/:serviceId", checkAuth, async (req, res) => {
  try {
    let serviceType;
    console.log(req.params.type);
    if (req.params.type == "Utility-Payments") {
      serviceType = "Utiliy Bill";
    } else if (req.params.type == "School-Fee-Payments") {
      serviceType = "School Fee Payment";
    } else {
      return res.status(400).json({ message: "Invalid Bill type" });
    }
    const alreadyExist = await Bill.findOne({
      userId: req.user._id,
      billType: serviceType,
      serviceId: req.params.serviceId,
    });
    if (alreadyExist) {
      return res.status(400).json({
        message:
          "You have already uploaded a bill. Please checkout first before uploading another one.",
      });
    }

    const { errors } = billValidationSchema.validate({
      ...req.body,
      type: req.params.type,
    });
    if (errors) {
      return res.status(400).json({ message: errors[0].message });
    }

    let base64Data = req.body.billImage;
    if (req.body.billImage.startsWith("data:")) {
      base64Data = req.body.billImage.split(",")[1];
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

    console.log(image);

    const bill = await Bill.create({
      ...req.body,
      userId: req.user._id,
      billType: serviceType,
      status: "pending",
      image: image,
    });

    res.status(200).json({ message: "Bill uploaded successfully", bill });
  } catch (error) {
    console.error("Error uploading bill fee data:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

router.get("/get/:type/:serviceId", async (req, res) => {
  try {
    let serviceType;
    if (req.params.type == "Utility-Payments") {
      serviceType = "Utiliy Bill";
    } else if (req.params.type == "School-Fee-Payments") {
      serviceType = "School Fee Payment";
    } else {
      return res.status(400).json({ message: "Invalid Bill type" });
    }
    const bills = await Bill.findOne({
      userId: req.user?._id,
      billType: serviceType,
      serviceId: req.params.serviceId,
    })
      .select("billType billNumber name dueDate amountDue status image ")
      .populate("serviceId");
    let serviceData;
    if (!bills) {
      serviceData = await service
        .findById(req.params.serviceId)
        .select("  rating serviceName image ")
        .exec();
      return res.status(200).json({ serviceData });
    }
    res.status(200).json({ bill: bills });
  } catch (error) {
    console.error("Error retrieving bills:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

router.delete("/delete/:id", checkAuth, async (req, res) => {
  try {
    const id = req.params.id;
    const billToDelete = await Bill.findByIdAndDelete(id).exec();
    await cloudinary.uploader.destroy(billToDelete.image[0].publicId);

    if (!billToDelete) {
      return res.status(404).json({ message: "Bill not found" });
    }

    res.status(200).json({ message: "User bill has been deleted" });
  } catch (error) {
    console.error("Error deleting bill:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

module.exports = router;
