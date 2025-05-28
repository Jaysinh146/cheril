import React from 'react';
import { Star, User } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Skeleton } from '@/components/ui/skeleton';
import { Database } from '@/lib/database.types';

// Define Review type until Supabase types are properly updated
type Review = {
  id: string;
  rating: number;
  comment: string | null;
  created_at: string;
  reviewer_id: string;
  profiles: {
    id: string;
    full_name: string | null;
    avatar_url: string | null;
  };
};

// The Review type is now imported from supabase.types.ts

interface ReviewListProps {
  itemId: string;
  refreshTrigger: number;
}

const ReviewList = ({ itemId, refreshTrigger }: ReviewListProps) => {
  const { data: reviews, isLoading, error } = useQuery<Review[]>({
    queryKey: ['reviews', itemId, refreshTrigger],
    queryFn: async () => {
      // Use type assertion to handle TypeScript errors with reviews table
      const { data, error } = await supabase
        .from('reviews' as any)
        .select(`
          id,
          rating,
          comment,
          created_at,
          reviewer_id,
          profiles:reviewer_id (id, full_name, avatar_url)
        `)
        .eq('item_id', itemId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as unknown as Review[];
    },
  });
  
  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }).map((_, index) => (
      <Star
        key={index}
        className={`h-4 w-4 ${
          index < rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
        }`}
      />
    ));
  };
  
  if (isLoading) {
    return (
      <div className="space-y-4">
        {Array.from({ length: 3 }).map((_, index) => (
          <div key={index} className="border rounded-lg p-4 space-y-3">
            <div className="flex items-center space-x-2">
              <Skeleton className="h-10 w-10 rounded-full" />
              <div className="space-y-1">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-3 w-24" />
              </div>
            </div>
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-16 w-full" />
          </div>
        ))}
      </div>
    );
  }
  
  if (error) {
    return <div className="text-red-500">Error loading reviews: {error.message}</div>;
  }
  
  if (!reviews || reviews.length === 0) {
    return (
      <div className="text-center py-8 border border-dashed border-gray-200 rounded-lg">
        <p className="text-gray-500">No reviews yet. Be the first to leave a review!</p>
      </div>
    );
  }
  
  return (
    <div className="space-y-6">
      {reviews.map((review) => (
        <div key={review.id} className="border border-gray-200 rounded-lg p-4 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center space-x-3">
              <div className="bg-gray-100 p-2 rounded-full">
                {review.profiles?.avatar_url ? (
                  <img 
                    src={review.profiles.avatar_url} 
                    alt={review.profiles.username || 'User'}
                    className="h-8 w-8 rounded-full object-cover"
                  />
                ) : (
                  <User className="h-5 w-5 text-gray-500" />
                )}
              </div>
              <div>
                <p className="font-medium">{review.profiles?.full_name || 'Anonymous User'}</p>
                <p className="text-sm text-gray-500">
                  {formatDistanceToNow(new Date(review.created_at), { addSuffix: true })}
                </p>
              </div>
            </div>
          </div>
          
          <div className="flex mb-2">
            {renderStars(review.rating)}
          </div>
          
          {review.comment && (
            <p className="text-gray-700 mt-2">{review.comment}</p>
          )}
        </div>
      ))}
    </div>
  );
};

export default ReviewList;
