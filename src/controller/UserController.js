const { userService } = require("../service");
const httpStatus = require("http-status");
const ApiError = require("../utils/ErrorHandler");
const catchAsync = require("../utils/ApiHandler");
const createToken = require("../utils/createToken");
const { google } = require("googleapis");
// Create a new instance of the Google Identity Toolkit API client
const identityToolkit = google.identitytoolkit("v3");

// const { userModel: User } = require("../model");
// const helper = require("../helper/EmailValidator");

const createUser = catchAsync(async (req, res, next) => {
  const {
    email,
    password,
  } = req.body;

  const isExist = await userService.findUserByEmail(email);

  if (isExist) new ApiError(httpStatus.CONFLICT, "User already exist");

  const user = await userService.registerUser({
    email,
    password,
  });

  res.json({
    data: user,
    token: createToken(user._id),
    success: true,
    message: "User has been created.",
  });
});

// LOGIN USER
const loginUser = catchAsync(async (req, res) => {
  const { email, password } = req.body;
  const user = await userService.findUserByEmail(email);

  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, "User not found");
  }

  if (!(await user.matchPassword(password))) {
    throw new ApiError(httpStatus.UNAUTHORIZED, "Incorrect password.");
  }

  return res.json({
    success: true,
    data: user,
    token: createToken(user._id),
  });
});



module.exports = {
  loginUser,
  createUser,
};
