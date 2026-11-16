const express = require('express');
const router = express.Router();
const {
  getListings,
  getListingById,
  createListing,
  updateListing,
  deleteListing,
  getHostListings,
  getFeaturedListings,
} = require('../controllers/listingController');
const { protect } = require('../middleware/auth');

router.route('/')
  .get(getListings)
  .post(protect, createListing);

router.get('/featured', getFeaturedListings);
router.get('/host/my-listings', protect, getHostListings);

router.route('/:id')
  .get(getListingById)
  .put(protect, updateListing)
  .delete(protect, deleteListing);

module.exports = router;
