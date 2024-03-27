const mongoose = require("mongoose");

const DatasetSchema = new mongoose.Schema({
    label: {
        type: String,
        required: true,
    },
    queryType: {
        type: String,
        required: false,
        default: 'sample'
    },
    image: {
        type: String,
        required: false,
        default: null
    },
    description: {
        type: String,
        required: false,
        default: null

    },
    detail: {
        type: String,
        required: false,
        default: null
    },
    size: {
        type: Number,
        required: false,
        default: null
    },
    visible: {
        type: Boolean,
        default: true,
    },
    isPremium: {
        type: Boolean,
        default: false,
    },
    dataUrl: {
        type: String,
        required: true,
    },
    configUrl: {
        type: String,
        default: null,
        required: false,
    },
    addedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    combinedDataset: {
        type: Boolean,
        default: false
    },
},
    {
        timestamps: true,
        toJSON: { virtuals: true },
        toObject: { virtuals: true },
    }
);

module.exports = mongoose.model("Dataset", DatasetSchema);
