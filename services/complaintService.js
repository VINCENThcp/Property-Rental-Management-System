const Complaint = require('../models/Complaint');

const fileComplaint = async (data, tenantId) => {
    const complaint = await Complaint.create({
        ...data,
        tenant: tenantId,
    });
    return complaint;
};

const fetchMyComplaints = async (tenantId) => {
    const complaints = await Complaint.find({ tenant: tenantId})
    .populate('property', 'address')
    return complaints;
};

const fetchAllComplaints = async () => {
    const complaints = await Complaint.find()
    .populate('tenant', 'name email')
    .populate('property', 'address')
    return complaints;
};

const fetchComplaintById = async (id, userId, userRole) => {
    const complaint = await Complaint.findById(id)
    .populate('tenant', 'name email')
    .populate('property', 'address');

    if (!complaint) {
        const error = new Error('complaint not found');
        error.statusCode = 404;
        throw error;
    }

    // Tenant can only view their own complaint
  if (userRole !== 'admin' && complaint.tenant._id.toString() !== userId) {
    const error = new Error('You are not authorized to view this complaint');
    error.statusCode = 403;
    throw error;
  }

    return complaint;
};

const updateComplaintStatus = async (id, status, adminNote) => {
    const complaint = await Complaint.findById(id);

    if (!complaint) {
    const error = new Error('Complaint not found');
    error.statusCode = 404;
    throw error;
    };
    complaint.status = status;
  if (adminNote) complaint.adminNote = adminNote;
  await complaint.save();

  return complaint;
};


module.exports = { 
    fileComplaint, 
    fetchMyComplaints, 
    fetchAllComplaints, 
    fetchComplaintById, 
    updateComplaintStatus
}