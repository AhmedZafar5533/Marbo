const express = require("express");
const OilOffer = require("../models/OilOfferSchema");
const Service = require("../models/service");
const uploadFromBuffer = require("../Utils/imageCompress");
const sharp = require("sharp");

const checkVendor = require("../middlewares/checkVendor");
const router = express.Router();

router.post("/create", checkVendor, async (req, res) => {
  try {
    const userServices = await Service.findOne({
      userId: req.user._id,
      category: "Oil Services",
    });
    console.log("Found user services:", userServices);
    if (!userServices) {
      return res.status(400).json({ message: "Service not found" });
    }

    let image = req.body.image;
    if (image.startsWith("data:")) {
      image = image.split(",")[1];
    }

    const buffer = Buffer.from(image, "base64");
    const compressedImage = await sharp(buffer)
      .resize({ width: 800 })
      .jpeg({ quality: 80 })
      .toBuffer();
    const newImage = await uploadFromBuffer(compressedImage);
    image = {
      imageUrl: newImage.secure_url,
      publicId: newImage.public_id,
    };

    req.body.image = image;

    const body = req.body;
    const oil = await OilOffer.create({
      image: body.image,
      pricePerLiter: body.pricePerLiter,
      maxLimit: body.maxLimit,
      voucherValidity: body.voucherValidity,
      description: body.description,
      serviceId: userServices._id,
      name: body.title,
      type: "Oil Offer",
    });

    res.status(201).json({ message: "Oil offer created successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to create oil offer" });
  }
});

router.get("/:offerId", async (req, res) => {
  try {
    const { offerId } = req.params;
    const oilOffer = await OilOffer.findById(offerId);
    if (!oilOffer) {
      return res.status(404).json({ message: "Oil offer not found" });
    }
    res.status(200).json({ offer: oilOffer });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch oil offer" });
  }
});

module.exports = router;
