import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Star, Heart, ChevronLeft, ChevronRight } from 'lucide-react';

const ListingCard = ({ listing, showTotalWithTaxes = false }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isFavorite, setIsFavorite] = useState(false);
  const navigate = useNavigate();

  const images = listing.images && listing.images.length > 0
    ? listing.images
    : [{ url: 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&w=800&q=80' }];

  const nextImage = (e) => {
    e.stopPropagation();
    setCurrentImageIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = (e) => {
    e.stopPropagation();
    setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  const toggleFavorite = (e) => {
    e.stopPropagation();
    setIsFavorite(!isFavorite);
  };

  const totalPrice = Math.round(
    listing.pricePerNight * 5 + (listing.cleaningFee || 40) + listing.pricePerNight * 5 * (listing.serviceFeeRate || 0.12)
  );

  return (
    <div
      onClick={() => navigate(`/listing/${listing._id}`)}
      className="group cursor-pointer flex flex-col gap-2"
    >
      {/* Image Showcase Container */}
      <div className="relative aspect-[20/19] w-full overflow-hidden rounded-2xl bg-neutral-100">
        <img
          src={images[currentImageIndex]?.url}
          alt={listing.title}
          className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />

        {/* Favorite Heart Button */}
        <button
          onClick={toggleFavorite}
          className="absolute top-3 right-3 p-2 rounded-full transition-transform active:scale-90 hover:scale-110 z-10"
        >
          <Heart
            className={`w-6 h-6 stroke-[2] ${
              isFavorite
                ? 'fill-rose-500 stroke-rose-500'
                : 'fill-black/30 stroke-white'
            }`}
          />
        </button>

        {/* Carousel Controls */}
        {images.length > 1 && (
          <>
            <button
              onClick={prevImage}
              className="absolute left-2 top-1/2 -translate-y-1/2 p-1.5 rounded-full bg-white/90 hover:bg-white text-neutral-800 opacity-0 group-hover:opacity-100 transition-opacity shadow-md z-10"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={nextImage}
              className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 rounded-full bg-white/90 hover:bg-white text-neutral-800 opacity-0 group-hover:opacity-100 transition-opacity shadow-md z-10"
            >
              <ChevronRight className="w-4 h-4" />
            </button>

            {/* Dot indicators */}
            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex items-center gap-1.5 z-10">
              {images.map((_, idx) => (
                <div
                  key={idx}
                  className={`h-1.5 rounded-full transition-all ${
                    idx === currentImageIndex
                      ? 'w-4 bg-white'
                      : 'w-1.5 bg-white/60'
                  }`}
                />
              ))}
            </div>
          </>
        )}

        {/* Guest Favorite Badge */}
        {listing.rating >= 4.9 && (
          <div className="absolute top-3 left-3 bg-white/95 backdrop-blur-sm px-2.5 py-1 rounded-full shadow-sm text-[11px] font-bold text-neutral-900 z-10">
            Guest favorite
          </div>
        )}
      </div>

      {/* Listing Details */}
      <div className="flex flex-col gap-0.5 text-sm">
        <div className="flex items-center justify-between">
          <p className="font-semibold text-neutral-900 truncate">
            {listing.location?.city}, {listing.location?.country}
          </p>
          <div className="flex items-center gap-1 font-semibold text-neutral-800 text-xs">
            <Star className="w-3.5 h-3.5 fill-neutral-900 stroke-neutral-900" />
            <span>{listing.rating > 0 ? listing.rating.toFixed(2) : 'New'}</span>
          </div>
        </div>

        <p className="text-neutral-500 text-xs truncate">
          {listing.propertyType} · {listing.category}
        </p>

        <p className="text-neutral-500 text-xs">
          {listing.guests} guests · {listing.bedrooms} beds
        </p>

        <div className="mt-1 flex items-baseline gap-1">
          {showTotalWithTaxes ? (
            <div>
              <span className="font-bold text-neutral-900">${totalPrice}</span>
              <span className="text-neutral-500 text-xs"> total before taxes</span>
            </div>
          ) : (
            <div>
              <span className="font-bold text-neutral-900">${listing.pricePerNight}</span>
              <span className="text-neutral-500 text-xs"> night</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ListingCard;
