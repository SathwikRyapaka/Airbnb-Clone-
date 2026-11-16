const dotenv = require('dotenv');
const { connectDB } = require('../config/db');
const User = require('../models/User');
const Listing = require('../models/Listing');
const Booking = require('../models/Booking');
const Review = require('../models/Review');
const { sampleUsers, sampleListings } = require('../utils/seedData');

dotenv.config();

const runSeed = async () => {
  try {
    console.log('[Seed] Connecting to MongoDB...');
    await connectDB();

    console.log('[Seed] Clearing existing collections...');
    await Booking.deleteMany({});
    await Review.deleteMany({});
    await Listing.deleteMany({});
    await User.deleteMany({});

    console.log('[Seed] Inserting users...');
    const createdUsers = [];
    for (const userData of sampleUsers) {
      const user = await User.create(userData);
      createdUsers.push(user);
    }
    console.log(`[Seed] Created ${createdUsers.length} users successfully.`);

    const host1 = createdUsers[0]; // Sarah Jenkins
    const host2 = createdUsers[1]; // David Rossi
    const guest1 = createdUsers[2]; // Alex Morgan
    const guest2 = createdUsers[3]; // Emma Watson

    console.log('[Seed] Inserting listings...');
    const createdListings = [];
    for (let i = 0; i < sampleListings.length; i++) {
      const listingData = {
        ...sampleListings[i],
        host: i % 2 === 0 ? host1._id : host2._id,
      };
      const listing = await Listing.create(listingData);
      createdListings.push(listing);
    }
    console.log(`[Seed] Created ${createdListings.length} listings successfully.`);

    console.log('[Seed] Creating sample reviews...');
    const sampleReviewsData = [
      {
        listing: createdListings[0]._id, // Santorini Cave
        user: guest1._id,
        rating: 5,
        ratingsDetail: { cleanliness: 5, accuracy: 5, communication: 5, location: 5, checkIn: 5, value: 5 },
        comment: 'Absolutely magical stay! The sunset views from the heated jacuzzi over the caldera are even more breathtaking in person. Sarah was a gracious host who arranged seamless luggage transfers.',
      },
      {
        listing: createdListings[0]._id,
        user: guest2._id,
        rating: 5,
        ratingsDetail: { cleanliness: 5, accuracy: 5, communication: 5, location: 5, checkIn: 5, value: 4 },
        comment: 'One of the best Airbnbs we have ever experienced in our lives. The cave architecture stays delightfully cool in midday sun. Highly recommended!',
      },
      {
        listing: createdListings[1]._id, // Bali Bamboo Treehouse
        user: guest1._id,
        rating: 5,
        ratingsDetail: { cleanliness: 5, accuracy: 5, communication: 5, location: 5, checkIn: 5, value: 5 },
        comment: 'A masterpiece of sustainable architecture. Falling asleep to sounds of nature and waking up to misty rice terraces was unforgettable. Delicious breakfast included too.',
      },
      {
        listing: createdListings[2]._id, // Paris Loft
        user: guest2._id,
        rating: 5,
        ratingsDetail: { cleanliness: 5, accuracy: 5, communication: 5, location: 5, checkIn: 5, value: 5 },
        comment: 'Unbeatable location. Having morning croissants on the balcony while watching the Eiffel Tower shimmer was a dream come true. Spotless and beautifully decorated.',
      },
      {
        listing: createdListings[4]._id, // Tuscan Wine Estate
        user: guest1._id,
        rating: 5,
        ratingsDetail: { cleanliness: 5, accuracy: 5, communication: 5, location: 5, checkIn: 5, value: 5 },
        comment: 'David gave us a tour of the private cellar and treated us to exceptional Chianti wine. The infinity pool looking over the valley is pure paradise.',
      },
      {
        listing: createdListings[5]._id, // Malibu Beach House
        user: guest2._id,
        rating: 5,
        ratingsDetail: { cleanliness: 5, accuracy: 5, communication: 5, location: 5, checkIn: 5, value: 5 },
        comment: 'Direct beach access was incredible. We saw dolphins jumping right off our balcony in the morning. Clean, modern, and perfectly equipped.',
      },
    ];

    for (const rev of sampleReviewsData) {
      await Review.create(rev);
    }
    console.log(`[Seed] Created ${sampleReviewsData.length} sample reviews.`);

    console.log('[Seed] Creating sample bookings...');
    const now = new Date();
    const in3Days = new Date(now.getTime() + 3 * 24 * 60 * 60 * 1000);
    const in7Days = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
    const in14Days = new Date(now.getTime() + 14 * 24 * 60 * 60 * 1000);
    const in18Days = new Date(now.getTime() + 18 * 24 * 60 * 60 * 1000);

    const sampleBookingsData = [
      {
        listing: createdListings[0]._id,
        user: guest1._id,
        checkIn: in3Days,
        checkOut: in7Days,
        guests: { adults: 2, children: 0, infants: 0 },
        nights: 4,
        pricePerNight: createdListings[0].pricePerNight,
        basePrice: 4 * createdListings[0].pricePerNight,
        cleaningFee: createdListings[0].cleaningFee,
        serviceFee: Math.round(4 * createdListings[0].pricePerNight * 0.12),
        totalAmount: 4 * createdListings[0].pricePerNight + createdListings[0].cleaningFee + Math.round(4 * createdListings[0].pricePerNight * 0.12),
        status: 'confirmed',
        paymentStatus: 'paid',
        guestNotes: 'Celebrating our anniversary!',
      },
      {
        listing: createdListings[2]._id,
        user: guest2._id,
        checkIn: in14Days,
        checkOut: in18Days,
        guests: { adults: 2, children: 0, infants: 0 },
        nights: 4,
        pricePerNight: createdListings[2].pricePerNight,
        basePrice: 4 * createdListings[2].pricePerNight,
        cleaningFee: createdListings[2].cleaningFee,
        serviceFee: Math.round(4 * createdListings[2].pricePerNight * 0.12),
        totalAmount: 4 * createdListings[2].pricePerNight + createdListings[2].cleaningFee + Math.round(4 * createdListings[2].pricePerNight * 0.12),
        status: 'confirmed',
        paymentStatus: 'paid',
        guestNotes: 'Arriving late afternoon from London.',
      },
    ];

    for (const b of sampleBookingsData) {
      await Booking.create(b);
    }
    console.log(`[Seed] Created ${sampleBookingsData.length} sample bookings.`);

    console.log('[Seed] Database successfully seeded! Exiting...');
    process.exit(0);
  } catch (err) {
    console.error('[Seed] Error during seeding:', err);
    process.exit(1);
  }
};

runSeed();
