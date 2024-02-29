const express = require("express");
const { userController } = require("../controller");
const ensureAuthenticated = require("../middleware/ensureAuthenticated");

const router = express.Router();

router.get("/all-users", ensureAuthenticated, userController.getAllUsers);
router.put("/:userId", ensureAuthenticated, userController.editUser);
router.put("/:userId/add-premium-datasets", ensureAuthenticated, userController.addPremiumDatasets);
router.get("/:userId/datasets", userController.getUserDatasets);

module.exports = router;