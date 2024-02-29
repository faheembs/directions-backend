const Joi = require("joi");
const validate = require("./validator");
const httpStatus = require("http-status");

const createDatasetSchema = {
    body: Joi.object({
        label: Joi.string().required(),
        queryType: Joi.string().required(),
        // imageUrl: Joi.string().required(),
        description: Joi.string().allow(""),
        detail: Joi.string().required(),
        size: Joi.number().required(),
        visible: Joi.boolean(),
        isPremium: Joi.boolean(),
        // dataUrl: Joi.string().required(),
        config: Joi.string().allow(''),
    }),
};

const updateIsPremiumSchema = {
    params: Joi.object({
        datasetId: Joi.string().required(),
    }),
    body: Joi.object({
        isPremium: Joi.boolean().required(),
    }),
};

const deleteDatasetSchema = {
    params: Joi.object({
        datasetId: Joi.string().required(),
    }),
};

const datasetValidator = {
    create: validate(createDatasetSchema),
    updateIsPremium: validate(updateIsPremiumSchema),
    deleteDataset: validate(deleteDatasetSchema)
};

module.exports = datasetValidator;
