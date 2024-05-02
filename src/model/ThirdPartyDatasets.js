const mongoose = require("mongoose");

const ThirdPartyDatasetSchema = new mongoose.Schema({

    dataUrl: {
        type: String,
        required: true,
    },
},
    {
        timestamps: true,
        toJSON: { virtuals: true },
        toObject: { virtuals: true },
    }
);

module.exports = mongoose.model("ThirdPartyDataset", ThirdPartyDatasetSchema);
