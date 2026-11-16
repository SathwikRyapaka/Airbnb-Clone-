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
        className={`flex items-center gap-2.5 px-4 py-3 rounded-2xl shadow-xl text-xs font-semibold text-white border ${
          isSuccess
            ? 'bg-neutral-900 border-neutral-800'
            : isError
            ? 'bg-red-600 border-red-500'
            : 'bg-neutral-800 border-neutral-700'
        }`}
      >
        {isSuccess ? (
          <CheckCircle className="w-4 h-4 text-emerald-400" />
        ) : isError ? (
          <AlertCircle className="w-4 h-4 text-red-200" />
        ) : (
          <Info className="w-4 h-4 text-blue-300" />
        )}
        <span>{toast.message}</span>
      </div>
    </div>
  );
};

const NotFound = () => (
  <div className="max-w-md mx-auto py-24 text-center px-4">
    <h1 className="text-6xl font-extrabold text-neutral-900 mb-2">404</h1>
    <h2 className="text-xl font-bold text-neutral-700 mb-2">Page not found</h2>
    <p className="text-xs text-neutral-500 mb-6">
      We can't seem to find the page you're looking for.
    </p>
    <Link
      to="/"
      className="inline-block py-2.5 px-5 bg-neutral-900 text-white rounded-xl text-xs font-bold hover:bg-neutral-800"
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
    <div className="min-h-screen flex flex-col font-sans bg-white selection:bg-rose-100 selection:text-rose-600">
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
