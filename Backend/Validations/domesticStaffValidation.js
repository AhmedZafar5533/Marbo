const Joi = require("joi");

const baseScheduleJoiSchema = Joi.object({
    name: Joi.string().trim().min(3).max(50),
    hours: Joi.number().min(1).max(24).integer(),
    days: Joi.string().trim().min(3).max(50),
    rate: Joi.number().min(0),
    includedThings: Joi.array().items(Joi.string().trim().min(1).max(50)),
});

const createScheduleJoiSchema = baseScheduleJoiSchema.keys({
    name: baseScheduleJoiSchema.extract("name").required(),
    hours: baseScheduleJoiSchema.extract("hours").required(),
    days: baseScheduleJoiSchema.extract("days").required(),
    rate: baseScheduleJoiSchema.extract("rate").required(),
    includedThings: baseScheduleJoiSchema.extract("includedThings").required(),
});

const updateScheduleJoiSchema = baseScheduleJoiSchema.keys({
    name: baseScheduleJoiSchema.extract("name").optional(),
    hours: baseScheduleJoiSchema.extract("hours").optional(),
    days: baseScheduleJoiSchema.extract("days").optional(),
    rate: baseScheduleJoiSchema.extract("rate").optional(),
    includedThings: baseScheduleJoiSchema.extract("includedThings").optional(),
});

const baseDomesticStaffingSchema = Joi.object({
    type: Joi.string().trim().min(3).max(50),
    description: Joi.string().trim().min(20).max(1000),
    schedule: Joi.array().items(baseScheduleJoiSchema).min(1),
});

const domesticStaffingCreateSchema = baseDomesticStaffingSchema.keys({
    type: baseDomesticStaffingSchema.extract("type").required(),
    description: baseDomesticStaffingSchema.extract("description").required(),
    schedule: Joi.array().items(createScheduleJoiSchema).min(1).required(),
    _id: Joi.forbidden(),
    serviceId: Joi.forbidden(),
});

const domesticStaffingUpdateSchema = baseDomesticStaffingSchema
    .keys({
        type: baseDomesticStaffingSchema.extract("type").optional(),
        description: baseDomesticStaffingSchema
            .extract("description")
            .optional(),
        schedule: Joi.array().items(updateScheduleJoiSchema).optional(),
        _id: Joi.string().optional(),
        serviceId: Joi.string().optional(),
    })
    .unknown(true);

module.exports = {

    domesticStaffingCreateSchema,
    domesticStaffingUpdateSchema,
};
