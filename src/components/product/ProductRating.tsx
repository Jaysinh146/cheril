
import React from 'react';
import { Star } from 'lucide-react';

interface ProductRatingProps {
  averageRating: number;
  reviewCount: number;
  showReviewText?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

const ProductRating: React.FC<ProductRatingProps> = ({ 
  averageRating, 
  reviewCount, 
  showReviewText = true,
  size = 'md'
}) => {
  if (reviewCount === 0) return null;

  const sizeClasses = {
    sm: 'text-xs',
    md: 'text-sm',
    lg: 'text-base'
  };

  const starSizes = {
    sm: 'w-3 h-3',
    md: 'w-4 h-4',
    lg: 'w-5 h-5'
  };

  return (
    <div className={`flex items-center gap-1 ${sizeClasses[size]}`}>
      <Star className={`${starSizes[size]} fill-yellow-400 text-yellow-400`} />
      <span className="font-medium text-gray-900">
        {averageRating.toFixed(1)}/5
      </span>
      {showReviewText && (
        <span className="text-gray-500">
          ({reviewCount} review{reviewCount !== 1 ? 's' : ''})
        </span>
      )}
    </div>
  );
};

export default ProductRating;
