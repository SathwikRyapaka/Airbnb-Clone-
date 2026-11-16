import React, { useState } from 'react';
import { Grid, X, ChevronLeft, ChevronRight } from 'lucide-react';

const ImageGallery = ({ images, title }) => {
  const [showAllModal, setShowAllModal] = useState(false);
  const [activePhotoIndex, setActivePhotoIndex] = useState(0);

  const displayImages = images && images.length > 0
    ? images
    : [{ url: 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&w=1200&q=80', caption: 'Exterior' }];

  return (
    <div>
      {/* Grid Showcase */}
      <div className="relative grid grid-cols-1 md:grid-cols-4 gap-2 rounded-2xl overflow-hidden h-[340px] md:h-[460px]">
        {/* Main large image */}
        <div
          onClick={() => {
            setActivePhotoIndex(0);
            setShowAllModal(true);
          }}
          className="md:col-span-2 h-full cursor-pointer overflow-hidden bg-neutral-100"
        >
          <img
            src={displayImages[0]?.url}
            alt={title}
            className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
          />
        </div>

        {/* 2x2 right images */}
        <div className="hidden md:grid md:col-span-2 grid-cols-2 gap-2 h-full">
          {displayImages.slice(1, 5).map((img, index) => (
            <div
              key={index}
              onClick={() => {
                setActivePhotoIndex(index + 1);
                setShowAllModal(true);
              }}
              className="h-[225px] cursor-pointer overflow-hidden bg-neutral-100"
            >
              <img
                src={img.url}
                alt={`${title} view ${index + 2}`}
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
              />
            </div>
          ))}
          {/* Fill empty cells if fewer than 5 images */}
          {displayImages.length < 5 &&
            Array.from({ length: 5 - displayImages.length }).map((_, i) => (
              <div
                key={`empty-${i}`}
                className="h-[225px] bg-neutral-100 flex items-center justify-center text-neutral-300 text-xs"
              >
                Airbnb Stay
              </div>
            ))}
        </div>

        {/* Show all photos button */}
        <button
          onClick={() => setShowAllModal(true)}
          className="absolute bottom-4 right-4 flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-white border border-neutral-900 text-xs font-semibold text-neutral-900 shadow-md hover:bg-neutral-50 transition-colors"
        >
          <Grid className="w-3.5 h-3.5" />
          <span>Show all photos</span>
        </button>
      </div>

      {/* Fullscreen Photo Modal */}
      {showAllModal && (
        <div className="fixed inset-0 z-50 bg-black/95 flex flex-col animate-fadeIn">
          {/* Modal Header */}
          <div className="flex items-center justify-between p-4 text-white">
            <button
              onClick={() => setShowAllModal(false)}
              className="p-2 rounded-full hover:bg-white/10 text-white transition-colors flex items-center gap-2 text-sm font-semibold"
            >
              <X className="w-5 h-5" /> Close
            </button>
            <span className="text-sm font-medium">
              {activePhotoIndex + 1} / {displayImages.length}
            </span>
            <div className="w-16" />
          </div>

          {/* Large Image Preview with Carousel */}
          <div className="flex-1 flex items-center justify-center p-6 relative">
            {displayImages.length > 1 && (
              <button
                onClick={() =>
                  setActivePhotoIndex(
                    (prev) => (prev - 1 + displayImages.length) % displayImages.length
                  )
                }
                className="absolute left-6 p-3 rounded-full bg-white/20 hover:bg-white/30 text-white transition-colors"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>
            )}

            <img
              src={displayImages[activePhotoIndex]?.url}
              alt={displayImages[activePhotoIndex]?.caption || title}
              className="max-h-[80vh] max-w-4xl object-contain rounded-xl shadow-2xl"
            />

            {displayImages.length > 1 && (
              <button
                onClick={() =>
                  setActivePhotoIndex((prev) => (prev + 1) % displayImages.length)
                }
                className="absolute right-6 p-3 rounded-full bg-white/20 hover:bg-white/30 text-white transition-colors"
              >
                <ChevronRight className="w-6 h-6" />
              </button>
            )}
          </div>

          {displayImages[activePhotoIndex]?.caption && (
            <p className="text-center text-white/80 text-sm pb-6">
              {displayImages[activePhotoIndex]?.caption}
            </p>
          )}
        </div>
      )}
    </div>
  );
};

export default ImageGallery;
