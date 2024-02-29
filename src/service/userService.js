const { UserModel } = require("../model");

const registerUser = async (payload) => {
  return await UserModel.create(payload);
};

const findUserByEmail = async (email) => {
  return await UserModel.findOne({ email });
};




const updateUser = async (_id, payload) => {
  return await UserModel.findByIdAndUpdate(_id, payload, {
    new: true,
  });
};
const deletingUser = async (_id) => {
  return await UserModel.findByIdAndDelete(_id);
};

const findOneUser = async (payload) => {
  try {
    const user = await UserModel.findOne(payload);
    return user;
  } catch (error) {
    console.error("Error:", error);
  }
};

const getAllUsers = async () => {
  const users = await UserModel.find().populate('premiumDatasets');
  return users;
};

const addingPremiumDatasets = async (userId, datasets) => {
  const user = await UserModel.findById(userId);
  const newDatasets = datasets.filter(dataset => {
    return !user.premiumDatasets.some(existingDataset =>
      existingDataset.equals(dataset._id)
    );
  });


  user.premiumDatasets.push(...newDatasets);

  await user.save();

  return await UserModel.findById(userId).populate('premiumDatasets');
};

const findUserById = async (_id) => {
  return await UserModel.findById(_id).populate('userDatasets');
};

module.exports = {
  registerUser,
  findUserByEmail,
  findUserById,
  updateUser,
  deletingUser,
  findOneUser,
  getAllUsers,
  addingPremiumDatasets,
};
