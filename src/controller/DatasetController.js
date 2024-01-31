const httpStatus = require("http-status");
const ApiError = require("../utils/ErrorHandler");
const catchAsync = require("../utils/ApiHandler");
const { datasetService } = require("../service");
const { DatasetModal } = require("../model");

// CREATE DATASET
const createDataset = catchAsync(async (req, res, next) => {
    const {
        label,
        queryType,
        description,
        detail,
        size,
        visible,
        isPremium,
    } = req.body;
    const image = req.files['image'][0].path;
    const dataUrl = req.files['data'][0].path;
    const configUrl = req.files['config'][0].path;

    const existingDataset = await datasetService.findDatasetByLabel(label);

    if (existingDataset) {
        throw new ApiError(httpStatus.CONFLICT, "Dataset with this label already exists");
    }

    // Create the dataset
    const dataset = await datasetService.createDataset({
        label,
        queryType,
        image,
        description,
        detail,
        size,
        visible,
        isPremium,
        dataUrl,
        configUrl,
    });

    res.json({
        data: {
            ...dataset.toObject(),
            image,
            dataUrl,
            configUrl,
        },
        success: true,
        message: "Dataset has been created.",
    });
});


// GET ALL DATASETS
const getAllDatasets = catchAsync(async (req, res) => {
    const datasets = await datasetService.getAllDatasets();

    res.json({
        success: true,
        data: datasets,
    });
});

const updateIsPremium = catchAsync(async (req, res) => {
    const { datasetId } = req.params;
    const { isPremium } = req.body;

    const existingDataset = await datasetService.findDatasetById(datasetId);

    if (!existingDataset) {
        throw new ApiError(httpStatus.NOT_FOUND, "Dataset not found");
    }

    existingDataset.isPremium = isPremium;
    await existingDataset.save();

    res.json({
        success: true,
        message: "Data type has been updated successfully.",
    });
});

const deleteDataset = catchAsync(async (req, res) => {
    const { datasetId } = req.params;

    try {
        const existingDataset = await datasetService.findDatasetById(datasetId);

        if (!existingDataset) {
            throw new ApiError(httpStatus.NOT_FOUND, "Dataset not found");
        }

        if (!(existingDataset instanceof DatasetModal)) {
            throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, "Invalid dataset instance");
        }

        // Delete the dataset
        await existingDataset.deleteOne();

        res.json({
            success: true,
            message: "Dataset deleted successfully.",
        });
    } catch (error) {
        res.status(error.statusCode).json({
            success: false,
            message: error.message,

        });
    }
});

module.exports = {
    createDataset,
    getAllDatasets,
    updateIsPremium,
    deleteDataset
};
