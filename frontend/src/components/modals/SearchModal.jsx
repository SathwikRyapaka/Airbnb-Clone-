import React, { useState } from 'react';
import { X, Search, MapPin, Calendar, Users, Plus, Minus } from 'lucide-react';

const POPULAR_DESTINATIONS = [
  { name: "I'm flexible", query: '' },
  { name: 'Santorini, Greece', query: 'Santorini' },
  { name: 'Bali, Indonesia', query: 'Bali' },
  { name: 'Paris, France', query: 'Paris' },
  { name: 'Malibu, USA', query: 'Malibu' },
  { name: 'Tuscany, Italy', query: 'Tuscany' },
  { name: 'Kyoto, Japan', query: 'Kyoto' },
];

const SearchModal = ({ isOpen, onClose, onSearch, currentSearchParams }) => {
  const [activeTab, setActiveTab] = useState('where'); // 'where' | 'when' | 'who'
  const [destination, setDestination] = useState(currentSearchParams?.destination || '');
  const [checkIn, setCheckIn] = useState(currentSearchParams?.checkIn || '');
  const [checkOut, setCheckOut] = useState(currentSearchParams?.checkOut || '');
  const [guests, setGuests] = useState(currentSearchParams?.guests || { adults: 1, children: 0, infants: 0 });

  if (!isOpen) return null;

  const totalGuests = (guests.adults || 1) + (guests.children || 0);

  const handleGuestChange = (type, delta) => {
    setGuests((prev) => {
      const current = prev[type] || 0;
      const updated = Math.max(type === 'adults' ? 1 : 0, current + delta);
      return { ...prev, [type]: updated };
    });
  };

  const handleApplySearch = () => {
    onSearch({
      destination: destination.trim(),
      checkIn,
      checkOut,
      guests: totalGuests,
    });
    onClose();
  };

  const handleClearAll = () => {
    setDestination('');
    setCheckIn('');
    setCheckOut('');
    setGuests({ adults: 1, children: 0, infants: 0 });
    onSearch({});
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4 bg-slate-900/40 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-float overflow-hidden border border-lavender">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-lavender bg-lavender/20">
          <div className="flex items-center gap-6 text-sm font-bold text-slate-500">
            <button
              onClick={() => setActiveTab('where')}
              className={`pb-1 transition-colors ${
                activeTab === 'where'
                  ? 'border-b-2 border-powder text-powder-deep font-extrabold'
                  : 'hover:text-slate-800'
              }`}
            >
              Where
            </button>
            <button
              onClick={() => setActiveTab('when')}
              className={`pb-1 transition-colors ${
                activeTab === 'when'
                  ? 'border-b-2 border-powder text-powder-deep font-extrabold'
                  : 'hover:text-slate-800'
              }`}
            >
              When
            </button>
            <button
              onClick={() => setActiveTab('who')}
              className={`pb-1 transition-colors ${
                activeTab === 'who'
                  ? 'border-b-2 border-powder text-powder-deep font-extrabold'
                  : 'hover:text-slate-800'
              }`}
            >
              Who
            </button>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-lavender text-slate-500 hover:text-slate-900 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Body */}
        <div className="p-6">
          {activeTab === 'where' && (
            <div>
              <label className="block text-sm font-extrabold text-slate-900 mb-2">
                Search destinations
              </label>
              <div className="relative mb-6">
                <MapPin className="absolute left-4 top-3.5 w-5 h-5 text-powder" />
                <input
                  type="text"
                  value={destination}
                  onChange={(e) => setDestination(e.target.value)}
                  placeholder="Search by city, country, or landmark..."
                  className="w-full pl-12 pr-4 py-3 rounded-2xl border border-lavender text-sm focus:outline-none focus:ring-2 focus:ring-powder font-semibold text-slate-800"
                  autoFocus
                />
              </div>

              <div>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">
                  Popular getaway spots
                </p>
                <div className="flex flex-wrap gap-2">
                  {POPULAR_DESTINATIONS.map((dest) => (
                    <button
                      key={dest.name}
                      onClick={() => setDestination(dest.query)}
                      className={`px-3.5 py-1.5 rounded-full text-xs font-bold border transition-all ${
                        destination === dest.query
                          ? 'border-powder bg-gradient-to-r from-powder to-peach text-white shadow-soft'
                          : 'border-lavender hover:border-powder/60 bg-white text-slate-700'
                      }`}
                    >
                      {dest.name}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'when' && (
            <div>
              <p className="text-sm font-extrabold text-slate-900 mb-4">Select travel dates</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-600 mb-1">
                    Check-in Date
                  </label>
                  <div className="relative">
                    <Calendar className="absolute left-3.5 top-3 w-4 h-4 text-powder" />
                    <input
                      type="date"
                      value={checkIn}
                      onChange={(e) => setCheckIn(e.target.value)}
                      className="w-full pl-10 pr-3 py-2.5 rounded-xl border border-lavender text-sm font-semibold text-slate-800 focus:ring-2 focus:ring-powder"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-600 mb-1">
                    Check-out Date
                  </label>
                  <div className="relative">
                    <Calendar className="absolute left-3.5 top-3 w-4 h-4 text-powder" />
                    <input
                      type="date"
                      value={checkOut}
                      onChange={(e) => setCheckOut(e.target.value)}
                      min={checkIn || undefined}
                      className="w-full pl-10 pr-3 py-2.5 rounded-xl border border-lavender text-sm font-semibold text-slate-800 focus:ring-2 focus:ring-powder"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'who' && (
            <div className="space-y-4 divide-y divide-lavender">
              <div className="flex items-center justify-between pt-2">
                <div>
                  <p className="text-sm font-extrabold text-slate-900">Adults</p>
                  <p className="text-xs text-slate-400">Ages 13 or above</p>
                </div>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => handleGuestChange('adults', -1)}
                    disabled={guests.adults <= 1}
                    className="p-1.5 rounded-full border border-lavender text-slate-600 hover:border-powder disabled:opacity-30 disabled:pointer-events-none"
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </button>
                  <span className="text-sm font-extrabold w-6 text-center text-slate-800">{guests.adults}</span>
                  <button
                    onClick={() => handleGuestChange('adults', 1)}
                    className="p-1.5 rounded-full border border-lavender text-slate-600 hover:border-powder"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between pt-4">
                <div>
                  <p className="text-sm font-extrabold text-slate-900">Children</p>
                  <p className="text-xs text-slate-400">Ages 2–12</p>
                </div>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => handleGuestChange('children', -1)}
                    disabled={guests.children <= 0}
                    className="p-1.5 rounded-full border border-lavender text-slate-600 hover:border-powder disabled:opacity-30 disabled:pointer-events-none"
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </button>
                  <span className="text-sm font-extrabold w-6 text-center text-slate-800">{guests.children}</span>
                  <button
                    onClick={() => handleGuestChange('children', 1)}
                    className="p-1.5 rounded-full border border-lavender text-slate-600 hover:border-powder"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="px-6 py-4 bg-lavender/30 border-t border-lavender flex items-center justify-between">
          <button
            onClick={handleClearAll}
            className="text-xs font-bold text-slate-500 hover:text-slate-900 underline"
          >
            Clear all
          </button>

          <button
            onClick={handleApplySearch}
            className="flex items-center gap-2 py-2.5 px-6 rounded-full bg-gradient-to-r from-powder to-peach text-white font-extrabold text-xs shadow-soft hover:opacity-90 transition-opacity"
          >
            <Search className="w-4 h-4" /> Search Listings
          </button>
        </div>
      </div>
    </div>
  );
};

export default SearchModal;
