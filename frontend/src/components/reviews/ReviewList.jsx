import React from 'react';
import { Star, Trash2 } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const RatingBar = ({ label, score }) => {
  const percentage = Math.min(100, Math.max(0, (score / 5) * 100));

  return (
    <div className="flex items-center justify-between text-xs font-medium text-neutral-800">
      <span className="w-32">{label}</span>
      <div className="flex items-center gap-3 flex-1 max-w-[140px]">
        <div className="h-1 bg-neutral-200 rounded-full w-full overflow-hidden">
          <div
            className="h-full bg-neutral-900 rounded-full"
            style={{ width: `${percentage}%` }}
          />
        </div>
        <span className="font-bold text-[11px] w-6 text-right">{score?.toFixed(1) || '5.0'}</span>
      </div>
    </div>
  );
};

const ReviewList = ({
  reviews = [],
  rating = 0,
  reviewCount = 0,
  categoryAverages = {},
  onDeleteReview,
  onOpenAddReview,
}) => {
  const { user } = useAuth();

  return (
    <div className="py-8 border-t border-neutral-200">
      {/* Reviews Summary Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div className="flex items-center gap-2 text-xl font-bold text-neutral-900">
          <Star className="w-6 h-6 fill-neutral-900" />
          <span>{rating > 0 ? rating.toFixed(2) : 'No reviews yet'}</span>
          {reviewCount > 0 && (
            <>
              <span className="text-neutral-400">·</span>
              <span>{reviewCount} review{reviewCount > 1 ? 's' : ''}</span>
            </>
          )}
        </div>

        {onOpenAddReview && (
          <button
            onClick={onOpenAddReview}
            className="self-start sm:self-auto py-2 px-5 border border-neutral-900 rounded-xl text-xs font-semibold text-neutral-900 hover:bg-neutral-50 transition-colors"
          >
            Write a review
          </button>
        )}
      </div>

      {/* Category breakdown ratings */}
      {reviewCount > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-3 mb-10 pb-8 border-b border-neutral-100">
          <RatingBar label="Cleanliness" score={categoryAverages.cleanliness || 5.0} />
          <RatingBar label="Accuracy" score={categoryAverages.accuracy || 5.0} />
          <RatingBar label="Communication" score={categoryAverages.communication || 5.0} />
          <RatingBar label="Location" score={categoryAverages.location || 5.0} />
          <RatingBar label="Check-in" score={categoryAverages.checkIn || 5.0} />
          <RatingBar label="Value" score={categoryAverages.value || 5.0} />
        </div>
      )}

      {/* Individual reviews grid */}
      {reviews.length === 0 ? (
        <p className="text-sm text-neutral-500 italic">
          Be the first guest to leave a review for this home!
        </p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {reviews.map((rev) => {
            const isAuthor = user && rev.user?._id === user.id;

            return (
              <div key={rev._id} className="flex flex-col gap-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <img
                      src={
                        rev.user?.avatar ||
                        'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=100&q=80'
                      }
                      alt={rev.user?.name || 'Reviewer'}
                      className="w-10 h-10 rounded-full object-cover border border-neutral-200"
                    />
                    <div>
                      <h4 className="text-sm font-bold text-neutral-900">{rev.user?.name || 'Guest'}</h4>
                      <p className="text-xs text-neutral-500">
                        {new Date(rev.createdAt).toLocaleDateString('en-US', {
                          month: 'long',
                          year: 'numeric',
                        })}
                      </p>
                    </div>
                  </div>

                  {isAuthor && onDeleteReview && (
                    <button
                      onClick={() => onDeleteReview(rev._id)}
                      className="text-neutral-400 hover:text-red-500 p-1 rounded transition-colors"
                      title="Delete your review"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>

                <div className="flex items-center gap-1 text-xs text-neutral-700">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      className={`w-3.5 h-3.5 ${
                        i < rev.rating
                          ? 'fill-neutral-900 text-neutral-900'
                          : 'fill-neutral-200 text-neutral-200'
                      }`}
                    />
                  ))}
                </div>

                <p className="text-sm text-neutral-700 leading-relaxed">{rev.comment}</p>

                {rev.hostResponse && (
                  <div className="mt-2 pl-3 border-l-2 border-neutral-300 bg-neutral-50 p-2.5 rounded-r-xl">
                    <p className="text-xs font-bold text-neutral-800">Response from host:</p>
                    <p className="text-xs text-neutral-600 mt-0.5">{rev.hostResponse}</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default ReviewList;
