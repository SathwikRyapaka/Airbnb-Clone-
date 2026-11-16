import React, { useState, useEffect, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  Star,
  Share2,
  Heart,
  MapPin,
  ShieldCheck,
  Award,
  Sparkles,
  Wifi,
  Waves,
  Car,
  Wind,
  Utensils,
  Bath,
  Tv,
  Trees,
  Check,
  ArrowLeft,
} from 'lucide-react';
import ImageGallery from '../components/listings/ImageGallery';
import BookingWidget from '../components/booking/BookingWidget';
import LeafletMapView from '../components/map/LeafletMapView';
import ReviewList from '../components/reviews/ReviewList';
import AddReviewModal from '../components/reviews/AddReviewModal';
import { listingService, reviewService } from '../services/api';
import { useAuth } from '../context/AuthContext';

const AMENITY_ICONS = {
  wifi: { label: 'Fast Wifi', icon: Wifi },
  pool: { label: 'Private swimming pool', icon: Waves },
  freeParking: { label: 'Free parking on premises', icon: Car },
  airConditioning: { label: 'Air conditioning', icon: Wind },
  kitchen: { label: 'Fully equipped kitchen', icon: Utensils },
  hotTub: { label: 'Private hot tub', icon: Bath },
  tv: { label: 'HD TV with streaming', icon: Tv },
  patio: { label: 'Patio or private balcony', icon: Trees },
  dedicatedWorkspace: { label: 'Dedicated workspace with ergonomic desk', icon: Sparkles },
};

const ListingDetail = () => {
  const { id } = useParams();
  const { user, isAuthenticated, openAuthModal, showToast } = useAuth();
  const [listing, setListing] = useState(null);
  const [loading, setLoading] = useState(true);
  const [reviewsData, setReviewsData] = useState({ reviews: [], categoryAverages: {} });
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [showFullDesc, setShowFullDesc] = useState(false);

  const fetchListingAndReviews = useCallback(async () => {
    setLoading(true);
    try {
      const res = await listingService.getById(id);
      if (res.success) {
        setListing(res.listing);
      }

      // Fetch reviews with category aggregates
      const revRes = await reviewService.getForListing(id);
      if (revRes.success) {
        setReviewsData({
          reviews: revRes.reviews || [],
          categoryAverages: revRes.categoryAverages || {},
        });
      }
    } catch (err) {
      console.error('Failed to load listing details:', err);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchListingAndReviews();
    window.scrollTo(0, 0);
  }, [fetchListingAndReviews]);

  const handleDeleteReview = async (reviewId) => {
    if (!window.confirm('Are you sure you want to delete this review?')) return;
    try {
      const res = await reviewService.delete(reviewId);
      if (res.success) {
        showToast('Review deleted successfully');
        fetchListingAndReviews();
      }
    } catch (err) {
      showToast('Failed to delete review', 'error');
    }
  };

  const handleOpenAddReview = () => {
    if (!isAuthenticated) {
      openAuthModal('login');
      return;
    }
    setIsReviewModalOpen(true);
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 animate-pulse">
        <div className="h-8 bg-lavender rounded-2xl w-2/3 mb-4" />
        <div className="h-4 bg-lavender/60 rounded-xl w-1/3 mb-8" />
        <div className="h-[460px] bg-lavender rounded-3xl mb-8" />
      </div>
    );
  }

  if (!listing) {
    return (
      <div className="max-w-md mx-auto py-24 text-center px-4">
        <h2 className="text-xl font-bold text-slate-900 mb-2">Listing Not Found</h2>
        <p className="text-sm text-slate-500 mb-6 font-medium">
          The requested listing could not be found or has been removed by the host.
        </p>
        <Link
          to="/"
          className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-powder to-peach text-white rounded-full text-xs font-bold shadow-soft"
        >
          <ArrowLeft className="w-4 h-4" /> Return to Explore
        </Link>
      </div>
    );
  }

  const host = listing.host || {
    name: 'Verified Host',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=200&q=80',
    bio: 'Dedicated host providing stellar hospitality.',
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fadeIn min-h-screen">
      {/* Title & Actions Bar */}
      <div className="mb-6">
        <div className="flex items-center justify-between gap-4 mb-2">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            {listing.title}
          </h1>
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                navigator.clipboard?.writeText(window.location.href);
                showToast('Link copied to clipboard!');
              }}
              className="flex items-center gap-1.5 text-xs font-bold text-slate-700 bg-white border border-lavender hover:border-powder py-2 px-3.5 rounded-full transition-all shadow-sm"
            >
              <Share2 className="w-3.5 h-3.5 text-powder-dark" /> Share
            </button>
            <button
              onClick={() => setIsSaved(!isSaved)}
              className="flex items-center gap-1.5 text-xs font-bold text-slate-700 bg-white border border-lavender hover:border-peach py-2 px-3.5 rounded-full transition-all shadow-sm"
            >
              <Heart
                className={`w-3.5 h-3.5 ${
                  isSaved ? 'fill-peach text-peach stroke-peach-dark' : 'text-slate-500'
                }`}
              />
              {isSaved ? 'Saved' : 'Save'}
            </button>
          </div>
        </div>

        {/* Location & Reviews Subheader */}
        <div className="flex flex-wrap items-center gap-2 text-xs font-bold text-slate-700">
          <div className="flex items-center gap-1">
            <Star className="w-3.5 h-3.5 fill-peach text-peach-dark" />
            <span>{listing.rating > 0 ? listing.rating.toFixed(2) : 'New'}</span>
          </div>
          <span className="text-slate-300">·</span>
          <span className="underline decoration-slate-300">{listing.reviewCount} reviews</span>
          <span className="text-slate-300">·</span>
          {listing.rating >= 4.9 && (
            <>
              <span className="bg-peach-light text-peach-deep px-2.5 py-0.5 rounded-full font-extrabold border border-peach/30">
                Guest favorite
              </span>
              <span className="text-slate-300">·</span>
            </>
          )}
          <span className="flex items-center gap-1 text-slate-600 font-semibold">
            <MapPin className="w-3.5 h-3.5 text-powder-dark" />
            {listing.location?.city}, {listing.location?.state ? `${listing.location.state}, ` : ''}{listing.location?.country}
          </span>
        </div>
      </div>

      {/* Showcase Image Gallery */}
      <ImageGallery images={listing.images} title={listing.title} />

      {/* Main Content Layout: Left Details & Right Booking Widget */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 mt-10">
        {/* Left Column */}
        <div className="lg:col-span-2 space-y-8">
          {/* Host & Capacity Overview */}
          <div className="flex items-center justify-between pb-6 border-b border-lavender">
            <div>
              <h2 className="text-xl font-bold text-slate-900">
                {listing.propertyType} hosted by {host.name}
              </h2>
              <p className="text-xs text-slate-500 mt-1 font-medium">
                {listing.guests} guests · {listing.bedrooms} bedroom{listing.bedrooms > 1 ? 's' : ''} · {listing.beds} bed{listing.beds > 1 ? 's' : ''} · {listing.bathrooms} bath{listing.bathrooms > 1 ? 's' : ''}
              </p>
            </div>
            <img
              src={host.avatar}
              alt={host.name}
              className="w-14 h-14 rounded-full object-cover border-2 border-powder shadow-soft"
            />
          </div>

          {/* Highlights */}
          <div className="space-y-4 pb-6 border-b border-lavender text-xs">
            <div className="flex items-start gap-4 p-3 bg-white rounded-2xl border border-lavender shadow-sm">
              <Award className="w-5 h-5 text-powder-deep flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-bold text-slate-900">{host.name} is an experienced Superhost</p>
                <p className="text-slate-500 mt-0.5">Superhosts are highly rated, committed to providing great stays for guests.</p>
              </div>
            </div>
            <div className="flex items-start gap-4 p-3 bg-white rounded-2xl border border-lavender shadow-sm">
              <MapPin className="w-5 h-5 text-peach-dark flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-bold text-slate-900">Exceptional Location</p>
                <p className="text-slate-500 mt-0.5">95% of recent guests gave the location a 5-star rating.</p>
              </div>
            </div>
            <div className="flex items-start gap-4 p-3 bg-white rounded-2xl border border-lavender shadow-sm">
              <ShieldCheck className="w-5 h-5 text-powder flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-bold text-slate-900">Free Cancellation Available</p>
                <p className="text-slate-500 mt-0.5">Cancel up to 48 hours before check-in for a full refund.</p>
              </div>
            </div>
          </div>

          {/* About This Space */}
          <div className="pb-6 border-b border-lavender">
            <h3 className="text-lg font-bold text-slate-900 mb-3">About this space</h3>
            <p className="text-sm text-slate-700 leading-relaxed whitespace-pre-line font-normal">
              {showFullDesc || listing.description.length < 350
                ? listing.description
                : `${listing.description.slice(0, 350)}...`}
            </p>
            {listing.description.length >= 350 && (
              <button
                onClick={() => setShowFullDesc(!showFullDesc)}
                className="mt-3 text-xs font-bold text-powder-deep underline hover:text-powder-dark transition-colors"
              >
                {showFullDesc ? 'Show less' : 'Show more >'}
              </button>
            )}
          </div>

          {/* Amenities Grid */}
          <div className="pb-6 border-b border-lavender">
            <h3 className="text-lg font-bold text-slate-900 mb-4">What this place offers</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {listing.amenities && listing.amenities.length > 0 ? (
                listing.amenities.map((item) => {
                  const meta = AMENITY_ICONS[item] || {
                    label: item.replace(/([A-Z])/g, ' $1').toLowerCase(),
                    icon: Check,
                  };
                  const Icon = meta.icon;
                  return (
                    <div
                      key={item}
                      className="flex items-center gap-3 text-sm text-slate-700 p-3 bg-white rounded-2xl border border-lavender"
                    >
                      <Icon className="w-5 h-5 text-powder-deep flex-shrink-0" />
                      <span className="capitalize font-medium">{meta.label}</span>
                    </div>
                  );
                })
              ) : (
                <p className="text-xs text-slate-500 font-medium">Standard travel amenities included.</p>
              )}
            </div>
          </div>

          {/* Where you'll be (Map Component) */}
          <div className="pb-6">
            <h3 className="text-lg font-bold text-slate-900 mb-1">Where you'll be</h3>
            <p className="text-xs text-slate-500 mb-4 font-medium">
              {listing.location?.address ? `${listing.location.address}, ` : ''}{listing.location?.city}, {listing.location?.country}
            </p>
            <LeafletMapView singleListing={listing} height="360px" />
          </div>

          {/* Reviews Section */}
          <ReviewList
            reviews={reviewsData.reviews}
            rating={listing.rating}
            reviewCount={listing.reviewCount}
            categoryAverages={reviewsData.categoryAverages}
            onDeleteReview={handleDeleteReview}
            onOpenAddReview={handleOpenAddReview}
          />
        </div>

        {/* Right Sticky Booking Widget */}
        <div className="lg:col-span-1">
          <BookingWidget
            listing={listing}
            onBookingSuccess={() => {
              fetchListingAndReviews();
            }}
          />
        </div>
      </div>

      {/* Add Review Modal */}
      <AddReviewModal
        isOpen={isReviewModalOpen}
        onClose={() => setIsReviewModalOpen(false)}
        listingId={listing._id}
        onReviewAdded={() => {
          fetchListingAndReviews();
        }}
      />
    </div>
  );
};

export default ListingDetail;
