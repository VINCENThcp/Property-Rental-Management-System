const mongoose = require("mongoose");
const Booking = require("../models/booking");
const Property = require("../models/property");// add property model here after craetion
const Offer = require("../models/offer");// add offers model here after creation
const isValidId = (id) => mongoose.Types.ObjectId.isValid(id);


const checkAvailability = async (propertyId, startDate, endDate, excludeBookingId = null) => {
  const query = {
    property: propertyId,
    status: { $in: ["pending", "confirmed"] },
    $or: [
      // New booking starts during an existing booking
      { startDate: { $lte: endDate }, endDate: { $gte: startDate } },
    ],
  };

  // Exclude a specific booking (useful if ever editing a booking)
  if (excludeBookingId) {
    query._id = { $ne: excludeBookingId };
  }

  const conflict = await Booking.findOne(query);
  return !conflict; // true = available, false = not available
};

/**
 * Calculate the number of days between two dates (minimum 1).
 */
const calculateDays = (startDate, endDate) => {
  const ms = new Date(endDate) - new Date(startDate);
  const days = Math.ceil(ms / (1000 * 60 * 60 * 24));
  return Math.max(days, 1);
};

/**
 * Create a new booking.
 * - Validates property exists and is available
 * - Checks for date conflicts
 * - Uses accepted offer price if one exists, otherwise uses listed price
 * - Auto-calculates totalPrice
 */
const createBooking = async ({ propertyId, tenantId, startDate, endDate, notes }) => {
  // 1. Fetch the property
  const property = await Property.findById(propertyId);
  if (!property) {
    const error = new Error("Property not found");
    error.statusCode = 404;
    throw error;
  }

  // 2. Check property is available for booking
  if (!property.isAvailable) {
    const error = new Error("This property is not available for booking");
    error.statusCode = 400;
    throw error;
  }

  // 3. Validate date logic
  if (new Date(startDate) >= new Date(endDate)) {
    const error = new Error("End date must be after start date");
    error.statusCode = 400;
    throw error;
  }

  // 4. Check for conflicting bookings
  const isAvailable = await checkAvailability(propertyId, startDate, endDate);
  if (!isAvailable) {
    const error = new Error(
      "Property is already booked for part or all of the selected dates"
    );
    error.statusCode = 409;
    throw error;
  }

  // 5. Determine price — use accepted offer price if one exists
  let pricePerDay = property.price;

  const acceptedOffer = await Offer.findOne({
    property: propertyId,
    tenant: tenantId,
    status: "accepted",
  });

  if (acceptedOffer) {
    pricePerDay = acceptedOffer.offeredPrice;
  }

  // 6. Auto-calculate total price
  const days = calculateDays(startDate, endDate);
  const totalPrice = pricePerDay * days;

  // 7. Create and return the booking
  const booking = await Booking.create({
    property: propertyId,
    tenant: tenantId,
    startDate,
    endDate,
    totalPrice,
    notes,
  });

  return booking;
};

/**
 * Get all bookings belonging to the logged-in tenant.
 */
const getMyBookings = async (tenantId) => {
  const bookings = await Booking.find({ tenant: tenantId })
    .populate("property", "address type price images")
    .sort({ createdAt: -1 });

  return bookings;
};

/**
 * Get a single booking by ID.
 * Tenants can only access their own bookings; admins can access any.
 */
const getBookingById = async (bookingId, userId, role) => {
  const booking = await Booking.findById(bookingId)
    .populate("property", "address type price landlord")
    .populate("tenant", "name email phone");

  if (!isValidId(booking)) {
    const error = new Error("Booking not found");
    error.statusCode = 404;
    throw error;
  }

  // Tenants can only view their own bookings
  if (role === "tenant" && booking.tenant._id.toString() !== userId.toString()) {
    const error = new Error("You are not authorised to view this booking");
    error.statusCode = 403;
    throw error;
  }

  return booking;
};

/**
 * Confirm a pending booking.
 * Only the landlord who owns the property (or an admin) can confirm.
 */
const confirmBooking = async (bookingId, userId, role) => {
  const booking = await Booking.findById(bookingId).populate("property");

  if (!isValidId(booking)) {
    const error = new Error("Booking not found");
    error.statusCode = 404;
    throw error;
  }

  if (booking.status !== "pending") {
    const error = new Error(`Cannot confirm a booking with status '${booking.status}'`);
    error.statusCode = 400;
    throw error;
  }

  // Landlords can only confirm bookings on their own properties
  if (role === "landlord" && booking.property.landlord.toString() !== userId.toString()) 
    {   
    const error = new Error("You are not authorised to confirm this booking");
    error.statusCode = 403;
    throw error;
  }

  booking.status = "confirmed";
  await booking.save();

  return booking;
};

/**
 * Cancel a booking.
 * Tenants can only cancel their own bookings; admins can cancel any.
 */
const cancelBooking = async (bookingId, userId, role) => {
  const booking = await Booking.findById(bookingId);

  if (!isValidId(booking)) {
    const error = new Error("Booking not found");
    error.statusCode = 404;
    throw error;
  }

  // Tenants can only cancel their own bookings
  if (role === "tenant" && booking.tenant.toString() !== userId.toString()) {
    const error = new Error("You are not authorised to cancel this booking");
    error.statusCode = 403;
    throw error;
  }

  if (booking.status === "cancelled") {
    const error = new Error("Booking is already cancelled");
    error.statusCode = 400;
    throw error;
  }

  if (booking.status === "completed") {
    const error = new Error("A completed booking cannot be cancelled");
    error.statusCode = 400;
    throw error;
  }

  booking.status = "cancelled";
  await booking.save();

  return booking;
};

/**
 * Get all bookings in the system — Admin only.
 */
const getAllBookings = async () => {
  const bookings = await Booking.find()
    .populate("property", "address type price")
    .populate("tenant", "name email")
    .sort({ createdAt: -1 });

  return bookings;
};

module.exports = {
  createBooking,
  getMyBookings,
  getBookingById,
  confirmBooking,
  cancelBooking,
  getAllBookings,
};