const Joi = require('joi');
Joi.objectId = require('joi-objectid')(Joi);



const objectIdPattern = /^[0-9a-fA-F]{24}$/;
const colorHexPattern = /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/;
const urlPattern = /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w .-]*)*\/?$/;


const idSchema = Joi.object({
    id: Joi.objectId().required()
  });
  


// Image validation schema - reused across multiple sections
const imageSchema = Joi.object({
    url: Joi.string().pattern(urlPattern).max(2000).required().messages({
        "string.pattern.base": "Image URL must be a valid URL format",
        "string.max": "Image URL must not exceed 2000 characters",
    }),
    isCloudinary: Joi.boolean().required(),
    publicId: Joi.string().allow("").max(255),
});

// Header Section Schema
const headerSectionSchema = Joi.object({
    text: Joi.string().max(200).trim().messages({
        "string.max": "Header text must not exceed 200 characters",
    }),
    description: Joi.string().max(500).trim().messages({
        "string.max": "Header description must not exceed 500 characters",
    }),
    image: imageSchema,
    gradientOpacity: Joi.number().min(0).max(1).messages({
        "number.min": "Gradient opacity must be at least 0",
        "number.max": "Gradient opacity must not exceed 1",
    }),
    textColor: Joi.string().pattern(colorHexPattern).messages({
        "string.pattern.base":
            "Text color must be a valid hex color code (e.g., #FFF or #FFFFFF)",
    }),
});

// About Section Schema
const aboutSectionSchema = Joi.object({
    title: Joi.string().max(200).trim().messages({
        "string.max": "About title must not exceed 200 characters",
    }),
    content: Joi.string().max(2000).trim().messages({
        "string.max": "About content must not exceed 2000 characters",
    }),
    image: imageSchema,
});

// Feature Item Schema
const featureItemSchema = Joi.object({
    text: Joi.string().max(200).trim().required().messages({
        "string.max": "Feature text must not exceed 200 characters",
        "any.required": "Feature text is required",
    }),
});

// Features Section Schema
const featuresSectionSchema = Joi.object({
    title: Joi.string().max(200).trim().messages({
        "string.max": "Features title must not exceed 200 characters",
    }),
    content: Joi.string().max(1000).trim().messages({
        "string.max": "Features content must not exceed 1000 characters",
    }),
    features: Joi.array().items(featureItemSchema).min(1).max(20).messages({
        "array.min": "At least one feature is required",
        "array.max": "Maximum of 20 features allowed",
    }),
    image: imageSchema,
});

// Pricing Feature Schema
const pricingFeatureSchema = Joi.object({
    text: Joi.string().max(200).trim().required().messages({
        "string.max": "Pricing feature text must not exceed 200 characters",
        "any.required": "Pricing feature text is required",
    }),
});

// Pricing Card Schema
const pricingCardSchema = Joi.object({
    title: Joi.string().max(100).trim().required().messages({
        "string.max": "Pricing title must not exceed 100 characters",
        "any.required": "Pricing title is required",
    }),
    price: Joi.string().max(50).trim().required().messages({
        "string.max": "Price must not exceed 50 characters",
        "any.required": "Price is required",
    }),
    description: Joi.string().max(500).trim().required().messages({
        "string.max": "Pricing description must not exceed 500 characters",
        "any.required": "Pricing description is required",
    }),
    features: Joi.array().items(pricingFeatureSchema).min(1).max(15).messages({
        "array.min": "At least one pricing feature is required",
        "array.max": "Maximum of 15 pricing features allowed",
    }),
});

// Pricing Section Schema
const pricingSectionSchema = Joi.object({
    cards: Joi.array().items(pricingCardSchema).min(1).max(5).messages({
        "array.min": "At least one pricing card is required",
        "array.max": "Maximum of 5 pricing cards allowed",
    }),
});

// Step Schema
const stepSchema = Joi.object({
    title: Joi.string().max(200).trim().required().messages({
        "string.max": "Step title must not exceed 200 characters",
        "any.required": "Step title is required",
    }),
    content: Joi.string().max(1000).trim().required().messages({
        "string.max": "Step content must not exceed 1000 characters",
        "any.required": "Step content is required",
    }),
});

// How It Works Section Schema
const howItWorksSectionSchema = Joi.object({
    title: Joi.string().max(200).trim().messages({
        "string.max": "How It Works title must not exceed 200 characters",
    }),
    description: Joi.string().max(500).trim().messages({
        "string.max": "How It Works description must not exceed 500 characters",
    }),
    steps: Joi.array().items(stepSchema).min(1).max(6).messages({
        "array.min": "At least one step is required",
        "array.max": "Maximum of 6 steps allowed",
    }),
});

// Main Page Schema
const pageSchema = Joi.object({
    vendorId: Joi.string().pattern(objectIdPattern).required().messages({
        "string.pattern.base": "Vendor ID must be a valid MongoDB ObjectId",
        "any.required": "Vendor ID is required",
    }),
    pageName: Joi.string()
        .min(3)
        .max(100)
        .trim()
        .required()
        .pattern(/^[a-zA-Z0-9-_]+$/)
        .messages({
            "string.min": "Page name must be at least 3 characters",
            "string.max": "Page name must not exceed 100 characters",
            "string.pattern.base":
                "Page name must contain only alphanumeric characters, hyphens, and underscores",
            "any.required": "Page name is required",
        }),
    header: headerSectionSchema,
    about: aboutSectionSchema,
    features: featuresSectionSchema,
    pricing: pricingSectionSchema,
    howItWorks: howItWorksSectionSchema,
    isActive: Joi.boolean(),
    isPublished: Joi.boolean(),
});

// Schema for creating a new page (all sections required)
const createPageSchema = pageSchema.fork(
    [
        "vendorId",
        "pageName",
        "header",
        "about",
        "features",
        "pricing",
        "howItWorks",
    ],
    (schema) => schema.required()
);

// Schema for updating a page (no fields required - partial updates allowed)
const updatePageSchema = pageSchema.fork(["vendorId", "pageName"], (schema) =>
    schema.optional()
);

module.exports = {
    createPageSchema,
    updatePageSchema,
    headerSectionSchema,
    aboutSectionSchema,
    featuresSectionSchema,
    pricingSectionSchema,
    howItWorksSectionSchema,
};
