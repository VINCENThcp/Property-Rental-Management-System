const {
      fileComplaint, 
    fetchMyComplaints, 
    fetchAllComplaints, 
    fetchComplaintById, 
    updateComplaintStatus
} = require('../services/complaintService');

const createComplaint = async (req, res, next) => {
  try {
    const complaint = await fileComplaint(req.body, req.user.id);
    res.status(201).json({
      message: 'Complaint filed successfully',
      data: complaint,
    });
  } catch (error) {
    next(error);
  }
};

const getMyComplaints = async (req, res, next) => {
  try {
    const complaints = await fetchMyComplaints(req.user.id);
    res.status(200).json({
      message: 'Complaints fetched successfully',
      data: complaints,
    });
  } catch (error) {
    next(error);
  }
};

const getAllComplaints = async (req, res, next) => {
  try {
    const complaints = await fetchAllComplaints();
    res.status(200).json({
      message: 'All complaints fetched successfully',
      data: complaints,
    });
  } catch (error) {
    next(error);
  }
};

const getComplaintById = async (req, res, next) => {
  try {
    const complaint = await fetchComplaintById(
      req.params.id,
      req.user.id,
      req.user.role
    );
    res.status(200).json({
      message: 'Complaint fetched successfully',
      data: complaint,
    });
  } catch (error) {
    next(error);
  }
};

const updateStatus = async (req, res, next) => {
  try {
    const { status, adminNote } = req.body;
    const complaint = await updateComplaintStatus(
      req.params.id,
      status,
      adminNote
    );
    res.status(200).json({
      message: 'Complaint status updated successfully',
      data: complaint,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createComplaint,
  getMyComplaints,
  getAllComplaints,
  getComplaintById,
  updateStatus,
};