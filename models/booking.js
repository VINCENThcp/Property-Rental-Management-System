const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema(
  {
    property: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Property",
      required: [true, "Property is required"],
    },
    tenant: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Tenant is required"],
    },
    startDate: {
      type: Date,
      required: [true, "Start date is required"],
    },
    endDate: {
      type: Date,
      required: [true, "End date is required"],
    },
    totalPrice: {
      type: Number,
      required: [true, "Total price is required"],
    },
    status: {
      type: String,
      enum: ["pending", "confirmed", "cancelled", "completed"],
      default: "pending",
    },
    notes: {
      type: String,
    },
  },
  { timestamps: true }
);
// Speeds up the availability conflict check query
bookingSchema.index({ property: 1, status: 1, startDate: 1, endDate: 1 });

module.exports = mongoose.model("Booking", bookingSchema);