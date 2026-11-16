import React, { useState, useEffect, useCallback } from 'react';
import CategoryBar from '../components/listings/CategoryBar';
import ListingGrid from '../components/listings/ListingGrid';
import { listingService } from '../services/api';
import { Map, List, ToggleLeft, ToggleRight, Sparkles, Compass, MapPin } from 'lucide-react';

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
    <div className="min-h-screen pb-24 bg-[#F9F9FD]">
      {/* Category Filter Bar */}
      <CategoryBar
        selectedCategory={selectedCategory}
        onSelectCategory={setSelectedCategory}
        onOpenFilters={onOpenFilters}
        activeFilterCount={activeFilterCount}
      />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        {/* Curated Hero Banner in Powder Blue, Soft Lavender White, and Sunset Peach */}
        <div className="relative mb-8 rounded-3xl overflow-hidden bg-gradient-to-r from-lavender via-white to-peach-light border border-lavender shadow-soft p-6 sm:p-8">
          <div className="relative z-10 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/80 border border-powder/30 text-powder-deep text-xs font-bold mb-3 shadow-sm">
              <Sparkles className="w-3.5 h-3.5 text-peach" />
              <span>Handpicked Destinations for Every Season</span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight leading-snug">
              Find serene stays crafted for <span className="bg-gradient-to-r from-powder-dark to-peach-dark bg-clip-text text-transparent">peaceful getaways</span>
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 mt-2 font-medium">
              Explore cliffside cave villas, pine forest chalets, and private oceanfront retreats across the globe.
            </p>

            <div className="mt-4 flex flex-wrap gap-2">
              <button
                onClick={() => setSelectedCategory('Beachfront')}
                className="px-3 py-1.5 rounded-full bg-white text-xs font-semibold text-slate-700 border border-lavender hover:border-powder hover:text-powder-dark transition-all shadow-sm"
              >
                🌊 Beachfront
              </button>
              <button
                onClick={() => setSelectedCategory('Cabins')}
                className="px-3 py-1.5 rounded-full bg-white text-xs font-semibold text-slate-700 border border-lavender hover:border-powder hover:text-powder-dark transition-all shadow-sm"
              >
                🌲 Cozy Cabins
              </button>
              <button
                onClick={() => setSelectedCategory('Islands')}
                className="px-3 py-1.5 rounded-full bg-white text-xs font-semibold text-slate-700 border border-lavender hover:border-powder hover:text-powder-dark transition-all shadow-sm"
              >
                🏝️ Islands
              </button>
              <button
                onClick={() => setSelectedCategory('Mansions')}
                className="px-3 py-1.5 rounded-full bg-white text-xs font-semibold text-slate-700 border border-lavender hover:border-powder hover:text-powder-dark transition-all shadow-sm"
              >
                🏰 Villas & Estates
              </button>
            </div>
          </div>

          {/* Decorative soft glow background spheres */}
          <div className="absolute right-0 top-0 -mr-16 -mt-16 w-80 h-80 rounded-full bg-powder/20 blur-3xl pointer-events-none" />
          <div className="absolute right-32 bottom-0 -mb-16 w-64 h-64 rounded-full bg-peach/25 blur-2xl pointer-events-none" />
        </div>

        {/* Total Price Toggle Bar */}
        <div className="mb-6 p-4 rounded-3xl border border-lavender bg-white shadow-soft flex items-center justify-between">
          <div className="flex flex-col sm:flex-row sm:items-center sm:gap-4">
            <span className="text-sm font-bold text-slate-800">Display total price</span>
            <span className="text-xs text-slate-500 font-medium">Includes all fees, before taxes</span>
          </div>
          <button
            onClick={() => setShowTotalWithTaxes(!showTotalWithTaxes)}
            className="transition-transform active:scale-95"
          >
            {showTotalWithTaxes ? (
              <ToggleRight className="w-10 h-10 text-powder fill-powder-dark" />
            ) : (
              <ToggleLeft className="w-10 h-10 text-slate-300" />
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

      {/* Floating Map / List Toggle Button with Powder Blue & Sunset Peach */}
      <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-30">
        <button
          onClick={() => setViewMode(viewMode === 'list' ? 'map' : 'list')}
          className="flex items-center gap-2 py-3.5 px-6 rounded-full bg-gradient-to-r from-powder to-peach text-white font-extrabold text-xs shadow-float hover:scale-105 active:scale-95 transition-all"
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
