const express = require("express");
const router = express.Router();

const bookingController = require("../controllers/bookingController");
const { protect } = require("../middlewares/authMiddleware");
const { authorize } = require("../middlewares/roleMiddleware");

// GET /api/bookings — Admin: view all bookings
router.get("/", protect, authorize("admin"), bookingController.getAllBookings);

// GET /api/bookings/my — Tenant: view own bookings
// Must be defined BEFORE /:id to avoid "my" being treated as a Mongo ID
router.get("/my", protect, authorize("tenant"), bookingController.getMyBookings);

// GET /api/bookings/:id — Tenant (own) or Admin
router.get(
  "/:id",
  protect,
  authorize("tenant", "admin"),
  bookingController.getBookingById
);

// POST /api/bookings — Tenant: create a booking
router.post(
  "/",
  protect,
  authorize("tenant"),
  bookingController.createBooking
);

// PUT /api/bookings/:id/confirm — Landlord or Admin
router.put(
  "/:id/confirm",
  protect,
  authorize("landlord", "admin"),
  bookingController.confirmBooking
);

// PUT /api/bookings/:id/cancel — Tenant (own) or Admin
router.put(
  "/:id/cancel",
  protect,
  authorize("tenant", "admin"),
  bookingController.cancelBooking
);

module.exports = router;