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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-xl bg-white rounded-3xl shadow-float overflow-hidden border border-lavender flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-lavender bg-lavender/20">
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-lavender text-slate-500 hover:text-slate-900 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
          <h2 className="text-sm font-extrabold text-slate-900">Filters</h2>
          <div className="w-6" />
        </div>

        {/* Scrollable Content */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1">
          {/* Price Range */}
          <div>
            <h3 className="text-sm font-extrabold text-slate-900 mb-1">Price range</h3>
            <p className="text-xs text-slate-500 font-medium mb-4">Nightly rates before taxes and fees</p>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-600 mb-1">
                  Minimum ($)
                </label>
                <input
                  type="number"
                  min="0"
                  placeholder="50"
                  value={minPrice}
                  onChange={(e) => setMinPrice(e.target.value)}
                  className="w-full px-3 py-2 text-sm rounded-xl border border-lavender focus:ring-2 focus:ring-powder font-semibold"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-600 mb-1">
                  Maximum ($)
                </label>
                <input
                  type="number"
                  min="0"
                  placeholder="1000+"
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(e.target.value)}
                  className="w-full px-3 py-2 text-sm rounded-xl border border-lavender focus:ring-2 focus:ring-powder font-semibold"
                />
              </div>
            </div>
          </div>

          <div className="border-t border-lavender" />

          {/* Property Type */}
          <div>
            <h3 className="text-sm font-extrabold text-slate-900 mb-3">Property type</h3>
            <div className="flex flex-wrap gap-2">
              {PROPERTY_TYPES.map((type) => (
                <button
                  key={type}
                  type="button"
                  onClick={() => setPropertyType(type)}
                  className={`px-4 py-2 rounded-full text-xs font-bold border transition-all ${
                    propertyType === type
                      ? 'border-powder bg-gradient-to-r from-powder to-peach text-white shadow-soft'
                      : 'border-lavender text-slate-700 hover:border-powder/60 bg-white'
                  }`}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>

          <div className="border-t border-lavender" />

          {/* Amenities */}
          <div>
            <h3 className="text-sm font-extrabold text-slate-900 mb-3">Popular amenities</h3>
            <div className="grid grid-cols-2 gap-3">
              {AMENITY_OPTIONS.map((amenity) => {
                const Icon = amenity.icon;
                const isChecked = selectedAmenities.includes(amenity.id);

                return (
                  <button
                    key={amenity.id}
                    type="button"
                    onClick={() => toggleAmenity(amenity.id)}
                    className={`flex items-center gap-3 p-3 rounded-2xl border text-left text-xs font-bold transition-all ${
                      isChecked
                        ? 'border-powder bg-lavender/50 text-powder-deep'
                        : 'border-lavender text-slate-700 hover:border-powder/40 bg-white'
                    }`}
                  >
                    <Icon className={`w-4 h-4 ${isChecked ? 'text-powder-dark' : 'text-slate-400'}`} />
                    <span className="flex-1">{amenity.label}</span>
                    {isChecked && <Check className="w-4 h-4 text-peach-dark" />}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-lavender/30 border-t border-lavender flex items-center justify-between">
          <button
            onClick={handleReset}
            className="text-xs font-bold text-slate-500 hover:text-slate-900 underline"
          >
            Clear all
          </button>
          <button
            onClick={handleApply}
            className="py-2.5 px-6 rounded-full bg-gradient-to-r from-powder to-peach text-white font-extrabold text-xs shadow-soft hover:opacity-90 transition-opacity"
          >
            Show results
          </button>
        </div>
      </div>
    </div>
  );
};

export default FilterModal;
