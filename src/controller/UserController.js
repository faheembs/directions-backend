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
    firstName,
    lastName,
    email,
    password,
  } = req.body;

  const isExist = await userService.findUserByEmail(email);

  if (isExist) new ApiError(httpStatus.CONFLICT, "User already exist");

  const user = await userService.registerUser({
    firstName,
    lastName,
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

const getAllUsers = catchAsync(async (req, res) => {

  if (!req.user) {
    return next(new ApiError(httpStatus.UNAUTHORIZED, "Authentication failed."));
  }
  const users = await userService.getAllUsers();

  res.json({
    success: true,
    data: users,
  });
});


const editUser = catchAsync(async (req, res) => {
  const { userId } = req.params;
  const { firstName, lastName, email } = req.body;
  console.log("web ok", firstName, lastName, email)
  const updatedUser = await userService.updateUser(userId, {
    firstName,
    lastName,
    email
  });

  console.log(updatedUser)

  if (!updatedUser) {
    throw new ApiError(httpStatus.NOT_FOUND, "User not found");
  }

  res.json({
    success: true,
    data: updatedUser,
    message: "User has been updated.",
  });
});

module.exports = {
  loginUser,
  createUser,
  getAllUsers,
  editUser
};
