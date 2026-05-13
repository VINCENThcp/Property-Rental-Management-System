const express = require("express");
const router = express.Router();
const {
  register,
  login,
  getMe,
  getAllUsers,
  getUserById,
  updateMe,
  updateUser,
  deleteUser,
  changePassword,
} = require("../controllers/userController");

// NOTE: Your team should implement these two middleware functions:
//   protect  — verifies the JWT and attaches req.user
//   adminOnly — checks that req.user.role === "admin"
const { protect, adminOnly } = require("../middlewares/authMiddleware");

// ─────────────────────────────────────────────
//  Public Routes
// ─────────────────────────────────────────────

/**
 * @route   POST /api/users/register
 * @desc    Register a new user account
 * @access  Public
 */
router.post("/register", register);

/**
 * @route   POST /api/users/login
 * @desc    Authenticate user and receive a JWT token
 * @access  Public
 */
router.post("/login", login);

// ─────────────────────────────────────────────
//  Private Routes (logged-in users)
// ─────────────────────────────────────────────

/**
 * @route   GET    /api/users/me
 * @desc    Get the currently logged-in user's profile
 * @access  Private
 */
router.get("/me", protect, getMe);

/**
 * @route   PUT /api/users/me
 * @desc    Update the currently logged-in user's profile
 * @access  Private
 */
router.put("/me", protect, updateMe);

/**
 * @route   PUT /api/users/me/change-password
 * @desc    Change the currently logged-in user's password
 * @access  Private
 */
router.put("/me/change-password", protect, changePassword);

// ─────────────────────────────────────────────
//  Admin Routes
// ─────────────────────────────────────────────

/**
 * @route   GET /api/users
 * @desc    Get all users (supports ?role=tenant | landlord | admin filter)
 * @access  Private/Admin
 */
router.get("/", protect, adminOnly, getAllUsers);

/**
 * @route   GET /api/users/:id
 * @desc    Get a single user by their ID
 * @access  Private/Admin
 */
router.get("/:id", protect, adminOnly, getUserById);

/**
 * @route   PUT /api/users/:id
 * @desc    Admin update any user's details
 * @access  Private/Admin
 */
router.put("/:id", protect, adminOnly, updateUser);

/**
 * @route   DELETE /api/users/:id
 * @desc    Delete a user account
 * @access  Private/Admin
 */
router.delete("/:id", protect, adminOnly, deleteUser);

module.exports = router;