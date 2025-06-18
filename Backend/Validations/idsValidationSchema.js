import Joi from "joi";
import mongoose from "mongoose";

const objectIdValidator = Joi.string().custom((value, helpers) => {
    if (!mongoose.Types.ObjectId.isValid(value)) {
        return helpers.error("any.invalid");
    }
    return value;
}, "ObjectId Validation");

const idValidaionSchema = Joi.object({
    userId: objectIdValidator.required(),
});

export default idValidaionSchema;
