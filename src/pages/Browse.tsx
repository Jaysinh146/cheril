
import React, { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Search, Filter, MapPin, Star, X } from 'lucide-react';
import { Link } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { supabase } from '@/integrations/supabase/client';
import { useQuery } from '@tanstack/react-query';

const Browse = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [priceRange, setPriceRange] = useState([0, 1000]);
  const [showFilters, setShowFilters] = useState(false);
  const [sortBy, setSortBy] = useState('relevance');

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Fetch categories
  const { data: categories = [] } = useQuery({
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

  // Fetch items
  const { data: items = [], isLoading } = useQuery({
    queryKey: ['items', searchQuery, selectedCategory, priceRange, sortBy],
    queryFn: async () => {
      let query = supabase
        .from('items')
        .select(`
          *,
          categories (name),
          profiles (full_name)
        `)
        .eq('verification_status', 'verified')
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
      
      if (error) throw error;
      return data;
    },
  });

  const clearFilters = () => {
    setSearchQuery('');
    setSelectedCategory('all');
    setPriceRange([0, 1000]);
    setSortBy('relevance');
  };

  const getImageUrl = (images: string[] | null) => {
    if (images && images.length > 0) {
      return images[0];
    }
    return 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=400&h=400&fit=crop';
  };

  return (
    <div className="min-h-screen bg-white font-poppins">
      <Header />
      
      <div className="pt-20 pb-16">
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
                      <h4 className="font-medium text-[#181A2A] mb-3 font-poppins">Price Range</h4>
                      <div className="space-y-3">
                        <div className="flex justify-between text-sm text-gray-600 font-poppins">
                          <span>₹0</span>
                          <span>₹1000+</span>
                        </div>
                        <input
                          type="range"
                          min="0"
                          max="1000"
                          value={priceRange[1]}
                          onChange={(e) => setPriceRange([0, parseInt(e.target.value)])}
                          className="w-full accent-[#F7996E]"
                        />
                        <div className="text-center text-sm text-gray-600 font-poppins">
                          Up to ₹{priceRange[1]}/day
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Product Grid */}
            <div className={`${showFilters ? 'lg:w-3/4' : 'w-full'}`}>
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
                <p className="text-gray-600 font-poppins">
                  {isLoading ? 'Loading...' : `${items.length} verified items found`}
                </p>
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

              {items.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                  {items.map((item) => (
                    <Link key={item.id} to={`/product/${item.id}`}>
                      <Card className="group hover:shadow-xl transition-all duration-300 hover:scale-105 cursor-pointer rounded-xl overflow-hidden border-0 shadow-lg">
                        <CardContent className="p-0">
                          <div className="relative overflow-hidden">
                            <img
                              src={getImageUrl(item.images)}
                              alt={item.title}
                              className="w-full h-40 md:h-48 object-cover group-hover:scale-110 transition-transform duration-300"
                            />
                            <Badge className="absolute top-3 right-3 bg-white text-[#181A2A] font-poppins font-medium text-xs">
                              {item.categories?.name}
                            </Badge>
                            <Badge className="absolute top-3 left-3 bg-green-500 text-white font-poppins font-medium text-xs">
                              ✓ Verified
                            </Badge>
                          </div>
                          
                          <div className="p-4 md:p-6">
                            <h3 className="font-semibold text-[#181A2A] mb-2 group-hover:text-[#F7996E] transition-colors font-poppins text-base md:text-lg">
                              {item.title}
                            </h3>
                            
                            <div className="flex items-center justify-between mb-3">
                              <span className="text-xl md:text-2xl font-bold text-[#F7996E] font-poppins">
                                ₹{item.price_per_day}
                                <span className="text-sm font-normal text-gray-500">/day</span>
                              </span>
                              <div className="flex items-center">
                                <Star className="w-4 h-4 text-yellow-400 fill-current" />
                                <span className="ml-1 text-sm text-gray-600 font-poppins">
                                  4.8 (24)
                                </span>
                              </div>
                            </div>
                            
                            <div className="flex items-center text-sm text-gray-500">
                              <MapPin className="w-4 h-4 mr-1" />
                              <span className="font-poppins">{item.location}</span>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </Link>
                  ))}
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
                    className="border-[#F7996E] text-[#F7996E] hover:bg-[#F7996E] hover:text-white px-6 py-2 rounded-full font-medium font-poppins mr-4"
                  >
                    Clear Filters
                  </Button>
                  <Link to="/list-item" className="inline-block">
                    <Button className="bg-[#F7996E] hover:bg-[#e8895f] text-white px-6 py-2 rounded-full font-medium font-poppins">
                      List Your Item
                    </Button>
                  </Link>
                </div>
              )}

              {/* Call to action */}
              <div className="text-center mt-12 py-8 md:py-12 bg-gray-50 rounded-xl">
                <h3 className="text-xl md:text-2xl font-semibold text-gray-700 mb-2 font-poppins">Join Our Verified Community</h3>
                <p className="text-gray-500 font-poppins mb-4">List your items and start earning from trusted renters.</p>
                <Link to="/list-item" className="inline-block">
                  <Button className="bg-[#F7996E] hover:bg-[#e8895f] text-white px-6 md:px-8 py-3 rounded-full font-medium font-poppins">
                    Become a Verified Lender
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Browse;
