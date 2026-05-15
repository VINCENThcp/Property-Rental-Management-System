const express = require("express");
const router = express.Router();
const {
  getMe,
  getAllUsers,
  getUserById,
  updateMe,
  updateUser,
  deleteUser,
  changePassword,
} = require("../controllers/userController");
const { protect } = require("../middlewares/authMiddleware");
const { authorize } = require("../middlewares/roleMiddleware");


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
router.get("/", protect, authorize('admin'), getAllUsers);

/**
 * @route   GET /api/users/:id
 * @desc    Get a single user by their ID
 * @access  Private/Admin
 */
router.get("/:id", protect, authorize('admin'), getUserById);

/**
 * @route   PUT /api/users/:id
 * @desc    Admin update any user's details
 * @access  Private/Admin
 */
router.put("/:id", protect, authorize('admin'), updateUser);

/**
 * @route   DELETE /api/users/:id
 * @desc    Delete a user account
 * @access  Private/Admin
 */
router.delete("/:id", protect, authorize('admin'), deleteUser);

module.exports = router;