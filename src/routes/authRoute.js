const { userController } = require("../controller");
const { validatorMiddleware } = require("../middleware");
const { authValidator } = require("../validator");

const router = require("express").Router();

router
  .route("/login")
  .post(validatorMiddleware(authValidator.login), userController.loginUser);

router
  .route("/register")
  .post(validatorMiddleware(authValidator.register), userController.createUser);
module.exports = router;
