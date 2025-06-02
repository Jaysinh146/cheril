
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { formatDistanceToNow } from 'date-fns';
import RatingStars from './product/RatingStars';

interface Review {
  id: string;
  rating: number;
  comment: string | null;
  created_at: string;
  profiles: {
    id: string;
    full_name: string;
    avatar_url: string;
  };
}

interface ReviewListProps {
  reviews: Review[];
  isLoading: boolean;
}

const ReviewList: React.FC<ReviewListProps> = ({ reviews, isLoading }) => {
  if (isLoading) {
    return (
      <div className="space-y-4">
        {[...Array(3)].map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardContent className="p-4">
              <div className="flex items-start space-x-4">
                <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (!reviews || reviews.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">No reviews yet. Be the first to review this item!</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {reviews.map((review) => (
        <Card key={review.id}>
          <CardContent className="p-4">
            <div className="flex items-start space-x-4">
              <Avatar className="w-10 h-10">
                <AvatarImage 
                  src={review.profiles?.avatar_url} 
                  alt={review.profiles?.full_name || 'User'} 
                />
                <AvatarFallback>
                  {review.profiles?.full_name?.charAt(0) || 'U'}
                </AvatarFallback>
              </Avatar>
              
              <div className="flex-1">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium text-gray-900">
                    {review.profiles?.full_name || 'Anonymous User'}
                  </h4>
                  <span className="text-sm text-gray-500">
                    {formatDistanceToNow(new Date(review.created_at), { addSuffix: true })}
                  </span>
                </div>
                
                <div className="mb-2">
                  <RatingStars rating={review.rating} />
                </div>
                
                {review.comment && (
                  <p className="text-gray-700 text-sm leading-relaxed">
                    {review.comment}
                  </p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default ReviewList;
