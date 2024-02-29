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
        required: false,
        default: null

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
    }
});

module.exports = mongoose.model("Dataset", DatasetSchema);
