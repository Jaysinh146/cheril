import React, { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Heart } from 'lucide-react';
import { Search, Filter, MapPin, Star, X, CheckCircle } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { supabase } from '@/integrations/supabase/client';
import { useQuery } from '@tanstack/react-query';
import { useAuth } from '@/contexts/AuthContext';
import { useWishlist } from '@/hooks/useWishlist';
import { useToast } from '@/components/ui/use-toast';

// Define types for our data
type Category = {
  id: string;
  name: string;
  description: string | null;
  icon: string | null;
  created_at: string;
};

type Profile = {
  full_name: string | null;
  avatar_url: string | null;
};

// Rating type for average ratings data
type RatingData = {
  itemId: string;
  averageRating: number;
  count: number;
};

type Item = {
  id: string;
  title: string;
  description: string | null;
  category_id: string;
  price_per_day: number;
  location: string;
  owner_id: string;
  images: string[] | null;
  is_available: boolean | null;
  verification_status: string | null;
  created_at: string;
  updated_at: string;
  categories: { name: string } | null;
  profiles: Profile | null;
  // Added rating fields to store the calculated average rating and count
  rating?: number;
  ratingCount?: number;
};

const Browse = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [priceRange, setPriceRange] = useState([0, 1000]);
  const [showFilters, setShowFilters] = useState(false);
  const [sortBy, setSortBy] = useState('relevance');
  const [wishlistItems, setWishlistItems] = useState<string[]>([]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  
  // Fetch user's wishlist items
  useEffect(() => {
    const fetchWishlistItems = async () => {
      if (!user) return;
      
      try {
        const { data, error } = await supabase
          .from('wishlists' as any)
          .select('item_id')
          .eq('user_id', user.id);
          
        if (error) throw error;
        
        if (data) {
          // Use type assertion to avoid TypeScript errors
          const safeData = data as any[];
          setWishlistItems(safeData.map(item => item.item_id));
        }
      } catch (error) {
        console.error('Error fetching wishlist:', error);
      }
    };
    
    fetchWishlistItems();
  }, [user]);
  
  // Toggle wishlist function
  const toggleWishlist = async (e: React.MouseEvent, itemId: string) => {
    e.preventDefault(); // Prevent navigation to product page
    e.stopPropagation(); // Stop event propagation
    
    if (!user) {
      toast({
        title: 'Authentication required',
        description: 'Please sign in to save items to your wishlist',
        variant: 'destructive',
      });
      return;
    }
    
    try {
      const isInWishlist = wishlistItems.includes(itemId);
      
      if (isInWishlist) {
        // Remove from wishlist
        await supabase
          .from('wishlists' as any)
          .delete()
          .eq('user_id', user.id)
          .eq('item_id', itemId);
          
        setWishlistItems(prev => prev.filter(id => id !== itemId));
        
        toast({
          title: 'Item removed',
          description: 'Item has been removed from your wishlist',
        });
      } else {
        // Add to wishlist
        await supabase
          .from('wishlists' as any)
          .insert({
            user_id: user.id,
            item_id: itemId
          } as any);
          
        setWishlistItems(prev => [...prev, itemId]);
        
        toast({
          title: 'Item saved',
          description: 'Item has been added to your wishlist',
        });
      }
    } catch (error) {
      console.error('Error updating wishlist:', error);
      toast({
        title: 'Error',
        description: 'Failed to update wishlist. Please try again.',
        variant: 'destructive',
      });
    }
  };

  // Fetch categories
  const { data: categories = [] } = useQuery<Category[]>({
    queryKey: ['categories'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .order('name');
      
      if (error) throw error;
      return data;
    },
  });

  // Fetch ratings using RPC instead of direct query
  const { data: ratings = [], isLoading: ratingsLoading } = useQuery<any[]>({
    queryKey: ['ratings'],
    queryFn: async () => {
      try {
        const { data, error } = await (supabase.rpc as any)('get_all_item_ratings');
        if (error) {
          console.error('Error fetching ratings:', error);
          return [];
        }
        console.log('Ratings RPC data:', data); // Debug log
        return data || [];
      } catch (error) {
        console.error('Error in ratings query:', error);
        return [];
      }
    },
  });

  // Fetch items
  const { data: items = [], isLoading: itemsLoading, error: itemsError } = useQuery<Item[]>({
    queryKey: ['items', searchQuery, selectedCategory, priceRange, sortBy],
    queryFn: async () => {
      try {
        let query = supabase
          .from('items')
          .select(`
            *,
            categories (name),
            profiles (full_name, avatar_url)
          `)
          .eq('is_available', true);
  
        // Apply filters
        if (searchQuery) {
          query = query.ilike('title', `%${searchQuery}%`);
        }
        
        if (selectedCategory !== 'all') {
          query = query.eq('category_id', selectedCategory);
        }
        
        query = query
          .gte('price_per_day', priceRange[0])
          .lte('price_per_day', priceRange[1]);
  
        // Apply sorting
        switch (sortBy) {
          case 'price-low':
            query = query.order('price_per_day', { ascending: true });
            break;
          case 'price-high':
            query = query.order('price_per_day', { ascending: false });
            break;
          case 'newest':
            query = query.order('created_at', { ascending: false });
            break;
          default:
            query = query.order('created_at', { ascending: false });
            break;
        }
  
        const { data, error } = await query;
        
        if (error) {
          console.error('Error fetching items:', error);
          throw error;
        }
        
        return data as Item[];
      } catch (error) {
        console.error('Error in fetchItems query:', error);
        throw error;
      }
    },
    refetchOnWindowFocus: false,
    retry: 1,
  });

  const clearFilters = () => {
    setSearchQuery('');
    setSelectedCategory('all');
    setPriceRange([0, 1000]);
    setSortBy('relevance');
  };

  const getImageUrl = (images: string[] | null) => {
    if (images && images.length > 0) {
      // Check if the URL is already a complete URL or a storage path
      if (images[0].startsWith('http')) {
        return images[0];
      }
      
      // If it's a storage path, get the public URL
      try {
        // Console log to debug the image path
        console.log('Image path:', images[0]);
        
        const { data } = supabase.storage
          .from('item-images')
          .getPublicUrl(images[0]);
        
        console.log('Generated public URL:', data.publicUrl);
        return data.publicUrl;
      } catch (error) {
        console.error('Error getting public URL:', error);
      }
    }
    return 'https://placehold.co/400x400/f0f0f0/999999?text=No+Image';
  };
  
  const isVerified = (status: string | null) => {
    return status === 'verified';
  };

  // Process items to include their ratings
  const itemsWithRatings = React.useMemo(() => {
    if (!items || !ratings) return items;
    return items.map(item => {
      // Find the rating for this item
      const itemRating = ratings.find((r: any) => r.item_id === item.id);
      return {
        ...item,
        rating: itemRating && itemRating.average_rating ? parseFloat(itemRating.average_rating) : 0,
        ratingCount: itemRating && itemRating.rating_count ? parseInt(itemRating.rating_count, 10) : 0
      };
    });
  }, [items, ratings]);
  
  return (
    <div className="min-h-screen bg-white font-poppins">
      <Header />
      
      <div className="pt-24 pb-16">
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          {/* Hero Section */}
          <div className="text-center mb-8 md:mb-12 py-8 md:py-12">
            <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold text-[#181A2A] mb-4 font-poppins leading-tight">
              Verified Rentals Only
            </h1>
            <p className="text-lg md:text-xl text-gray-600 mb-6 md:mb-8 max-w-2xl mx-auto font-poppins">
              Find trusted, quality items from verified community members near you.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-md mx-auto">
              <Button className="bg-[#F7996E] hover:bg-[#e8895f] text-white px-6 md:px-8 py-3 md:py-4 rounded-full font-medium font-poppins text-base md:text-lg transition-all duration-300 hover:scale-105">
                Browse Verified Rentals
              </Button>
              <Link to="/list-item">
                <Button variant="outline" className="border-[#F7996E] text-[#F7996E] hover:bg-[#F7996E] hover:text-white px-6 md:px-8 py-3 md:py-4 rounded-full font-medium font-poppins text-base md:text-lg w-full">
                  List Your Item
                </Button>
              </Link>
            </div>
          </div>

          {/* Search Header */}
          <div className="mb-6 md:mb-8">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <Input
                  placeholder="Search for items..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 py-3 rounded-xl border-gray-300 focus:border-[#F7996E] font-poppins text-base"
                />
              </div>
              <Button 
                onClick={() => setShowFilters(!showFilters)}
                className="bg-[#F7996E] hover:bg-[#e8895f] text-white px-6 md:px-8 py-3 rounded-xl font-poppins"
              >
                <Filter className="w-4 h-4 mr-2" />
                Filters
                {(selectedCategory !== 'all' || searchQuery || priceRange[1] < 1000) && (
                  <Badge className="ml-2 bg-white text-[#F7996E] px-2 py-1">!</Badge>
                )}
              </Button>
            </div>
          </div>

          <div className="flex flex-col lg:flex-row gap-6 md:gap-8">
            {/* Sidebar Filters */}
            {showFilters && (
              <div className="lg:w-1/4">
                <div className="bg-[#EDEDED] p-4 md:p-6 rounded-xl shadow-sm">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="font-semibold text-[#181A2A] font-poppins text-lg">Filters</h3>
                    <div className="flex gap-2">
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={clearFilters}
                        className="text-gray-500 hover:text-[#F7996E] font-poppins"
                      >
                        Clear
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => setShowFilters(false)}
                        className="lg:hidden"
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                  
                  <div className="space-y-6">
                    {/* Categories */}
                    <div>
                      <h4 className="font-medium text-[#181A2A] mb-3 font-poppins">Categories</h4>
                      <div className="space-y-2">
                        <label className="flex items-center cursor-pointer">
                          <input
                            type="radio"
                            name="category"
                            value="all"
                            checked={selectedCategory === 'all'}
                            onChange={(e) => setSelectedCategory(e.target.value)}
                            className="mr-3 text-[#F7996E] focus:ring-[#F7996E]"
                          />
                          <span className="text-gray-700 font-poppins text-sm">All</span>
                        </label>
                        {categories.map((category) => (
                          <label key={category.id} className="flex items-center cursor-pointer">
                            <input
                              type="radio"
                              name="category"
                              value={category.id}
                              checked={selectedCategory === category.id}
                              onChange={(e) => setSelectedCategory(e.target.value)}
                              className="mr-3 text-[#F7996E] focus:ring-[#F7996E]"
                            />
                            <span className="text-gray-700 font-poppins text-sm">{category.name}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                    
                    {/* Price Range */}
                    <div>
                      <h4 className="font-medium text-[#181A2A] mb-3 font-poppins">Price Range (per day)</h4>
                      <div className="flex justify-between mb-2">
                        <span className="text-gray-700 font-poppins text-sm">₹{priceRange[0]}</span>
                        <span className="text-gray-700 font-poppins text-sm">₹{priceRange[1]}</span>
                      </div>
                      <input 
                        type="range" 
                        min="0" 
                        max="1000" 
                        value={priceRange[1]}
                        onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value)])}
                        className="w-full h-2 bg-gray-300 rounded-lg appearance-none cursor-pointer"
                      />
                    </div>
                    
                    {/* Sort By */}
                    <div>
                      <h4 className="font-medium text-[#181A2A] mb-3 font-poppins">Sort By</h4>
                      <div className="space-y-2">
                        <label className="flex items-center cursor-pointer">
                          <input
                            type="radio"
                            name="sort"
                            value="relevance"
                            checked={sortBy === 'relevance'}
                            onChange={(e) => setSortBy(e.target.value)}
                            className="mr-3 text-[#F7996E] focus:ring-[#F7996E]"
                          />
                          <span className="text-gray-700 font-poppins text-sm">Relevance</span>
                        </label>
                        <label className="flex items-center cursor-pointer">
                          <input
                            type="radio"
                            name="sort"
                            value="newest"
                            checked={sortBy === 'newest'}
                            onChange={(e) => setSortBy(e.target.value)}
                            className="mr-3 text-[#F7996E] focus:ring-[#F7996E]"
                          />
                          <span className="text-gray-700 font-poppins text-sm">Newest First</span>
                        </label>
                        <label className="flex items-center cursor-pointer">
                          <input
                            type="radio"
                            name="sort"
                            value="price-low"
                            checked={sortBy === 'price-low'}
                            onChange={(e) => setSortBy(e.target.value)}
                            className="mr-3 text-[#F7996E] focus:ring-[#F7996E]"
                          />
                          <span className="text-gray-700 font-poppins text-sm">Price: Low to High</span>
                        </label>
                        <label className="flex items-center cursor-pointer">
                          <input
                            type="radio"
                            name="sort"
                            value="price-high"
                            checked={sortBy === 'price-high'}
                            onChange={(e) => setSortBy(e.target.value)}
                            className="mr-3 text-[#F7996E] focus:ring-[#F7996E]"
                          />
                          <span className="text-gray-700 font-poppins text-sm">Price: High to Low</span>
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            {/* Main Content */}
            <div className={showFilters ? "lg:w-3/4" : "w-full"}>
              {itemsLoading || ratingsLoading ? (
                <div className="text-center py-12">
                  <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-[#F7996E] mx-auto mb-4"></div>
                  <p className="text-gray-600 font-poppins">Loading items...</p>
                </div>
              ) : items.length > 0 ? (
                <div>
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-semibold text-[#181A2A] font-poppins">
                      {items.length} Items Found
                    </h2>
                    <select 
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value)}
                      className="border border-gray-300 rounded-xl px-4 py-2 focus:border-[#F7996E] focus:outline-none font-poppins bg-white"
                    >
                      <option value="relevance">Sort by: Relevance</option>
                      <option value="price-low">Price: Low to High</option>
                      <option value="price-high">Price: High to Low</option>
                      <option value="newest">Newest First</option>
                    </select>
                  </div>

                  {/* Item Grid */}
                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                    {itemsWithRatings.map((item) => (
                      <Link to={`/product/${item.id}`} key={item.id} className="transition-transform hover:scale-105" onClick={() => window.scrollTo(0, 0)}>
                        <Card className="overflow-hidden shadow-sm relative h-full flex flex-col">
                          {/* Verification Badge */}
                          {isVerified(item.verification_status) && (
                            <div className="absolute top-2 right-2 z-10">
                              <Badge className="bg-blue-500 text-white px-1.5 py-0.5 text-xs flex items-center">
                                <CheckCircle className="w-3 h-3 mr-0.5" />
                                Verified
                              </Badge>
                            </div>
                          )}
                          
                          {/* Wishlist Heart Button */}
                          <div className="absolute top-2 left-2 z-10">
                            <Button
                              variant="ghost"
                              size="icon"
                              className={`rounded-full bg-white/80 hover:bg-white w-8 h-8 ${wishlistItems.includes(item.id) ? 'text-red-500' : 'text-gray-500'}`}
                              onClick={(e) => toggleWishlist(e, item.id)}
                            >
                              <Heart className={`w-4 h-4 ${wishlistItems.includes(item.id) ? 'fill-current' : ''}`} />
                            </Button>
                          </div>
                          
                          <div className="aspect-square overflow-hidden bg-gray-100">
                            <img 
                              src={getImageUrl(item.images)} 
                              alt={item.title} 
                              className="w-full h-full object-cover transition-transform hover:scale-110" 
                              loading="lazy"
                              onError={(e) => {
                                console.error(`Failed to load image for item: ${item.id}`);
                                (e.target as HTMLImageElement).src = 'https://placehold.co/400x400/f0f0f0/999999?text=No+Image';
                              }}
                            />
                          </div>
                          <CardContent className="p-3 flex-grow flex flex-col justify-between">
                            <div>
                              <div className="flex justify-between items-start mb-1">
                                <h3 className="font-semibold text-gray-800 text-sm line-clamp-1">{item.title}</h3>
                                <Badge className="bg-[#F7996E] hover:bg-[#e8895f] ml-1 whitespace-nowrap text-xs">₹{item.price_per_day}/day</Badge>
                              </div>
                              <p className="text-xs text-gray-500 flex items-center mb-1">
                                <MapPin className="w-3 h-3 mr-0.5 flex-shrink-0" />
                                <span className="truncate">{item.location}</span>
                              </p>
                            </div>
                            <div className="flex items-center justify-between text-xs text-gray-500 mt-1">
                              <div className="flex items-center truncate mr-1">
                                {item.profiles?.full_name ? `By ${item.profiles.full_name}` : 'By Anonymous'}
                              </div>
                              <div className="text-yellow-500 flex items-center flex-shrink-0">
                                <Star className="w-3 h-3 mr-0.5" fill="currentColor" />
                                <span className="font-medium">
                                  {item.ratingCount > 0
                                    ? `${item.rating.toFixed(1)}/5 (${item.ratingCount} review${item.ratingCount > 1 ? 's' : ''})`
                                    : 'New'}
                                </span>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      </Link>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="text-center mt-12 py-12">
                  <div className="text-gray-400 mb-4">
                    <Search className="w-16 h-16 mx-auto mb-4" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-600 mb-2 font-poppins">No items found</h3>
                  <p className="text-gray-500 font-poppins mb-4">Try adjusting your filters or search terms.</p>
                  <Button 
                    onClick={clearFilters}
                    variant="outline" 
                    className="border-[#F7996E] text-[#F7996E] hover:bg-[#F7996E] hover:text-white px-6 py-2 rounded-full font-medium font-poppins"
                  >
                    Clear Filters
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Browse;
