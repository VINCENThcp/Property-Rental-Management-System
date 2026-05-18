const Review = require('../models/Review');
const Property = require('../models/Property');

// To Create a New Review
const createReview = async ({propertyId, reviewerId, rating, comment}) => {
    const property = await Property.findById(propertyId);
    if (!property) {
        const error = new Error('Property not Found');
        error.statusCode = 404;
        throw error;
    }

// TO Prevent Landlord from being part the reviewers
if (property.landlord.toString() === reviewerId.toString()) {
    const error = Error('You cannot leave a review on your owned Property');
    error.statusCode = 403;
    throw error;
}

const review = await Review.create({
    property: propertyId,
    reviewer: reviewerId,
    rating,
    comment,
});

await review.populate('reviewer', 'name email');
await review.populate('property', 'address type');

return review;
};


// To Get All Reviews
const getReviewByProperty = async (propertyId) => {
    const property = await Property.findyBy(propertyId);
    if (!property) {
        const error = new Error ('Property not Found');
        error.statusCode = 404;
        throw error;
    }

    const reviews = await Review.find({property: propertyId})
    .populate ('reviewer', 'name email')
    .sort({ createdAt: -1});

    return reviews;
};


// To Get a Single Review

const getReviewById = async (revieweId) => {
    const review = await Review.findById(reviewId)
    .populate('reviwer', 'name email')
    .pupolate('property', 'address');

    if (!review) {
        const error = new Error('Review not Found');
        error.statusCode = 404;
        throw error;
    }

    return review;
};

// To Edit/Update Reviews
const updateReview = async ({ reviewId, userId, rating, comment}) => {
    const review = await Review.findById(reviewId);

    if (!review) {
        const error = new Error('Review not');
        error.statusCode = 404;
        throw error;
    }

    if (review.reviewer.toString() !== userId.toString()) {
        const error = new Error ('Authorization Failed in Updating');
        error.statusCode = 403;
        throw error;
    }

    if (rating !== undefined) review.rating = rating;
    if (comment !== undefined) review.comment = comment;

    await review.save();
    await review.populate('property', 'address type');

    return review;
};


// Delete Review
const deleteReview = async ({ reviewId, userId, userRole}) => {
    const review = await Review.findById(reviewId);

    if (!review) {
        const error = new Error ('Review not Found');
        error.statusCode = 404;
        throw error;
    }

    const isOwner = review.reviewer.toString() === userId.toString();
    const isAdmin = userRole === 'admin';

    if (!isOwner && !isAdmin) {
        const error = new Error('Authorization Failed');
        error.statusCode = 403;
        throw error;
    }

    await review.deleteOne();

    return {message: 'Review Deleted Successfully'};
};


module.exports = {
    createReview,
    getReviewByProperty,
    getReviewById,
    updateReview,
    deleteReview
};