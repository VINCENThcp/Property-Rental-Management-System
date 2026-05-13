const express = require("express");
const { body } = require("express-validator");
const router = express.Router();

const bookingController = require("../controllers/bookingController");
const { protect } = require("../middlewares/authMiddleware");
const { restrictTo } = require("../middlewares/roleMiddleware");

// ----- Validation Rules -----

const createBookingValidation = [
  body("propertyId")
    .notEmpty()
    .withMessage("Property ID is required")
    .isMongoId()
    .withMessage("Invalid property ID"),

  body("startDate")
    .notEmpty()
    .withMessage("Start date is required")
    .isISO8601()
    .withMessage("Start date must be a valid date (YYYY-MM-DD)")
    .custom((value) => {
      if (new Date(value) < new Date()) {
        throw new Error("Start date cannot be in the past");
      }
      return true;
    }),

  body("endDate")
    .notEmpty()
    .withMessage("End date is required")
    .isISO8601()
    .withMessage("End date must be a valid date (YYYY-MM-DD)")
    .custom((value, { req }) => {
      if (new Date(value) <= new Date(req.body.startDate)) {
        throw new Error("End date must be after start date");
      }
      return true;
    }),

  body("notes")
    .optional()
    .isString()
    .withMessage("Notes must be a string")
    .isLength({ max: 500 })
    .withMessage("Notes cannot exceed 500 characters"),
];

// ----- Routes -----

// GET /api/bookings — Admin: view all bookings
router.get("/", protect, restrictTo("admin"), bookingController.getAllBookings);

// GET /api/bookings/my — Tenant: view own bookings
// Must be defined BEFORE /:id to avoid "my" being treated as a Mongo ID
router.get("/my", protect, restrictTo("tenant"), bookingController.getMyBookings);

// GET /api/bookings/:id — Tenant (own) or Admin
router.get(
  "/:id",
  protect,
  restrictTo("tenant", "admin"),
  bookingController.getBookingById
);

// POST /api/bookings — Tenant: create a booking
router.post(
  "/",
  protect,
  restrictTo("tenant"),
  createBookingValidation,
  bookingController.createBooking
);

// PUT /api/bookings/:id/confirm — Landlord or Admin
router.put(
  "/:id/confirm",
  protect,
  restrictTo("landlord", "admin"),
  bookingController.confirmBooking
);

// PUT /api/bookings/:id/cancel — Tenant (own) or Admin
router.put(
  "/:id/cancel",
  protect,
  restrictTo("tenant", "admin"),
  bookingController.cancelBooking
);

module.exports = router;