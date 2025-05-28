import React, { memo } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import ReviewForm from '@/components/ReviewForm';
import ReviewList from '@/components/ReviewList';
import ErrorBoundary from '@/components/ErrorBoundary';

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
              itemId={itemId} 
              refreshTrigger={refreshReviews} 
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
