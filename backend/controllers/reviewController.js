const Review = require('../models/Review');
const Listing = require('../models/Listing');

/**
 * @desc    Create a new review for a listing
 * @route   POST /api/reviews
 * @access  Private
 */
const createReview = async (req, res, next) => {
  try {
    const { listingId, rating, comment, ratingsDetail, bookingId } = req.body;

    if (!listingId || !rating || !comment) {
      return res.status(400).json({
        success: false,
        message: 'Listing ID, rating (1-5), and written comment are required.',
      });
    }

    const listing = await Listing.findById(listingId);
    if (!listing) {
      return res.status(404).json({
        success: false,
        message: 'Listing not found',
      });
    }

    // Check if host is trying to review their own place
    if (listing.host.toString() === req.user.id) {
      return res.status(400).json({
        success: false,
        message: 'Hosts cannot submit a review for their own listing.',
      });
    }

    // Check if user already reviewed this listing
    const existingReview = await Review.findOne({
      listing: listingId,
      user: req.user.id,
    });

    if (existingReview) {
      return res.status(400).json({
        success: false,
        message: 'You have already submitted a review for this property.',
      });
    }

    const review = await Review.create({
      listing: listingId,
      user: req.user.id,
      booking: bookingId || null,
      rating: Number(rating),
      ratingsDetail: ratingsDetail || {
        cleanliness: 5,
        accuracy: 5,
        communication: 5,
        location: 5,
        checkIn: 5,
        value: 5,
      },
      comment,
    });

    const populatedReview = await Review.findById(review._id).populate(
      'user',
      'name avatar createdAt'
    );

    res.status(201).json({
      success: true,
      message: 'Review posted successfully!',
      review: populatedReview,
    });
  } catch (err) {
    next(err);
  }
};

/**
 * @desc    Get all reviews for a listing with aggregate metrics
 * @route   GET /api/reviews/listing/:listingId
 * @access  Public
 */
const getListingReviews = async (req, res, next) => {
  try {
    const reviews = await Review.find({ listing: req.params.listingId })
      .populate('user', 'name avatar createdAt')
      .sort({ createdAt: -1 });

    // Aggregate sub-scores
    let categoryAverages = {
      cleanliness: 5.0,
      accuracy: 5.0,
      communication: 5.0,
      location: 5.0,
      checkIn: 5.0,
      value: 5.0,
    };

    if (reviews.length > 0) {
      const totals = reviews.reduce(
        (acc, r) => {
          acc.cleanliness += r.ratingsDetail?.cleanliness || r.rating;
          acc.accuracy += r.ratingsDetail?.accuracy || r.rating;
          acc.communication += r.ratingsDetail?.communication || r.rating;
          acc.location += r.ratingsDetail?.location || r.rating;
          acc.checkIn += r.ratingsDetail?.checkIn || r.rating;
          acc.value += r.ratingsDetail?.value || r.rating;
          return acc;
        },
        { cleanliness: 0, accuracy: 0, communication: 0, location: 0, checkIn: 0, value: 0 }
      );

      const count = reviews.length;
      categoryAverages = {
        cleanliness: Number((totals.cleanliness / count).toFixed(1)),
        accuracy: Number((totals.accuracy / count).toFixed(1)),
        communication: Number((totals.communication / count).toFixed(1)),
        location: Number((totals.location / count).toFixed(1)),
        checkIn: Number((totals.checkIn / count).toFixed(1)),
        value: Number((totals.value / count).toFixed(1)),
      };
    }

    res.status(200).json({
      success: true,
      count: reviews.length,
      categoryAverages,
      reviews,
    });
  } catch (err) {
    next(err);
  }
};

/**
 * @desc    Delete a review
 * @route   DELETE /api/reviews/:id
 * @access  Private (Owner/Admin)
 */
const deleteReview = async (req, res, next) => {
  try {
    const review = await Review.findById(req.params.id);

    if (!review) {
      return res.status(404).json({
        success: false,
        message: 'Review not found',
      });
    }

    if (review.user.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this review.',
      });
    }

    const listingId = review.listing;
    await review.deleteOne();
    await Review.calculateAverageRating(listingId);

    res.status(200).json({
      success: true,
      message: 'Review removed successfully',
    });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  createReview,
  getListingReviews,
  deleteReview,
};
