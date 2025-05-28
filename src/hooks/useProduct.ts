import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

// Type for extended item
export type ExtendedItem = {
  category_id: string;
  created_at: string;
  description: string;
  id: string;
  images: string[];
  is_available: boolean;
  location: string;
  owner_id: string;
  price_per_day: number;
  title: string;
  updated_at: string;
  verification_status: string;
  condition?: string;
  brand?: string;
  model?: string;
  year?: number;
  color?: string;
  dimensions?: string;
  security_deposit?: number;
  categories: {
    id: string;
    name: string;
  };
  profiles: {
    id: string;
    username: string;
    avatar_url: string;
    bio: string;
    location: string;
    website: string;
    created_at: string;
    updated_at: string;
    whatsapp_number?: string;
    phone?: string;
  };
};

// Type for RPC response
export type AverageRatingResponse = {
  average_rating: number;
  count: number;
};

export const useProduct = (id: string | undefined) => {
  const [activeImage, setActiveImage] = useState<string>('');

  // Fetch product data
  const {
    data: product,
    isLoading: isProductLoading,
    error: productError,
    isError: isProductError,
  } = useQuery({
    queryKey: ['product', id],
    queryFn: async () => {
      if (!id) throw new Error('No item ID provided');

      const { data, error } = await supabase
        .from('items')
        .select(`
          *,
          categories(*),
          profiles:owner_id(id, username:full_name, avatar_url, created_at, updated_at, phone:phone)
        `)
        .eq('id', id)
        .single();

      if (error) throw error;
      
      // Transform the data to match our ExtendedItem type
      const transformedData = {
        ...data,
        profiles: {
          ...data.profiles,
          // Use profile data to set username (from query it comes as 'username' because we aliased full_name)
          username: data.profiles?.username || `User ${data.owner_id.substring(0, 5)}`,
          // Add missing fields with defaults
          bio: '',
          location: data.location || '',
          website: '',
          whatsapp_number: data.profiles?.phone || ''
        }
      };
      
      return transformedData as unknown as ExtendedItem;
    },
    enabled: !!id,
  });

  // Fetch rating data
  const {
    data: ratingData,
    isLoading: isRatingLoading,
    error: ratingError,
    isError: isRatingError,
  } = useQuery({
    queryKey: ['product-rating', id],
    queryFn: async () => {
      if (!id) throw new Error('No item ID provided');

      try {
        // First try to use the RPC function if it exists
        const { data, error } = await (supabase.rpc as any)('get_average_rating_for_item', {
          item_id: id,
        });
        
        if (error) {
          console.warn('RPC function error:', error.message);
          // If the function doesn't exist, return a default value
          if (error.code === '404' || error.message.includes('not found')) {
            return { average_rating: 0, count: 0 } as AverageRatingResponse;
          }
          throw error;
        }
        
        return data as AverageRatingResponse;
      } catch (err) {
        console.error('Failed to get ratings:', err);
        // Fallback to a default value
        return { average_rating: 0, count: 0 } as AverageRatingResponse;
      }
    },
    enabled: !!id,
    // Don't retry too many times if the function doesn't exist
    retry: 1,
  });

  // Update active image when product data changes
  useEffect(() => {
    if (product?.images && product.images.length > 0) {
      setActiveImage(getImageUrl(product.images[0]));
    }
  }, [product]);

  // Helper function to get Supabase storage image URLs
  const getImageUrl = (path: string | null): string => {
    // Return placeholder for empty paths
    if (!path) return 'https://placehold.co/600x400/e2e8f0/64748b?text=No+Image';
    
    // If it's already a full URL, return it
    if (path.startsWith('http')) {
      return path;
    }

    try {
      // Check if path is valid
      if (typeof path !== 'string' || path.trim() === '') {
        return 'https://placehold.co/600x400/e2e8f0/64748b?text=No+Image';
      }
      
      // Use Supabase's getPublicUrl method to get the correct URL
      const { data } = supabase.storage
        .from('item-images')
        .getPublicUrl(path);
      
      // Log for debugging
      console.log('Path processed in useProduct:', path);
      console.log('Generated URL in useProduct:', data.publicUrl);
      
      return data.publicUrl;
    } catch (error) {
      console.error('Error generating image URL:', error);
      return 'https://placehold.co/600x400/e2e8f0/64748b?text=Error';
    }
  };

  // Calculate rental cost
  const calculateTotalCost = (days: number, pricePerDay: number, deposit: number = 0): number => {
    return (days * pricePerDay) + deposit;
  };

  return {
    product,
    isProductLoading,
    productError,
    isProductError,
    ratingData,
    isRatingLoading,
    ratingError,
    isRatingError,
    activeImage,
    setActiveImage,
    getImageUrl,
    calculateTotalCost
  };
};
