// datasetRoute.js
const express = require("express");
const { datasetController } = require("../controller");
const { datasetValidator } = require("../middleware");
const upload = require("../utils/multerConfig");

const router = express.Router();

router
    .route("/create")
    .post(upload.fields([
        { name: 'image', maxCount: 1 },
        { name: 'data', maxCount: 1 },
        { name: 'config', maxCount: 1 },
    ]), datasetValidator.create, datasetController.createDataset);


router
    .route("/getAll")
    .get(datasetController.getAllDatasets);

router
    .route("/:datasetId/editDataset")
    .patch(datasetValidator.updateIsPremium, datasetController.updateIsPremium);
router
    .route("/:datasetId/delete")
    .delete(datasetValidator.deleteDataset, datasetController.deleteDataset);

module.exports = router;
