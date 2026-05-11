const ROLES = {
  ADMIN: 'admin',
  LANDLORD: 'landlord',
  TENANT: 'tenant',
};

const BOOKING_STATUS = {
  PENDING: 'pending',
  CONFIRMED: 'confirmed',
  CANCELLED: 'cancelled',
  COMPLETED: 'completed',
};

const PAYMENT_STATUS = {
  PENDING: 'pending',
  COMPLETED: 'completed',
  FAILED: 'failed',
  REFUNDED: 'refunded',
};

const OFFER_STATUS = {
  PENDING: 'pending',
  ACCEPTED: 'accepted',
  DECLINED: 'declined',
};

const COMPLAINT_STATUS = {
  OPEN: 'open',
  IN_REVIEW: 'in_review',
  RESOLVED: 'resolved',
};

const PROPERTY_TYPE = {
  APARTMENT: 'apartment',
  HOUSE: 'house',
  STUDIO: 'studio',
  OFFICE: 'office',
};

module.exports = {
  ROLES,
  BOOKING_STATUS,
  PAYMENT_STATUS,
  OFFER_STATUS,
  COMPLAINT_STATUS,
  PROPERTY_TYPE,
};