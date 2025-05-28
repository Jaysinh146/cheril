import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';

export const useWishlist = (itemId: string | undefined, userId: string | undefined) => {
  const [isItemSaved, setIsItemSaved] = useState<boolean>(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Check if item is in wishlist
  const { data: wishlistData } = useQuery({
    queryKey: ['wishlist-check', itemId, userId],
    queryFn: async () => {
      if (!userId || !itemId) return null;

      const { data, error } = await supabase
        .from('wishlists')
        .select('id')
        .eq('user_id', userId)
        .eq('item_id', itemId)
        .single();

      if (error && error.code !== 'PGRST116') { // PGRST116 is the error code for no rows returned
        console.error('Error checking wishlist:', error);
        return null;
      }

      return data;
    },
    enabled: !!itemId && !!userId,
  });

  // Update isItemSaved state when wishlistData changes
  useEffect(() => {
    setIsItemSaved(!!wishlistData);
  }, [wishlistData]);

  // Save to wishlist mutation
  const saveToWishlist = useMutation({
    mutationFn: async () => {
      if (!userId || !itemId) throw new Error('User not authenticated or invalid item');

      if (isItemSaved) {
        // Remove from wishlist
        const { error } = await supabase
          .from('wishlists')
          .delete()
          .eq('user_id', userId)
          .eq('item_id', itemId);

        if (error) throw error;
        return { added: false };
      } else {
        // Add to wishlist
        const { error } = await supabase
          .from('wishlists')
          .insert({
            user_id: userId,
            item_id: itemId
          });

        if (error) throw error;
        return { added: true };
      }
    },
    onSuccess: (data) => {
      // Invalidate and refetch wishlist data
      queryClient.invalidateQueries({ queryKey: ['wishlist-check', itemId, userId] });
      queryClient.invalidateQueries({ queryKey: ['wishlist', userId] });
      
      setIsItemSaved(data.added);
      
      toast({
        title: data.added ? 'Item saved' : 'Item removed',
        description: data.added 
          ? 'Item has been added to your wishlist' 
          : 'Item has been removed from your wishlist',
        variant: 'default',
      });
    },
    onError: (error) => {
      toast({
        title: 'Error',
        description: `Failed to update wishlist: ${error instanceof Error ? error.message : 'Unknown error'}`,
        variant: 'destructive',
      });
    }
  });

  return {
    isItemSaved,
    saveToWishlist
  };
};
