const fs = require('fs')
const httpStatus = require("http-status");
const ApiError = require("../utils/ErrorHandler");
const catchAsync = require("../utils/ApiHandler");
const { datasetService } = require("../service");
const { DatasetModal } = require("../model");
const uploadToS3 = require("../utils/uploadToS3");






// CREATE DATASET
const createDataset = catchAsync(async (req, res, next) => {
    const userId = req.params.userId;
    const {
        label,
        queryType,
        description,
        detail,
        size,
        visible,
        isPremium,
    } = req.body;

    console.log("ok")
    // console.log("files", req.files['image'][0])
    const imageFile = req.files['image'] ? req.files['image'][0] : null;
    const dataFile = req.files['data'] ? req.files['data'][0] : null;
    const configFile = req.files['config'] ? req.files['config'][0] : null;

    console.log("ok 2")
    // 

    // console.log("IMAGE URL ------", imageUrl)

    // console.log("config", configUrl)

    const existingDataset = await datasetService.findDatasetByLabel(label);
    // if (!imageUrl || !dataUrl || !configUrl) {
    //     throw new ApiError(httpStatus.BAD_REQUEST, "Missing file(s) in request");
    // }
    if (existingDataset) {

        // fs.unlink(imageFile.path);
        try {
            fs.unlinkSync('src/uploads/' + imageFile.filename);
            console.log('Image file deleted successfully');

            fs.unlinkSync('src/uploads/' + dataFile.filename);
            console.log('Data file deleted successfully');

            if (configFile !== null) {
                fs.unlinkSync('src/uploads/' + configFile.filename);
                console.log('Config file deleted successfully');
            }
        } catch (error) {
            console.error('Error deleting files:', error);
        }
        console.log("ok 3")
        // console.log("asdfsd", httpStatus.CONFLICT);

        throw new ApiError(httpStatus.CONFLICT, "Dataset with this label already exists", true);

    }

    // Upload files to S3 and get URLs
    const imageUrl = imageFile !== null ? await uploadToS3(imageFile, 'images') : 'https://directions-assets.s3.eu-north-1.amazonaws.com/images/image-1709229176975-60907121.png';
    const dataUrl = await uploadToS3(dataFile, 'files');
    const configUrl = configFile !== null ? await uploadToS3(configFile, 'files') : null;

    // try {
    //     fs.unlinkSync('src/uploads/' + imageFile.filename);
    //     console.log('Image file deleted successfully');

    //     fs.unlinkSync('src/uploads/' + dataFile.filename);
    //     console.log('Data file deleted successfully');

    //     if (configFile !== null) {
    //         fs.unlinkSync('src/uploads/' + configFile.filename);
    //         console.log('Config file deleted successfully');
    //     }
    // } catch (error) {
    //     console.error('Error deleting files:', error);
    // }
    // Create the dataset
    const dataset = await datasetService.createDatasetInternal({
        label,
        queryType,
        image: imageUrl,
        description,
        detail,
        size,
        visible,
        isPremium,
        dataUrl,
        configUrl,
        addedBy: userId,
    });

    res.json({
        data: {
            ...dataset.toObject(),
            imageUrl,
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
    deleteDataset,
};
