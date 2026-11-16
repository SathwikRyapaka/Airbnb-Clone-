const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema(
  {
    listing: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Listing',
      required: [true, 'Booking must be associated with a listing'],
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Booking must belong to a user'],
    },
    checkIn: {
      type: Date,
      required: [true, 'Check-in date is required'],
    },
    checkOut: {
      type: Date,
      required: [true, 'Check-out date is required'],
    },
    guests: {
      adults: {
        type: Number,
        default: 1,
        min: 1,
      },
      children: {
        type: Number,
        default: 0,
        min: 0,
      },
      infants: {
        type: Number,
        default: 0,
        min: 0,
      },
    },
    nights: {
      type: Number,
      required: true,
      min: 1,
    },
    pricePerNight: {
      type: Number,
      required: true,
    },
    basePrice: {
      type: Number,
      required: true,
    },
    cleaningFee: {
      type: Number,
      default: 0,
    },
    serviceFee: {
      type: Number,
      default: 0,
    },
    totalAmount: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      enum: ['pending', 'confirmed', 'cancelled', 'completed'],
      default: 'confirmed',
    },
    paymentStatus: {
      type: String,
      enum: ['unpaid', 'paid', 'refunded'],
      default: 'paid',
    },
    guestNotes: {
      type: String,
      default: '',
    },
  },
  {
    timestamps: true,
  }
);

// Indexes for fast lookup of listing bookings and overlap checks
bookingSchema.index({ listing: 1, checkIn: 1, checkOut: 1, status: 1 });
bookingSchema.index({ user: 1, createdAt: -1 });

module.exports = mongoose.model('Booking', bookingSchema);
