const { userService } = require("../service");
const httpStatus = require("http-status");
const ApiError = require("../utils/ErrorHandler");
const catchAsync = require("../utils/ApiHandler");
const createToken = require("../utils/createToken");
const { DatasetModal, UserModel } = require("../model");
const { userLoggedIn } = require("../utils/socketManager");
const bcrypt = require('bcryptjs')


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
  console.log(user._id)
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, "User not found");
  }
  // Verify password
  const isPasswordMatch = await bcrypt.compare(password, user.password);
  console.log(isPasswordMatch)
  if (!isPasswordMatch) {
    throw new ApiError(httpStatus.UNAUTHORIZED, "Incorrect password", true);
  }
  // Find userDatasets
  const userDatasets = await DatasetModal.find({ addedBy: user._id });

  // Combine premiumDatasets and userDatasets into allDatasetsOfUser
  const allDatasetsOfUser = [...user.premiumDatasets, ...userDatasets];

  // console.log(allDatasetsOfUser)

  // Remove duplicates
  const uniqueDatasets = allDatasetsOfUser.filter((dataset, index, self) =>
    index === self.findIndex((d) => (
      d._id.toString() === (dataset._id && dataset._id.toString())
    ))
  );

  // Assign allDatasetsOfUser to user
  user.allDatasetsOfUser = uniqueDatasets;
  userLoggedIn(user._id)
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

const getUserDatasets = catchAsync(async (req, res) => {
  const { userId } = req.params;

  const user = await userService.findUserById(userId);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, "User not found");
  }
  // Populate premiumDatasets 
  const populatedUser = await UserModel.populate(user, { path: 'premiumDatasets' });

  // Find userDatasets
  const userDatasets = await DatasetModal.find({ addedBy: userId });

  // Combine premiumDatasets and userDatasets into allDatasetsOfUser
  const allDatasetsOfUser = [...populatedUser.premiumDatasets, ...userDatasets];


  const uniqueDatasets = allDatasetsOfUser.filter((dataset, index, self) =>
    index === self.findIndex((d) => (
      d._id.toString() === (dataset._id && dataset._id.toString())
    ))
  );

  res.json({
    success: true,
    data: uniqueDatasets,
  });
});

module.exports = {
  loginUser,
  createUser,
  getAllUsers,
  editUser,
  addPremiumDatasets,
  getUserDatasets
};
