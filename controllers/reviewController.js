const reviewService = require ('../services/reviewService');

// To Handle POST Request for Reviews
const createReview = async (req, res, next) => {
    try {
        const { propertyId, rating, comment} = req.body;
        const reviewerId = req.user._id;

        const review = await reviewService.createReview({
            propertyId,
            reviewerId,
            rating,
            comment,
        });
        res.status(201).json({
            success: true, message: 'Review added Successfully', data: review,
        });
    } catch (error) {
        next(error);
    }
};

// GET Request to View Reviews
const getReviewById = async (req, res, next)=> {
    try {
        const review = await reviewService.getReviewById(req.params.id);

        res.status(200).json({
            succcess: true, message: 'Review Successfully Fetched Successfully', data: review,
        });
    } catch (error) {
        next(error);
    }
};

// To Update Reviews
const updateReview = async (req, res, next) => {
    try {
        const {rating, comment} = req.body;
        const UserId = req.user._id;

        const review = await reviewService.updateReview ({
            reviewId: req.params.id, 
            userId,
            rating,
            comment,
        });

        res.status(200).json({
            success: true, message: 'Review Updated Successfully', data: review,
        });
    } catch (error) {
        next(error);
    }
};

// Handels Deletion of Reviews
const deleteReview = async (req, res, next) => {
    try {
        const result = await reviewService.deleteReview({
            reviewId: req.params.id,
            userId: req.user._id,
            userRole: req.user.role,
        });

        res.status(200).json({
            success: true, message: result.message, data: null,
        });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    createReview,
    getReviewById,
    updateReview,
    deleteReview
};