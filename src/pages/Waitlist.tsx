
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { CheckCircle, Sparkles, Users, Zap } from 'lucide-react';
import { Link } from 'react-router-dom';

const Waitlist = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    city: '',
    interests: ''
  });
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Waitlist signup:', formData);
    setIsSubmitted(true);
  };

  const cities = [
    'Mumbai', 'Delhi', 'Bangalore', 'Chennai', 'Kolkata', 'Hyderabad', 'Pune', 'Ahmedabad', 'Jaipur', 'Lucknow'
  ];

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#181A2A] via-[#2c2f4a] to-[#181A2A] flex items-center justify-center px-6">
        <div className="text-center max-w-md">
          <div className="mb-8">
            <CheckCircle className="w-20 h-20 text-green-400 mx-auto mb-4" />
            <h1 className="text-3xl font-bold text-white mb-4">You're In!</h1>
            <p className="text-white/80 leading-relaxed">
              Thank you for joining the Cheril waitlist. We'll notify you as soon as we launch in your city!
            </p>
          </div>
          
          <div className="space-y-4">
            <p className="text-white/60 text-sm">
              Get ready to revolutionize how you access fashion and lifestyle products.
            </p>
            <Link to="/">
              <Button className="bg-[#F7996E] hover:bg-[#e8895f] text-white px-8 py-3 rounded-full font-semibold">
                Back to Home
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#181A2A] via-[#2c2f4a] to-[#181A2A] flex items-center justify-center px-6">
      <div className="w-full max-w-4xl">
        <div className="text-center mb-12">
          <Link to="/" className="text-3xl font-bold text-white mb-4 inline-block">
            CHERIL
          </Link>
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight">
            Join the Future of 
            <span className="text-[#F7996E]"> Sharing Economy</span>
          </h1>
          <p className="text-xl text-white/80 max-w-2xl mx-auto leading-relaxed">
            Be among the first to experience Cheril when we launch in your city. 
            Get exclusive early access and special perks!
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Features */}
          <div className="space-y-8">
            <div className="flex items-start space-x-4">
              <div className="bg-[#F7996E] p-3 rounded-full">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-white mb-2">Early Access</h3>
                <p className="text-white/70">
                  Be the first to list items and start earning before the public launch
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <div className="bg-blue-500 p-3 rounded-full">
                <Users className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-white mb-2">Exclusive Community</h3>
                <p className="text-white/70">
                  Join a curated community of early adopters and power users
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <div className="bg-green-500 p-3 rounded-full">
                <Zap className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-white mb-2">Special Perks</h3>
                <p className="text-white/70">
                  Get reduced fees, priority support, and exclusive offers
                </p>
              </div>
            </div>
          </div>

          {/* Form */}
          <Card className="border-0 shadow-2xl">
            <CardContent className="p-8">
              <h2 className="text-2xl font-bold text-[#181A2A] mb-6 text-center">
                Join the Waitlist
              </h2>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <Label htmlFor="name" className="text-sm font-medium text-gray-700 mb-2 block">
                    Full Name *
                  </Label>
                  <Input
                    id="name"
                    type="text"
                    placeholder="Enter your full name"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    className="border-gray-300 focus:border-[#F7996E]"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="email" className="text-sm font-medium text-gray-700 mb-2 block">
                    Email Address *
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="your@email.com"
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    className="border-gray-300 focus:border-[#F7996E]"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="phone" className="text-sm font-medium text-gray-700 mb-2 block">
                    Phone Number *
                  </Label>
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="+91 9876543210"
                    value={formData.phone}
                    onChange={(e) => setFormData({...formData, phone: e.target.value})}
                    className="border-gray-300 focus:border-[#F7996E]"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="city" className="text-sm font-medium text-gray-700 mb-2 block">
                    City *
                  </Label>
                  <Select value={formData.city} onValueChange={(value) => setFormData({...formData, city: value})}>
                    <SelectTrigger className="border-gray-300 focus:border-[#F7996E]">
                      <SelectValue placeholder="Select your city" />
                    </SelectTrigger>
                    <SelectContent>
                      {cities.map((city) => (
                        <SelectItem key={city} value={city.toLowerCase()}>
                          {city}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="interests" className="text-sm font-medium text-gray-700 mb-2 block">
                    What would you like to rent or list? (Optional)
                  </Label>
                  <Textarea
                    id="interests"
                    placeholder="e.g., Designer dresses, electronics, books, party props..."
                    value={formData.interests}
                    onChange={(e) => setFormData({...formData, interests: e.target.value})}
                    className="border-gray-300 focus:border-[#F7996E]"
                  />
                </div>

                <Button 
                  type="submit"
                  className="w-full bg-[#F7996E] hover:bg-[#e8895f] text-white py-4 text-lg font-semibold rounded-lg transition-all duration-300 hover:scale-105"
                >
                  Join Waitlist
                </Button>

                <p className="text-xs text-gray-500 text-center">
                  By joining, you agree to receive updates about Cheril's launch and features.
                </p>
              </form>
            </CardContent>
          </Card>
        </div>

        <div className="text-center mt-12">
          <Link to="/" className="text-white/60 hover:text-white text-sm transition-colors">
            ← Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Waitlist;
