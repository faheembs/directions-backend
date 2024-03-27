const express = require('express');
const router = express.Router();
const { combinedDatasetController } = require('../controller');

// GET all combined datasets
router.get('/get-all', combinedDatasetController.getAllCombinedDatasets);

router
    .route("/:userId/createCombined")
    .post(combinedDatasetController.createCombinedDataset);

module.exports = router;