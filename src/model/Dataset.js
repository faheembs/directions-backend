const mongoose = require("mongoose");

const DatasetSchema = new mongoose.Schema({
    label: {
        type: String,
        required: true,
    },
    queryType: {
        type: String,
        required: true,
    },
    image: {
        type: String,
    },
    description: {
        type: String,
        required: true,
    },
    detail: {
        type: String,
        required: true,
    },
    size: {
        type: Number,
        required: true,
    },
    visible: {
        type: Boolean,
        default: true,
    },
    isPremium: {
        type: Boolean,
        default: false,
    },
    data: {
        type: String,
    },
    config: {
        type: String,
    },
});

module.exports = mongoose.model("Dataset", DatasetSchema);
