import React from 'react';
import ListingCard from './ListingCard';
import { Home, RefreshCw } from 'lucide-react';

const ListingSkeleton = () => (
  <div className="flex flex-col gap-2 animate-pulse">
    <div className="aspect-[20/19] w-full rounded-2xl bg-neutral-200" />
    <div className="h-4 bg-neutral-200 rounded w-3/4 mt-1" />
    <div className="h-3 bg-neutral-200 rounded w-1/2" />
    <div className="h-3 bg-neutral-200 rounded w-1/3" />
    <div className="h-4 bg-neutral-200 rounded w-1/4 mt-1" />
  </div>
);

const ListingGrid = ({ listings, loading, showTotalWithTaxes, onResetFilters }) => {
  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-10">
        {Array.from({ length: 8 }).map((_, i) => (
          <ListingSkeleton key={i} />
        ))}
      </div>
    );
  }

  if (!listings || listings.length === 0) {
    return (
      <div className="py-20 text-center flex flex-col items-center justify-center max-w-md mx-auto">
        <div className="w-16 h-16 bg-neutral-100 rounded-full flex items-center justify-center mb-4 text-neutral-400">
          <Home className="w-8 h-8" />
        </div>
        <h3 className="text-lg font-bold text-neutral-900 mb-1">No exact matches found</h3>
        <p className="text-sm text-neutral-500 mb-6">
          Try changing or clearing some of your filters or searching for another destination.
        </p>
        <button
          onClick={onResetFilters}
          className="flex items-center gap-2 px-5 py-2.5 bg-neutral-900 text-white rounded-xl text-xs font-semibold hover:bg-neutral-800 transition-colors"
        >
          <RefreshCw className="w-3.5 h-3.5" /> Clear All Filters
        </button>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-10">
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
