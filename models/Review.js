const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema(
    {
        property: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Property',
            required: [true, 'Property is required'],
        },
        reviewer: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: [true, 'Reviewer is required'],
        },
        rating: {
            type: Number,
            required: [true, 'Rating is required'],
            min: 1,
            max: 5,
        },
        comment: {
            type: String,
            trim: true,
        },
    },
    {timestamp: true}
);

// To Prevent Users providing double review on a particular property
reviewSchema.index({property: 1, reviewer: 1}, {unique: true});

module.exports = mongoose.model('Review', reviewSchema);