const { v4: uuidv4 } = require('uuid');
const AWS = require('aws-sdk');
const fetch = require('node-fetch');
const csvToJson = require('csvtojson');
const { DatasetModal } = require('../model');


const configs = {
    region: "eu-north-1",
    bucketName: "directions-assets",
    accessKey: "AKIA47CRXZAUHODNAZEV",
    secretKey: "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",
    signatureVersion: "v4",
};

const s3 = new AWS.S3({
    region: configs.region,
    accessKeyId: configs.accessKey,
    secretAccessKey: configs.secretKey,
    signatureVersion: configs.signatureVersion,
});

const combineAndUploadFiles = async (url1, url2) => {
    try {
        // Fetch and parse data from file 1
        const response1 = await fetch(url1);
        const csvData1 = await response1.text();
        const parsedData1 = await csvToJson().fromString(csvData1);

        // Fetch and parse data from file 2
        const response2 = await fetch(url2);
        const csvData2 = await response2.text();
        const parsedData2 = await csvToJson().fromString(csvData2);

        // Combine data into a JSON object
        const combinedData = {
            data1: parsedData1,
            data2: parsedData2
        };

        // Upload the combined JSON object to S3
        const uniqueFilename = `combined_${uuidv4()}.json`;
        const uploadParams = {
            Bucket: configs.bucketName,
            Key: `combined/${uniqueFilename}`,
            Body: JSON.stringify(combinedData),
            ContentType: 'application/json'
        };
        const uploadResult = await s3.upload(uploadParams).promise();

        // Get the URL of the uploaded combined file
        const combinedFileUrl = uploadResult.Location;

        return combinedFileUrl;
    } catch (error) {
        console.error('Error combining and uploading files:', error);
        throw new Error('Failed to combine and upload files');
    }
};

const findDatasetsByIds = async (datasetIds) => {
    try {
        // Map each dataset ID to a Mongoose query to find the dataset
        const datasetPromises = datasetIds.map(async (datasetId) => {
            return await DatasetModal.findById(datasetId);
        });

        // Await all the queries to fetch datasets
        const datasets = await Promise.all(datasetPromises);

        return datasets;
    } catch (error) {
        console.error("Error in findDatasetsByIds:", error);
        throw error;
    }
};

module.exports = {
    combineAndUploadFiles,
    findDatasetsByIds
};