import React, { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Search, Filter, MapPin, Star, X } from 'lucide-react';
import { Link } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

const Browse = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [priceRange, setPriceRange] = useState([0, 1000]);
  const [showFilters, setShowFilters] = useState(false);
  const [sortBy, setSortBy] = useState('relevance');
  const [filteredProducts, setFilteredProducts] = useState<any[]>([]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const categories = [
    'All', 'Dresses', 'Jewellery', 'Footwear', 'Books', 'Kitchenware', 'Party Props'
  ];

  // Minimal example data - just 2 items
  const exampleProducts = [
    {
      id: 1,
      title: 'Designer Lehenga',
      image: 'https://images.unsplash.com/photo-1583391733956-6c78276477e2?w=400&h=400&fit=crop',
      price: 250,
      period: 'day',
      location: '2.5 km away',
      rating: 4.8,
      reviews: 24,
      category: 'dresses',
      verified: true
    },
    {
      id: 2,
      title: 'Diamond Necklace Set',
      image: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=400&h=400&fit=crop',
      price: 150,
      period: 'day',
      location: '1.2 km away',
      rating: 4.9,
      reviews: 18,
      category: 'jewellery',
      verified: true
    }
  ];

  // Filter and search logic
  useEffect(() => {
    let filtered = exampleProducts.filter(product => {
      const matchesSearch = product.title.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory;
      const matchesPrice = product.price >= priceRange[0] && product.price <= priceRange[1];
      
      return matchesSearch && matchesCategory && matchesPrice;
    });

    // Apply sorting
    switch (sortBy) {
      case 'price-low':
        filtered.sort((a, b) => a.price - b.price);
        break;
      case 'price-high':
        filtered.sort((a, b) => b.price - a.price);
        break;
      case 'rating':
        filtered.sort((a, b) => b.rating - a.rating);
        break;
      case 'distance':
        filtered.sort((a, b) => parseFloat(a.location) - parseFloat(b.location));
        break;
      default:
        // Keep original order for relevance
        break;
    }

    setFilteredProducts(filtered);
  }, [searchQuery, selectedCategory, priceRange, sortBy]);

  const clearFilters = () => {
    setSearchQuery('');
    setSelectedCategory('all');
    setPriceRange([0, 1000]);
    setSortBy('relevance');
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
            {/* Sidebar Filters - Show/Hide based on showFilters state */}
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
                        {categories.map((category) => (
                          <label key={category} className="flex items-center cursor-pointer">
                            <input
                              type="radio"
                              name="category"
                              value={category.toLowerCase()}
                              checked={selectedCategory === category.toLowerCase()}
                              onChange={(e) => setSelectedCategory(e.target.value)}
                              className="mr-3 text-[#F7996E] focus:ring-[#F7996E]"
                            />
                            <span className="text-gray-700 font-poppins text-sm">{category}</span>
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
                <p className="text-gray-600 font-poppins">{filteredProducts.length} verified items found</p>
                <select 
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="border border-gray-300 rounded-xl px-4 py-2 focus:border-[#F7996E] focus:outline-none font-poppins bg-white"
                >
                  <option value="relevance">Sort by: Relevance</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                  <option value="rating">Rating</option>
                  <option value="distance">Distance</option>
                </select>
              </div>

              {filteredProducts.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                  {filteredProducts.map((product) => (
                    <Link key={product.id} to={`/product/${product.id}`}>
                      <Card className="group hover:shadow-xl transition-all duration-300 hover:scale-105 cursor-pointer rounded-xl overflow-hidden border-0 shadow-lg">
                        <CardContent className="p-0">
                          <div className="relative overflow-hidden">
                            <img
                              src={product.image}
                              alt={product.title}
                              className="w-full h-40 md:h-48 object-cover group-hover:scale-110 transition-transform duration-300"
                            />
                            <Badge className="absolute top-3 right-3 bg-white text-[#181A2A] font-poppins font-medium text-xs">
                              {product.category}
                            </Badge>
                            {product.verified && (
                              <Badge className="absolute top-3 left-3 bg-green-500 text-white font-poppins font-medium text-xs">
                                ✓ Verified
                              </Badge>
                            )}
                          </div>
                          
                          <div className="p-4 md:p-6">
                            <h3 className="font-semibold text-[#181A2A] mb-2 group-hover:text-[#F7996E] transition-colors font-poppins text-base md:text-lg">
                              {product.title}
                            </h3>
                            
                            <div className="flex items-center justify-between mb-3">
                              <span className="text-xl md:text-2xl font-bold text-[#F7996E] font-poppins">
                                ₹{product.price}
                                <span className="text-sm font-normal text-gray-500">/{product.period}</span>
                              </span>
                              <div className="flex items-center">
                                <Star className="w-4 h-4 text-yellow-400 fill-current" />
                                <span className="ml-1 text-sm text-gray-600 font-poppins">
                                  {product.rating} ({product.reviews})
                                </span>
                              </div>
                            </div>
                            
                            <div className="flex items-center text-sm text-gray-500">
                              <MapPin className="w-4 h-4 mr-1" />
                              <span className="font-poppins">{product.location}</span>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </Link>
                  ))}
                </div>
              ) : (
                // Empty State Message
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
