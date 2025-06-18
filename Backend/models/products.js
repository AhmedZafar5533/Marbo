const mongoose = require("mongoose");

const imagesSchema = new mongoose.Schema(
    {
        imageUrl: {
            type: String,
            required: true,
        },
        publicId: {
            type: String,
            required: true,
        },
    },
    { _id: false, timestamps: true }
);

const productSchema = new mongoose.Schema(
    {
        serviceId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Service",
            required: true,
        },
        productName: {
            type: String,
            required: true,
        },

        category: {
            type: String,
            required: true,
        },
        price: {
            type: Number,
            required: true,
        },
        description: {
            type: String,
            required: true,
        },
        features: {
            type: [String],
            required: true,
        },
        quantity: {
            type: Number,
            required: true,
        },
        // rating: {
        //     type: Number,
        //     default: 0,
        //     min: 1,
        //     max: 5,
        // },
        images: {
            type: [imagesSchema],
            validate: {
                validator: function (v) {
                    return v.length <= 4;
                },
                message: "Products can have a maximum of 4 images.",
            },
        },
    },
    { timestamps: true }
);

productSchema.index({ serviceId: 1 });

module.exports = mongoose.model("Product", productSchema);
