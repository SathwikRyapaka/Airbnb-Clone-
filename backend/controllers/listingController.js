const Listing = require('../models/Listing');
const Review = require('../models/Review');
const Booking = require('../models/Booking');

/**
 * @desc    Get all listings with filtering, search, sorting & pagination
 * @route   GET /api/listings
 * @access  Public
 */
const getListings = async (req, res, next) => {
  try {
    const {
      category,
      search,
      city,
      country,
      minPrice,
      maxPrice,
      guests,
      bedrooms,
      bathrooms,
      propertyType,
      amenities,
      sort,
      page = 1,
      limit = 20,
    } = req.query;

    const query = {};

    // Category filter
    if (category && category !== 'All') {
      query.category = category;
    }

    // Property Type filter
    if (propertyType) {
      query.propertyType = propertyType;
    }

    // Keyword search over city, country, title, description
    if (search) {
      const searchRegex = new RegExp(search.trim(), 'i');
      query.$or = [
        { title: searchRegex },
        { description: searchRegex },
        { 'location.city': searchRegex },
        { 'location.country': searchRegex },
        { 'location.state': searchRegex },
      ];
    }

    if (city) {
      query['location.city'] = new RegExp(city.trim(), 'i');
    }

    if (country) {
      query['location.country'] = new RegExp(country.trim(), 'i');
    }

    // Price range filter
    if (minPrice || maxPrice) {
      query.pricePerNight = {};
      if (minPrice) query.pricePerNight.$gte = Number(minPrice);
      if (maxPrice) query.pricePerNight.$lte = Number(maxPrice);
    }

    // Capacity filters
    if (guests) {
      query.guests = { $gte: Number(guests) };
    }
    if (bedrooms) {
      query.bedrooms = { $gte: Number(bedrooms) };
    }
    if (bathrooms) {
      query.bathrooms = { $gte: Number(bathrooms) };
    }

    // Amenities filter (all matched)
    if (amenities) {
      const amenityList = Array.isArray(amenities) ? amenities : amenities.split(',');
      query.amenities = { $all: amenityList };
    }

    // Sorting
    let sortOption = { createdAt: -1 }; // Default newest
    if (sort === 'price_asc') {
      sortOption = { pricePerNight: 1 };
    } else if (sort === 'price_desc') {
      sortOption = { pricePerNight: -1 };
    } else if (sort === 'rating') {
      sortOption = { rating: -1, reviewCount: -1 };
    } else if (sort === 'popular') {
      sortOption = { reviewCount: -1, rating: -1 };
    }

    const pageNum = parseInt(page, 10);
    const limitNum = parseInt(limit, 10);
    const skip = (pageNum - 1) * limitNum;

    const total = await Listing.countDocuments(query);
    const listings = await Listing.find(query)
      .populate('host', 'name avatar isHost')
      .sort(sortOption)
      .skip(skip)
      .limit(limitNum);

    res.status(200).json({
      success: true,
      count: listings.length,
      total,
      page: pageNum,
      totalPages: Math.ceil(total / limitNum),
      listings,
    });
  } catch (err) {
    next(err);
  }
};

/**
 * @desc    Get single listing by ID with host and populated reviews
 * @route   GET /api/listings/:id
 * @access  Public
 */
const getListingById = async (req, res, next) => {
  try {
    const listing = await Listing.findById(req.params.id)
      .populate('host', 'name email avatar bio isHost createdAt')
      .populate({
        path: 'reviews',
        populate: { path: 'user', select: 'name avatar createdAt' },
      });

    if (!listing) {
      return res.status(404).json({
        success: false,
        message: 'Listing not found with ID: ' + req.params.id,
      });
    }

    res.status(200).json({
      success: true,
      listing,
    });
  } catch (err) {
    next(err);
  }
};

/**
 * @desc    Create a new listing
 * @route   POST /api/listings
 * @access  Private (Host/Admin)
 */
const createListing = async (req, res, next) => {
  try {
    // Attach current user as host
    const listingData = {
      ...req.body,
      host: req.user.id,
    };

    // Ensure images array has at least one item
    if (!listingData.images || listingData.images.length === 0) {
      listingData.images = [
        {
          url: 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&w=1200&q=80',
          caption: 'Listing Exterior',
          isPrimary: true,
        },
      ];
    } else {
      listingData.images[0].isPrimary = true;
    }

    const listing = await Listing.create(listingData);

    // Ensure user is marked as host
    if (!req.user.isHost) {
      req.user.isHost = true;
      req.user.role = 'host';
      await req.user.save();
    }

    res.status(201).json({
      success: true,
      message: 'Listing published successfully!',
      listing,
    });
  } catch (err) {
    next(err);
  }
};

/**
 * @desc    Update an existing listing
 * @route   PUT /api/listings/:id
 * @access  Private (Owner/Admin)
 */
const updateListing = async (req, res, next) => {
  try {
    let listing = await Listing.findById(req.params.id);

    if (!listing) {
      return res.status(404).json({
        success: false,
        message: 'Listing not found',
      });
    }

    // Check ownership or admin
    if (listing.host.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'You are not authorized to update this listing',
      });
    }

    listing = await Listing.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({
      success: true,
      message: 'Listing updated successfully',
      listing,
    });
  } catch (err) {
    next(err);
  }
};

/**
 * @desc    Delete a listing
 * @route   DELETE /api/listings/:id
 * @access  Private (Owner/Admin)
 */
const deleteListing = async (req, res, next) => {
  try {
    const listing = await Listing.findById(req.params.id);

    if (!listing) {
      return res.status(404).json({
        success: false,
        message: 'Listing not found',
      });
    }

    // Check ownership
    if (listing.host.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'You are not authorized to delete this listing',
      });
    }

    // Clean up dependent reviews and bookings
    await Review.deleteMany({ listing: listing._id });
    await Booking.deleteMany({ listing: listing._id });

    await listing.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Listing and related data successfully removed',
    });
  } catch (err) {
    next(err);
  }
};

/**
 * @desc    Get all listings managed by current host
 * @route   GET /api/listings/host/my-listings
 * @access  Private
 */
const getHostListings = async (req, res, next) => {
  try {
    const listings = await Listing.find({ host: req.user.id }).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: listings.length,
      listings,
    });
  } catch (err) {
    next(err);
  }
};

/**
 * @desc    Get featured top-rated listings
 * @route   GET /api/listings/featured
 * @access  Public
 */
const getFeaturedListings = async (req, res, next) => {
  try {
    const featured = await Listing.find({
      $or: [{ isFeatured: true }, { rating: { $gte: 4.8 } }],
    })
      .limit(6)
      .populate('host', 'name avatar');

    res.status(200).json({
      success: true,
      listings: featured,
    });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getListings,
  getListingById,
  createListing,
  updateListing,
  deleteListing,
  getHostListings,
  getFeaturedListings,
};
