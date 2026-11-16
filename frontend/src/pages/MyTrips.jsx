import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Calendar, MapPin, AlertCircle, ArrowRight, ShieldCheck, Clock, Sparkles } from 'lucide-react';
import { bookingService } from '../services/api';
import { useAuth } from '../context/AuthContext';

const MyTrips = () => {
  const { user, showToast } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cancellingId, setCancellingId] = useState(null);

  const fetchTrips = async () => {
    setLoading(true);
    try {
      const res = await bookingService.getMyTrips();
      if (res.success) {
        setBookings(res.bookings || []);
      }
    } catch (err) {
      console.error('Error fetching guest trips:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTrips();
  }, []);

  const handleCancelBooking = async (bookingId) => {
    if (!window.confirm('Are you sure you want to cancel this reservation?')) return;
    setCancellingId(bookingId);
    try {
      const res = await bookingService.cancel(bookingId);
      if (res.success) {
        showToast('Reservation successfully cancelled and refund initiated.');
        fetchTrips();
      }
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to cancel booking', 'error');
    } finally {
      setCancellingId(null);
    }
  };

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-12 animate-pulse">
        <div className="h-8 bg-lavender rounded-2xl w-1/4 mb-8" />
        <div className="space-y-4">
          <div className="h-44 bg-white rounded-3xl border border-lavender" />
          <div className="h-44 bg-white rounded-3xl border border-lavender" />
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 animate-fadeIn min-h-[75vh]">
      <div className="mb-8">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-powder/15 text-powder-deep text-xs font-bold mb-2">
          <Sparkles className="w-3.5 h-3.5 text-peach-dark" />
          <span>Your Travel Log</span>
        </div>
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">My Trips</h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1 font-medium">
          Review your upcoming stays, past getaways, and reservation receipts.
        </p>
      </div>

      {bookings.length === 0 ? (
        <div className="py-16 text-center border border-lavender bg-white rounded-3xl max-w-xl mx-auto p-8 shadow-soft">
          <div className="w-16 h-16 bg-lavender/60 rounded-2xl flex items-center justify-center mx-auto mb-4 text-powder-dark">
            <Calendar className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-bold text-slate-900">No trips booked... yet!</h3>
          <p className="text-xs text-slate-500 mt-1 mb-6 font-medium leading-relaxed">
            Time to dust off your bags and start planning your next extraordinary escape.
          </p>
          <Link
            to="/"
            className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-powder to-peach text-white rounded-full text-xs font-extrabold shadow-soft hover:opacity-95 transition-opacity"
          >
            Start Searching <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      ) : (
        <div className="space-y-6">
          {bookings.map((booking) => {
            const listing = booking.listing || {};
            const isCancelled = booking.status === 'cancelled';
            const checkInDate = new Date(booking.checkIn).toLocaleDateString('en-US', {
              month: 'short',
              day: 'numeric',
              year: 'numeric',
            });
            const checkOutDate = new Date(booking.checkOut).toLocaleDateString('en-US', {
              month: 'short',
              day: 'numeric',
              year: 'numeric',
            });

            return (
              <div
                key={booking._id}
                className="bg-white border border-lavender rounded-3xl overflow-hidden shadow-soft hover:shadow-card transition-shadow p-5 flex flex-col md:flex-row gap-6 items-start md:items-center"
              >
                {/* Thumbnail */}
                <div className="w-full md:w-56 h-40 rounded-2xl overflow-hidden bg-lavender flex-shrink-0">
                  <img
                    src={listing.images?.[0]?.url || 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&w=400&q=80'}
                    alt={listing.title}
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Details */}
                <div className="flex-1 space-y-2">
                  <div className="flex flex-wrap items-center gap-2">
                    <span
                      className={`text-[11px] font-extrabold px-3 py-0.5 rounded-full ${
                        isCancelled
                          ? 'bg-red-50 text-red-600 border border-red-200'
                          : 'bg-powder/20 text-powder-deep border border-powder/40'
                      }`}
                    >
                      {isCancelled ? 'Cancelled' : 'Confirmed'}
                    </span>
                    <span className="text-xs text-slate-300">·</span>
                    <span className="text-xs text-slate-400 font-semibold">
                      Ref: #{booking._id.slice(-6).toUpperCase()}
                    </span>
                  </div>

                  <h3 className="text-lg font-bold text-slate-900 line-clamp-1">
                    {listing.title || 'Vacation Stay'}
                  </h3>

                  <p className="text-xs text-slate-500 font-medium flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-powder" />
                    {listing.location?.city}, {listing.location?.country}
                  </p>

                  <div className="pt-2 flex flex-wrap items-center gap-6 text-xs text-slate-700">
                    <div>
                      <span className="text-slate-400 block text-[10px] uppercase font-bold tracking-wider">Dates</span>
                      <span className="font-bold">{checkInDate} – {checkOutDate}</span>
                    </div>

                    <div>
                      <span className="text-slate-400 block text-[10px] uppercase font-bold tracking-wider">Guests</span>
                      <span className="font-bold">
                        {(booking.guests?.adults || 1) + (booking.guests?.children || 0)} Guests
                      </span>
                    </div>

                    <div>
                      <span className="text-slate-400 block text-[10px] uppercase font-bold tracking-wider">Total Paid</span>
                      <span className="font-extrabold text-powder-deep">${booking.totalAmount}</span>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex flex-col gap-2 w-full md:w-auto flex-shrink-0 self-stretch md:self-center justify-center">
                  <Link
                    to={`/listing/${listing._id}`}
                    className="py-2.5 px-5 text-center rounded-full bg-gradient-to-r from-powder to-peach text-white font-bold text-xs shadow-soft hover:opacity-90 transition-opacity"
                  >
                    View Listing
                  </Link>

                  {!isCancelled && (
                    <button
                      onClick={() => handleCancelBooking(booking._id)}
                      disabled={cancellingId === booking._id}
                      className="py-2 px-4 rounded-full border border-lavender text-slate-600 hover:text-red-500 hover:border-red-200 text-xs font-bold transition-colors disabled:opacity-50"
                    >
                      {cancellingId === booking._id ? 'Cancelling...' : 'Cancel Reservation'}
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default MyTrips;
