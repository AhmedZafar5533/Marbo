const express = require("express");
const checkVendor = require("../middlewares/checkVendor");
const Product = require("../models/products");
const {
  productSchemaJoi: productSchema,
} = require("../Validations/productValiadtionSchema");
const Service = require("../models/service");

const uploadFromBuffer = require("../Utils/imageCompress");
const sharp = require("sharp");
const mainProduct = require("../models/mainProduct");

const router = express.Router();

router.post("/add", checkVendor, async (req, res) => {
  try {
    const { typeOf } = req.body;
    let serviceToFindType;

    if (typeOf === "Groceries") {
      serviceToFindType = "Groceries";
    } else if (typeOf === "Tech") {
      serviceToFindType = "Tech Supplies";
    } else if (typeOf === "Clothing") {
      serviceToFindType = "Traditional Clothing";
    }

    const service = await Service.findOne({
      userId: req.user._id,
      category: serviceToFindType,
    }).exec();
    if (!service) {
      return res.status(404).json({ message: "Service not found" });
    }
    const { error } = productSchema.validate({
      productName: req.body.productName,
      category: req.body.category,
      price: req.body.price,
      description: req.body.description,
      features: req.body.features,
      typeOf: req.body.typeOf,
      warranty: req.body?.warranty,
      gender: req.body?.gender,
      sizes: req.body?.sizes,
      brand: req.body?.brand,
      warrantyConditions: req.body?.warrantyConditions,
      quantity: req.body.quantity,
      images: req.body.images,
    });
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }
    console.log(error);
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

    // Start with the basic product data
    const productData = {
      serviceId: service._id,
      name: req.body.productName,
      category: req.body.category,
      price: req.body.price,
      description: req.body.description,
      type: req.body.typeOf,
      images: {
        publicId: "jknsfd",
        imageUrl:
          "https://res.cloudinary.com/dx1u2f3eu/image/upload/v1700343085/jknsfd.jpg",
      },
      sizes: req.body?.sizes,
      gender: req.body?.gender,
      brand: req.body?.brand,
      warrantyConditions: req.body?.warrantyConditions,
      warranty: req.body?.warranty,
      quantity: req.body.quantity,
      features: req.body.features,
      vendorId: req.user._id,
    };

    if (req.body.warranty) {
      productData.warranty = req.body.warranty;
    }

    if (req.body.warrantyConditions) {
      productData.warrantyConditions = req.body.warrantyConditions;
    }

    const newProduct = Product.create(productData);

    res.status(200).json({
      // product,
      message: "Product added successfully",
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Internal server error" });
  }
});

router.get("/get/inventory/:typeOf", checkVendor, async (req, res) => {
  try {
    const { typeOf } = req.params;

    if (typeOf === "Groceries") {
      serviceToFindType = "Groceries";
    } else if (typeOf === "Tech") {
      serviceToFindType = "Tech Supplies";
    } else if (typeOf === "Clothing") {
      serviceToFindType = "Traditional Clothing";
    }

    const service = await Service.findOne({
      userId: req.user._id,
      category: serviceToFindType,
    }).exec();
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
