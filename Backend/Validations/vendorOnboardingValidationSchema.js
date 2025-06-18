const Joi = require("joi");

const businessDetailsSchemaJoi = Joi.object({
    businessName: Joi.string().required().messages({
        "string.empty": "Business Name is required.",
    }),
    legalBusinessName: Joi.string().required().messages({
        "string.empty": "Legal Business Name is required.",
    }),
    businessType: Joi.string().required().messages({
        "string.empty": "Business Type is required.",
    }),
    businessIndustry: Joi.string().required().messages({
        "string.empty": "Business Industry is required.",
    }),
    registrationNumber: Joi.string().required().messages({
        "string.empty": "Registration Number is required.",
    }),
});

const businessContactSchemaJoi = Joi.object({
    businessEmail: Joi.string().email().required().messages({
        "string.empty": "Business Email is required.",
        "string.email": "Business Email must be a valid email address.",
    }),
    businessPhone: Joi.string().required().messages({
        "string.empty": "Business Phone is required.",
    }),
    website: Joi.string().uri().allow("").optional().messages({
        "string.uri": "Website must be a valid URI.",
    }),
});

const ownerDetailsSchemaJoi = Joi.object({
    name: Joi.string().required().messages({
        "string.empty": "Owner Name is required.",
    }),
    dateOfBirth: Joi.date().required().max("now").messages({
        "date.base": "Date of Birth must be a valid date.",
        "any.required": "Date of Birth is required.",
        "date.max": "Date of Birth cannot be in the future.",
    }),
    nationality: Joi.string().required().messages({
        "string.empty": "Nationality is required.",
    }),
    identificationType: Joi.string()
        .valid("Passport", "Driver's License", "National ID")
        .required()
        .messages({
            "any.only":
                "Identification Type must be one of: Passport, Driver's License, National ID.",
            "any.required": "Identification Type is required.",
            "string.empty": "Identification Type is required.",
        }),
    identificationNumber: Joi.string().required().messages({
        "string.empty": "Identification Number is required.",
    }),
    ownerPhoto: Joi.string().base64().allow("").optional().messages({
        "string.base64": "Owner Photo must be a valid Base64 encoded string.",
    }),
    ownerDocumentPhoto: Joi.string().base64().allow("").optional().messages({
        "string.base64":
            "Owner Document Photo must be a valid Base64 encoded string.",
    }),
});

const contactPersonSchemaJoi = Joi.object({
    name: Joi.string().required().messages({
        "string.empty": "Contact Person Name is required.",
    }),
    phone: Joi.string().required().messages({
        "string.empty": "Contact Person Phone is required.",
    }),
    email: Joi.string().email().required().messages({
        "string.empty": "Contact Person Email is required.",
        "string.email": "Contact Person Email must be a valid email address.",
    }),
    title: Joi.string().allow("").optional().messages({
        "string.empty": "Contact Person Title cannot be empty if provided.",
    }),
});

const businessAddressSchemaJoi = Joi.object({
    street: Joi.string().required().messages({
        "string.empty": "Street is required.",
    }),
    city: Joi.string().required().messages({
        "string.empty": "City is required.",
    }),
    state: Joi.string().required().messages({
        "string.empty": "State is required.",
    }),
    zip: Joi.string().required().messages({
        "string.empty": "Zip code is required.",
    }),
    country: Joi.string().required().messages({
        "string.empty": "Country is required.",
    }),
});

const vendorSchemaJoi = Joi.object({
    userId: Joi.string().hex().length(24).required().messages({
        "string.empty": "User ID is required.",
        "string.hex": "User ID must be a hexadecimal string.",
        "string.length": "User ID must be 24 characters long.",
    }),
    businessDetails: businessDetailsSchemaJoi.required().messages({
        "any.required": "Business Details are required.",
    }),
    businessContact: businessContactSchemaJoi.required().messages({
        "any.required": "Business Contact details are required.",
    }),
    ownerDetails: ownerDetailsSchemaJoi.required().messages({
        "any.required": "Owner Details are required.",
    }),
    contactPerson: contactPersonSchemaJoi.required().messages({
        "any.required": "Contact Person details are required.",
    }),
    businessAddress: businessAddressSchemaJoi.required().messages({
        "any.required": "Business Address is required.",
    }),
    status: Joi.string()
        .valid("Pending", "Approved", "Rejected", "Onboarding")
        .default("Onboarding")
        .messages({
            "any.only":
                "Status must be one of: Pending, Approved, Rejected, Onboarding.",
        }),
});

module.exports = {
    vendorSchemaJoi,
    businessDetailsSchemaJoi,
    businessContactSchemaJoi,
    ownerDetailsSchemaJoi,
    contactPersonSchemaJoi,
    businessAddressSchemaJoi,
};
