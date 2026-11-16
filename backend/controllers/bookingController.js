const Booking = require('../models/Booking');
const Listing = require('../models/Listing');

/**
 * @desc    Create a new booking with strict overlap validation
 * @route   POST /api/bookings
 * @access  Private
 */
const createBooking = async (req, res, next) => {
  try {
    const { listingId, checkIn, checkOut, guests, guestNotes } = req.body;

    if (!listingId || !checkIn || !checkOut) {
      return res.status(400).json({
        success: false,
        message: 'Listing ID, check-in date, and check-out date are required.',
      });
    }

    const checkInDate = new Date(checkIn);
    const checkOutDate = new Date(checkOut);
    const now = new Date();
    now.setHours(0, 0, 0, 0);

    // Validate date chronology
    if (isNaN(checkInDate.getTime()) || isNaN(checkOutDate.getTime())) {
      return res.status(400).json({
        success: false,
        message: 'Invalid date format provided.',
      });
    }

    if (checkInDate < now) {
      return res.status(400).json({
        success: false,
        message: 'Check-in date cannot be in the past.',
      });
    }

    if (checkOutDate <= checkInDate) {
      return res.status(400).json({
        success: false,
        message: 'Check-out date must be strictly after the check-in date.',
      });
    }

    // Find listing
    const listing = await Listing.findById(listingId);
    if (!listing) {
      return res.status(404).json({
        success: false,
        message: 'Listing not found.',
      });
    }

    // Prevent host from booking their own listing
    if (listing.host.toString() === req.user.id) {
      return res.status(400).json({
        success: false,
        message: 'Hosts cannot book their own property listing.',
      });
    }

    // Validate guest capacity
    const totalGuests = (guests?.adults || 1) + (guests?.children || 0);
    if (totalGuests > listing.guests) {
      return res.status(400).json({
        success: false,
        message: `Total guests (${totalGuests}) exceeds the property maximum limit (${listing.guests}).`,
      });
    }

    // OVERLAP VALIDATION: Check for existing overlapping active reservations
    const overlappingBooking = await Booking.findOne({
      listing: listingId,
      status: { $in: ['confirmed', 'pending'] },
      checkIn: { $lt: checkOutDate },
      checkOut: { $gt: checkInDate },
    });

    if (overlappingBooking) {
      return res.status(409).json({
        success: false,
        message: 'Selected dates overlap with an existing booking. Please pick another date range.',
      });
    }

    // Calculate nights & fees securely on backend
    const diffTime = Math.abs(checkOutDate - checkInDate);
    const nights = Math.max(1, Math.round(diffTime / (1000 * 60 * 60 * 24)));
    const pricePerNight = listing.pricePerNight;
    const basePrice = nights * pricePerNight;
    const cleaningFee = listing.cleaningFee || 0;
    const serviceFeeRate = listing.serviceFeeRate || 0.12;
    const serviceFee = Math.round(basePrice * serviceFeeRate);
    const totalAmount = basePrice + cleaningFee + serviceFee;

    const booking = await Booking.create({
      listing: listingId,
      user: req.user.id,
      checkIn: checkInDate,
      checkOut: checkOutDate,
      guests: {
        adults: guests?.adults || 1,
        children: guests?.children || 0,
        infants: guests?.infants || 0,
      },
      nights,
      pricePerNight,
      basePrice,
      cleaningFee,
      serviceFee,
      totalAmount,
      guestNotes: guestNotes || '',
      status: 'confirmed',
      paymentStatus: 'paid',
    });

    const populatedBooking = await Booking.findById(booking._id).populate({
      path: 'listing',
      select: 'title images location pricePerNight host',
      populate: { path: 'host', select: 'name avatar email' },
    });

    res.status(201).json({
      success: true,
      message: 'Booking confirmed successfully!',
      booking: populatedBooking,
    });
  } catch (err) {
    next(err);
  }
};

/**
 * @desc    Get all bookings for currently logged-in guest
 * @route   GET /api/bookings/my-trips
 * @access  Private
 */
const getMyBookings = async (req, res, next) => {
  try {
    const bookings = await Booking.find({ user: req.user.id })
      .populate({
        path: 'listing',
        select: 'title images location pricePerNight propertyType rating host',
        populate: { path: 'host', select: 'name avatar email' },
      })
      .sort({ checkIn: -1 });

    res.status(200).json({
      success: true,
      count: bookings.length,
      bookings,
    });
  } catch (err) {
    next(err);
  }
};

/**
 * @desc    Get all booked date ranges for a listing (for date-picker disable states)
 * @route   GET /api/bookings/listing/:listingId/availability
 * @access  Public
 */
const getListingAvailability = async (req, res, next) => {
  try {
    const now = new Date();
    now.setHours(0, 0, 0, 0);

    const bookings = await Booking.find({
      listing: req.params.listingId,
      status: { $in: ['confirmed', 'pending'] },
      checkOut: { $gte: now },
    }).select('checkIn checkOut -_id');

    res.status(200).json({
      success: true,
      bookedRanges: bookings.map((b) => ({
        checkIn: b.checkIn,
        checkOut: b.checkOut,
      })),
    });
  } catch (err) {
    next(err);
  }
};

/**
 * @desc    Get all reservations received for listings owned by host
 * @route   GET /api/bookings/host/reservations
 * @access  Private
 */
const getHostReservations = async (req, res, next) => {
  try {
    // Find all listings belonging to this host
    const myListings = await Listing.find({ host: req.user.id }).select('_id');
    const listingIds = myListings.map((l) => l._id);

    const reservations = await Booking.find({
      listing: { $in: listingIds },
    })
      .populate('user', 'name email avatar phone')
      .populate('listing', 'title images location pricePerNight')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: reservations.length,
      reservations,
    });
  } catch (err) {
    next(err);
  }
};

/**
 * @desc    Cancel a booking
 * @route   PUT /api/bookings/:id/cancel
 * @access  Private
 */
const cancelBooking = async (req, res, next) => {
  try {
    const booking = await Booking.findById(req.params.id).populate('listing');

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found',
      });
    }

    // Only booking guest or listing host or admin can cancel
    const isGuest = booking.user.toString() === req.user.id;
    const isHost = booking.listing.host.toString() === req.user.id;
    const isAdmin = req.user.role === 'admin';

    if (!isGuest && !isHost && !isAdmin) {
      return res.status(403).json({
        success: false,
        message: 'You are not authorized to cancel this booking.',
      });
    }

    if (booking.status === 'cancelled') {
      return res.status(400).json({
        success: false,
        message: 'This booking has already been cancelled.',
      });
    }

    booking.status = 'cancelled';
    booking.paymentStatus = 'refunded';
    await booking.save();

    res.status(200).json({
      success: true,
      message: 'Booking has been successfully cancelled and payment marked refunded.',
      booking,
    });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  createBooking,
  getMyBookings,
  getListingAvailability,
  getHostReservations,
  cancelBooking,
};
