const express = require('express');
const router = express.Router();
const { thirdPartyDatasetController } = require('../controller');


router.get('/tomtom', thirdPartyDatasetController.fetchAndUploadData);
router.get('/get-tomtom-data', thirdPartyDatasetController.getAllData);

module.exports = router;