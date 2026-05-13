const userService = require("../services/userService");

/**
 * @desc    Register a new user
 * @route   POST /api/users/register
 * @access  Public
 */
const register = async (req, res) => {
  try {
    const result = await userService.registerUser(req.body);
    return res.status(201).json({
      success: true,
      message: "Account created successfully.",
      data: result,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

/**
 * @desc    Login a user
 * @route   POST /api/users/login
 * @access  Public
 */
const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const result = await userService.loginUser(email, password);
    return res.status(200).json({
      success: true,
      message: "Login successful.",
      data: result,
    });
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: error.message,
    });
  }
};

/**
 * @desc    Get currently logged-in user's profile
 * @route   GET /api/users/me
 * @access  Private (requires auth middleware)
 */
const getMe = async (req, res) => {
  try {
    // req.user.id is set by the auth middleware after verifying JWT
    const user = await userService.getUserById(req.user.id);
    return res.status(200).json({
      success: true,
      data: user,
    });
  } catch (error) {
    return res.status(404).json({
      success: false,
      message: error.message,
    });
  }
};

/**
 * @desc    Get all users
 * @route   GET /api/users
 * @access  Private/Admin
 */
const getAllUsers = async (req, res) => {
  try {
    // Optionally filter by role via query param e.g. ?role=tenant
    const filters = {};
    if (req.query.role) filters.role = req.query.role;

    const users = await userService.getAllUsers(filters);
    return res.status(200).json({
      success: true,
      count: users.length,
      data: users,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/**
 * @desc    Get a single user by ID
 * @route   GET /api/users/:id
 * @access  Private/Admin
 */
const getUserById = async (req, res) => {
  try {
    const user = await userService.getUserById(req.params.id);
    return res.status(200).json({
      success: true,
      data: user,
    });
  } catch (error) {
    return res.status(404).json({
      success: false,
      message: error.message,
    });
  }
};

/**
 * @desc    Update currently logged-in user's profile
 * @route   PUT /api/users/me
 * @access  Private
 */
const updateMe = async (req, res) => {
  try {
    const user = await userService.updateUser(req.user.id, req.body);
    return res.status(200).json({
      success: true,
      message: "Profile updated successfully.",
      data: user,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

/**
 * @desc    Admin update any user by ID
 * @route   PUT /api/users/:id
 * @access  Private/Admin
 */
const updateUser = async (req, res) => {
  try {
    const user = await userService.updateUser(req.params.id, req.body);
    return res.status(200).json({
      success: true,
      message: "User updated successfully.",
      data: user,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

/**
 * @desc    Delete a user by ID
 * @route   DELETE /api/users/:id
 * @access  Private/Admin
 */
const deleteUser = async (req, res) => {
  try {
    await userService.deleteUser(req.params.id);
    return res.status(200).json({
      success: true,
      message: "User deleted successfully.",
    });
  } catch (error) {
    return res.status(404).json({
      success: false,
      message: error.message,
    });
  }
};

/**
 * @desc    Change logged-in user's password
 * @route   PUT /api/users/me/change-password
 * @access  Private
 */
const changePassword = async (req, res) => {
  try {
    const { oldPassword, newPassword } = req.body;
    await userService.changePassword(req.user.id, oldPassword, newPassword);
    return res.status(200).json({
      success: true,
      message: "Password changed successfully.",
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  register,
  login,
  getMe,
  getAllUsers,
  getUserById,
  updateMe,
  updateUser,
  deleteUser,
  changePassword,
};
