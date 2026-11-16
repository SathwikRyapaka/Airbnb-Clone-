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
  Sparkles,
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
        <div className="w-16 h-16 bg-lavender rounded-2xl flex items-center justify-center mx-auto mb-4 text-powder-deep">
          <Building2 className="w-8 h-8" />
        </div>
        <h2 className="text-xl font-extrabold text-slate-900 mb-2">Host Dashboard</h2>
        <p className="text-xs sm:text-sm text-slate-500 mb-6 font-medium leading-relaxed">
          Please log in with a host account to manage properties, inspect reservations, and track your hosting earnings.
        </p>
        <button
          onClick={() => openAuthModal('login')}
          className="w-full py-3 bg-gradient-to-r from-powder to-peach text-white font-extrabold rounded-full text-xs shadow-soft hover:opacity-90"
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
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-powder/15 text-powder-deep text-xs font-bold mb-2">
            <Sparkles className="w-3.5 h-3.5 text-peach-dark" />
            <span>Host Management Suite</span>
          </div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
            Host Dashboard
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1 font-medium">
            Welcome back, {user?.name}. Manage your properties and guest reservations.
          </p>
        </div>

        <button
          onClick={() => {
            setEditingListing(null);
            setIsFormOpen(true);
          }}
          className="flex items-center gap-2 py-3 px-6 rounded-full bg-gradient-to-r from-powder to-peach hover:opacity-95 text-white font-extrabold text-xs shadow-soft transition-all"
        >
          <Plus className="w-4 h-4" /> Create New Listing
        </button>
      </div>

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
        <div className="p-5 bg-white border border-lavender rounded-3xl shadow-soft">
          <div className="flex items-center gap-2 text-powder-deep mb-2">
            <div className="p-1.5 rounded-xl bg-powder/15 text-powder">
              <Home className="w-4 h-4" />
            </div>
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Active Listings</span>
          </div>
          <p className="text-2xl font-extrabold text-slate-900">{listings.length}</p>
        </div>

        <div className="p-5 bg-white border border-lavender rounded-3xl shadow-soft">
          <div className="flex items-center gap-2 text-peach-deep mb-2">
            <div className="p-1.5 rounded-xl bg-peach-light text-peach-dark">
              <Calendar className="w-4 h-4" />
            </div>
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Reservations</span>
          </div>
          <p className="text-2xl font-extrabold text-slate-900">{reservations.length}</p>
        </div>

        <div className="p-5 bg-white border border-lavender rounded-3xl shadow-soft">
          <div className="flex items-center gap-2 text-powder-deep mb-2">
            <div className="p-1.5 rounded-xl bg-powder/15 text-powder">
              <DollarSign className="w-4 h-4" />
            </div>
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Host Earnings</span>
          </div>
          <p className="text-2xl font-extrabold text-slate-900">${totalEarnings}</p>
        </div>

        <div className="p-5 bg-white border border-lavender rounded-3xl shadow-soft">
          <div className="flex items-center gap-2 text-peach-deep mb-2">
            <div className="p-1.5 rounded-xl bg-peach-light text-peach-dark">
              <Star className="w-4 h-4" />
            </div>
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Average Rating</span>
          </div>
          <p className="text-2xl font-extrabold text-slate-900">★ {avgRating}</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-6 border-b border-lavender mb-6 text-sm font-extrabold">
        <button
          onClick={() => setActiveTab('listings')}
          className={`pb-3 transition-colors ${
            activeTab === 'listings'
              ? 'border-b-2 border-powder text-powder-deep'
              : 'text-slate-400 hover:text-slate-700'
          }`}
        >
          My Properties ({listings.length})
        </button>
        <button
          onClick={() => setActiveTab('reservations')}
          className={`pb-3 transition-colors ${
            activeTab === 'reservations'
              ? 'border-b-2 border-powder text-powder-deep'
              : 'text-slate-400 hover:text-slate-700'
          }`}
        >
          Guest Bookings ({reservations.length})
        </button>
      </div>

      {/* Tab 1: Listings */}
      {activeTab === 'listings' && (
        <div>
          {listings.length === 0 ? (
            <div className="py-16 text-center border border-lavender bg-white rounded-3xl p-8 shadow-soft">
              <div className="w-14 h-14 bg-lavender/60 rounded-2xl flex items-center justify-center mx-auto mb-3 text-powder-dark">
                <Home className="w-7 h-7" />
              </div>
              <h3 className="text-base font-bold text-slate-900">No properties listed yet</h3>
              <p className="text-xs text-slate-500 mt-1 mb-5 font-medium">
                Start sharing your space with millions of travelers worldwide.
              </p>
              <button
                onClick={() => {
                  setEditingListing(null);
                  setIsFormOpen(true);
                }}
                className="py-2.5 px-5 bg-gradient-to-r from-powder to-peach text-white rounded-full text-xs font-extrabold shadow-soft hover:opacity-90"
              >
                Create Your First Listing
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {listings.map((l) => (
                <div
                  key={l._id}
                  className="bg-white border border-lavender rounded-3xl overflow-hidden shadow-soft hover:shadow-card transition-all flex flex-col p-3"
                >
                  <div className="relative aspect-[16/10] w-full bg-lavender rounded-2xl overflow-hidden">
                    <img
                      src={l.images?.[0]?.url || 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&w=600&q=80'}
                      alt={l.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm px-2.5 py-1 rounded-full text-[11px] font-extrabold text-slate-900 border border-lavender shadow-sm">
                      ${l.pricePerNight} / night
                    </div>
                  </div>

                  <div className="p-3 flex-1 flex flex-col justify-between">
                    <div>
                      <h3 className="font-bold text-sm text-slate-900 line-clamp-1">{l.title}</h3>
                      <p className="text-xs text-slate-500 mt-1 font-medium">
                        {l.location?.city}, {l.location?.country} · {l.category}
                      </p>
                      <div className="mt-2 flex items-center gap-1 text-xs font-bold text-slate-700">
                        <Star className="w-3.5 h-3.5 fill-peach text-peach-dark" />
                        <span>{l.rating > 0 ? l.rating.toFixed(2) : 'New'}</span>
                        <span className="text-slate-300">·</span>
                        <span className="text-slate-500">{l.reviewCount} reviews</span>
                      </div>
                    </div>

                    <div className="mt-5 pt-3 border-t border-lavender flex items-center justify-between">
                      <Link
                        to={`/listing/${l._id}`}
                        className="text-xs font-bold text-powder-deep hover:text-powder-dark flex items-center gap-1 underline"
                      >
                        Preview <ExternalLink className="w-3 h-3" />
                      </Link>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => {
                            setEditingListing(l);
                            setIsFormOpen(true);
                          }}
                          className="p-2 rounded-xl text-slate-600 hover:text-powder-dark hover:bg-lavender/50 transition-colors"
                          title="Edit Listing"
                        >
                          <Edit className="w-4 h-4" />
                        </button>

                        <button
                          onClick={() => handleDeleteListing(l._id)}
                          className="p-2 rounded-xl text-slate-400 hover:text-red-500 hover:bg-red-50 transition-colors"
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
            <div className="py-16 text-center border border-lavender bg-white rounded-3xl p-8 shadow-soft">
              <div className="w-14 h-14 bg-lavender/60 rounded-2xl flex items-center justify-center mx-auto mb-3 text-powder-dark">
                <Calendar className="w-7 h-7" />
              </div>
              <h3 className="text-base font-bold text-slate-900">No reservations booked yet</h3>
              <p className="text-xs text-slate-500 mt-1 font-medium">
                Upcoming guest reservations for your properties will be shown right here.
              </p>
            </div>
          ) : (
            <div className="bg-white border border-lavender rounded-3xl overflow-hidden shadow-soft divide-y divide-lavender">
              {reservations.map((res) => {
                const guest = res.user || { name: 'Traveler', email: 'guest@airbnb.com' };
                const listing = res.listing || { title: 'Listing' };

                return (
                  <div key={res._id} className="p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                      <img
                        src={guest.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=100&q=80'}
                        alt={guest.name}
                        className="w-12 h-12 rounded-full object-cover border-2 border-powder"
                      />
                      <div>
                        <h4 className="font-bold text-sm text-slate-900">{guest.name}</h4>
                        <p className="text-xs text-slate-400 font-medium">{guest.email}</p>
                        <p className="text-xs text-peach-deep font-bold mt-0.5">{listing.title}</p>
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-6 text-xs text-slate-700">
                      <div>
                        <span className="block text-[10px] text-slate-400 uppercase font-bold tracking-wider">Check-in</span>
                        <span className="font-bold">{new Date(res.checkIn).toLocaleDateString()}</span>
                      </div>

                      <div>
                        <span className="block text-[10px] text-slate-400 uppercase font-bold tracking-wider">Check-out</span>
                        <span className="font-bold">{new Date(res.checkOut).toLocaleDateString()}</span>
                      </div>

                      <div>
                        <span className="block text-[10px] text-slate-400 uppercase font-bold tracking-wider">Nights</span>
                        <span className="font-bold">{res.nights}</span>
                      </div>

                      <div>
                        <span className="block text-[10px] text-slate-400 uppercase font-bold tracking-wider">Payout</span>
                        <span className="font-extrabold text-powder-deep">${res.basePrice}</span>
                      </div>

                      <div>
                        <span
                          className={`text-[10px] font-extrabold px-3 py-1 rounded-full ${
                            res.status === 'confirmed'
                              ? 'bg-powder/20 text-powder-deep border border-powder/40'
                              : 'bg-red-50 text-red-600 border border-red-200'
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
