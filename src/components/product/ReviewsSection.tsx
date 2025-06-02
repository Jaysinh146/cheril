
import React, { memo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { supabase } from '@/integrations/supabase/client';
import ReviewForm from '@/components/ReviewForm';
import ReviewList from '@/components/ReviewList';
import ErrorBoundary from '@/components/ErrorBoundary';

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

interface ReviewsSectionProps {
  itemId: string;
  ownerId: string;
  userId?: string;
  refreshReviews: number;
  onReviewSubmitted: () => void;
}

const ReviewsSection: React.FC<ReviewsSectionProps> = ({
  itemId,
  ownerId,
  userId,
  refreshReviews,
  onReviewSubmitted
}) => {
  // Fetch reviews data
  const {
    data: reviews = [],
    isLoading: isReviewsLoading,
    error: reviewsError,
  } = useQuery({
    queryKey: ['reviews', itemId, refreshReviews],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('reviews')
        .select(`
          id,
          rating,
          comment,
          created_at,
          profiles:reviewer_id(
            id,
            full_name,
            avatar_url
          )
        `)
        .eq('item_id', itemId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as Review[];
    },
    enabled: !!itemId,
  });

  return (
    <ErrorBoundary>
      <div className="mt-12">
        <h2 className="text-2xl font-bold mb-6">Reviews & Ratings</h2>
        
        <Tabs defaultValue="reviews" className="w-full">
          <TabsList className="mb-6">
            <TabsTrigger value="reviews">Reviews</TabsTrigger>
            {/* Make the Write a Review tab always visible when user is logged in */}
            {userId && (
              <TabsTrigger value="write">Write a Review</TabsTrigger>
            )}
          </TabsList>
          
          <TabsContent value="reviews">
            <ReviewList 
              reviews={reviews}
              isLoading={isReviewsLoading}
            />
          </TabsContent>
          
          {/* Allow users to write reviews if they're logged in */}
          {userId && (
            <TabsContent value="write">
              <ReviewForm 
                itemId={itemId} 
                onReviewSubmitted={onReviewSubmitted} 
              />
            </TabsContent>
          )}
        </Tabs>
      </div>
    </ErrorBoundary>
  );
};

export default memo(ReviewsSection);
