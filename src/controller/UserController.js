const { userService } = require("../service");
const httpStatus = require("http-status");
const ApiError = require("../utils/ErrorHandler");
const catchAsync = require("../utils/ApiHandler");
const createToken = require("../utils/createToken");
const { DatasetModal } = require("../model");
const { userLoggedIn } = require("../utils/socketManager");


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

  if (isExist) {
    throw new ApiError(httpStatus.CONFLICT, "User already exists");
  }

  // Add role admin for new user
  const role = req.body.role || 'user';
  const user = await userService.registerUser({
    firstName,
    lastName,
    email,
    password,
    role,
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

  // if (!(await user.matchPassword(password))) {
  //   throw new ApiError(httpStatus.UNAUTHORIZED, "Incorrect password.");
  // }

  // userLoggedIn(user._id);

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

const addPremiumDatasets = catchAsync(async (req, res) => {
  const { userId } = req.params;
  const { datasetIds } = req.body;
  console.log(datasetIds)

  const populatedDatasets = await DatasetModal.find({ _id: { $in: datasetIds } });

  const updatedUser = await userService.addingPremiumDatasets(userId, populatedDatasets);

  if (!updatedUser) {
    throw new ApiError(httpStatus.NOT_FOUND, "User not found");
  }

  res.json({
    success: true,
    data: updatedUser,
    message: "Premium datasets have been added to the user.",
  });
});


module.exports = {
  loginUser,
  createUser,
  getAllUsers,
  editUser,
  addPremiumDatasets
};
