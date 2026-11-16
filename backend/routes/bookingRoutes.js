const express = require('express');
const router = express.Router();
const {
  createBooking,
  getMyBookings,
  getListingAvailability,
  getHostReservations,
  cancelBooking,
} = require('../controllers/bookingController');
const { protect } = require('../middleware/auth');

router.post('/', protect, createBooking);
router.get('/my-trips', protect, getMyBookings);
router.get('/listing/:listingId/availability', getListingAvailability);
router.get('/host/reservations', protect, getHostReservations);
router.put('/:id/cancel', protect, cancelBooking);

module.exports = router;
