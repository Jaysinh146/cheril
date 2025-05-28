import React from 'react';
import { Star } from 'lucide-react';

interface RatingStarsProps {
  rating: number;
  className?: string;
}

const RatingStars: React.FC<RatingStarsProps> = ({ rating, className = '' }) => {
  // Create an array of 5 stars
  const stars = Array.from({ length: 5 }, (_, i) => {
    // Determine fill level of each star
    if (i < Math.floor(rating)) {
      return 'fill-yellow-400'; // Full star
    } else if (i < Math.ceil(rating) && rating % 1 !== 0) {
      return 'fill-yellow-400 half-filled'; // Half star (using CSS for styling)
    } else {
      return 'fill-gray-200'; // Empty star
    }
  });

  return (
    <div className={`flex ${className}`}>
      {stars.map((fillClass, idx) => (
        <Star
          key={idx}
          size={18}
          className={`${fillClass} text-yellow-400 ${idx > 0 ? 'ml-1' : ''}`}
        />
      ))}
    </div>
  );
};

export default RatingStars;
