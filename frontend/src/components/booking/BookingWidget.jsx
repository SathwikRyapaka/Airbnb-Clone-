import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Star, ShieldCheck, Calendar, Users, Info, Loader2, Sparkles } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { bookingService } from '../../services/api';

const BookingWidget = ({ listing, onBookingSuccess }) => {
  const { user, isAuthenticated, openAuthModal, showToast } = useAuth();
  const navigate = useNavigate();

  // Dates state
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const fiveDaysLater = new Date();
  fiveDaysLater.setDate(fiveDaysLater.getDate() + 5);

  const formatDate = (d) => d.toISOString().split('T')[0];

  const [checkIn, setCheckIn] = useState(formatDate(tomorrow));
  const [checkOut, setCheckOut] = useState(formatDate(fiveDaysLater));
  const [adults, setAdults] = useState(1);
  const [children, setChildren] = useState(0);
  const [bookedRanges, setBookedRanges] = useState([]);
  const [submitting, setSubmitting] = useState(false);
  const [guestNotes, setGuestNotes] = useState('');

  // Fetch booked dates for this listing
  useEffect(() => {
    const fetchAvailability = async () => {
      try {
        const res = await bookingService.getAvailability(listing._id);
        if (res.success) {
          setBookedRanges(res.bookedRanges || []);
        }
      } catch (err) {
        console.warn('Could not fetch listing booked dates:', err);
      }
    };

    if (listing?._id) {
      fetchAvailability();
    }
  }, [listing?._id]);

  // Calculate nights
  const checkInDate = new Date(checkIn);
  const checkOutDate = new Date(checkOut);
  const diffTime = checkOutDate - checkInDate;
  const nights = Math.max(1, Math.round(diffTime / (1000 * 60 * 60 * 24)));

  // Pricing calculations
  const pricePerNight = listing.pricePerNight;
  const basePrice = nights * pricePerNight;
  const cleaningFee = listing.cleaningFee || 40;
  const serviceFeeRate = listing.serviceFeeRate || 0.12;
  const serviceFee = Math.round(basePrice * serviceFeeRate);
  const totalAmount = basePrice + cleaningFee + serviceFee;

  const totalGuests = adults + children;
  const isHostOfListing = isAuthenticated && user && listing.host?._id === user.id;

  const handleReserve = async (e) => {
    e.preventDefault();

    if (!isAuthenticated) {
      openAuthModal('login');
      return;
    }

    if (isHostOfListing) {
      showToast('You cannot book your own property listing.', 'error');
      return;
    }

    if (totalGuests > listing.guests) {
      showToast(`Maximum guest capacity is ${listing.guests}.`, 'error');
      return;
    }

    if (checkOutDate <= checkInDate) {
      showToast('Check-out date must be after check-in date.', 'error');
      return;
    }

    setSubmitting(true);
    try {
      const res = await bookingService.create({
        listingId: listing._id,
        checkIn,
        checkOut,
        guests: { adults, children, infants: 0 },
        guestNotes,
      });

      if (res.success) {
        showToast('Reservation confirmed! Safe travels.');
        if (onBookingSuccess) {
          onBookingSuccess(res.booking);
        } else {
          navigate('/my-trips');
        }
      }
    } catch (err) {
      showToast(
        err.response?.data?.message || 'Failed to complete booking. Please try another date range.',
        'error'
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="sticky top-28 bg-white rounded-3xl border border-lavender shadow-card p-6 sm:p-7 transition-all">
      {/* Price Header */}
      <div className="flex items-baseline justify-between mb-5">
        <div className="flex items-baseline gap-1">
          <span className="text-3xl font-extrabold text-slate-900">${pricePerNight}</span>
          <span className="text-slate-400 text-sm font-medium">/ night</span>
        </div>
        <div className="flex items-center gap-1 text-xs font-bold text-slate-800 bg-lavender/40 px-2.5 py-1 rounded-full border border-lavender">
          <Star className="w-3.5 h-3.5 fill-peach text-peach-dark" />
          <span>{listing.rating > 0 ? listing.rating.toFixed(2) : 'New'}</span>
          <span className="text-slate-300">·</span>
          <span className="text-slate-500 font-semibold">{listing.reviewCount} reviews</span>
        </div>
      </div>

      {/* Booking Form Box */}
      <form onSubmit={handleReserve}>
        <div className="border border-lavender-dark/80 rounded-2xl overflow-hidden mb-4 bg-lavender/10">
          <div className="grid grid-cols-2 divide-x divide-lavender border-b border-lavender">
            <div className="p-3">
              <label className="block text-[10px] font-extrabold uppercase text-powder-deep tracking-wider">
                Check-in
              </label>
              <input
                type="date"
                required
                value={checkIn}
                min={formatDate(new Date())}
                onChange={(e) => setCheckIn(e.target.value)}
                className="w-full text-xs font-semibold text-slate-800 focus:outline-none bg-transparent pt-0.5"
              />
            </div>
            <div className="p-3">
              <label className="block text-[10px] font-extrabold uppercase text-powder-deep tracking-wider">
                Check-out
              </label>
              <input
                type="date"
                required
                value={checkOut}
                min={checkIn || formatDate(new Date())}
                onChange={(e) => setCheckOut(e.target.value)}
                className="w-full text-xs font-semibold text-slate-800 focus:outline-none bg-transparent pt-0.5"
              />
            </div>
          </div>

          <div className="p-3 bg-white/70">
            <label className="block text-[10px] font-extrabold uppercase text-powder-deep tracking-wider">
              Guests (Max {listing.guests})
            </label>
            <div className="flex items-center justify-between pt-1">
              <span className="text-xs font-semibold text-slate-800">
                {totalGuests} guest{totalGuests > 1 ? 's' : ''}
              </span>
              <div className="flex items-center gap-2">
                <select
                  value={adults}
                  onChange={(e) => setAdults(Number(e.target.value))}
                  className="text-xs border border-lavender rounded-xl px-2.5 py-1 font-bold bg-white text-slate-800 focus:ring-1 focus:ring-powder"
                >
                  {Array.from({ length: listing.guests }).map((_, i) => (
                    <option key={i + 1} value={i + 1}>
                      {i + 1} Adult{i > 0 ? 's' : ''}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Guest Notes */}
        <div className="mb-4">
          <label className="block text-xs font-bold text-slate-600 mb-1">
            Note for the Host (Optional)
          </label>
          <input
            type="text"
            value={guestNotes}
            onChange={(e) => setGuestNotes(e.target.value)}
            placeholder="e.g. Arriving around 3 PM..."
            className="w-full px-3 py-2 text-xs border border-lavender rounded-xl focus:ring-2 focus:ring-powder focus:outline-none bg-white"
          />
        </div>

        {/* Reserve Action Button in Powder Blue & Warm Sunset Peach Gradient */}
        <button
          type="submit"
          disabled={submitting || isHostOfListing}
          className="w-full py-3.5 bg-gradient-to-r from-peach to-powder hover:from-peach-hover hover:to-powder-hover text-white font-extrabold rounded-2xl text-sm transition-all shadow-soft hover:shadow-card disabled:opacity-50 flex items-center justify-center gap-2"
        >
          {submitting ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" /> Confirming...
            </>
          ) : isHostOfListing ? (
            'Your Listing'
          ) : (
            <>
              <Sparkles className="w-4 h-4" /> Reserve Stay
            </>
          )}
        </button>

        <p className="text-center text-xs text-slate-400 mt-2 font-medium">
          You won't be charged yet
        </p>

        {/* Pricing Breakdown */}
        <div className="mt-6 space-y-2.5 text-xs text-slate-600 font-medium">
          <div className="flex justify-between">
            <span className="text-slate-500">
              ${pricePerNight} × {nights} night{nights > 1 ? 's' : ''}
            </span>
            <span className="font-semibold text-slate-800">${basePrice}</span>
          </div>

          <div className="flex justify-between">
            <span className="text-slate-500">Cleaning fee</span>
            <span className="font-semibold text-slate-800">${cleaningFee}</span>
          </div>

          <div className="flex justify-between">
            <span className="text-slate-500">Platform service fee</span>
            <span className="font-semibold text-slate-800">${serviceFee}</span>
          </div>

          <div className="border-t border-lavender pt-3 flex justify-between text-base font-extrabold text-slate-900">
            <span>Total before taxes</span>
            <span className="text-powder-deep">${totalAmount}</span>
          </div>
        </div>
      </form>

      {/* Quality assurance footer */}
      <div className="mt-6 pt-4 border-t border-lavender flex items-center gap-2.5 text-xs text-slate-500">
        <ShieldCheck className="w-5 h-5 text-powder flex-shrink-0" />
        <span>Every stay includes Airbnb Cover against Host cancellations and listing inaccuracies.</span>
      </div>
    </div>
  );
};

export default BookingWidget;
