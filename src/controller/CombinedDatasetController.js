const httpStatus = require('http-status');
const { CombinedDatasetModal, DatasetModal } = require('../model');
const catchAsync = require('../utils/ApiHandler');
const ApiError = require('../utils/ErrorHandler');
const { combinedDatasetService } = require('../service');

const getAllCombinedDatasets = catchAsync(async (req, res) => {
    try {

        const combinedDatasets = await CombinedDatasetModal.find();

        if (combinedDatasets.length === 0) {
            throw new ApiError(httpStatus.NOT_FOUND, "No combined datasets found");
        }

        res.json({
            success: true,
            data: combinedDatasets,
        });


    } catch (error) {
        console.error('Error fetching combined datasets:', error);
        res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
            success: false,
            message: 'Failed to fetch combined datasets',
        });
    }
});

const createCombinedDataset = catchAsync(async (req, res) => {
    const { dataset1, dataset2, name } = req.body;
    const userId = req.params.userId;
    console.log(userId)
    console.log(dataset1, dataset2, name)


    const datasetIds = [dataset1, dataset2];
    const existingDatasets = await combinedDatasetService.findDatasetsByIds(datasetIds);
    console.log('ok..')

    if (!existingDatasets || existingDatasets.length !== 2) {
        throw new ApiError(httpStatus.NOT_FOUND, "Datasets not found or count is not equal to 2");
    }

    const dataUrls = existingDatasets.map(dataset => dataset.dataUrl);
    console.log('ok')
    const combinedFileUrl = await combinedDatasetService.combineAndUploadFiles(dataUrls[0], dataUrls[1]);
    console.log('ok1')


    const combinedDataset = await DatasetModal.create({
        dataUrl: combinedFileUrl,
        label: name,
        combinedDataset: true,
        addedBy: userId
    });
    console.log('ok2')

    res.status(httpStatus.CREATED).json({
        success: true,
        data: combinedDataset,
        message: 'Combined dataset created and saved successfully',
    });
});


module.exports = {
    getAllCombinedDatasets,
    createCombinedDataset
}