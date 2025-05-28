import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Star } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { Database } from '@/lib/database.types';

interface ReviewFormProps {
  itemId: string;
  onReviewSubmitted: () => void;
}

const ReviewForm = ({ itemId, onReviewSubmitted }: ReviewFormProps) => {
  const [rating, setRating] = useState<number>(5);
  const [comment, setComment] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const { toast } = useToast();
  const { user } = useAuth();
  
  // Array of ratings for the star selector
  const ratingOptions = [1, 2, 3, 4, 5];
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      toast({
        title: 'Authentication required',
        description: 'Please sign in to leave a review',
        variant: 'destructive',
      });
      return;
    }
    
    if (rating < 1 || rating > 5) {
      toast({
        title: 'Invalid rating',
        description: 'Please select a rating between 1 and 5 stars',
        variant: 'destructive',
      });
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Create a properly typed review object
      const reviewData: Database['public']['Tables']['reviews']['Insert'] = {
        item_id: itemId,
        reviewer_id: user.id,
        rating,
        comment: comment.trim() || null,
      };
      
      // Type assertion to handle the TypeScript error with the reviews table
      // This is needed until Supabase types are regenerated to include the reviews table
      const { error } = await supabase
        .from('reviews' as any)
        .insert(reviewData);
      
      if (error) throw error;
      
      toast({
        title: 'Review submitted',
        description: 'Thank you for your feedback!',
      });
      
      // Reset form
      setRating(5);
      setComment('');
      
      // Notify parent component to refresh reviews
      onReviewSubmitted();
      
    } catch (error: any) {
      console.error('Error submitting review:', error);
      
      toast({
        title: 'Error submitting review',
        description: error.message || 'Please try again later',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  if (!user) {
    return (
      <div className="text-center py-4 border border-gray-200 rounded-lg">
        <p className="text-gray-600 mb-2">Sign in to leave a review</p>
        <Button className="bg-[#F7996E] hover:bg-[#e8895f] text-white">Sign In</Button>
      </div>
    );
  }
  
  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <h4 className="font-semibold mb-2">Your Rating</h4>
        <div className="flex items-center space-x-1">
          {ratingOptions.map((value) => (
            <button
              key={value}
              type="button"
              onClick={() => setRating(value)}
              className="focus:outline-none"
            >
              <Star
                className={`w-8 h-8 ${
                  value <= rating 
                    ? 'text-yellow-400 fill-current' 
                    : 'text-gray-300'
                }`}
              />
            </button>
          ))}
        </div>
      </div>
      
      <div>
        <h4 className="font-semibold mb-2">Your Review</h4>
        <Textarea
          placeholder="Share your experience with this item..."
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          className="min-h-[120px] border-gray-300 focus:border-[#F7996E]"
        />
      </div>
      
      <Button
        type="submit"
        className="bg-[#F7996E] hover:bg-[#e8895f] text-white"
        disabled={isSubmitting}
      >
        {isSubmitting ? 'Submitting...' : 'Submit Review'}
      </Button>
    </form>
  );
};

export default ReviewForm;
