const mongoose = require('mongoose');

const listingSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Please provide a title for the listing'],
      trim: true,
      maxlength: [100, 'Title cannot exceed 100 characters'],
    },
    description: {
      type: String,
      required: [true, 'Please provide a detailed description'],
      maxlength: [4000, 'Description cannot exceed 4000 characters'],
    },
    category: {
      type: String,
      required: [true, 'Please specify a category'],
      enum: [
        'Beachfront',
        'Cabins',
        'Iconic Cities',
        'Mansions',
        'Countryside',
        'Lake',
        'Islands',
        'Trending',
        'Luxury',
        'Camping',
        'Skiing',
        'Design',
      ],
      default: 'Trending',
    },
    propertyType: {
      type: String,
      enum: ['Apartment', 'House', 'Villa', 'Cabin', 'Cottage', 'Loft', 'Chalet', 'Bungalow'],
      default: 'Apartment',
    },
    roomType: {
      type: String,
      enum: ['Entire place', 'Private room', 'Shared room'],
      default: 'Entire place',
    },
    pricePerNight: {
      type: Number,
      required: [true, 'Please enter the nightly rate'],
      min: [10, 'Price per night must be at least $10'],
    },
    cleaningFee: {
      type: Number,
      default: 45,
      min: [0, 'Cleaning fee cannot be negative'],
    },
    serviceFeeRate: {
      type: Number,
      default: 0.12, // 12% Airbnb service fee
    },
    guests: {
      type: Number,
      required: [true, 'Please enter max guest capacity'],
      min: [1, 'Capacity must be at least 1 guest'],
    },
    bedrooms: {
      type: Number,
      required: [true, 'Please enter bedroom count'],
      min: [0, 'Bedrooms cannot be negative'],
    },
    beds: {
      type: Number,
      required: [true, 'Please enter bed count'],
      min: [1, 'Must have at least 1 bed'],
    },
    bathrooms: {
      type: Number,
      required: [true, 'Please enter bathroom count'],
      min: [0.5, 'Must have at least 0.5 bath'],
    },
    location: {
      address: {
        type: String,
        default: '',
      },
      city: {
        type: String,
        required: [true, 'Please provide a city'],
        trim: true,
      },
      state: {
        type: String,
        trim: true,
        default: '',
      },
      country: {
        type: String,
        required: [true, 'Please provide a country'],
        trim: true,
      },
      zipCode: {
        type: String,
        default: '',
      },
      coordinates: {
        lat: {
          type: Number,
          required: true,
        },
        lng: {
          type: Number,
          required: true,
        },
      },
    },
    images: [
      {
        url: {
          type: String,
          required: true,
        },
        caption: {
          type: String,
          default: '',
        },
        isPrimary: {
          type: Boolean,
          default: false,
        },
      },
    ],
    amenities: [
      {
        type: String,
      },
    ],
    host: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    rating: {
      type: Number,
      default: 0,
      min: [0, 'Rating cannot be negative'],
      max: [5, 'Rating cannot exceed 5'],
    },
    reviewCount: {
      type: Number,
      default: 0,
    },
    isFeatured: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Virtual relationship with reviews
listingSchema.virtual('reviews', {
  ref: 'Review',
  localField: '_id',
  foreignField: 'listing',
  justOne: false,
});

// Indexing for search optimization
listingSchema.index({
  title: 'text',
  description: 'text',
  'location.city': 'text',
  'location.country': 'text',
});

module.exports = mongoose.model('Listing', listingSchema);
