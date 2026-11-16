const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema(
  {
    listing: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Listing',
      required: [true, 'Review must belong to a listing'],
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Review must belong to a user'],
    },
    booking: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Booking',
    },
    rating: {
      type: Number,
      required: [true, 'Please provide an overall rating between 1 and 5'],
      min: [1, 'Minimum rating is 1'],
      max: [5, 'Maximum rating is 5'],
    },
    ratingsDetail: {
      cleanliness: { type: Number, min: 1, max: 5, default: 5 },
      accuracy: { type: Number, min: 1, max: 5, default: 5 },
      communication: { type: Number, min: 1, max: 5, default: 5 },
      location: { type: Number, min: 1, max: 5, default: 5 },
      checkIn: { type: Number, min: 1, max: 5, default: 5 },
      value: { type: Number, min: 1, max: 5, default: 5 },
    },
    comment: {
      type: String,
      required: [true, 'Please provide feedback in your review'],
      trim: true,
      maxlength: [1500, 'Review cannot exceed 1500 characters'],
    },
    hostResponse: {
      type: String,
      trim: true,
      default: '',
    },
  },
  {
    timestamps: true,
  }
);

// Prevent same user from posting multiple reviews for the exact same listing
reviewSchema.index({ listing: 1, user: 1 }, { unique: true });

// Static method to recalculate average rating & reviewCount on the listing
reviewSchema.statics.calculateAverageRating = async function (listingId) {
  const stats = await this.aggregate([
    {
      $match: { listing: new mongoose.Types.ObjectId(listingId) },
    },
    {
      $group: {
        _id: '$listing',
        avgRating: { $avg: '$rating' },
        reviewCount: { $sum: 1 },
      },
    },
  ]);

  try {
    if (stats.length > 0) {
      await mongoose.model('Listing').findByIdAndUpdate(listingId, {
        rating: Math.round(stats[0].avgRating * 10) / 10,
        reviewCount: stats[0].reviewCount,
      });
    } else {
      await mongoose.model('Listing').findByIdAndUpdate(listingId, {
        rating: 0,
        reviewCount: 0,
      });
    }
  } catch (err) {
    console.error('Failed to update listing rating statistics:', err);
  }
};

// Hooks to recalculate average rating after review is created or deleted
reviewSchema.post('save', async function () {
  await this.constructor.calculateAverageRating(this.listing);
});

reviewSchema.post('deleteOne', { document: true, query: false }, async function () {
  await this.constructor.calculateAverageRating(this.listing);
});

module.exports = mongoose.model('Review', reviewSchema);
