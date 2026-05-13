const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

const JWT_SECRET = process.env.JWT_SECRET || "change_this_secret_in_env";
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || "7d";

/**
 * Generate a signed JWT for a user.
 * @param {Object} user - User document from DB
 * @returns {string} JWT token
 */
const generateToken = (user) => {
  return jwt.sign(
    { id: user._id || user.id, role: user.role },
    JWT_SECRET,
    { expiresIn: JWT_EXPIRES_IN }
  );
};

/**
 * Register a new user.
 * @param {Object} data - { name, email, password, phone, role }
 * @returns {Object} { user, token }
 */
const registerUser = async (data) => {
  const { name, email, password, phone, role = "tenant" } = data;

  // Validate required fields
  if (!name || !email || !password) {
    throw new Error("Name, email, and password are required.");
  }

  // Check for duplicate email
  const existing = await User.findOne({ email: email.toLowerCase() });
  if (existing) {
    throw new Error("An account with this email already exists.");
  }

  // Hash password
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  // Create user
  const user = await User.create({
    name,
    email: email.toLowerCase(),
    password: hashedPassword,
    phone,
    role,
  });

  const token = generateToken(user);

  return {
    token,
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      role: user.role,
    },
  };
};

/**
 * Authenticate a user and return a token.
 * @param {string} email
 * @param {string} password
 * @returns {Object} { user, token }
 */
const loginUser = async (email, password) => {
  if (!email || !password) {
    throw new Error("Email and password are required.");
  }

  const user = await User.findOne({ email: email.toLowerCase() }).select(
    "+password"
  );
  if (!user) {
    throw new Error("Invalid email or password.");
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    throw new Error("Invalid email or password.");
  }

  const token = generateToken(user);

  return {
    token,
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      role: user.role,
    },
  };
};

/**
 * Get a single user by ID (excluding password).
 * @param {string} userId
 * @returns {Object} user
 */
const getUserById = async (userId) => {
  const user = await User.findById(userId).select("-password");
  if (!user) {
    throw new Error("User not found.");
  }
  return user;
};

/**
 * Get all users (admin only).
 * @param {Object} filters - Optional query filters e.g. { role: "tenant" }
 * @returns {Array} users
 */
const getAllUsers = async (filters = {}) => {
  const users = await User.find(filters).select("-password");
  return users;
};

/**
 * Update a user's profile.
 * @param {string} userId
 * @param {Object} updates - Fields to update
 * @returns {Object} updated user
 */
const updateUser = async (userId, updates) => {
  // Prevent password from being updated through this service
  delete updates.password;
  delete updates.role; // Role changes should go through a dedicated admin service

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

/**
 * Delete a user by ID.
 * @param {string} userId
 */
const deleteUser = async (userId) => {
  const user = await User.findByIdAndDelete(userId);
  if (!user) {
    throw new Error("User not found.");
  }
};

/**
 * Change a user's password after verifying the old one.
 * @param {string} userId
 * @param {string} oldPassword
 * @param {string} newPassword
 */
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
  registerUser,
  loginUser,
  getUserById,
  getAllUsers,
  updateUser,
  deleteUser,
  changePassword,
};