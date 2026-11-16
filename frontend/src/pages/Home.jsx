import React, { useState, useEffect, useCallback } from 'react';
import CategoryBar from '../components/listings/CategoryBar';
import ListingGrid from '../components/listings/ListingGrid';
import { listingService } from '../services/api';
import { Map, List, ToggleLeft, ToggleRight } from 'lucide-react';

const Home = ({
  searchParams,
  onOpenSearch,
  onOpenFilters,
  filters,
  onResetFilters,
  activeFilterCount,
  renderMapView,
}) => {
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [showTotalWithTaxes, setShowTotalWithTaxes] = useState(false);
  const [viewMode, setViewMode] = useState('list'); // 'list' | 'map'

  const fetchListings = useCallback(async () => {
    setLoading(true);
    try {
      const params = {};

      if (selectedCategory && selectedCategory !== 'All') {
        params.category = selectedCategory;
      }
      if (searchParams?.destination) {
        params.search = searchParams.destination;
      }
      if (searchParams?.guests) {
        params.guests = searchParams.guests;
      }
      if (filters?.minPrice) {
        params.minPrice = filters.minPrice;
      }
      if (filters?.maxPrice) {
        params.maxPrice = filters.maxPrice;
      }
      if (filters?.propertyType) {
        params.propertyType = filters.propertyType;
      }
      if (filters?.amenities && filters.amenities.length > 0) {
        params.amenities = filters.amenities.join(',');
      }

      const res = await listingService.getAll(params);
      if (res.success) {
        setListings(res.listings || []);
      }
    } catch (err) {
      console.error('Failed to fetch listings:', err);
      setListings([]);
    } finally {
      setLoading(false);
    }
  }, [selectedCategory, searchParams, filters]);

  useEffect(() => {
    fetchListings();
  }, [fetchListings]);

  return (
    <div className="min-h-screen pb-20">
      {/* Category Filter Bar */}
      <CategoryBar
        selectedCategory={selectedCategory}
        onSelectCategory={setSelectedCategory}
        onOpenFilters={onOpenFilters}
        activeFilterCount={activeFilterCount}
      />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        {/* Total Price Toggle Bar */}
        <div className="mb-6 p-4 rounded-2xl border border-neutral-200 bg-neutral-50/70 flex items-center justify-between">
          <div className="flex flex-col sm:flex-row sm:items-center sm:gap-4">
            <span className="text-sm font-bold text-neutral-900">Display total price</span>
            <span className="text-xs text-neutral-500">Includes all fees, before taxes</span>
          </div>
          <button
            onClick={() => setShowTotalWithTaxes(!showTotalWithTaxes)}
            className="text-neutral-900 hover:text-black transition-colors"
          >
            {showTotalWithTaxes ? (
              <ToggleRight className="w-9 h-9 text-neutral-900 fill-neutral-900" />
            ) : (
              <ToggleLeft className="w-9 h-9 text-neutral-400" />
            )}
          </button>
        </div>

        {/* View Toggle (List vs Map) */}
        {viewMode === 'list' ? (
          <ListingGrid
            listings={listings}
            loading={loading}
            showTotalWithTaxes={showTotalWithTaxes}
            onResetFilters={() => {
              setSelectedCategory('All');
              onResetFilters();
            }}
          />
        ) : (
          renderMapView && renderMapView(listings)
        )}
      </main>

      {/* Floating Map / List Toggle Button */}
      <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-30">
        <button
          onClick={() => setViewMode(viewMode === 'list' ? 'map' : 'list')}
          className="flex items-center gap-2 py-3 px-6 rounded-full bg-neutral-900 text-white font-semibold text-xs shadow-xl hover:scale-105 active:scale-95 transition-all hover:bg-black"
        >
          {viewMode === 'list' ? (
            <>
              <span>Show map</span>
              <Map className="w-4 h-4" />
            </>
          ) : (
            <>
              <span>Show list</span>
              <List className="w-4 h-4" />
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default Home;
