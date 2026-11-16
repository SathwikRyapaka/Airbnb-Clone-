import React, { useState } from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import Home from './pages/Home';
import ListingDetail from './pages/ListingDetail';
import MyTrips from './pages/MyTrips';
import HostDashboard from './pages/HostDashboard';
import AuthModal from './components/auth/AuthModal';
import SearchModal from './components/modals/SearchModal';
import FilterModal from './components/modals/FilterModal';
import LeafletMapView from './components/map/LeafletMapView';
import { AuthProvider, useAuth } from './context/AuthContext';
import { AlertCircle, CheckCircle, Info, X } from 'lucide-react';

const ToastNotification = () => {
  const { toast } = useAuth();
  if (!toast) return null;

  const isSuccess = toast.type === 'success';
  const isError = toast.type === 'error';

  return (
    <div className="fixed top-24 right-6 z-50 animate-bounce duration-200">
      <div
        className={`flex items-center gap-2.5 px-4 py-3 rounded-2xl shadow-float text-xs font-bold text-white border ${
          isSuccess
            ? 'bg-gradient-to-r from-powder to-peach border-white/40 text-slate-900 shadow-soft'
            : isError
            ? 'bg-red-600 border-red-500 text-white'
            : 'bg-slate-800 border-slate-700 text-white'
        }`}
      >
        {isSuccess ? (
          <CheckCircle className="w-4 h-4 text-slate-900" />
        ) : isError ? (
          <AlertCircle className="w-4 h-4 text-red-200" />
        ) : (
          <Info className="w-4 h-4 text-blue-200" />
        )}
        <span>{toast.message}</span>
      </div>
    </div>
  );
};

const NotFound = () => (
  <div className="max-w-md mx-auto py-24 text-center px-4">
    <h1 className="text-6xl font-extrabold text-powder-deep mb-2">404</h1>
    <h2 className="text-xl font-bold text-slate-800 mb-2">Page not found</h2>
    <p className="text-xs text-slate-500 mb-6 font-medium">
      We can't seem to find the page you're looking for.
    </p>
    <Link
      to="/"
      className="inline-block py-2.5 px-6 bg-gradient-to-r from-powder to-peach text-white rounded-full text-xs font-extrabold shadow-soft"
    >
      Return Home
    </Link>
  </div>
);

function AppContent() {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);
  const [searchParams, setSearchParams] = useState({});
  const [filters, setFilters] = useState({
    minPrice: '',
    maxPrice: '',
    propertyType: '',
    amenities: [],
  });

  const activeFilterCount =
    (filters.minPrice ? 1 : 0) +
    (filters.maxPrice ? 1 : 0) +
    (filters.propertyType ? 1 : 0) +
    (filters.amenities.length > 0 ? filters.amenities.length : 0);

  const handleResetFilters = () => {
    setSearchParams({});
    setFilters({
      minPrice: '',
      maxPrice: '',
      propertyType: '',
      amenities: [],
    });
  };

  return (
    <div className="min-h-screen flex flex-col font-sans bg-[#F9F9FD] selection:bg-peach/30 selection:text-slate-900">
      {/* Global Navbar */}
      <Navbar
        onOpenSearch={() => setIsSearchOpen(true)}
        onOpenFilters={() => setIsFiltersOpen(true)}
      />

      {/* Main Body View */}
      <main className="flex-1">
        <Routes>
          <Route
            path="/"
            element={
              <Home
                searchParams={searchParams}
                onOpenSearch={() => setIsSearchOpen(true)}
                onOpenFilters={() => setIsFiltersOpen(true)}
                filters={filters}
                onResetFilters={handleResetFilters}
                activeFilterCount={activeFilterCount}
                renderMapView={(listings) => (
                  <div className="mt-4 mb-12">
                    <LeafletMapView listings={listings} height="600px" />
                  </div>
                )}
              />
            }
          />
          <Route path="/listing/:id" element={<ListingDetail />} />
          <Route path="/my-trips" element={<MyTrips />} />
          <Route path="/host/dashboard" element={<HostDashboard />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>

      {/* Global Modals */}
      <AuthModal />
      <SearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        currentSearchParams={searchParams}
        onSearch={(params) => setSearchParams(params)}
      />
      <FilterModal
        isOpen={isFiltersOpen}
        onClose={() => setIsFiltersOpen(false)}
        filters={filters}
        onApplyFilters={(newFilters) => setFilters(newFilters)}
        onResetFilters={handleResetFilters}
      />

      <ToastNotification />

      {/* Global Footer */}
      <Footer />
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;
