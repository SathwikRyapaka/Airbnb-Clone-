import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Star, Heart, ChevronLeft, ChevronRight, Sparkles } from 'lucide-react';

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
      className="group cursor-pointer flex flex-col gap-3 p-3 bg-white rounded-3xl border border-lavender hover:border-powder/60 shadow-soft hover:shadow-card transition-all duration-300"
    >
      {/* Image Showcase Container */}
      <div className="relative aspect-[20/19] w-full overflow-hidden rounded-2xl bg-lavender/40">
        <img
          src={images[currentImageIndex]?.url}
          alt={listing.title}
          className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />

        {/* Favorite Heart Button with Warm Sunset Peach */}
        <button
          onClick={toggleFavorite}
          className="absolute top-3 right-3 p-2 rounded-full transition-transform active:scale-90 hover:scale-110 z-10 bg-white/70 backdrop-blur-md shadow-sm"
        >
          <Heart
            className={`w-5 h-5 stroke-[2.2] transition-colors ${
              isFavorite
                ? 'fill-peach stroke-peach-dark'
                : 'fill-transparent stroke-slate-700'
            }`}
          />
        </button>

        {/* Carousel Controls */}
        {images.length > 1 && (
          <>
            <button
              onClick={prevImage}
              className="absolute left-2.5 top-1/2 -translate-y-1/2 p-1.5 rounded-full bg-white/80 hover:bg-white text-slate-800 opacity-0 group-hover:opacity-100 transition-opacity shadow-md z-10"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={nextImage}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 p-1.5 rounded-full bg-white/80 hover:bg-white text-slate-800 opacity-0 group-hover:opacity-100 transition-opacity shadow-md z-10"
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
                      ? 'w-4 bg-white shadow-sm'
                      : 'w-1.5 bg-white/60'
                  }`}
                />
              ))}
            </div>
          </>
        )}

        {/* Guest Favorite Badge in Warm Sunset Peach & Soft Lavender White */}
        {listing.rating >= 4.9 && (
          <div className="absolute top-3 left-3 bg-white/95 backdrop-blur-sm px-2.5 py-1 rounded-full shadow-sm text-[11px] font-extrabold text-slate-800 flex items-center gap-1 border border-peach/30 z-10">
            <Sparkles className="w-3 h-3 text-peach-dark fill-peach" />
            <span>Guest favorite</span>
          </div>
        )}
      </div>

      {/* Listing Details */}
      <div className="flex flex-col gap-1 px-1 text-sm">
        <div className="flex items-center justify-between">
          <p className="font-bold text-slate-900 truncate">
            {listing.location?.city}, {listing.location?.country}
          </p>
          <div className="flex items-center gap-1 font-bold text-xs text-slate-800">
            <Star className="w-3.5 h-3.5 fill-peach text-peach-dark" />
            <span>{listing.rating > 0 ? listing.rating.toFixed(2) : 'New'}</span>
          </div>
        </div>

        <p className="text-slate-500 text-xs truncate font-medium">
          {listing.propertyType} · {listing.category}
        </p>

        <p className="text-slate-400 text-xs">
          {listing.guests} guests · {listing.bedrooms} bed{listing.bedrooms > 1 ? 's' : ''}
        </p>

        <div className="mt-1.5 pt-1.5 border-t border-lavender flex items-baseline justify-between">
          {showTotalWithTaxes ? (
            <div>
              <span className="font-extrabold text-slate-900 text-base">${totalPrice}</span>
              <span className="text-slate-500 text-xs"> total</span>
            </div>
          ) : (
            <div>
              <span className="font-extrabold text-slate-900 text-base">${listing.pricePerNight}</span>
              <span className="text-slate-500 text-xs"> / night</span>
            </div>
          )}

          <span className="text-[11px] font-bold text-powder-deep bg-powder/15 px-2 py-0.5 rounded-full">
            Available
          </span>
        </div>
      </div>
    </div>
  );
};

export default ListingCard;
