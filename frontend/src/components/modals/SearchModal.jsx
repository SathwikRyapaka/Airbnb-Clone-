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
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4 bg-black/50 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl overflow-hidden border border-neutral-100">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-100">
          <div className="flex items-center gap-6 text-sm font-semibold text-neutral-600">
            <button
              onClick={() => setActiveTab('where')}
              className={`pb-1 transition-colors ${
                activeTab === 'where'
                  ? 'border-b-2 border-neutral-900 text-neutral-900 font-bold'
                  : 'hover:text-neutral-900'
              }`}
            >
              Where
            </button>
            <button
              onClick={() => setActiveTab('when')}
              className={`pb-1 transition-colors ${
                activeTab === 'when'
                  ? 'border-b-2 border-neutral-900 text-neutral-900 font-bold'
                  : 'hover:text-neutral-900'
              }`}
            >
              When
            </button>
            <button
              onClick={() => setActiveTab('who')}
              className={`pb-1 transition-colors ${
                activeTab === 'who'
                  ? 'border-b-2 border-neutral-900 text-neutral-900 font-bold'
                  : 'hover:text-neutral-900'
              }`}
            >
              Who
            </button>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-neutral-100 text-neutral-500 hover:text-neutral-900 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Body */}
        <div className="p-6">
          {activeTab === 'where' && (
            <div>
              <label className="block text-sm font-bold text-neutral-900 mb-2">
                Search destinations
              </label>
              <div className="relative mb-6">
                <MapPin className="absolute left-4 top-3.5 w-5 h-5 text-neutral-400" />
                <input
                  type="text"
                  value={destination}
                  onChange={(e) => setDestination(e.target.value)}
                  placeholder="Search by city, country, or landmark..."
                  className="w-full pl-12 pr-4 py-3 rounded-2xl border border-neutral-300 text-sm focus:outline-none focus:ring-2 focus:ring-rose-500 font-medium"
                  autoFocus
                />
              </div>

              <div>
                <p className="text-xs font-bold text-neutral-500 uppercase tracking-wider mb-3">
                  Popular getaway spots
                </p>
                <div className="flex flex-wrap gap-2">
                  {POPULAR_DESTINATIONS.map((dest) => (
                    <button
                      key={dest.name}
                      onClick={() => setDestination(dest.query)}
                      className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-colors ${
                        destination === dest.query
                          ? 'border-rose-500 bg-rose-50 text-rose-700'
                          : 'border-neutral-200 hover:border-neutral-400 text-neutral-700'
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
              <p className="text-sm font-bold text-neutral-900 mb-4">Select travel dates</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-neutral-600 mb-1">
                    Check-in Date
                  </label>
                  <div className="relative">
                    <Calendar className="absolute left-3.5 top-3 w-4 h-4 text-neutral-400" />
                    <input
                      type="date"
                      value={checkIn}
                      onChange={(e) => setCheckIn(e.target.value)}
                      className="w-full pl-10 pr-3 py-2.5 rounded-xl border border-neutral-300 text-sm font-medium focus:ring-2 focus:ring-rose-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-neutral-600 mb-1">
                    Check-out Date
                  </label>
                  <div className="relative">
                    <Calendar className="absolute left-3.5 top-3 w-4 h-4 text-neutral-400" />
                    <input
                      type="date"
                      value={checkOut}
                      onChange={(e) => setCheckOut(e.target.value)}
                      min={checkIn || undefined}
                      className="w-full pl-10 pr-3 py-2.5 rounded-xl border border-neutral-300 text-sm font-medium focus:ring-2 focus:ring-rose-500"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'who' && (
            <div className="space-y-4 divide-y divide-neutral-100">
              <div className="flex items-center justify-between pt-2">
                <div>
                  <p className="text-sm font-bold text-neutral-900">Adults</p>
                  <p className="text-xs text-neutral-500">Ages 13 or above</p>
                </div>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => handleGuestChange('adults', -1)}
                    disabled={guests.adults <= 1}
                    className="p-1.5 rounded-full border border-neutral-300 text-neutral-600 hover:border-neutral-900 disabled:opacity-30 disabled:pointer-events-none"
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </button>
                  <span className="text-sm font-semibold w-6 text-center">{guests.adults}</span>
                  <button
                    onClick={() => handleGuestChange('adults', 1)}
                    className="p-1.5 rounded-full border border-neutral-300 text-neutral-600 hover:border-neutral-900"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between pt-4">
                <div>
                  <p className="text-sm font-bold text-neutral-900">Children</p>
                  <p className="text-xs text-neutral-500">Ages 2–12</p>
                </div>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => handleGuestChange('children', -1)}
                    disabled={guests.children <= 0}
                    className="p-1.5 rounded-full border border-neutral-300 text-neutral-600 hover:border-neutral-900 disabled:opacity-30 disabled:pointer-events-none"
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </button>
                  <span className="text-sm font-semibold w-6 text-center">{guests.children}</span>
                  <button
                    onClick={() => handleGuestChange('children', 1)}
                    className="p-1.5 rounded-full border border-neutral-300 text-neutral-600 hover:border-neutral-900"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="px-6 py-4 bg-neutral-50 border-t border-neutral-100 flex items-center justify-between">
          <button
            onClick={handleClearAll}
            className="text-xs font-semibold text-neutral-600 hover:text-neutral-900 underline"
          >
            Clear all
          </button>

          <button
            onClick={handleApplySearch}
            className="flex items-center gap-2 py-2.5 px-6 rounded-xl bg-gradient-to-r from-rose-500 to-rose-600 text-white font-semibold text-xs shadow-md hover:shadow-lg transition-all"
          >
            <Search className="w-4 h-4" /> Search Listings
          </button>
        </div>
      </div>
    </div>
  );
};

export default SearchModal;
