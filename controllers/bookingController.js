const bookingService = require("../services/bookingService");

/**
 * POST /api/bookings
 * Tenant: Create a new booking
 */
const createBooking = async (req, res, next) => {
  try {
    const { propertyId, startDate, endDate, notes } = req.body;
    const tenantId = req.user.id;

    const booking = await bookingService.createBooking({
      propertyId,
      tenantId,
      startDate,
      endDate,
      notes,
    });

    return res.status(201).json({
      success: true,
      message: "Booking created successfully",
      data: booking,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/bookings/my
 * Tenant: Get all bookings for the logged-in tenant
 */
const getMyBookings = async (req, res, next) => {
  try {
    const bookings = await bookingService.getMyBookings(req.user.id);

    return res.status(200).json({
      success: true,
      count: bookings.length,
      data: bookings,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/bookings/:id
 * Tenant (own) or Admin: Get a single booking by ID
 */
const getBookingById = async (req, res, next) => {
  try {
    const booking = await bookingService.getBookingById(
      req.params.id,
      req.user.id,
      req.user.role
    );

    return res.status(200).json({
      success: true,
      data: booking,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * PUT /api/bookings/:id/confirm
 * Landlord or Admin: Confirm a pending booking
 */
const confirmBooking = async (req, res, next) => {
  try {
    const booking = await bookingService.confirmBooking(
      req.params.id,
      req.user.id,
      req.user.role
    );

    return res.status(200).json({
      success: true,
      message: "Booking confirmed successfully",
      data: booking,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * PUT /api/bookings/:id/cancel
 * Tenant (own) or Admin: Cancel a booking
 */
const cancelBooking = async (req, res, next) => {
  try {
    const booking = await bookingService.cancelBooking(
      req.params.id,
      req.user.id,
      req.user.role
    );

    return res.status(200).json({
      success: true,
      message: "Booking cancelled successfully",
      data: booking,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/bookings
 * Admin: Get all bookings in the system
 */
const getAllBookings = async (req, res, next) => {
  try {
    const bookings = await bookingService.getAllBookings();

    return res.status(200).json({
      success: true,
      count: bookings.length,
      data: bookings,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createBooking,
  getMyBookings,
  getBookingById,
  confirmBooking,
  cancelBooking,
  getAllBookings,
};