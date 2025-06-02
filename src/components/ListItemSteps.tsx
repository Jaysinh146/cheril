import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { MapPin, Check, Loader2 } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import ImageUploader from '@/components/ImageUploader';
import { v4 as uuidv4 } from 'uuid';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

interface FormData {
  title: string;
  category: string;
  description: string;
  condition: string;
  dailyPrice: string;
  weeklyPrice: string;
  securityDeposit: string;
  location: string;
  availableFrom: string;
  availableTo: string;
  images: string[];
}

const ListItemSteps = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [uploadProgress, setUploadProgress] = useState(0);
  
  // Generate a temporary item ID for organizing uploads
  const [tempItemId] = useState(() => uuidv4());
  
  const [formData, setFormData] = useState<FormData>({
    title: '',
    category: '',
    description: '',
    condition: '',
    dailyPrice: '',
    weeklyPrice: '',
    securityDeposit: '',
    location: '',
    availableFrom: '',
    availableTo: '',
    images: []
  });

  const steps = [
    { title: 'Basic Info', description: 'Tell us about your item' },
    { title: 'Photos', description: 'Add stunning photos' },
    { title: 'Pricing', description: 'Set your rental rates' },
    { title: 'Location', description: 'Where to find you' },
    { title: 'Review', description: 'Review and publish' }
  ];

  const [categories, setCategories] = useState<Array<{id: string, name: string}>>([]);
  
  // Fetch categories from Supabase
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const { data, error } = await supabase
          .from('categories')
          .select('*')
          .order('name');
          
        if (error) throw error;
        
        if (data && data.length > 0) {
          setCategories(data);
        } else {
          // Fallback to default categories if none exist in database
          setCategories([
            { id: 'dresses', name: 'Dresses' },
            { id: 'jewellery', name: 'Jewellery' },
            { id: 'footwear', name: 'Footwear' },
            { id: 'books', name: 'Books' },
            { id: 'kitchenware', name: 'Kitchenware' },
            { id: 'party_props', name: 'Party Props' },
            { id: 'electronics', name: 'Electronics' },
            { id: 'accessories', name: 'Accessories' }
          ]);
        }
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };
    
    fetchCategories();
  }, []);

  const conditions = [
    'Brand New', 'Excellent', 'Very Good', 'Good', 'Fair'
  ];

  const progress = ((currentStep + 1) / steps.length) * 100;

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  // Handle images uploaded through the ImageUploader component
  const handleImagesUploaded = (urls: string[]) => {
    setFormData(prev => ({
      ...prev,
      images: [...prev.images, ...urls]
    }));
  };
  
  // Handle removal of an existing image
  const handleImageRemove = (url: string) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter(imageUrl => imageUrl !== url)
    }));
  };

  const handleSubmit = async () => {
    if (!user) {
      toast({
        title: 'Authentication required',
        description: 'You need to be logged in to list an item',
        variant: 'destructive',
      });
      navigate('/auth');
      return;
    }

    if (!formData.title || !formData.category || !formData.dailyPrice || !formData.location) {
      toast({
        title: 'Missing information',
        description: 'Please fill in all required fields.',
        variant: 'destructive',
      });
      return;
    }

    if (formData.images.length === 0) {
      toast({
        title: 'Images required',
        description: 'Please upload at least one image of your item.',
        variant: 'destructive',
      });
      return;
    }

    try {
      setIsSubmitting(true);
      setUploadProgress(0);
      
      // Simulate progress for database operation
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => {
          const newProgress = prev + 10;
          return newProgress > 90 ? 90 : newProgress;
        });
      }, 300);
      
      // Insert the item data into the database with the already uploaded images
      // Ensure we have a valid category ID
      let categoryId = formData.category;
      
      // If we can't find the category, use the first one as fallback
      if (!categories.some(cat => cat.id === categoryId) && categories.length > 0) {
        categoryId = categories[0].id;
      }
      
      console.log('Creating item with the following data:', {
        owner_id: user.id,
        title: formData.title,
        category_id: categoryId,
        description: formData.description,
        price_per_day: parseFloat(formData.dailyPrice) || 0,
        location: formData.location,
        images: formData.images,
        available_from: formData.availableFrom || null,
        available_till: formData.availableTo || null,
        security_deposit: parseFloat(formData.securityDeposit) || 0,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        is_available: true,
        verification_status: 'pending'
      });
      
      const { error, data } = await supabase.from('items').insert({
        owner_id: user.id,
        title: formData.title,
        category_id: categoryId,
        description: formData.description,
        price_per_day: parseFloat(formData.dailyPrice) || 0,
        location: formData.location,
        images: formData.images,
        available_from: formData.availableFrom || null,
        available_till: formData.availableTo || null,
        security_deposit: parseFloat(formData.securityDeposit) || 0,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        is_available: true,
        verification_status: 'pending'
      }).select('id').single();
      
      if (error) throw error;
      
      clearInterval(progressInterval);
      setUploadProgress(100);
      
      toast({
        title: 'Success!',
        description: 'Your item has been published successfully.',
      });
      
      // Redirect to the browse page to see the newly listed item
      setTimeout(() => {
        navigate('/browse');
      }, 1000);
      
    } catch (error: any) {
      console.error('Error submitting form:', error);
      toast({
        title: 'Error',
        description: error.message || 'Failed to publish your item. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 0:
        return (
          <div className="space-y-6">
            <div>
              <Label htmlFor="title" className="text-sm font-medium text-gray-700 mb-2 block font-poppins">
                Item Title *
              </Label>
              <Input
                id="title"
                placeholder="e.g., Designer Lehenga for Wedding"
                value={formData.title}
                onChange={(e) => setFormData({...formData, title: e.target.value})}
                className="border-gray-300 focus:border-[#F7996E] font-poppins"
                required
              />
            </div>

            <div>
              <Label htmlFor="category" className="text-sm font-medium text-gray-700 mb-2 block font-poppins">
                Category *
              </Label>
              <Select 
                value={formData.category} 
                onValueChange={(value) => setFormData({...formData, category: value})}
                disabled={categories.length === 0}
              >
                <SelectTrigger className="border-gray-300 focus:border-[#F7996E] font-poppins">
                  <SelectValue placeholder={categories.length === 0 ? "Loading categories..." : "Select a category"} />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category.id} value={category.id}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="description" className="text-sm font-medium text-gray-700 mb-2 block font-poppins">
                Description *
              </Label>
              <Textarea
                id="description"
                placeholder="Describe your item, its condition, features, and any special instructions..."
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                className="min-h-[120px] border-gray-300 focus:border-[#F7996E] font-poppins"
                required
              />
            </div>

            <div>
              <Label htmlFor="condition" className="text-sm font-medium text-gray-700 mb-2 block font-poppins">
                Condition *
              </Label>
              <Select value={formData.condition} onValueChange={(value) => setFormData({...formData, condition: value})}>
                <SelectTrigger className="border-gray-300 focus:border-[#F7996E] font-poppins">
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
          </div>
        );

      case 1:
        return (
          <div className="space-y-6">
            <div className="mb-4">
              <h3 className="text-lg font-medium text-gray-800 mb-2 font-poppins">Item Photos</h3>
              <p className="text-sm text-gray-600 font-poppins mb-4">
                Upload clear, high-quality photos of your item. Multiple angles and details help potential renters.
              </p>
              
              <ImageUploader
                userId={user?.id || ''}
                itemId={tempItemId}
                onUploadComplete={handleImagesUploaded}
                existingImages={formData.images}
                onExistingImageDelete={handleImageRemove}
              />
            </div>
            
            {formData.images.length > 0 && (
              <div className="bg-green-50 p-4 rounded-lg">
                <p className="text-sm text-green-700 font-poppins flex items-center">
                  <Check className="w-4 h-4 mr-2 text-green-600" />
                  {formData.images.length} {formData.images.length === 1 ? 'image' : 'images'} uploaded successfully
                </p>
              </div>
            )}
            
            {isSubmitting && (
              <div className="mt-4">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium text-gray-700">Processing...</span>
                  <span className="text-sm text-gray-500">{uploadProgress}%</span>
                </div>
                <Progress value={uploadProgress} className="h-2" />
              </div>
            )}
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="dailyPrice" className="text-sm font-medium text-gray-700 mb-2 block font-poppins">
                  Daily Rent (₹) *
                </Label>
                <Input
                  id="dailyPrice"
                  type="number"
                  placeholder="100"
                  value={formData.dailyPrice}
                  onChange={(e) => setFormData({...formData, dailyPrice: e.target.value})}
                  className="border-gray-300 focus:border-[#F7996E] font-poppins"
                  required
                />
              </div>

              <div>
                <Label htmlFor="weeklyPrice" className="text-sm font-medium text-gray-700 mb-2 block font-poppins">
                  Weekly Rent (₹)
                </Label>
                <Input
                  id="weeklyPrice"
                  type="number"
                  placeholder="600"
                  value={formData.weeklyPrice}
                  onChange={(e) => setFormData({...formData, weeklyPrice: e.target.value})}
                  className="border-gray-300 focus:border-[#F7996E] font-poppins"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="securityDeposit" className="text-sm font-medium text-gray-700 mb-2 block font-poppins">
                Security Deposit (₹) *
              </Label>
              <Input
                id="securityDeposit"
                type="number"
                placeholder="1000"
                value={formData.securityDeposit}
                onChange={(e) => setFormData({...formData, securityDeposit: e.target.value})}
                className="border-gray-300 focus:border-[#F7996E] font-poppins"
                required
              />
              <p className="text-sm text-gray-500 mt-1 font-poppins">
                This amount will be refunded when the item is returned in original condition
              </p>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <div>
              <Label htmlFor="location" className="text-sm font-medium text-gray-700 mb-2 block font-poppins">
                Location *
              </Label>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <Input
                  id="location"
                  placeholder="Enter your area/locality"
                  value={formData.location}
                  onChange={(e) => setFormData({...formData, location: e.target.value})}
                  className="pl-10 border-gray-300 focus:border-[#F7996E] font-poppins"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="availableFrom" className="text-sm font-medium text-gray-700 mb-2 block font-poppins">
                  Available From
                </Label>
                <Input
                  id="availableFrom"
                  type="date"
                  value={formData.availableFrom}
                  onChange={(e) => setFormData({...formData, availableFrom: e.target.value})}
                  className="border-gray-300 focus:border-[#F7996E] font-poppins"
                />
                <p className="text-xs text-gray-500 mt-1 font-poppins">
                  Optional: Restrict rental availability to specific dates
                </p>
              </div>

              <div>
                <Label htmlFor="availableTo" className="text-sm font-medium text-gray-700 mb-2 block font-poppins">
                  Available Till
                </Label>
                <Input
                  id="availableTo"
                  type="date"
                  value={formData.availableTo}
                  onChange={(e) => setFormData({...formData, availableTo: e.target.value})}
                  className="border-gray-300 focus:border-[#F7996E] font-poppins"
                />
                <p className="text-xs text-gray-500 mt-1 font-poppins">
                  Optional: Set end date for availability
                </p>
              </div>
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            <div className="bg-green-50 border border-green-200 rounded-lg p-6">
              <div className="flex items-center mb-4">
                <Check className="w-6 h-6 text-green-600 mr-2" />
                <h3 className="text-lg font-semibold text-green-800 font-poppins">Review Your Listing</h3>
              </div>
              <div className="space-y-2 text-sm text-green-700 font-poppins">
                <p><strong>Title:</strong> {formData.title || 'Not provided'}</p>
                <p><strong>Category:</strong> {formData.category || 'Not selected'}</p>
                <p><strong>Daily Price:</strong> ₹{formData.dailyPrice || '0'}</p>
                <p><strong>Location:</strong> {formData.location || 'Not provided'}</p>
                <p><strong>Photos:</strong> {formData.images.length} uploaded</p>
                {formData.availableFrom && formData.availableTo && (
                  <p><strong>Available:</strong> {formData.availableFrom} to {formData.availableTo}</p>
                )}
              </div>
            </div>
            <p className="text-sm text-gray-500 font-poppins">
              By listing your item, you agree to our Terms of Service and Privacy Policy. Your listing will be reviewed before going live.
            </p>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="space-y-8">
      {/* Progress Header */}
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <span className="text-sm font-medium text-gray-500 font-poppins">
            Step {currentStep + 1} of {steps.length}
          </span>
          <span className="text-sm font-medium text-[#F7996E] font-poppins">
            {Math.round(progress)}% Complete
          </span>
        </div>
        <Progress value={progress} className="h-2" />
        
        {/* Step indicators */}
        <div className="flex justify-between">
          {steps.map((step, index) => (
            <div key={index} className="flex flex-col items-center flex-1">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium font-poppins ${
                index <= currentStep 
                  ? 'bg-[#F7996E] text-white' 
                  : 'bg-gray-200 text-gray-400'
              }`}>
                {index < currentStep ? <Check className="w-4 h-4" /> : index + 1}
              </div>
              <div className="text-center mt-2">
                <p className="text-xs font-medium text-gray-700 font-poppins">{step.title}</p>
                <p className="text-xs text-gray-500 font-poppins hidden sm:block">{step.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Step Content */}
      <Card>
        <CardContent className="p-8">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-[#181A2A] mb-2 font-poppins">
              {steps[currentStep].title}
            </h2>
            <p className="text-gray-600 font-poppins">{steps[currentStep].description}</p>
          </div>
          
          {renderStepContent()}
        </CardContent>
      </Card>

      {/* Navigation Buttons */}
      <div className="flex justify-between">
        <Button
          variant="outline"
          onClick={handlePrevious}
          disabled={currentStep === 0}
          className="px-8 py-3 font-poppins"
        >
          Previous
        </Button>
        
        {currentStep === steps.length - 1 ? (
          <Button
            onClick={handleSubmit}
            className="bg-[#F7996E] hover:bg-[#e8895f] text-white px-8 py-3 font-poppins"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Publishing...' : 'Publish Listing'}
          </Button>
        ) : (
          <Button
            onClick={handleNext}
            className="bg-[#F7996E] hover:bg-[#e8895f] text-white px-8 py-3 font-poppins"
          >
            Next Step
          </Button>
        )}
      </div>
    </div>
  );
};

export default ListItemSteps;
