
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar } from '@/components/ui/calendar';
import { MapPin, Star, Shield, Heart, ArrowLeft, Share } from 'lucide-react';
import { Link, useParams } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

const Product = () => {
  const { id } = useParams();
  const [selectedDate, setSelectedDate] = useState<Date>();
  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState('M');

  // Mock product data
  const product = {
    id: 1,
    title: 'Designer Lehenga',
    images: [
      'https://images.unsplash.com/photo-1583391733956-6c78276477e2?w=600&h=600&fit=crop',
      'https://images.unsplash.com/photo-1594736797933-d0401ba2fe65?w=600&h=600&fit=crop',
      'https://images.unsplash.com/photo-1571513722275-4b41940f54b8?w=600&h=600&fit=crop'
    ],
    price: 250,
    period: 'day',
    weeklyPrice: 1500,
    location: '2.5 km away',
    rating: 4.8,
    reviews: 24,
    category: 'Dresses',
    condition: 'Excellent',
    sizes: ['S', 'M', 'L', 'XL'],
    securityDeposit: 2000,
    description: 'Beautiful designer lehenga perfect for weddings and special occasions. This stunning piece features intricate embroidery and premium fabric. Dry cleaned and ready to wear.',
    owner: {
      name: 'Priya Sharma',
      avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b5e4?w=100&h=100&fit=crop&crop=face',
      rating: 4.9,
      totalRentals: 45
    }
  };

  const reviews = [
    {
      name: 'Ananya R.',
      rating: 5,
      comment: 'Absolutely gorgeous! Perfect fit and the quality exceeded my expectations.',
      date: '2 weeks ago'
    },
    {
      name: 'Kavya M.',
      rating: 5,
      comment: 'Beautiful lehenga, exactly as shown in photos. Priya was very helpful.',
      date: '1 month ago'
    }
  ];

  const relatedProducts = [
    {
      id: 2,
      title: 'Silk Saree',
      image: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=300&h=300&fit=crop',
      price: 180
    },
    {
      id: 3,
      title: 'Anarkali Suit',
      image: 'https://images.unsplash.com/photo-1594736797933-d0401ba2fe65?w=300&h=300&fit=crop',
      price: 200
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      <div className="pt-20 pb-16">
        <div className="max-w-7xl mx-auto px-6">
          {/* Breadcrumb */}
          <div className="flex items-center mb-6">
            <Link to="/browse" className="flex items-center text-gray-600 hover:text-[#F7996E]">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Browse
            </Link>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Product Images */}
            <div>
              <div className="mb-4">
                <img
                  src={product.images[0]}
                  alt={product.title}
                  className="w-full h-96 object-cover rounded-lg"
                />
              </div>
              <div className="grid grid-cols-3 gap-4">
                {product.images.slice(1).map((image, index) => (
                  <img
                    key={index}
                    src={image}
                    alt={`${product.title} ${index + 2}`}
                    className="w-full h-24 object-cover rounded-lg cursor-pointer hover:opacity-80"
                  />
                ))}
              </div>
            </div>

            {/* Product Details */}
            <div>
              <div className="mb-6">
                <Badge className="mb-2">{product.category}</Badge>
                <h1 className="text-3xl font-bold text-[#181A2A] mb-4">{product.title}</h1>
                
                <div className="flex items-center mb-4">
                  <div className="flex items-center mr-6">
                    <Star className="w-5 h-5 text-yellow-400 fill-current" />
                    <span className="ml-1 font-semibold">{product.rating}</span>
                    <span className="ml-1 text-gray-600">({product.reviews} reviews)</span>
                  </div>
                  <div className="flex items-center text-gray-600">
                    <MapPin className="w-4 h-4 mr-1" />
                    {product.location}
                  </div>
                </div>

                <div className="mb-6">
                  <div className="text-3xl font-bold text-[#F7996E] mb-2">
                    ₹{product.price}
                    <span className="text-lg font-normal text-gray-500">/{product.period}</span>
                  </div>
                  <div className="text-lg text-gray-600">
                    Weekly: ₹{product.weeklyPrice} (Save 15%)
                  </div>
                </div>

                <p className="text-gray-600 mb-6 leading-relaxed">
                  {product.description}
                </p>

                {/* Size Selection */}
                <div className="mb-6">
                  <h3 className="font-semibold text-[#181A2A] mb-3">Available Sizes</h3>
                  <div className="flex gap-3">
                    {product.sizes.map((size) => (
                      <button
                        key={size}
                        onClick={() => setSelectedSize(size)}
                        className={`w-12 h-12 rounded-lg border-2 font-semibold transition-all ${
                          selectedSize === size
                            ? 'border-[#F7996E] bg-[#F7996E] text-white'
                            : 'border-gray-300 text-gray-700 hover:border-[#F7996E]'
                        }`}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Security Deposit */}
                <div className="bg-blue-50 p-4 rounded-lg mb-6">
                  <div className="flex items-center">
                    <Shield className="w-5 h-5 text-blue-600 mr-2" />
                    <span className="font-semibold text-blue-800">Security Deposit: ₹{product.securityDeposit}</span>
                  </div>
                  <p className="text-sm text-blue-600 mt-1">
                    Refundable after item return in original condition
                  </p>
                </div>

                {/* Booking Buttons */}
                <div className="space-y-4">
                  <Button className="w-full bg-[#F7996E] hover:bg-[#e8895f] text-white py-4 text-lg font-semibold rounded-lg">
                    Book Now
                  </Button>
                  <div className="flex gap-4">
                    <Button variant="outline" className="flex-1 border-[#F7996E] text-[#F7996E] hover:bg-[#F7996E] hover:text-white">
                      <Heart className="w-4 h-4 mr-2" />
                      Save
                    </Button>
                    <Button variant="outline" className="flex-1">
                      <Share className="w-4 h-4 mr-2" />
                      Share
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Owner Info */}
          <div className="mt-12">
            <Card>
              <CardContent className="p-6">
                <h3 className="text-xl font-semibold text-[#181A2A] mb-4">Meet the Owner</h3>
                <div className="flex items-center">
                  <img
                    src={product.owner.avatar}
                    alt={product.owner.name}
                    className="w-16 h-16 rounded-full mr-4"
                  />
                  <div>
                    <h4 className="font-semibold text-[#181A2A]">{product.owner.name}</h4>
                    <div className="flex items-center">
                      <Star className="w-4 h-4 text-yellow-400 fill-current mr-1" />
                      <span className="font-semibold mr-2">{product.owner.rating}</span>
                      <span className="text-gray-600">• {product.owner.totalRentals} successful rentals</span>
                    </div>
                  </div>
                  <Button variant="outline" className="ml-auto">
                    Contact Owner
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Reviews */}
          <div className="mt-12">
            <h3 className="text-2xl font-bold text-[#181A2A] mb-6">Customer Reviews</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {reviews.map((review, index) => (
                <Card key={index}>
                  <CardContent className="p-6">
                    <div className="flex items-center mb-3">
                      <h4 className="font-semibold text-[#181A2A] mr-2">{review.name}</h4>
                      <div className="flex">
                        {[...Array(review.rating)].map((_, i) => (
                          <Star key={i} className="w-4 h-4 text-yellow-400 fill-current" />
                        ))}
                      </div>
                      <span className="ml-auto text-sm text-gray-500">{review.date}</span>
                    </div>
                    <p className="text-gray-600">{review.comment}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Related Products */}
          <div className="mt-12">
            <h3 className="text-2xl font-bold text-[#181A2A] mb-6">More Like This</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {relatedProducts.map((item) => (
                <Link key={item.id} to={`/product/${item.id}`}>
                  <Card className="hover:shadow-lg transition-shadow">
                    <CardContent className="p-0">
                      <img
                        src={item.image}
                        alt={item.title}
                        className="w-full h-48 object-cover rounded-t-lg"
                      />
                      <div className="p-4">
                        <h4 className="font-semibold text-[#181A2A] mb-2">{item.title}</h4>
                        <span className="text-lg font-bold text-[#F7996E]">₹{item.price}/day</span>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Product;
