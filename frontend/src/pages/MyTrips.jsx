import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Calendar, MapPin, AlertCircle, ArrowRight, ShieldCheck, Clock } from 'lucide-react';
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
        <div className="h-8 bg-neutral-200 rounded w-1/4 mb-8" />
        <div className="space-y-4">
          <div className="h-44 bg-neutral-100 rounded-3xl" />
          <div className="h-44 bg-neutral-100 rounded-3xl" />
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 animate-fadeIn min-h-[70vh]">
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold text-neutral-900 tracking-tight">My Trips</h1>
        <p className="text-sm text-neutral-500 mt-1">
          Review your upcoming stays, past getaways, and reservation receipts.
        </p>
      </div>

      {bookings.length === 0 ? (
        <div className="py-16 text-center border border-dashed border-neutral-300 rounded-3xl max-w-xl mx-auto p-8">
          <Calendar className="w-12 h-12 text-neutral-400 mx-auto mb-3" />
          <h3 className="text-lg font-bold text-neutral-800">No trips booked... yet!</h3>
          <p className="text-xs text-neutral-500 mt-1 mb-6">
            Time to dust off your bags and start planning your next extraordinary adventure.
          </p>
          <Link
            to="/"
            className="inline-flex items-center gap-2 px-6 py-3 bg-rose-500 text-white rounded-xl text-xs font-semibold hover:bg-rose-600 transition-colors shadow-md"
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
                className="bg-white border border-neutral-200 rounded-3xl overflow-hidden shadow-sm hover:shadow-md transition-shadow p-5 flex flex-col md:flex-row gap-6 items-start md:items-center"
              >
                {/* Thumbnail */}
                <div className="w-full md:w-56 h-40 rounded-2xl overflow-hidden bg-neutral-100 flex-shrink-0">
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
                      className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full ${
                        isCancelled
                          ? 'bg-red-50 text-red-600'
                          : 'bg-emerald-50 text-emerald-700'
                      }`}
                    >
                      {isCancelled ? 'Cancelled' : 'Confirmed'}
                    </span>
                    <span className="text-xs text-neutral-400">·</span>
                    <span className="text-xs text-neutral-500">
                      Booking Ref: #{booking._id.slice(-6).toUpperCase()}
                    </span>
                  </div>

                  <h3 className="text-lg font-bold text-neutral-900 line-clamp-1">
                    {listing.title || 'Vacation Stay'}
                  </h3>

                  <p className="text-xs text-neutral-500 flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5" />
                    {listing.location?.city}, {listing.location?.country}
                  </p>

                  <div className="pt-2 flex flex-wrap items-center gap-6 text-xs text-neutral-700">
                    <div>
                      <span className="text-neutral-400 block text-[10px] uppercase font-bold">Dates</span>
                      <span className="font-semibold">{checkInDate} – {checkOutDate}</span>
                    </div>

                    <div>
                      <span className="text-neutral-400 block text-[10px] uppercase font-bold">Guests</span>
                      <span className="font-semibold">
                        {(booking.guests?.adults || 1) + (booking.guests?.children || 0)} Guests
                      </span>
                    </div>

                    <div>
                      <span className="text-neutral-400 block text-[10px] uppercase font-bold">Total Paid</span>
                      <span className="font-bold text-neutral-900">${booking.totalAmount}</span>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex flex-col gap-2 w-full md:w-auto flex-shrink-0 self-stretch md:self-center justify-center">
                  <Link
                    to={`/listing/${listing._id}`}
                    className="py-2.5 px-4 text-center rounded-xl bg-neutral-900 text-white font-semibold text-xs hover:bg-neutral-800 transition-colors"
                  >
                    View Listing
                  </Link>

                  {!isCancelled && (
                    <button
                      onClick={() => handleCancelBooking(booking._id)}
                      disabled={cancellingId === booking._id}
                      className="py-2 px-4 rounded-xl border border-neutral-300 text-neutral-600 hover:text-red-600 hover:border-red-300 text-xs font-semibold transition-colors disabled:opacity-50"
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
