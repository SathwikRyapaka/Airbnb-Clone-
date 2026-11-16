import React, { useState, useEffect, useCallback } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import {
  Plus,
  Home,
  Calendar,
  DollarSign,
  Star,
  Edit,
  Trash2,
  ExternalLink,
  Users,
  Building2,
  ShieldAlert,
} from 'lucide-react';
import { listingService, bookingService } from '../services/api';
import { useAuth } from '../context/AuthContext';
import ListingFormModal from '../components/host/ListingFormModal';

const HostDashboard = () => {
  const { user, isAuthenticated, openAuthModal, showToast } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();

  const [activeTab, setActiveTab] = useState('listings'); // 'listings' | 'reservations'
  const [listings, setListings] = useState([]);
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modal states
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingListing, setEditingListing] = useState(null);

  const fetchHostData = useCallback(async () => {
    if (!isAuthenticated) return;
    setLoading(true);
    try {
      const [listRes, bookRes] = await Promise.all([
        listingService.getHostListings(),
        bookingService.getHostReservations(),
      ]);

      if (listRes.success) setListings(listRes.listings || []);
      if (bookRes.success) setReservations(bookRes.reservations || []);
    } catch (err) {
      console.error('Failed to load host dashboard data:', err);
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated]);

  useEffect(() => {
    if (isAuthenticated) {
      fetchHostData();
    }
  }, [isAuthenticated, fetchHostData]);

  // Open create modal if URL has ?action=new
  useEffect(() => {
    if (searchParams.get('action') === 'new') {
      setEditingListing(null);
      setIsFormOpen(true);
      searchParams.delete('action');
      setSearchParams(searchParams, { replace: true });
    }
  }, [searchParams, setSearchParams]);

  const handleDeleteListing = async (listingId) => {
    if (!window.confirm('Are you sure you want to delete this listing? All reservations and reviews associated will be permanently removed.')) {
      return;
    }

    try {
      const res = await listingService.delete(listingId);
      if (res.success) {
        showToast('Listing successfully deleted.');
        fetchHostData();
      }
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to delete listing.', 'error');
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="max-w-md mx-auto py-24 text-center px-4">
        <Building2 className="w-16 h-16 text-rose-500 mx-auto mb-4" />
        <h2 className="text-xl font-bold text-neutral-900 mb-2">Host Dashboard</h2>
        <p className="text-sm text-neutral-500 mb-6">
          Please log in with a host account to manage properties, inspect reservations, and track your hosting earnings.
        </p>
        <button
          onClick={() => openAuthModal('login')}
          className="w-full py-3 bg-gradient-to-r from-rose-500 to-rose-600 text-white font-bold rounded-xl text-xs shadow-md"
        >
          Log In as Host
        </button>
      </div>
    );
  }

  // Calculate Host Metrics
  const totalEarnings = reservations
    .filter((r) => r.status === 'confirmed')
    .reduce((acc, r) => acc + (r.basePrice || 0), 0);

  const avgRating =
    listings.length > 0
      ? (
          listings.reduce((acc, l) => acc + (l.rating || 0), 0) / listings.length
        ).toFixed(2)
      : '0.0';

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 animate-fadeIn min-h-[80vh]">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-extrabold text-neutral-900 tracking-tight">
            Host Dashboard
          </h1>
          <p className="text-sm text-neutral-500 mt-1">
            Welcome back, {user?.name}. Manage your properties and guest reservations.
          </p>
        </div>

        <button
          onClick={() => {
            setEditingListing(null);
            setIsFormOpen(true);
          }}
          className="flex items-center gap-2 py-3 px-5 rounded-2xl bg-gradient-to-r from-rose-500 to-rose-600 hover:from-rose-600 hover:to-rose-700 text-white font-bold text-xs shadow-md hover:shadow-lg transition-all"
        >
          <Plus className="w-4 h-4" /> Create New Listing
        </button>
      </div>

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
        <div className="p-5 bg-white border border-neutral-200 rounded-3xl shadow-sm">
          <div className="flex items-center gap-2 text-neutral-400 mb-2">
            <Home className="w-4 h-4" />
            <span className="text-xs font-semibold uppercase tracking-wider">Active Listings</span>
          </div>
          <p className="text-2xl font-extrabold text-neutral-900">{listings.length}</p>
        </div>

        <div className="p-5 bg-white border border-neutral-200 rounded-3xl shadow-sm">
          <div className="flex items-center gap-2 text-neutral-400 mb-2">
            <Calendar className="w-4 h-4" />
            <span className="text-xs font-semibold uppercase tracking-wider">Reservations</span>
          </div>
          <p className="text-2xl font-extrabold text-neutral-900">{reservations.length}</p>
        </div>

        <div className="p-5 bg-white border border-neutral-200 rounded-3xl shadow-sm">
          <div className="flex items-center gap-2 text-neutral-400 mb-2">
            <DollarSign className="w-4 h-4" />
            <span className="text-xs font-semibold uppercase tracking-wider">Host Earnings</span>
          </div>
          <p className="text-2xl font-extrabold text-neutral-900">${totalEarnings}</p>
        </div>

        <div className="p-5 bg-white border border-neutral-200 rounded-3xl shadow-sm">
          <div className="flex items-center gap-2 text-neutral-400 mb-2">
            <Star className="w-4 h-4" />
            <span className="text-xs font-semibold uppercase tracking-wider">Average Rating</span>
          </div>
          <p className="text-2xl font-extrabold text-neutral-900">★ {avgRating}</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-6 border-b border-neutral-200 mb-6 text-sm font-bold">
        <button
          onClick={() => setActiveTab('listings')}
          className={`pb-3 transition-colors ${
            activeTab === 'listings'
              ? 'border-b-2 border-neutral-900 text-neutral-900'
              : 'text-neutral-400 hover:text-neutral-700'
          }`}
        >
          My Properties ({listings.length})
        </button>
        <button
          onClick={() => setActiveTab('reservations')}
          className={`pb-3 transition-colors ${
            activeTab === 'reservations'
              ? 'border-b-2 border-neutral-900 text-neutral-900'
              : 'text-neutral-400 hover:text-neutral-700'
          }`}
        >
          Guest Bookings ({reservations.length})
        </button>
      </div>

      {/* Tab 1: Listings */}
      {activeTab === 'listings' && (
        <div>
          {listings.length === 0 ? (
            <div className="py-16 text-center border border-dashed border-neutral-300 rounded-3xl p-8">
              <Home className="w-12 h-12 text-neutral-300 mx-auto mb-3" />
              <h3 className="text-base font-bold text-neutral-800">No properties listed yet</h3>
              <p className="text-xs text-neutral-500 mt-1 mb-5">
                Start sharing your space with millions of travelers worldwide.
              </p>
              <button
                onClick={() => {
                  setEditingListing(null);
                  setIsFormOpen(true);
                }}
                className="py-2.5 px-5 bg-neutral-900 text-white rounded-xl text-xs font-bold hover:bg-neutral-800 transition-colors"
              >
                Create Your First Listing
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {listings.map((l) => (
                <div
                  key={l._id}
                  className="bg-white border border-neutral-200 rounded-3xl overflow-hidden shadow-sm hover:shadow-md transition-shadow flex flex-col"
                >
                  <div className="relative aspect-[16/10] w-full bg-neutral-100 overflow-hidden">
                    <img
                      src={l.images?.[0]?.url || 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&w=600&q=80'}
                      alt={l.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm px-2.5 py-1 rounded-full text-[11px] font-bold text-neutral-900">
                      ${l.pricePerNight} / night
                    </div>
                  </div>

                  <div className="p-5 flex-1 flex flex-col justify-between">
                    <div>
                      <h3 className="font-bold text-sm text-neutral-900 line-clamp-1">{l.title}</h3>
                      <p className="text-xs text-neutral-500 mt-1">
                        {l.location?.city}, {l.location?.country} · {l.category}
                      </p>
                      <div className="mt-2 flex items-center gap-1 text-xs font-semibold text-neutral-700">
                        <Star className="w-3.5 h-3.5 fill-neutral-900 text-neutral-900" />
                        <span>{l.rating > 0 ? l.rating.toFixed(2) : 'New'}</span>
                        <span className="text-neutral-400">·</span>
                        <span>{l.reviewCount} reviews</span>
                      </div>
                    </div>

                    <div className="mt-5 pt-4 border-t border-neutral-100 flex items-center justify-between">
                      <Link
                        to={`/listing/${l._id}`}
                        className="text-xs font-semibold text-neutral-700 hover:text-black flex items-center gap-1 underline"
                      >
                        Preview <ExternalLink className="w-3 h-3" />
                      </Link>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => {
                            setEditingListing(l);
                            setIsFormOpen(true);
                          }}
                          className="p-2 rounded-xl text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100 transition-colors"
                          title="Edit Listing"
                        >
                          <Edit className="w-4 h-4" />
                        </button>

                        <button
                          onClick={() => handleDeleteListing(l._id)}
                          className="p-2 rounded-xl text-neutral-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                          title="Delete Listing"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Tab 2: Reservations */}
      {activeTab === 'reservations' && (
        <div>
          {reservations.length === 0 ? (
            <div className="py-16 text-center border border-dashed border-neutral-300 rounded-3xl p-8">
              <Calendar className="w-12 h-12 text-neutral-300 mx-auto mb-3" />
              <h3 className="text-base font-bold text-neutral-800">No reservations booked yet</h3>
              <p className="text-xs text-neutral-500 mt-1">
                Upcoming guest reservations for your properties will be shown right here.
              </p>
            </div>
          ) : (
            <div className="bg-white border border-neutral-200 rounded-3xl overflow-hidden shadow-sm divide-y divide-neutral-100">
              {reservations.map((res) => {
                const guest = res.user || { name: 'Traveler', email: 'guest@airbnb.com' };
                const listing = res.listing || { title: 'Listing' };

                return (
                  <div key={res._id} className="p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                      <img
                        src={guest.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=100&q=80'}
                        alt={guest.name}
                        className="w-12 h-12 rounded-full object-cover border border-neutral-200"
                      />
                      <div>
                        <h4 className="font-bold text-sm text-neutral-900">{guest.name}</h4>
                        <p className="text-xs text-neutral-500">{guest.email}</p>
                        <p className="text-xs text-rose-600 font-medium mt-0.5">{listing.title}</p>
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-6 text-xs text-neutral-700">
                      <div>
                        <span className="block text-[10px] text-neutral-400 uppercase font-bold">Check-in</span>
                        <span className="font-semibold">{new Date(res.checkIn).toLocaleDateString()}</span>
                      </div>

                      <div>
                        <span className="block text-[10px] text-neutral-400 uppercase font-bold">Check-out</span>
                        <span className="font-semibold">{new Date(res.checkOut).toLocaleDateString()}</span>
                      </div>

                      <div>
                        <span className="block text-[10px] text-neutral-400 uppercase font-bold">Nights</span>
                        <span className="font-semibold">{res.nights}</span>
                      </div>

                      <div>
                        <span className="block text-[10px] text-neutral-400 uppercase font-bold">Payout</span>
                        <span className="font-bold text-neutral-900">${res.basePrice}</span>
                      </div>

                      <div>
                        <span
                          className={`text-[10px] font-bold px-2.5 py-1 rounded-full ${
                            res.status === 'confirmed'
                              ? 'bg-emerald-50 text-emerald-700'
                              : 'bg-red-50 text-red-600'
                          }`}
                        >
                          {res.status.toUpperCase()}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* Listing Form Modal */}
      <ListingFormModal
        isOpen={isFormOpen}
        onClose={() => {
          setIsFormOpen(false);
          setEditingListing(null);
        }}
        editingListing={editingListing}
        onSaved={fetchHostData}
      />
    </div>
  );
};

export default HostDashboard;
