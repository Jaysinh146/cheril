
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Upload, Camera, MapPin, Calendar } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

const ListItem = () => {
  const [formData, setFormData] = useState({
    title: '',
    category: '',
    description: '',
    dailyPrice: '',
    weeklyPrice: '',
    securityDeposit: '',
    condition: '',
    sizes: [],
    location: '',
    availableFrom: '',
    availableTo: ''
  });

  const [images, setImages] = useState<File[]>([]);

  const categories = [
    'Dresses', 'Jewellery', 'Footwear', 'Books', 'Kitchenware', 'Party Props', 'Electronics', 'Accessories'
  ];

  const conditions = [
    'Brand New', 'Excellent', 'Very Good', 'Good', 'Fair'
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
    // Handle form submission logic here
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setImages([...images, ...Array.from(e.target.files)]);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      <div className="pt-20 pb-16">
        <div className="max-w-4xl mx-auto px-6">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-[#181A2A] mb-4">
              List Your Item
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Turn your unused items into income. List them for rent and start earning today!
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Basic Information */}
            <Card>
              <CardHeader>
                <CardTitle className="text-xl text-[#181A2A]">Basic Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <Label htmlFor="title" className="text-sm font-medium text-gray-700 mb-2 block">
                    Item Title *
                  </Label>
                  <Input
                    id="title"
                    placeholder="e.g., Designer Lehenga for Wedding"
                    value={formData.title}
                    onChange={(e) => setFormData({...formData, title: e.target.value})}
                    className="border-gray-300 focus:border-[#F7996E]"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="category" className="text-sm font-medium text-gray-700 mb-2 block">
                    Category *
                  </Label>
                  <Select value={formData.category} onValueChange={(value) => setFormData({...formData, category: value})}>
                    <SelectTrigger className="border-gray-300 focus:border-[#F7996E]">
                      <SelectValue placeholder="Select a category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem key={category} value={category.toLowerCase()}>
                          {category}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="description" className="text-sm font-medium text-gray-700 mb-2 block">
                    Description *
                  </Label>
                  <Textarea
                    id="description"
                    placeholder="Describe your item, its condition, features, and any special instructions..."
                    value={formData.description}
                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                    className="min-h-[120px] border-gray-300 focus:border-[#F7996E]"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="condition" className="text-sm font-medium text-gray-700 mb-2 block">
                    Condition *
                  </Label>
                  <Select value={formData.condition} onValueChange={(value) => setFormData({...formData, condition: value})}>
                    <SelectTrigger className="border-gray-300 focus:border-[#F7996E]">
                      <SelectValue placeholder="Select condition" />
                    </SelectTrigger>
                    <SelectContent>
                      {conditions.map((condition) => (
                        <SelectItem key={condition} value={condition.toLowerCase()}>
                          {condition}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            {/* Photos */}
            <Card>
              <CardHeader>
                <CardTitle className="text-xl text-[#181A2A]">Photos</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-[#F7996E] transition-colors">
                  <input
                    type="file"
                    id="images"
                    multiple
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                  <label htmlFor="images" className="cursor-pointer">
                    <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-lg font-medium text-gray-700 mb-2">Upload Photos</p>
                    <p className="text-sm text-gray-500">Drag and drop or click to select images</p>
                  </label>
                </div>
                
                {images.length > 0 && (
                  <div className="grid grid-cols-3 gap-4 mt-4">
                    {images.map((image, index) => (
                      <div key={index} className="relative">
                        <img
                          src={URL.createObjectURL(image)}
                          alt={`Upload ${index + 1}`}
                          className="w-full h-24 object-cover rounded-lg"
                        />
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Pricing */}
            <Card>
              <CardHeader>
                <CardTitle className="text-xl text-[#181A2A]">Pricing</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="dailyPrice" className="text-sm font-medium text-gray-700 mb-2 block">
                      Daily Rent (₹) *
                    </Label>
                    <Input
                      id="dailyPrice"
                      type="number"
                      placeholder="100"
                      value={formData.dailyPrice}
                      onChange={(e) => setFormData({...formData, dailyPrice: e.target.value})}
                      className="border-gray-300 focus:border-[#F7996E]"
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="weeklyPrice" className="text-sm font-medium text-gray-700 mb-2 block">
                      Weekly Rent (₹)
                    </Label>
                    <Input
                      id="weeklyPrice"
                      type="number"
                      placeholder="600"
                      value={formData.weeklyPrice}
                      onChange={(e) => setFormData({...formData, weeklyPrice: e.target.value})}
                      className="border-gray-300 focus:border-[#F7996E]"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="securityDeposit" className="text-sm font-medium text-gray-700 mb-2 block">
                    Security Deposit (₹) *
                  </Label>
                  <Input
                    id="securityDeposit"
                    type="number"
                    placeholder="1000"
                    value={formData.securityDeposit}
                    onChange={(e) => setFormData({...formData, securityDeposit: e.target.value})}
                    className="border-gray-300 focus:border-[#F7996E]"
                    required
                  />
                  <p className="text-sm text-gray-500 mt-1">
                    This amount will be refunded when the item is returned in original condition
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Location & Availability */}
            <Card>
              <CardHeader>
                <CardTitle className="text-xl text-[#181A2A]">Location & Availability</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <Label htmlFor="location" className="text-sm font-medium text-gray-700 mb-2 block">
                    Location *
                  </Label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <Input
                      id="location"
                      placeholder="Enter your area/locality"
                      value={formData.location}
                      onChange={(e) => setFormData({...formData, location: e.target.value})}
                      className="pl-10 border-gray-300 focus:border-[#F7996E]"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="availableFrom" className="text-sm font-medium text-gray-700 mb-2 block">
                      Available From
                    </Label>
                    <Input
                      id="availableFrom"
                      type="date"
                      value={formData.availableFrom}
                      onChange={(e) => setFormData({...formData, availableFrom: e.target.value})}
                      className="border-gray-300 focus:border-[#F7996E]"
                    />
                  </div>

                  <div>
                    <Label htmlFor="availableTo" className="text-sm font-medium text-gray-700 mb-2 block">
                      Available Till
                    </Label>
                    <Input
                      id="availableTo"
                      type="date"
                      value={formData.availableTo}
                      onChange={(e) => setFormData({...formData, availableTo: e.target.value})}
                      className="border-gray-300 focus:border-[#F7996E]"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Submit Button */}
            <div className="text-center">
              <Button 
                type="submit"
                className="bg-[#F7996E] hover:bg-[#e8895f] text-white px-12 py-4 text-lg font-semibold rounded-lg transition-all duration-300 hover:scale-105"
              >
                List My Item
              </Button>
              <p className="text-sm text-gray-500 mt-4">
                By listing your item, you agree to our Terms of Service and Privacy Policy
              </p>
            </div>
          </form>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default ListItem;
