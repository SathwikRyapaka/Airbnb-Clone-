import React, { useState } from 'react';
import { X, Wifi, Waves, Car, Wind, Utensils, Bath, Check, Home, Building2, Trees } from 'lucide-react';

const AMENITY_OPTIONS = [
  { id: 'wifi', label: 'Wifi', icon: Wifi },
  { id: 'pool', label: 'Pool', icon: Waves },
  { id: 'freeParking', label: 'Free parking', icon: Car },
  { id: 'airConditioning', label: 'Air conditioning', icon: Wind },
  { id: 'kitchen', label: 'Kitchen', icon: Utensils },
  { id: 'hotTub', label: 'Hot tub', icon: Bath },
  { id: 'patio', label: 'Patio or balcony', icon: Trees },
  { id: 'dedicatedWorkspace', label: 'Dedicated workspace', icon: Building2 },
];

const PROPERTY_TYPES = ['Any', 'Apartment', 'House', 'Villa', 'Cabin', 'Loft', 'Chalet'];

const FilterModal = ({ isOpen, onClose, filters, onApplyFilters, onResetFilters }) => {
  const [minPrice, setMinPrice] = useState(filters?.minPrice || '');
  const [maxPrice, setMaxPrice] = useState(filters?.maxPrice || '');
  const [propertyType, setPropertyType] = useState(filters?.propertyType || 'Any');
  const [selectedAmenities, setSelectedAmenities] = useState(filters?.amenities || []);

  if (!isOpen) return null;

  const toggleAmenity = (id) => {
    setSelectedAmenities((prev) =>
      prev.includes(id) ? prev.filter((a) => a !== id) : [...prev, id]
    );
  };

  const handleApply = () => {
    onApplyFilters({
      minPrice: minPrice ? Number(minPrice) : '',
      maxPrice: maxPrice ? Number(maxPrice) : '',
      propertyType: propertyType === 'Any' ? '' : propertyType,
      amenities: selectedAmenities,
    });
    onClose();
  };

  const handleReset = () => {
    setMinPrice('');
    setMaxPrice('');
    setPropertyType('Any');
    setSelectedAmenities([]);
    onResetFilters();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-xl bg-white rounded-3xl shadow-2xl overflow-hidden border border-neutral-100 flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-100">
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-neutral-100 text-neutral-500 hover:text-neutral-900 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
          <h2 className="text-sm font-bold text-neutral-900">Filters</h2>
          <div className="w-6" />
        </div>

        {/* Scrollable Content */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1">
          {/* Price Range */}
          <div>
            <h3 className="text-sm font-bold text-neutral-900 mb-1">Price range</h3>
            <p className="text-xs text-neutral-500 mb-4">Nightly rates before taxes and fees</p>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-neutral-600 mb-1">
                  Minimum ($)
                </label>
                <input
                  type="number"
                  min="0"
                  placeholder="50"
                  value={minPrice}
                  onChange={(e) => setMinPrice(e.target.value)}
                  className="w-full px-3 py-2 text-sm rounded-xl border border-neutral-300 focus:ring-2 focus:ring-rose-500 font-medium"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-neutral-600 mb-1">
                  Maximum ($)
                </label>
                <input
                  type="number"
                  min="0"
                  placeholder="1000+"
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(e.target.value)}
                  className="w-full px-3 py-2 text-sm rounded-xl border border-neutral-300 focus:ring-2 focus:ring-rose-500 font-medium"
                />
              </div>
            </div>
          </div>

          <div className="border-t border-neutral-100" />

          {/* Property Type */}
          <div>
            <h3 className="text-sm font-bold text-neutral-900 mb-3">Property type</h3>
            <div className="flex flex-wrap gap-2">
              {PROPERTY_TYPES.map((type) => (
                <button
                  key={type}
                  type="button"
                  onClick={() => setPropertyType(type)}
                  className={`px-4 py-2 rounded-xl text-xs font-semibold border transition-all ${
                    propertyType === type
                      ? 'border-neutral-900 bg-neutral-900 text-white'
                      : 'border-neutral-200 text-neutral-700 hover:border-neutral-400'
                  }`}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>

          <div className="border-t border-neutral-100" />

          {/* Amenities */}
          <div>
            <h3 className="text-sm font-bold text-neutral-900 mb-3">Popular amenities</h3>
            <div className="grid grid-cols-2 gap-3">
              {AMENITY_OPTIONS.map((amenity) => {
                const Icon = amenity.icon;
                const isChecked = selectedAmenities.includes(amenity.id);

                return (
                  <button
                    key={amenity.id}
                    type="button"
                    onClick={() => toggleAmenity(amenity.id)}
                    className={`flex items-center gap-3 p-3 rounded-2xl border text-left text-xs font-semibold transition-all ${
                      isChecked
                        ? 'border-rose-500 bg-rose-50/50 text-rose-700'
                        : 'border-neutral-200 text-neutral-700 hover:border-neutral-300'
                    }`}
                  >
                    <Icon className="w-4 h-4 text-neutral-500 flex-shrink-0" />
                    <span className="flex-1">{amenity.label}</span>
                    {isChecked && <Check className="w-4 h-4 text-rose-600" />}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-neutral-50 border-t border-neutral-100 flex items-center justify-between">
          <button
            onClick={handleReset}
            className="text-xs font-semibold text-neutral-600 hover:text-neutral-900 underline"
          >
            Clear all
          </button>
          <button
            onClick={handleApply}
            className="py-2.5 px-6 rounded-xl bg-neutral-900 text-white font-semibold text-xs hover:bg-black transition-colors"
          >
            Show results
          </button>
        </div>
      </div>
    </div>
  );
};

export default FilterModal;
