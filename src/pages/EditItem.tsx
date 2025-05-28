import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';
import { useQuery } from '@tanstack/react-query';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { Trash2, ImagePlus, Save, X, ArrowLeft } from 'lucide-react';

type Category = {
  id: string;
  name: string;
  description: string | null;
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
  is_available: boolean;
};

const EditItem = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [pricePerDay, setPricePerDay] = useState('');
  const [location, setLocation] = useState('');
  const [isAvailable, setIsAvailable] = useState(true);
  const [existingImages, setExistingImages] = useState<string[]>([]);
  const [imagesToDelete, setImagesToDelete] = useState<string[]>([]);
  
  const [newImages, setNewImages] = useState<File[]>([]);
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  
  // Fetch item data
  const { data: item, isLoading: isLoadingItem } = useQuery<Item>({
    queryKey: ['item', id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('items')
        .select('*')
        .eq('id', id)
        .single();
        
      if (error) throw error;
      return data as Item;
    },
    enabled: !!id && !!user
  });
  
  // Handle successful data fetching
  useEffect(() => {
    if (item) {
      // Check if the current user is the owner
      if (item.owner_id !== user?.id) {
        toast({
          title: 'Unauthorized',
          description: 'You can only edit your own items.',
          variant: 'destructive',
        });
        navigate('/profile');
        return;
      }
      
      setTitle(item.title);
      setDescription(item.description || '');
      setCategoryId(item.category_id);
      setPricePerDay(item.price_per_day.toString());
      setLocation(item.location);
      setIsAvailable(item.is_available);
      setExistingImages(item.images || []);
    }
  }, [item, user, toast, navigate]);
  
  // Fetch categories
  const { data: categories = [] } = useQuery<Category[]>({
    queryKey: ['categories'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('categories')
        .select('id, name, description')
        .order('name');
        
      if (error) throw error;
      return data as Category[];
    },
  });
  
  // Redirect if not logged in
  useEffect(() => {
    if (!user) {
      navigate('/auth');
    }
  }, [user, navigate]);
  
  const handleNewImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const selectedFiles = Array.from(e.target.files);
      
      // Validate file types
      const validFiles = selectedFiles.filter(file => 
        file.type === 'image/jpeg' || 
        file.type === 'image/png' || 
        file.type === 'image/webp');
      
      if (validFiles.length !== selectedFiles.length) {
        toast({
          title: 'Invalid file type',
          description: 'Only JPEG, PNG, and WebP images are allowed.',
          variant: 'destructive',
        });
      }
      
      // Validate file sizes
      const validSizedFiles = validFiles.filter(file => file.size <= 5 * 1024 * 1024);
      
      if (validSizedFiles.length !== validFiles.length) {
        toast({
          title: 'File too large',
          description: 'Maximum file size is 5MB.',
          variant: 'destructive',
        });
      }
      
      setNewImages(prev => [...prev, ...validSizedFiles]);
    }
  };
  
  const removeNewImage = (index: number) => {
    setNewImages(prev => prev.filter((_, i) => i !== index));
  };
  
  const toggleImageToDelete = (imageUrl: string) => {
    if (imagesToDelete.includes(imageUrl)) {
      setImagesToDelete(prev => prev.filter(url => url !== imageUrl));
    } else {
      setImagesToDelete(prev => [...prev, imageUrl]);
    }
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      toast({
        title: 'Authentication required',
        description: 'You need to be logged in to edit an item.',
        variant: 'destructive',
      });
      navigate('/auth');
      return;
    }
    
    if (!title || !categoryId || !pricePerDay || !location) {
      toast({
        title: 'Missing information',
        description: 'Please fill in all required fields.',
        variant: 'destructive',
      });
      return;
    }
    
    try {
      setIsSubmitting(true);
      
      // Process new images if any
      let newImageUrls: string[] = [];
      
      if (newImages.length > 0) {
        // Simulate upload progress
        const progressInterval = setInterval(() => {
          setUploadProgress(prev => {
            const newProgress = prev + 5;
            return newProgress > 90 ? 90 : newProgress;
          });
        }, 200);
        
        // Upload each image
        for (const file of newImages) {
          const fileExt = file.name.split('.').pop();
          const fileName = `${Date.now()}_${Math.random().toString(36).substring(2, 15)}.${fileExt}`;
          const filePath = `${user.id}/${fileName}`;
          
          // Try uploading to 'item-images' bucket (with hyphen) first, if that fails, try 'item_images' (with underscore)
          let uploadError;
          let data;
          
          try {
            const result = await supabase.storage
              .from('item-images')
              .upload(filePath, file);
              
            uploadError = result.error;
            data = result.data;
          } catch (err) {
            // If first attempt fails, try with underscore
            const result = await supabase.storage
              .from('item_images')
              .upload(filePath, file);
              
            uploadError = result.error;
            data = result.data;
          }
            
          if (uploadError) throw uploadError;
          
          // Get public URL - use the same bucket name that worked for upload
          let publicUrl;
          try {
            const { data } = supabase.storage
              .from('item-images')
              .getPublicUrl(filePath);
            publicUrl = data.publicUrl;
          } catch (err) {
            // Fallback to the underscore version
            const { data } = supabase.storage
              .from('item_images')
              .getPublicUrl(filePath);
            publicUrl = data.publicUrl;
          }
            
          newImageUrls.push(publicUrl);
        }
        
        clearInterval(progressInterval);
        setUploadProgress(100);
      }
      
      // Filter out images marked for deletion
      const remainingExistingImages = existingImages.filter(url => !imagesToDelete.includes(url));
      
      // Combine remaining existing images with new ones
      const updatedImages = [...remainingExistingImages, ...newImageUrls];
      
      // Update item data
      const { error: updateError } = await supabase
        .from('items')
        .update({
          title,
          description,
          category_id: categoryId,
          price_per_day: parseFloat(pricePerDay),
          location,
          images: updatedImages,
          is_available: isAvailable,
          updated_at: new Date().toISOString(),
        })
        .eq('id', id);
        
      if (updateError) throw updateError;
      
      toast({
        title: 'Item updated successfully',
        description: 'Your item has been updated.',
      });
      
      navigate('/profile');
      
    } catch (error: any) {
      console.error('Error updating item:', error.message);
      toast({
        title: 'Error',
        description: 'Failed to update the item. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  if (isLoadingItem) {
    return (
      <div className="min-h-screen bg-white font-poppins">
        <Header />
        <div className="pt-24 pb-16 flex items-center justify-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-[#F7996E]"></div>
        </div>
        <Footer />
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-white font-poppins">
      <Header />
      
      <div className="pt-20 pb-16">
        <div className="max-w-3xl mx-auto px-4 md:px-6">
          <Button 
            variant="ghost" 
            onClick={() => navigate('/profile')}
            className="mb-6"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Profile
          </Button>
          
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-[#181A2A] mb-3">
              Edit Your Item
            </h1>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Update your item details and images. All fields marked with * are required.
            </p>
          </div>
          
          <Card className="shadow-md border-0">
            <form onSubmit={handleSubmit}>
              <CardHeader>
                <CardTitle className="text-xl">Item Details</CardTitle>
              </CardHeader>
              
              <CardContent className="space-y-6">
                {/* Title */}
                <div className="space-y-2">
                  <Label htmlFor="title">
                    Title <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Enter a descriptive title"
                    required
                  />
                </div>
                
                {/* Description */}
                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Describe your item, its condition, and any special features"
                    rows={4}
                  />
                </div>
                
                {/* Category */}
                <div className="space-y-2">
                  <Label htmlFor="category">
                    Category <span className="text-red-500">*</span>
                  </Label>
                  <Select
                    value={categoryId}
                    onValueChange={setCategoryId}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select a category" />
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
                
                {/* Price */}
                <div className="space-y-2">
                  <Label htmlFor="price">
                    Price per day (₹) <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="price"
                    type="number"
                    value={pricePerDay}
                    onChange={(e) => setPricePerDay(e.target.value)}
                    placeholder="Enter price per day"
                    min="0"
                    step="0.01"
                    required
                  />
                </div>
                
                {/* Location */}
                <div className="space-y-2">
                  <Label htmlFor="location">
                    Location <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="location"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="Enter your location"
                    required
                  />
                </div>
                
                {/* Availability */}
                <div className="space-y-2">
                  <Label htmlFor="availability">Availability</Label>
                  <Select
                    value={isAvailable ? "true" : "false"}
                    onValueChange={(value) => setIsAvailable(value === "true")}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Set availability" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="true">Available for rent</SelectItem>
                      <SelectItem value="false">Not available</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                {/* Existing Images */}
                {existingImages.length > 0 && (
                  <div className="space-y-4">
                    <Label>Current Images</Label>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                      {existingImages.map((imageUrl, index) => (
                        <div 
                          key={index}
                          className={`relative rounded-lg overflow-hidden border-2 ${
                            imagesToDelete.includes(imageUrl)
                              ? 'border-red-500 opacity-50'
                              : 'border-transparent'
                          }`}
                        >
                          <img
                            src={imageUrl}
                            alt={`Item image ${index + 1}`}
                            className="w-full h-40 object-cover"
                            onError={(e) => {
                              (e.target as HTMLImageElement).src = 'https://placehold.co/400x400/f0f0f0/999999?text=No+Image';
                            }}
                          />
                          <button
                            type="button"
                            onClick={() => toggleImageToDelete(imageUrl)}
                            className={`absolute top-2 right-2 p-1 rounded-full ${
                              imagesToDelete.includes(imageUrl)
                                ? 'bg-red-500 text-white'
                                : 'bg-white text-red-500'
                            }`}
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                          {imagesToDelete.includes(imageUrl) && (
                            <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-30">
                              <span className="text-white font-medium">Marked for deletion</span>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                    {imagesToDelete.length > 0 && (
                      <p className="text-sm text-red-500">
                        {imagesToDelete.length} image(s) will be deleted when you save changes.
                      </p>
                    )}
                  </div>
                )}
                
                {/* New Images */}
                <div className="space-y-4">
                  <Label htmlFor="images">Add New Images</Label>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-[#F7996E] transition-colors">
                    <input
                      type="file"
                      id="images"
                      accept="image/jpeg,image/png,image/webp"
                      onChange={handleNewImageChange}
                      multiple
                      className="hidden"
                    />
                    <label htmlFor="images" className="cursor-pointer">
                      <ImagePlus className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-lg font-medium text-gray-700 mb-2">Upload Images</p>
                      <p className="text-sm text-gray-500">Drag and drop or click to select</p>
                      <p className="text-xs text-gray-400 mt-2">
                        JPG, PNG, WebP • Max 5MB per image
                      </p>
                    </label>
                  </div>
                  
                  {newImages.length > 0 && (
                    <div className="mt-4">
                      <h4 className="font-medium text-gray-700 mb-3">New Images to Upload</h4>
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                        {newImages.map((file, index) => (
                          <div key={index} className="relative rounded-lg overflow-hidden border">
                            <img
                              src={URL.createObjectURL(file)}
                              alt={`New image ${index + 1}`}
                              className="w-full h-40 object-cover"
                            />
                            <button
                              type="button"
                              onClick={() => removeNewImage(index)}
                              className="absolute top-2 right-2 p-1 rounded-full bg-white text-red-500"
                            >
                              <X className="h-4 w-4" />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
                
                {isSubmitting && (
                  <div className="mt-4">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-medium text-gray-700">Uploading...</span>
                      <span className="text-sm text-gray-500">{uploadProgress}%</span>
                    </div>
                    <Progress value={uploadProgress} className="h-2" />
                  </div>
                )}
              </CardContent>
              
              <CardFooter className="flex flex-col sm:flex-row gap-3 border-t pt-6">
                <Button
                  type="button"
                  variant="outline"
                  className="w-full sm:w-auto"
                  onClick={() => navigate('/profile')}
                  disabled={isSubmitting}
                >
                  <X className="mr-2 h-4 w-4" />
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="w-full sm:w-auto bg-[#F7996E] hover:bg-[#e8895f] text-white"
                  disabled={isSubmitting}
                >
                  <Save className="mr-2 h-4 w-4" />
                  Save Changes
                </Button>
              </CardFooter>
            </form>
          </Card>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default EditItem;
