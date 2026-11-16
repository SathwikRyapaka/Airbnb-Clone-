import React, { useState } from 'react';
import { X, Star, Loader2 } from 'lucide-react';
import { reviewService } from '../../services/api';
import { useAuth } from '../../context/AuthContext';

const AddReviewModal = ({ isOpen, onClose, listingId, onReviewAdded }) => {
  const { showToast } = useAuth();
  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState('');
  const [cleanliness, setCleanliness] = useState(5);
  const [accuracy, setAccuracy] = useState(5);
  const [communication, setCommunication] = useState(5);
  const [locationScore, setLocationScore] = useState(5);
  const [checkInScore, setCheckInScore] = useState(5);
  const [valueScore, setValueScore] = useState(5);
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!comment.trim()) {
      showToast('Please provide some comments about your experience.', 'error');
      return;
    }

    setLoading(true);
    try {
      const res = await reviewService.create({
        listingId,
        rating,
        comment,
        ratingsDetail: {
          cleanliness,
          accuracy,
          communication,
          location: locationScore,
          checkIn: checkInScore,
          value: valueScore,
        },
      });

      if (res.success) {
        showToast('Review submitted successfully!');
        if (onReviewAdded) onReviewAdded(res.review);
        onClose();
      }
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to submit review.', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl overflow-hidden border border-neutral-100 flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-100">
          <h3 className="text-sm font-bold text-neutral-900">Write a Review</h3>
          <button
            onClick={onClose}
            className="p-1 rounded-full hover:bg-neutral-100 text-neutral-500 hover:text-neutral-900"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-5 flex-1">
          {/* Overall Star Rating */}
          <div className="text-center">
            <p className="text-xs font-semibold text-neutral-600 mb-2">Overall Rating</p>
            <div className="flex items-center justify-center gap-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  type="button"
                  key={star}
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHoverRating(star)}
                  onMouseLeave={() => setHoverRating(0)}
                  className="p-1 focus:outline-none transition-transform hover:scale-125"
                >
                  <Star
                    className={`w-7 h-7 ${
                      (hoverRating || rating) >= star
                        ? 'fill-rose-500 text-rose-500'
                        : 'fill-neutral-200 text-neutral-200'
                    }`}
                  />
                </button>
              ))}
            </div>
            <p className="text-xs text-neutral-500 mt-1 font-medium">
              {rating === 5
                ? 'Exceptional'
                : rating === 4
                ? 'Very good'
                : rating === 3
                ? 'Average'
                : 'Could be better'}
            </p>
          </div>

          <div className="border-t border-neutral-100" />

          {/* Sub-scores */}
          <div className="space-y-3">
            <p className="text-xs font-bold text-neutral-800">Category Ratings</p>
            {[
              { label: 'Cleanliness', value: cleanliness, setter: setCleanliness },
              { label: 'Accuracy', value: accuracy, setter: setAccuracy },
              { label: 'Communication', value: communication, setter: setCommunication },
              { label: 'Location', value: locationScore, setter: setLocationScore },
              { label: 'Check-in', value: checkInScore, setter: setCheckInScore },
              { label: 'Value', value: valueScore, setter: setValueScore },
            ].map(({ label, value, setter }) => (
              <div key={label} className="flex items-center justify-between text-xs">
                <span className="text-neutral-700 font-medium">{label}</span>
                <div className="flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <button
                      type="button"
                      key={s}
                      onClick={() => setter(s)}
                      className={`w-6 h-6 rounded text-[11px] font-bold border transition-colors ${
                        value === s
                          ? 'bg-neutral-900 text-white border-neutral-900'
                          : 'bg-white text-neutral-600 border-neutral-200 hover:border-neutral-400'
                      }`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div className="border-t border-neutral-100" />

          {/* Feedback Text */}
          <div>
            <label className="block text-xs font-semibold text-neutral-700 mb-1.5">
              Your Review & Experiences
            </label>
            <textarea
              required
              rows={4}
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Tell other travelers what you loved about this place, the neighborhood, and the host's hospitality..."
              className="w-full p-3 text-xs rounded-xl border border-neutral-300 focus:ring-2 focus:ring-rose-500 focus:outline-none"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-gradient-to-r from-rose-500 to-rose-600 text-white font-bold rounded-xl text-xs hover:from-rose-600 hover:to-rose-700 shadow-md transition-all disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" /> Submitting...
              </>
            ) : (
              'Submit Review'
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddReviewModal;
