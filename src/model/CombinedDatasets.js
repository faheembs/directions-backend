const mongoose = require('mongoose');

const CombinedDatasetSchema = new mongoose.Schema({
    name: {
        type: String,
    },
    dataUrl: {
        type: String,
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

module.exports = mongoose.model("CombinedDataset", CombinedDatasetSchema);