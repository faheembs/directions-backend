const axios = require('axios');
const fs = require('fs');
const path = require('path');

// Assuming uploadToS3 is already imported from your utilities

const httpStatus = require('http-status');
const ApiError = require('../utils/ErrorHandler');
const uploadToS3 = require('../utils/uploadToS3');
const catchAsync = require('../utils/ApiHandler');
const { ThirdPartyDatasetModal } = require('../model');

// New Function to Fetch and Upload Data
const fetchAndUploadData = catchAsync(async (req, res, next) => {
    try {
        // Fetch data from the API
        const apiUrl = 'https://api.tomtom.com/traffic/services/4/flowSegmentData/relative0/10/json?point=52.41072%2C4.84239&unit=KMPH&openLr=false&key=KJViYlJxpo7JI81emABGNaBcerD2RwPS';  // Update with your actual API URL
        const { data } = await axios.get(apiUrl);
        const coordinates = data.flowSegmentData.coordinates.coordinate;

        const processedData = coordinates;

        // Save the processed data to a JSON file
        const jsonContent = JSON.stringify(processedData);
        const directory = path.join(__dirname, '..', '..', '..');
        // console.log(directory)

        if (!fs.existsSync(directory)) {
            fs.mkdirSync(directory, { recursive: true });
        }
        const filePath = path.join(directory, `temp_data_${Date.now()}.json`);

        fs.writeFileSync(filePath, jsonContent); // Using synchronous writeFile to ensure file is saved before proceeding

        // Upload the JSON file to S3
        const fileDetails = {
            filename: `temp_data_${Date.now()}.json`,
            mimetype: 'application/json',
            path: filePath,
        };
        const folderName = 'thirdPartyDatasets';
        const uploadedUrl = await uploadToS3(fileDetails, folderName);
        console.log("uploadedUrl", uploadedUrl);
        if (!uploadedUrl) {
            return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
                success: false,
                message: 'Failed to upload data to S3',
            });
        }
        const newDataset = await ThirdPartyDatasetModal.create({
            dataUrl: uploadedUrl,
        });
        // await newDataset.save();

        res.json({
            success: true,
            message: 'Data fetched, processed, and uploaded successfully.',
            newDataset
        });

    } catch (error) {
        console.error(error);
        return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
            success: false,
            message: 'Failed to process and upload data',
            error: error.message
        });
    }
});


const getAllData = async (req, res, next) => {
    try {

        const allData = await ThirdPartyDatasetModal.find();
        res.json({
            success: true,
            data: allData
        });
    } catch (error) {
        console.error(error);
        return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
            success: false,
            message: 'Failed to retrieve data from the database',
        });
    }
};

module.exports = {
    fetchAndUploadData,
    getAllData
};
