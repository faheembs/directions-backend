const { DatasetModal } = require("../model");

const findDatasetByLabel = async (label) => {
    try {
        const dataset = await DatasetModal.findOne({ label });
        return dataset;
    } catch (error) {
        console.error("Error in findDatasetByLabel:", error);
        throw error;
    }
};
const findDatasetById = async (datasetId) => {
    try {
        const dataset = await DatasetModal.findById(datasetId);
        return dataset;
    } catch (error) {
        console.error("Error in findDatasetById:", error);
        throw error;
    }
};

const createDataset = async (datasetData) => {
    try {
        const dataset = await DatasetModal.create(datasetData);
        return dataset;
    } catch (error) {
        console.error("Error in createDataset:", error);
        throw error;
    }
};

const getAllDatasets = async () => {
    try {
        const datasets = await DatasetModal.find();
        return datasets;
    } catch (error) {
        console.error("Error in getAllDatasets:", error);
        throw error;
    }
};

const deleteDatasetById = async (datasetId) => {
    try {
        const result = await DatasetModal.deleteOne({ _id: datasetId });
        return result;
    } catch (error) {
        console.error("Error in deleteDatasetById:", error);
        throw error;
    }
};

module.exports = {
    findDatasetByLabel,
    createDataset,
    getAllDatasets,
    findDatasetById,
    deleteDatasetById
};