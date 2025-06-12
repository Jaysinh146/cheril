
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
  available_from?: string | null;
  available_till?: string | null;
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
          profiles:owner_id(id, full_name, avatar_url, created_at, updated_at, phone, whatsapp_number)
        `)
        .eq('id', id)
        .single();

      if (error) throw error;
      
      console.log('Raw profile data from Supabase:', data.profiles);
      
      // Transform the data to match our ExtendedItem type
      const transformedData = {
        ...data,
        profiles: {
          ...data.profiles,
          // Use full_name as username
          username: data.profiles?.full_name || `User ${data.owner_id.substring(0, 5)}`,
          // Add missing fields with defaults
          bio: '',
          location: data.location || '',
          website: '',
          // Keep the whatsapp_number and phone as they are from the database
          whatsapp_number: data.profiles?.whatsapp_number || null,
          phone: data.profiles?.phone || null
        }
      };
      
      console.log('Transformed profile data:', transformedData.profiles);
      
      return transformedData as unknown as ExtendedItem;
    },
    enabled: !!id,
  });

  // Fetch rating data using reviews table
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
        // Fetch reviews for this item and calculate average
        const { data: reviews, error } = await supabase
          .from('reviews')
          .select('rating')
          .eq('item_id', id);
        
        if (error) {
          console.warn('Error fetching reviews:', error.message);
          return { average_rating: 0, count: 0 } as AverageRatingResponse;
        }
        
        if (!reviews || reviews.length === 0) {
          return { average_rating: 0, count: 0 } as AverageRatingResponse;
        }

        const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
        const averageRating = totalRating / reviews.length;
        
        return { 
          average_rating: Number(averageRating.toFixed(1)), 
          count: reviews.length 
        } as AverageRatingResponse;
      } catch (err) {
        console.error('Failed to get ratings:', err);
        return { average_rating: 0, count: 0 } as AverageRatingResponse;
      }
    },
    enabled: !!id,
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

  // Calculate available rental days based on availability dates
  const getAvailableRentalDays = (): number | null => {
    if (!product?.available_from || !product?.available_till) {
      return null; // No availability restrictions
    }

    const fromDate = new Date(product.available_from);
    const tillDate = new Date(product.available_till);
    const diffTime = tillDate.getTime() - fromDate.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1; // Include both start and end dates
    
    return Math.max(1, diffDays);
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
    calculateTotalCost,
    getAvailableRentalDays
  };
};
