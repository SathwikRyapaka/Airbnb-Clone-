import React, { useState, useEffect } from 'react';
import { X, Loader2, Upload, Plus, Trash2 } from 'lucide-react';
import { listingService } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { CATEGORIES } from '../listings/CategoryBar';

const PROPERTY_TYPES = ['Apartment', 'House', 'Villa', 'Cabin', 'Cottage', 'Loft', 'Chalet', 'Bungalow'];

const AMENITY_KEYS = [
  { id: 'wifi', label: 'Fast Wifi' },
  { id: 'pool', label: 'Swimming Pool' },
  { id: 'freeParking', label: 'Free Parking' },
  { id: 'airConditioning', label: 'Air Conditioning' },
  { id: 'kitchen', label: 'Full Kitchen' },
  { id: 'hotTub', label: 'Hot Tub' },
  { id: 'tv', label: 'TV' },
  { id: 'patio', label: 'Patio / Balcony' },
  { id: 'dedicatedWorkspace', label: 'Dedicated Workspace' },
  { id: 'petFriendly', label: 'Pet Friendly' },
];

const ListingFormModal = ({ isOpen, onClose, editingListing = null, onSaved }) => {
  const { showToast } = useAuth();
  const [loading, setLoading] = useState(false);

  const initialForm = {
    title: '',
    category: 'Trending',
    propertyType: 'Apartment',
    roomType: 'Entire place',
    pricePerNight: 150,
    cleaningFee: 45,
    guests: 2,
    bedrooms: 1,
    beds: 1,
    bathrooms: 1,
    description: '',
    address: '',
    city: '',
    state: '',
    country: '',
    lat: 34.0522,
    lng: -118.2437,
    imageUrls: [
      'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&w=1200&q=80',
    ],
    amenities: ['wifi', 'kitchen'],
  };

  const [formData, setFormData] = useState(initialForm);

  useEffect(() => {
    if (editingListing) {
      setFormData({
        title: editingListing.title || '',
        category: editingListing.category || 'Trending',
        propertyType: editingListing.propertyType || 'Apartment',
        roomType: editingListing.roomType || 'Entire place',
        pricePerNight: editingListing.pricePerNight || 150,
        cleaningFee: editingListing.cleaningFee || 45,
        guests: editingListing.guests || 2,
        bedrooms: editingListing.bedrooms || 1,
        beds: editingListing.beds || 1,
        bathrooms: editingListing.bathrooms || 1,
        description: editingListing.description || '',
        address: editingListing.location?.address || '',
        city: editingListing.location?.city || '',
        state: editingListing.location?.state || '',
        country: editingListing.location?.country || '',
        lat: editingListing.location?.coordinates?.lat || 34.0522,
        lng: editingListing.location?.coordinates?.lng || -118.2437,
        imageUrls: editingListing.images?.map((img) => img.url) || initialForm.imageUrls,
        amenities: editingListing.amenities || ['wifi'],
      });
    } else {
      setFormData(initialForm);
    }
  }, [editingListing, isOpen]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'number' ? Number(value) : value,
    }));
  };

  const toggleAmenity = (id) => {
    setFormData((prev) => ({
      ...prev,
      amenities: prev.amenities.includes(id)
        ? prev.amenities.filter((a) => a !== id)
        : [...prev.amenities, id],
    }));
  };

  const handleImageUrlChange = (index, value) => {
    const updated = [...formData.imageUrls];
    updated[index] = value;
    setFormData((prev) => ({ ...prev, imageUrls: updated }));
  };

  const addImageUrl = () => {
    setFormData((prev) => ({ ...prev, imageUrls: [...prev.imageUrls, ''] }));
  };

  const removeImageUrl = (index) => {
    if (formData.imageUrls.length <= 1) return;
    setFormData((prev) => ({
      ...prev,
      imageUrls: prev.imageUrls.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title || !formData.city || !formData.country || !formData.description) {
      showToast('Please complete all required fields.', 'error');
      return;
    }

    setLoading(true);
    try {
      const payload = {
        title: formData.title,
        description: formData.description,
        category: formData.category,
        propertyType: formData.propertyType,
        roomType: formData.roomType,
        pricePerNight: formData.pricePerNight,
        cleaningFee: formData.cleaningFee,
        guests: formData.guests,
        bedrooms: formData.bedrooms,
        beds: formData.beds,
        bathrooms: formData.bathrooms,
        location: {
          address: formData.address,
          city: formData.city,
          state: formData.state,
          country: formData.country,
          coordinates: {
            lat: Number(formData.lat) || 0,
            lng: Number(formData.lng) || 0,
          },
        },
        images: formData.imageUrls.filter(Boolean).map((url, i) => ({
          url,
          isPrimary: i === 0,
        })),
        amenities: formData.amenities,
      };

      if (editingListing?._id) {
        await listingService.update(editingListing._id, payload);
        showToast('Listing updated successfully!');
      } else {
        await listingService.create(payload);
        showToast('New listing published successfully!');
      }

      if (onSaved) onSaved();
      onClose();
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to save listing.', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-float overflow-hidden border border-lavender flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-lavender bg-lavender/30">
          <h2 className="text-base font-extrabold text-slate-900">
            {editingListing ? 'Edit Property Listing' : 'List a New Property on Airbnb'}
          </h2>
          <button
            onClick={onClose}
            className="p-1 rounded-full hover:bg-lavender text-slate-500 hover:text-slate-900"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Form Body */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-6 flex-1 text-xs">
          {/* Basic Details */}
          <div>
            <h3 className="text-sm font-extrabold text-slate-900 mb-3">1. Listing Overview</h3>
            <div className="space-y-3">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Title *</label>
                <input
                  type="text"
                  name="title"
                  required
                  value={formData.title}
                  onChange={handleChange}
                  placeholder="e.g. Modern Sunset Villa with Ocean View"
                  className="w-full px-3 py-2 text-xs border border-lavender rounded-xl focus:ring-2 focus:ring-powder focus:outline-none font-semibold text-slate-800"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Category *</label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-lavender rounded-xl font-semibold bg-white text-slate-800 focus:ring-2 focus:ring-powder"
                  >
                    {CATEGORIES.filter((c) => c.id !== 'All').map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Property Type</label>
                  <select
                    name="propertyType"
                    value={formData.propertyType}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-lavender rounded-xl font-semibold bg-white text-slate-800 focus:ring-2 focus:ring-powder"
                  >
                    {PROPERTY_TYPES.map((t) => (
                      <option key={t} value={t}>
                        {t}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Description *</label>
                <textarea
                  name="description"
                  required
                  rows={3}
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Detail the uniqueness, scenery, and vibe of your property..."
                  className="w-full px-3 py-2 border border-lavender rounded-xl focus:ring-2 focus:ring-powder focus:outline-none font-medium text-slate-700"
                />
              </div>
            </div>
          </div>

          <div className="border-t border-lavender" />

          {/* Pricing & Capacity */}
          <div>
            <h3 className="text-sm font-extrabold text-slate-900 mb-3">2. Pricing & Capacity</h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Nightly Rate ($) *</label>
                <input
                  type="number"
                  name="pricePerNight"
                  min="10"
                  required
                  value={formData.pricePerNight}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-lavender rounded-xl font-extrabold text-slate-900"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Cleaning Fee ($)</label>
                <input
                  type="number"
                  name="cleaningFee"
                  min="0"
                  value={formData.cleaningFee}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-lavender rounded-xl font-semibold text-slate-800"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Max Guests *</label>
                <input
                  type="number"
                  name="guests"
                  min="1"
                  required
                  value={formData.guests}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-lavender rounded-xl font-semibold text-slate-800"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Bedrooms</label>
                <input
                  type="number"
                  name="bedrooms"
                  min="0"
                  value={formData.bedrooms}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-lavender rounded-xl font-semibold text-slate-800"
                />
              </div>
            </div>
          </div>

          <div className="border-t border-lavender" />

          {/* Location */}
          <div>
            <h3 className="text-sm font-extrabold text-slate-900 mb-3">3. Geographic Location</h3>
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">City *</label>
                  <input
                    type="text"
                    name="city"
                    required
                    value={formData.city}
                    onChange={handleChange}
                    placeholder="e.g. Florence"
                    className="w-full px-3 py-2 border border-lavender rounded-xl font-semibold text-slate-800"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Country *</label>
                  <input
                    type="text"
                    name="country"
                    required
                    value={formData.country}
                    onChange={handleChange}
                    placeholder="e.g. Italy"
                    className="w-full px-3 py-2 border border-lavender rounded-xl font-semibold text-slate-800"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Latitude</label>
                  <input
                    type="number"
                    step="any"
                    name="lat"
                    value={formData.lat}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-lavender rounded-xl font-semibold"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Longitude</label>
                  <input
                    type="number"
                    step="any"
                    name="lng"
                    value={formData.lng}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-lavender rounded-xl font-semibold"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="border-t border-lavender" />

          {/* Photos */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-extrabold text-slate-900">4. High Resolution Photos</h3>
              <button
                type="button"
                onClick={addImageUrl}
                className="flex items-center gap-1 text-powder-deep font-bold hover:underline"
              >
                <Plus className="w-3.5 h-3.5" /> Add photo URL
              </button>
            </div>
            <div className="space-y-2">
              {formData.imageUrls.map((url, i) => (
                <div key={i} className="flex items-center gap-2">
                  <input
                    type="url"
                    value={url}
                    onChange={(e) => handleImageUrlChange(i, e.target.value)}
                    placeholder={`Photo URL #${i + 1} (Unsplash or direct image URL)`}
                    className="w-full px-3 py-2 border border-lavender rounded-xl text-slate-800 font-medium"
                  />
                  {formData.imageUrls.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeImageUrl(i)}
                      className="p-2 text-slate-400 hover:text-red-500 rounded-xl"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="border-t border-lavender" />

          {/* Amenities */}
          <div>
            <h3 className="text-sm font-extrabold text-slate-900 mb-3">5. Amenities</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {AMENITY_KEYS.map((am) => (
                <label
                  key={am.id}
                  className="flex items-center gap-2 p-2.5 border border-lavender rounded-xl cursor-pointer hover:bg-lavender/30 transition-colors"
                >
                  <input
                    type="checkbox"
                    checked={formData.amenities.includes(am.id)}
                    onChange={() => toggleAmenity(am.id)}
                    className="w-3.5 h-3.5 text-powder rounded border-lavender focus:ring-powder"
                  />
                  <span className="font-semibold text-slate-700">{am.label}</span>
                </label>
              ))}
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 bg-gradient-to-r from-powder to-peach text-white font-extrabold rounded-2xl text-sm shadow-soft hover:shadow-card transition-all disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" /> Saving Listing...
              </>
            ) : editingListing ? (
              'Save Listing Updates'
            ) : (
              'Publish Listing'
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ListingFormModal;
