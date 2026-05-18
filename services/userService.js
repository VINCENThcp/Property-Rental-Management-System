const bcrypt = require("bcrypt");
const User = require("../models/User");

const getUserById = async (userId) => {
  const user = await User.findById(userId).select("-password");
  if (!user) {
    throw new Error("User not found.");
  }
  return user;
};

const getAllUsers = async (filters = {}) => {
  const users = await User.find(filters).select("-password");
  return users;
};

const updateUser = async (userId, updates) => {
  delete updates.password;

  const user = await User.findByIdAndUpdate(
    userId,
    { $set: updates },
    { new: true, runValidators: true }
  ).select("-password");

  if (!user) {
    throw new Error("User not found.");
  }

  return user;
};

const deleteUser = async (userId) => {
  const user = await User.findByIdAndDelete(userId);
  if (!user) {
    throw new Error("User not found.");
  }
};

const changePassword = async (userId, oldPassword, newPassword) => {
  const user = await User.findById(userId).select("+password");
  if (!user) {
    throw new Error("User not found.");
  }

  const isMatch = await bcrypt.compare(oldPassword, user.password);
  if (!isMatch) {
    throw new Error("Current password is incorrect.");
  }

  const salt = await bcrypt.genSalt(10);
  user.password = await bcrypt.hash(newPassword, salt);
  await user.save();
};

module.exports = {
  getUserById,
  getAllUsers,
  updateUser,
  changePassword,
};