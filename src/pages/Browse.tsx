
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
    }
  ];

  return (
    <div className="min-h-screen bg-white font-poppins">
      <Header />
      
      <div className="pt-20 pb-16">
        <div className="max-w-7xl mx-auto px-6">
          {/* Hero Section */}
          <div className="text-center mb-12 py-12">
            <h1 className="text-5xl md:text-6xl font-bold text-[#181A2A] mb-4 font-poppins leading-tight">
              Give life to what's lying idle
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto font-poppins">
              Find what you need in a tap. Rent fashion and lifestyle products from your community.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-md mx-auto">
              <Button className="bg-[#F7996E] hover:bg-[#e8895f] text-white px-8 py-4 rounded-full font-medium font-poppins text-lg transition-all duration-300 hover:scale-105">
                Browse Rentals
              </Button>
              <Link to="/list-item">
                <Button variant="outline" className="border-[#F7996E] text-[#F7996E] hover:bg-[#F7996E] hover:text-white px-8 py-4 rounded-full font-medium font-poppins text-lg w-full">
                  List Your Item
                </Button>
              </Link>
            </div>
          </div>

          {/* Search Header */}
          <div className="mb-8">
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
              <Button className="bg-[#F7996E] hover:bg-[#e8895f] text-white px-8 py-3 rounded-xl font-poppins">
                <Filter className="w-4 h-4 mr-2" />
                Filters
              </Button>
            </div>
          </div>

          <div className="flex flex-col lg:flex-row gap-8">
            {/* Sidebar Filters */}
            <div className="lg:w-1/4">
              <div className="bg-[#EDEDED] p-6 rounded-xl shadow-sm">
                <h3 className="font-semibold text-[#181A2A] mb-4 font-poppins text-lg">Categories</h3>
                <div className="space-y-3">
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
                      <span className="text-gray-700 font-poppins">{category}</span>
                    </label>
                  ))}
                </div>

                <div className="mt-8">
                  <h3 className="font-semibold text-[#181A2A] mb-4 font-poppins text-lg">Price Range</h3>
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

            {/* Product Grid */}
            <div className="lg:w-3/4">
              <div className="flex justify-between items-center mb-6">
                <p className="text-gray-600 font-poppins">{exampleProducts.length} items found</p>
                <select className="border border-gray-300 rounded-xl px-4 py-2 focus:border-[#F7996E] focus:outline-none font-poppins">
                  <option>Sort by: Relevance</option>
                  <option>Price: Low to High</option>
                  <option>Price: High to Low</option>
                  <option>Rating</option>
                  <option>Distance</option>
                </select>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {exampleProducts.map((product) => (
                  <Link key={product.id} to={`/product/${product.id}`}>
                    <Card className="group hover:shadow-xl transition-all duration-300 hover:scale-105 cursor-pointer rounded-xl overflow-hidden border-0 shadow-lg">
                      <CardContent className="p-0">
                        <div className="relative overflow-hidden">
                          <img
                            src={product.image}
                            alt={product.title}
                            className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-300"
                          />
                          <Badge className="absolute top-3 right-3 bg-white text-[#181A2A] font-poppins font-medium">
                            {product.category}
                          </Badge>
                        </div>
                        
                        <div className="p-6">
                          <h3 className="font-semibold text-[#181A2A] mb-2 group-hover:text-[#F7996E] transition-colors font-poppins text-lg">
                            {product.title}
                          </h3>
                          
                          <div className="flex items-center justify-between mb-3">
                            <span className="text-2xl font-bold text-[#F7996E] font-poppins">
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

              {/* Empty State Message */}
              <div className="text-center mt-12 py-12">
                <div className="text-gray-400 mb-4">
                  <Search className="w-16 h-16 mx-auto mb-4" />
                </div>
                <h3 className="text-xl font-semibold text-gray-600 mb-2 font-poppins">More items coming soon!</h3>
                <p className="text-gray-500 font-poppins">Be the first to list your items and start earning.</p>
                <Link to="/list-item" className="inline-block mt-4">
                  <Button className="bg-[#F7996E] hover:bg-[#e8895f] text-white px-8 py-3 rounded-full font-medium font-poppins">
                    List Your First Item
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
