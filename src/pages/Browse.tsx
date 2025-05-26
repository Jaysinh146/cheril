
import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Search, Filter, MapPin, Star } from 'lucide-react';
import { Link } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

const Browse = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [priceRange, setPriceRange] = useState([0, 1000]);

  const categories = [
    'All', 'Dresses', 'Jewellery', 'Footwear', 'Books', 'Kitchenware', 'Party Props'
  ];

  const mockProducts = [
    {
      id: 1,
      title: 'Designer Lehenga',
      image: 'https://images.unsplash.com/photo-1583391733956-6c78276477e2?w=400&h=400&fit=crop',
      price: 250,
      period: 'day',
      location: '2.5 km away',
      rating: 4.8,
      reviews: 24,
      category: 'dresses'
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
      category: 'jewellery'
    },
    {
      id: 3,
      title: 'Designer Heels',
      image: 'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=400&h=400&fit=crop',
      price: 80,
      period: 'day',
      location: '3.1 km away',
      rating: 4.7,
      reviews: 32,
      category: 'footwear'
    },
    {
      id: 4,
      title: 'Photography Equipment',
      image: 'https://images.unsplash.com/photo-1502920917128-1aa500764cbd?w=400&h=400&fit=crop',
      price: 200,
      period: 'day',
      location: '4.5 km away',
      rating: 4.8,
      reviews: 15,
      category: 'electronics'
    },
    {
      id: 5,
      title: 'Party Decoration Kit',
      image: 'https://images.unsplash.com/photo-1530103862676-de8c9debad1d?w=400&h=400&fit=crop',
      price: 120,
      period: 'day',
      location: '1.8 km away',
      rating: 4.6,
      reviews: 28,
      category: 'party props'
    },
    {
      id: 6,
      title: 'Premium Cookware Set',
      image: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&h=400&fit=crop',
      price: 60,
      period: 'day',
      location: '2.2 km away',
      rating: 4.5,
      reviews: 41,
      category: 'kitchenware'
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      <div className="pt-20 pb-16">
        <div className="max-w-7xl mx-auto px-6">
          {/* Search Header */}
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-[#181A2A] mb-4">Browse Rentals</h1>
            <div className="flex flex-col md:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <Input
                  placeholder="Search for items..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 py-3 rounded-full border-gray-300 focus:border-[#F7996E]"
                />
              </div>
              <Button className="bg-[#F7996E] hover:bg-[#e8895f] text-white px-8 py-3 rounded-full">
                <Filter className="w-4 h-4 mr-2" />
                Filters
              </Button>
            </div>
          </div>

          <div className="flex flex-col lg:flex-row gap-8">
            {/* Sidebar Filters */}
            <div className="lg:w-1/4">
              <div className="bg-gray-50 p-6 rounded-lg">
                <h3 className="font-semibold text-[#181A2A] mb-4">Categories</h3>
                <div className="space-y-2">
                  {categories.map((category) => (
                    <label key={category} className="flex items-center">
                      <input
                        type="radio"
                        name="category"
                        value={category.toLowerCase()}
                        checked={selectedCategory === category.toLowerCase()}
                        onChange={(e) => setSelectedCategory(e.target.value)}
                        className="mr-2 text-[#F7996E]"
                      />
                      <span className="text-gray-700">{category}</span>
                    </label>
                  ))}
                </div>

                <div className="mt-6">
                  <h3 className="font-semibold text-[#181A2A] mb-4">Price Range</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm text-gray-600">
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
                    <div className="text-center text-sm text-gray-600">
                      Up to ₹{priceRange[1]}/day
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Product Grid */}
            <div className="lg:w-3/4">
              <div className="flex justify-between items-center mb-6">
                <p className="text-gray-600">{mockProducts.length} items found</p>
                <select className="border border-gray-300 rounded-lg px-4 py-2 focus:border-[#F7996E] focus:outline-none">
                  <option>Sort by: Relevance</option>
                  <option>Price: Low to High</option>
                  <option>Price: High to Low</option>
                  <option>Rating</option>
                  <option>Distance</option>
                </select>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {mockProducts.map((product) => (
                  <Link key={product.id} to={`/product/${product.id}`}>
                    <Card className="group hover:shadow-xl transition-all duration-300 hover:scale-105 cursor-pointer">
                      <CardContent className="p-0">
                        <div className="relative overflow-hidden rounded-t-lg">
                          <img
                            src={product.image}
                            alt={product.title}
                            className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-300"
                          />
                          <Badge className="absolute top-3 right-3 bg-white text-[#181A2A]">
                            {product.category}
                          </Badge>
                        </div>
                        
                        <div className="p-4">
                          <h3 className="font-semibold text-[#181A2A] mb-2 group-hover:text-[#F7996E] transition-colors">
                            {product.title}
                          </h3>
                          
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-xl font-bold text-[#F7996E]">
                              ₹{product.price}
                              <span className="text-sm font-normal text-gray-500">/{product.period}</span>
                            </span>
                            <div className="flex items-center">
                              <Star className="w-4 h-4 text-yellow-400 fill-current" />
                              <span className="ml-1 text-sm text-gray-600">
                                {product.rating} ({product.reviews})
                              </span>
                            </div>
                          </div>
                          
                          <div className="flex items-center text-sm text-gray-500">
                            <MapPin className="w-4 h-4 mr-1" />
                            {product.location}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                ))}
              </div>

              {/* Load More */}
              <div className="text-center mt-8">
                <Button variant="outline" className="px-8 py-3 rounded-full border-[#F7996E] text-[#F7996E] hover:bg-[#F7996E] hover:text-white">
                  Load More Items
                </Button>
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
