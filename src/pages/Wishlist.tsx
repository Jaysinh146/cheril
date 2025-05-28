import React from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useToast } from '@/components/ui/use-toast';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

const Wishlist = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  // Fetch saved items with a two-step approach
  const { data: wishlistItems = [], isLoading, error } = useQuery({
    queryKey: ['wishlist', user?.id],
    queryFn: async () => {
      if (!user) return [];

      try {
        // Step 1: Get all wishlist entries for the user
        // Use type assertion to bypass TypeScript schema validation
        const { data: wishlistData, error: wishlistError } = await supabase
          .from('wishlists' as any)
          .select('id, item_id, created_at')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false });
        
        if (wishlistError) {
          console.error('Wishlist fetch error:', wishlistError);
          return [];
        }
        
        if (!wishlistData || wishlistData.length === 0) {
          return [];
        }
        
        // Step 2: Get item details for all wishlist items in one query
        const itemIds = wishlistData.map((entry: any) => entry.item_id);
        
        if (itemIds.length === 0) {
          return [];
        }
        
        // Use proper .in() format with an array, not a string
        // Use type assertion to bypass TypeScript schema validation
        const { data: itemsData, error: itemsError } = await supabase
          .from('items' as any)
          .select(`
            id, 
            title, 
            price_per_day, 
            images, 
            location, 
            category_id,
            owner_id,
            security_deposit,
            profiles(id, full_name)
          `)
          .in('id', itemIds);
        
        if (itemsError) {
          console.error('Items fetch error:', itemsError);
          return [];
        }
        
        if (!itemsData) {
          return [];
        }
        
        // Define proper type for items to fix spread error
        interface ItemData {
          id: string;
          title: string;
          price_per_day: number;
          images: string[];
          location: string;
          category_id: string;
          owner_id: string;
          security_deposit?: number;
          profiles?: {
            id: string;
            full_name?: string;
          };
          [key: string]: any; // Allow other properties
        }
        
        // Merge wishlist data with item data
        return wishlistData.map((wishlistEntry: any) => {
          // Find the matching item and cast it properly to avoid TypeScript errors
          const matchingItem = itemsData.find((item: any) => item.id === wishlistEntry.item_id);
          if (!matchingItem) return null;
          
          // Cast to unknown first to avoid TypeScript conversion errors
          const itemData = matchingItem as unknown as ItemData;
          
          // Create a new object with all properties from the properly cast itemData plus wishlist_id
          return {
            ...itemData,
            wishlist_id: wishlistEntry.id
          };
        }).filter(Boolean);
      } catch (error) {
        console.error('Error fetching wishlist items:', error);
        // Return empty array instead of throwing to prevent component crash
        return [];
      }
    },
    enabled: !!user,
    retry: 1 // Limit retries to prevent excessive failed requests
  });

  // Remove from wishlist
  const removeFromWishlist = useMutation({
    mutationFn: async (wishlistId: string) => {
      const { error } = await supabase
        .from('wishlists' as any)
        .delete()
        .eq('id', wishlistId);
      
      if (error) throw error;
      return wishlistId;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['wishlist', user?.id] });
      
      toast({
        title: 'Item removed',
        description: 'Item has been removed from your wishlist',
      });
    },
    onError: (error) => {
      toast({
        title: 'Error',
        description: 'Failed to remove item from wishlist',
        variant: 'destructive',
      });
      console.error('Error removing from wishlist:', error);
    }
  });

  // Helper function to get image URL
  const getImageUrl = (path: string): string => {
    if (!path) return 'https://placehold.co/400x400/f0f0f0/999999?text=No+Image';
    
    if (path.startsWith('http')) {
      return path;
    }
    
    try {
      const { data } = supabase.storage
        .from('item-images')
        .getPublicUrl(path);
      
      return data.publicUrl;
    } catch (error) {
      console.error('Error getting image URL:', error);
      return 'https://placehold.co/400x400/f0f0f0/999999?text=No+Image';
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <div className="text-center py-12 border border-dashed border-gray-200 rounded-lg">
            <p className="text-gray-500 mb-4">Please sign in to view your wishlist</p>
            <Button 
              onClick={() => navigate('/auth')} 
              className="bg-[#F7996E] hover:bg-[#e8895f] text-white"
            >
              Sign In
            </Button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <h1 className="text-3xl font-bold mb-8">My Wishlist</h1>
          <div className="text-center py-12">
            <p className="text-gray-500">Loading your wishlist...</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <h1 className="text-3xl font-bold mb-8">My Wishlist</h1>
          <div className="text-center py-12 border border-dashed border-red-200 rounded-lg">
            <p className="text-red-500 mb-4">There was an error loading your wishlist</p>
            <Button 
              onClick={() => window.location.reload()} 
              className="bg-[#F7996E] hover:bg-[#e8895f] text-white"
            >
              Try Again
            </Button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <Header />
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">My Wishlist</h1>
        
        {wishlistItems.length === 0 ? (
          <div className="text-center py-12 border border-dashed border-gray-200 rounded-lg">
            <p className="text-gray-500 mb-4">Your wishlist is empty</p>
            <Button 
              onClick={() => navigate('/browse')} 
              className="bg-[#F7996E] hover:bg-[#e8895f] text-white"
            >
              Browse Items
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {wishlistItems.map((item: any) => (
              <Card key={item.id} className="overflow-hidden h-full">
                <div className="relative aspect-square overflow-hidden">
                  <img 
                    src={item.images && item.images.length > 0 ? getImageUrl(item.images[0]) : 'https://placehold.co/400x400/f0f0f0/999999?text=No+Image'} 
                    alt={item.title} 
                    className="w-full h-full object-cover transition-transform hover:scale-105"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = 'https://placehold.co/400x400/f0f0f0/999999?text=No+Image';
                    }}
                  />
                  <Button
                    variant="destructive"
                    size="icon"
                    className="absolute top-2 right-2 h-8 w-8 rounded-full bg-white/80 hover:bg-white text-red-500"
                    onClick={() => removeFromWishlist.mutate(item.wishlist_id)}
                    disabled={removeFromWishlist.isPending}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
                
                <CardContent className="p-4">
                  <h3 className="font-semibold text-gray-800 line-clamp-1 mb-1">{item.title}</h3>
                  <div className="flex justify-between items-center">
                    <span className="text-[#F7996E] font-medium">₹{item.price_per_day}/day</span>
                    <span className="text-sm text-gray-500">{item.location}</span>
                  </div>
                  {item.security_deposit && (
                    <p className="text-xs text-gray-500 mt-1">
                      Deposit: ${item.security_deposit}
                    </p>
                  )}
                  <Button
                    onClick={() => navigate(`/product/${item.id}`)}
                    className="w-full mt-3 bg-[#F7996E] hover:bg-[#e8895f] text-white"
                  >
                    View Details
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default Wishlist;
