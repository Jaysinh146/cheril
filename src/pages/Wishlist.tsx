
import React, { useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useWishlist } from '@/hooks/useWishlist';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Heart, Loader2 } from 'lucide-react';
import OptimizedImage from '@/components/ui/OptimizedImage';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';

const Wishlist = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const {
    wishlistItems,
    isLoadingWishlist,
    saveToWishlist
  } = useWishlist(undefined, user?.id);

  // Redirect to auth if not logged in
  useEffect(() => {
    if (!user) {
      navigate('/auth');
    }
  }, [user, navigate]);

  // Helper function to get Supabase storage image URLs
  const getImageUrl = (path: string | null): string => {
    if (!path) return 'https://placehold.co/600x400/e2e8f0/64748b?text=No+Image';
    
    if (path.startsWith('http')) {
      return path;
    }

    try {
      const { data } = supabase.storage
        .from('item-images')
        .getPublicUrl(path);
      
      return data.publicUrl;
    } catch (error) {
      console.error('Error generating image URL:', error);
      return 'https://placehold.co/600x400/e2e8f0/64748b?text=Error';
    }
  };

  const handleRemoveFromWishlist = (itemId: string) => {
    // This will use the existing wishlist hook but we need to create a temporary hook instance
    // For now, let's handle it directly
    supabase
      .from('wishlists')
      .delete()
      .eq('item_id', itemId)
      .eq('user_id', user?.id)
      .then(() => {
        // Refresh the page or trigger a refetch
        window.location.reload();
      });
  };

  if (!user) {
    return null; // Will redirect via useEffect
  }

  if (isLoadingWishlist) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#ffebe3] to-white">
        <Header />
        <div className="container mx-auto px-4 py-8 mt-6">
          <div className="flex items-center justify-center h-96">
            <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#ffebe3] to-white">
      <Header />
      
      <div className="container mx-auto px-4 py-8 mt-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">My Wishlist</h1>
          <p className="text-gray-600">
            {wishlistItems.length > 0 
              ? `You have ${wishlistItems.length} item${wishlistItems.length > 1 ? 's' : ''} saved` 
              : 'Save items you love to view them later'}
          </p>
        </div>

        {wishlistItems.length === 0 ? (
          <div className="text-center py-12">
            <Heart className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Your wishlist is empty</h3>
            <p className="text-gray-500 mb-6">Start browsing and save items you'd like to rent later.</p>
            <Button onClick={() => navigate('/browse')} className="bg-[#F7996E] hover:bg-[#e8895f]">
              Browse Items
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {wishlistItems.map((wishlistItem) => {
              const item = wishlistItem.items;
              if (!item) return null;

              return (
                <Card key={wishlistItem.id} className="group hover:shadow-lg transition-all duration-200 overflow-hidden">
                  <div className="relative aspect-square overflow-hidden bg-gray-50">
                    <OptimizedImage
                      src={getImageUrl(item.images?.[0] || '')}
                      alt={item.title}
                      className="w-full h-full group-hover:scale-105 transition-transform duration-200"
                      objectFit="cover"
                    />
                    
                    {/* Remove from wishlist button */}
                    <button
                      onClick={() => handleRemoveFromWishlist(item.id)}
                      className="absolute top-2 right-2 p-2 bg-white/80 hover:bg-white rounded-full shadow-md transition-colors"
                    >
                      <Heart className="w-4 h-4 text-red-500 fill-current" />
                    </button>
                    
                    {/* Status badges */}
                    <div className="absolute top-2 left-2 flex flex-col gap-1">
                      <Badge 
                        variant={item.is_available ? "default" : "secondary"}
                        className={`text-xs ${item.is_available ? 'bg-green-500' : 'bg-red-500'}`}
                      >
                        {item.is_available ? 'Available' : 'Unavailable'}
                      </Badge>
                      <Badge 
                        variant="outline" 
                        className={`text-xs ${
                          item.verification_status === 'verified' ? 'bg-blue-50 text-blue-700' :
                          item.verification_status === 'pending' ? 'bg-yellow-50 text-yellow-700' :
                          'bg-red-50 text-red-700'
                        }`}
                      >
                        {item.verification_status === 'verified' ? 'Verified' :
                         item.verification_status === 'pending' ? 'Pending' : 'Rejected'}
                      </Badge>
                    </div>
                  </div>
                  
                  <CardContent className="p-4">
                    <div className="space-y-2">
                      <div>
                        <p className="text-xs text-gray-500 uppercase tracking-wide">
                          {item.categories?.name || 'Category'}
                        </p>
                        <h3 className="font-medium text-base line-clamp-2 text-gray-900">
                          {item.title}
                        </h3>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-lg font-semibold text-gray-900">
                            ₹{item.price_per_day}
                          </p>
                          <p className="text-sm text-gray-500">per day</p>
                        </div>
                      </div>
                      
                      {/* Action button */}
                      <Button
                        onClick={() => navigate(`/product/${item.id}`)}
                        className="w-full mt-3 bg-[#F7996E] hover:bg-[#e8895f] text-white"
                      >
                        View Details
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
};

export default Wishlist;
