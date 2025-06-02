
import { useState, useEffect } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';

export const useWishlist = (itemId: string | undefined, userId: string | undefined) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Check if item is saved to wishlist
  const {
    data: wishlistItem,
    isLoading: isCheckingWishlist,
  } = useQuery({
    queryKey: ['wishlist-item', itemId, userId],
    queryFn: async () => {
      if (!itemId || !userId) return null;
      
      const { data, error } = await supabase
        .from('wishlists')
        .select('id')
        .eq('item_id', itemId)
        .eq('user_id', userId)
        .maybeSingle();

      if (error) throw error;
      return data;
    },
    enabled: !!itemId && !!userId,
  });

  // Fetch all wishlist items for the user
  const {
    data: wishlistItems = [],
    isLoading: isLoadingWishlist,
    refetch: refetchWishlist
  } = useQuery({
    queryKey: ['wishlist', userId],
    queryFn: async () => {
      if (!userId) return [];
      
      const { data, error } = await supabase
        .from('wishlists')
        .select(`
          id,
          created_at,
          items:item_id (
            id,
            title,
            price_per_day,
            images,
            is_available,
            verification_status,
            categories:category_id (
              name
            )
          )
        `)
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    },
    enabled: !!userId,
  });

  // Save/remove from wishlist mutation
  const saveToWishlist = useMutation({
    mutationFn: async () => {
      if (!itemId || !userId) {
        throw new Error('Item ID and User ID are required');
      }

      // Check if already in wishlist
      if (wishlistItem) {
        // Remove from wishlist
        const { error } = await supabase
          .from('wishlists')
          .delete()
          .eq('item_id', itemId)
          .eq('user_id', userId);

        if (error) throw error;
        return { action: 'removed' };
      } else {
        // Add to wishlist
        const { error } = await supabase
          .from('wishlists')
          .insert({
            item_id: itemId,
            user_id: userId,
          });

        if (error) throw error;
        return { action: 'added' };
      }
    },
    onSuccess: (result) => {
      // Invalidate and refetch wishlist queries
      queryClient.invalidateQueries({ queryKey: ['wishlist-item', itemId, userId] });
      queryClient.invalidateQueries({ queryKey: ['wishlist', userId] });
      
      toast({
        title: result.action === 'added' ? 'Added to Wishlist' : 'Removed from Wishlist',
        description: result.action === 'added' 
          ? 'Item has been saved to your wishlist' 
          : 'Item has been removed from your wishlist',
      });
    },
    onError: (error) => {
      console.error('Wishlist error:', error);
      toast({
        title: 'Error',
        description: 'Failed to update wishlist. Please try again.',
        variant: 'destructive',
      });
    },
  });

  const isItemSaved = !!wishlistItem;

  return {
    isItemSaved,
    isCheckingWishlist,
    wishlistItems,
    isLoadingWishlist,
    saveToWishlist,
    refetchWishlist
  };
};
