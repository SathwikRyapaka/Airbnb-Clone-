import React from 'react';
import ListingCard from './ListingCard';
import { Home, RefreshCw, Compass } from 'lucide-react';

const ListingSkeleton = () => (
  <div className="flex flex-col gap-3 p-3 bg-white rounded-3xl border border-lavender shadow-soft animate-pulse">
    <div className="aspect-[20/19] w-full rounded-2xl bg-lavender" />
    <div className="h-4 bg-lavender rounded w-3/4 mt-1" />
    <div className="h-3 bg-lavender/60 rounded w-1/2" />
    <div className="h-3 bg-lavender/40 rounded w-1/3" />
    <div className="h-4 bg-lavender rounded w-1/4 mt-2" />
  </div>
);

const ListingGrid = ({ listings, loading, showTotalWithTaxes, onResetFilters }) => {
  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {Array.from({ length: 8 }).map((_, i) => (
          <ListingSkeleton key={i} />
        ))}
      </div>
    );
  }

  if (!listings || listings.length === 0) {
    return (
      <div className="py-20 text-center flex flex-col items-center justify-center max-w-md mx-auto p-8 bg-white rounded-3xl border border-lavender shadow-soft">
        <div className="w-16 h-16 bg-lavender/50 rounded-2xl flex items-center justify-center mb-4 text-powder-dark">
          <Compass className="w-8 h-8" />
        </div>
        <h3 className="text-lg font-bold text-slate-900 mb-1">No exact matches found</h3>
        <p className="text-xs text-slate-500 mb-6 font-medium leading-relaxed">
          Try expanding your price range, clearing some amenities, or exploring another destination.
        </p>
        <button
          onClick={onResetFilters}
          className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-powder to-peach text-white rounded-full text-xs font-bold hover:opacity-90 transition-opacity shadow-soft"
        >
          <RefreshCw className="w-3.5 h-3.5" /> Clear All Filters
        </button>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {listings.map((listing) => (
        <ListingCard
          key={listing._id}
          listing={listing}
          showTotalWithTaxes={showTotalWithTaxes}
        />
      ))}
    </div>
  );
};

export default ListingGrid;
