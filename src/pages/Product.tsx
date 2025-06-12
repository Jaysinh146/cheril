
import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Loader2 } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ErrorBoundary from '@/components/ErrorBoundary';
import ProductPageRedesigned from '@/components/product/ProductPageRedesigned';
import ProductRating from '@/components/product/ProductRating';
import ReviewsSection from '@/components/product/ReviewsSection';
import RatingStars from '@/components/product/RatingStars';
import { useProduct } from '@/hooks/useProduct';
import { useWishlist } from '@/hooks/useWishlist';
import { supabase } from '@/integrations/supabase/client';

const Product = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { toast } = useToast();
    const { user } = useAuth();
    const [rentalDays, setRentalDays] = useState<number>(1);
    const [refreshReviews, setRefreshReviews] = useState<number>(0);
  
    // Use custom hooks
    const {
      product,
      isProductLoading,
      productError,
      ratingData,
      activeImage,
      setActiveImage,
      getImageUrl,
      calculateTotalCost,
      getAvailableRentalDays
    } = useProduct(id);
  
    const {
      isItemSaved,
      saveToWishlist
    } = useWishlist(id, user?.id);
  
    // Scroll to top on page load
    useEffect(() => {
      window.scrollTo(0, 0);
    }, []);
  
    // Track product view in Supabase
    useEffect(() => {
      if (!product) return;
      const trackView = async () => {
        await supabase.from('views').insert({
          item_id: product.id,
          viewed_at: new Date().toISOString(),
          viewer_id: user?.id || null,
        });
      };
      trackView();
    }, [product, user]);
  
    // Generate WhatsApp message
    const generateWhatsAppMessage = useCallback((item: any): string => {
      if (!item) return '';
      
      const totalCost = calculateTotalCost(rentalDays, item.price_per_day, item.security_deposit || 0);
      
      return encodeURIComponent(
        `Hi! I'm interested in renting your item "${item.title}" for ${rentalDays} day${rentalDays > 1 ? 's' : ''}. ` +
        `Total cost would be ₹${totalCost.toFixed(2)} (₹${item.price_per_day}/day + ₹${item.security_deposit || 0} deposit). ` +
        `Is it available? Item link: ${window.location.href}`
      );
    }, [rentalDays, calculateTotalCost]);
  
    // Render rating stars
    const renderRatingStars = useCallback((rating: number) => {
      return <RatingStars rating={rating} />;
    }, []);
  
    // Handle review submission
    const handleReviewSubmitted = useCallback(() => {
      setRefreshReviews(prev => prev + 1);
    }, []);

    // Handle wishlist save
    const handleSaveToWishlist = useCallback(() => {
      if (!user) {
        toast({
          title: 'Login Required',
          description: 'Please login to save items to your wishlist',
          variant: 'destructive',
        });
        return;
      }
      
      saveToWishlist.mutate();
    }, [user, saveToWishlist, toast]);
  
    // Loading state
    if (isProductLoading) {
      return (
        <div className="container mx-auto py-8 px-4">
          <div className="flex items-center justify-center h-96">
            <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
          </div>
        </div>
      );
    }
  
    // Error state
    if (productError || !product) {
      return (
        <div className="container mx-auto py-8 px-4 text-center">
          <h2 className="text-2xl font-bold text-red-500 mb-4">Error Loading Product</h2>
          <p className="mb-4">We couldn't find the product you're looking for.</p>
          <Button onClick={() => navigate('/')}>Back to Home</Button>
        </div>
      );
    }
  
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#ffebe3] to-white">
        <Header />
  
        <div className="container mx-auto px-4 py-8 mt-6">
          {/* Breadcrumb */}
          <div className="flex items-center mb-6 mt-6">
            <Button 
              variant="ghost" 
              onClick={() => navigate(-1)}
              className="hover:bg-transparent p-0 mr-2"
            >
              <ArrowLeft size={20} className="text-gray-600" />
            </Button>
            <span className="text-sm text-gray-600">
              <Link to="/" className="hover:underline">Home</Link>
              {' / '}
              <Link to="/search" className="hover:underline">Search</Link>
              {' / '}
              <span className="text-gray-900 font-medium">{product.title}</span>
            </span>
          </div>

          {/* Product Rating Display */}
          {ratingData && ratingData.count > 0 && (
            <div className="mb-4">
              <ProductRating 
                averageRating={ratingData.average_rating} 
                reviewCount={ratingData.count}
                size="lg"
              />
            </div>
          )}
          
          <ErrorBoundary>
            <ProductPageRedesigned
              product={product}
              activeImage={activeImage}
              setActiveImage={setActiveImage}
              getImageUrl={getImageUrl}
              rentalDays={rentalDays}
              setRentalDays={setRentalDays}
              calculateTotalCost={calculateTotalCost}
              isItemSaved={isItemSaved}
              onSaveToWishlist={handleSaveToWishlist}
              getAvailableRentalDays={getAvailableRentalDays}
              onRentNow={() => {
                // Check for phone number in profile data
                // Use either whatsapp_number or phone field, whichever is available
                const contactNumber = product.profiles?.whatsapp_number || product.profiles?.phone;
                
                if (contactNumber) {
                  const message = generateWhatsAppMessage(product);
                  
                  // Format the phone number correctly for WhatsApp API
                  let formattedNumber = contactNumber.replace(/\D/g, ''); // Remove non-digits
                  
                  // Handle country code
                  if (!formattedNumber.startsWith('91') && !formattedNumber.startsWith('+91')) {
                    // If no country code, add Indian country code (adjust based on your target country)
                    formattedNumber = '91' + formattedNumber;
                  } else if (formattedNumber.startsWith('+')) {
                    // Remove '+' if present as WhatsApp API doesn't need it
                    formattedNumber = formattedNumber.substring(1);
                  }
                  
                  console.log('Opening WhatsApp with number:', formattedNumber);
                  window.open(`https://wa.me/${formattedNumber}?text=${message}`, '_blank');
                } else {
                  toast({
                    title: 'Contact Information Missing',
                    description: 'The owner has not provided contact information',
                    variant: 'destructive',
                  });
                }
              }}
            />
          </ErrorBoundary>
  
          <ReviewsSection
            itemId={product.id}
            ownerId={product.owner_id}
            userId={user?.id}
            refreshReviews={refreshReviews}
            onReviewSubmitted={handleReviewSubmitted}
          />
        </div>
  
        <Footer />
      </div>
    );
  };
  
  export default Product;
