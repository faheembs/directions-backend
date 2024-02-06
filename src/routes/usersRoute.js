const express = require("express");
const { userController } = require("../controller");
const ensureAuthenticated = require("../middleware/ensureAuthenticated");

const router = express.Router();

router.get("/all-users", ensureAuthenticated, userController.getAllUsers);
router.put("/:userId", ensureAuthenticated, userController.editUser);

module.exports = router;