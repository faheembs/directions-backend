const express = require("express");
const { userController } = require("../controller");
const ensureAuthenticated = require("../middleware/ensureAuthenticated");

const router = express.Router();

router.get("/all-users", ensureAuthenticated, userController.getAllUsers);
router.put("/:userId", ensureAuthenticated, userController.editUser);
router.put("/:userId/add-premium-datasets", ensureAuthenticated, userController.addPremiumDatasets);
router.get("/:userId/datasets", userController.getUserDatasets);
router.put('/:userId/allow-export-data', userController.updateUserAllowExportData);
router.put('/:userId/allow-combine-datasets', userController.updateUserAllowCombineDatasets);

module.exports = router;