import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { 
  User, 
  Package, 
  Edit, 
  Trash2, 
  CheckCircle,
  ShieldCheck, 
  Upload,
  ExternalLink,
  Phone
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { getRandomAvatar } from '@/lib/getRandomAvatar';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

// Define types
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
};

type Profile = {
  id: string;
  full_name: string | null;
  avatar_url: string | null;
  phone: string | null;
  whatsapp_number: string | null;
  created_at: string;
  updated_at: string;
  is_verified: boolean;
};

const Profile = () => {
  const [activeTab, setActiveTab] = useState('listings');
  const [userItems, setUserItems] = useState<Item[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [userProfile, setUserProfile] = useState<Profile | null>(null);
  const [deleteItemId, setDeleteItemId] = useState<string | null>(null);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showGenderDialog, setShowGenderDialog] = useState(false);
  const [selectedGender, setSelectedGender] = useState<'male' | 'female' | null>(null);
  const [showEditProfileDialog, setShowEditProfileDialog] = useState(false);
  const [whatsappNumber, setWhatsappNumber] = useState('');
  
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    if (userProfile && !userProfile.avatar_url && !showGenderDialog) {
      setShowGenderDialog(true);
    }
    if (userProfile?.whatsapp_number) {
      setWhatsappNumber(userProfile.whatsapp_number);
    }
  }, [userProfile]);

  const handleGenderSelect = async (gender: 'male' | 'female') => {
    if (!user) return;
    setSelectedGender(gender);
    const avatarUrl = getRandomAvatar(gender);
    
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ avatar_url: avatarUrl })
        .eq('id', user.id);

      if (error) throw error;
      await fetchUserProfile();
      setShowGenderDialog(false);
    } catch (error: any) {
      console.error('Error updating avatar:', error.message);
    }
  };

  const handleUpdateProfile = async () => {
    if (!user) return;
    
    try {
      // Use the correct type for the update operation
      const { error } = await supabase
        .from('profiles')
        .update({
          whatsapp_number: whatsappNumber
        } as any) // Using type assertion to bypass TypeScript error
        .eq('id', user.id);

      if (error) throw error;
      
      await fetchUserProfile();
      setShowEditProfileDialog(false);
      
      toast({
        title: 'Profile Updated',
        description: 'Your profile has been updated successfully.',
      });
    } catch (error: any) {
      console.error('Error updating profile:', error.message);
      toast({
        title: 'Error',
        description: 'Failed to update profile. Please try again.',
        variant: 'destructive',
      });
    }
  };

  useEffect(() => {
    if (!user) {
      navigate('/auth');
      return;
    }

    fetchUserProfile();
    fetchUserItems();
  }, [user, navigate]);

  const fetchUserProfile = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (error) throw error;
      setUserProfile(data as Profile);
    } catch (error: any) {
      console.error('Error fetching user profile:', error.message);
    }
  };

  const fetchUserItems = async () => {
    if (!user) return;

    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('items')
        .select(`
          *,
          categories (name)
        `)
        .eq('owner_id', user.id)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching items:', error);
        throw error;
      }
      
      // Ensure all data is properly formatted
      const formattedItems = data?.map(item => {
        // Make sure item.images is always an array, even if it's null
        if (!item.images) item.images = [];
        return item;
      });
      
      setUserItems(formattedItems as Item[]);
    } catch (error: any) {
      console.error('Error fetching items:', error.message);
      toast({
        title: 'Error',
        description: 'Failed to fetch your listings. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteItem = async () => {
    if (!deleteItemId) return;
    
    try {
      const { error } = await supabase
        .from('items')
        .delete()
        .eq('id', deleteItemId);
      
      if (error) throw error;
      
      setUserItems(userItems.filter(item => item.id !== deleteItemId));
      toast({
        title: 'Success',
        description: 'Item deleted successfully',
      });
      
      setShowDeleteDialog(false);
      setDeleteItemId(null);
    } catch (error: any) {
      console.error('Error deleting item:', error.message);
      toast({
        title: 'Error',
        description: 'Failed to delete the item. Please try again.',
        variant: 'destructive',
      });
    }
  };
  
  const confirmDelete = (id: string) => {
    setDeleteItemId(id);
    setShowDeleteDialog(true);
  };

  const getImageUrl = (images: string[] | null) => {
    if (images && images.length > 0) {
      // Check if the URL is already a complete URL
      if (images[0].startsWith('http')) {
        return images[0];
      }
      
      // If it's a storage path, get the public URL
      try {
        // Handle both full paths and just filenames
        const path = images[0];
        
        // Log the path to help with debugging
        console.log('Image path being processed:', path);
        
        const { data } = supabase.storage
          .from('item-images')
          .getPublicUrl(path);
        
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

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#ffebe3] to-white relative font-poppins">
      {/* Background Pattern */}
      <div className="absolute inset-0 z-0 opacity-5">
        <div className="absolute inset-0" style={{ 
          backgroundImage: `radial-gradient(#F7996E 1px, transparent 1px), radial-gradient(#F7996E 1px, transparent 1px)`,
          backgroundSize: `20px 20px`,
          backgroundPosition: `0 0, 10px 10px`
        }}></div>
      </div>
      <Header />
      
      <div className="pt-24 pb-16">
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          <div className="mb-8 md:mb-12">
            {/* Profile Header */}
            <Card className="border-0 shadow-md overflow-hidden mb-8">
              <div className="bg-gradient-to-r from-[#f9f9f9] to-[#ffebe3] h-32 relative"></div>
              <CardContent className="relative px-6 pt-0 pb-6">
                <div className="flex flex-col md:flex-row gap-6 items-start md:items-center -mt-12">
                  <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center overflow-hidden border-4 border-white shadow-md">
                    {userProfile?.avatar_url ? (
                      <img 
                        src={userProfile.avatar_url} 
                        alt={userProfile.full_name || 'User'} 
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <User className="w-12 h-12 text-gray-400" />
                    )}
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h2 className="text-2xl font-bold text-gray-800">
                        {userProfile?.full_name || user?.email}
                      </h2>
                      {userProfile?.is_verified && (
                        <Badge className="bg-blue-500 text-white">
                          <CheckCircle className="w-3 h-3 mr-1" />
                          Verified Seller
                        </Badge>
                      )}
                    </div>
                    <p className="text-gray-500 mt-1">Member since {new Date(user?.created_at || userProfile?.created_at || '').toLocaleDateString()}</p>
                    {userProfile?.whatsapp_number && (
                      <div className="flex items-center text-green-600 mt-1">
                        <Phone className="w-4 h-4 mr-1" />
                        <span>WhatsApp: {userProfile.whatsapp_number}</span>
                      </div>
                    )}
                  </div>
                  
                  <div className="mt-4 md:mt-0">
                    <div className="flex flex-col sm:flex-row gap-2">
                      {!userProfile?.is_verified && (
                        <Button className="bg-blue-500 hover:bg-blue-600 text-white" asChild>
                          <Link to="/verify">
                            <ShieldCheck className="w-4 h-4 mr-2" />
                            Become a Verified Seller
                          </Link>
                        </Button>
                      )}
                      <Button variant="outline" onClick={() => setShowEditProfileDialog(true)}>
                        <Edit className="w-4 h-4 mr-2" />
                        Edit Profile
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            {/* Tabs Section */}
            <Tabs 
              defaultValue={activeTab}
              onValueChange={setActiveTab}
              className="w-full"
            >
              <TabsList className="mb-6 w-full flex justify-start border-b">
                <TabsTrigger 
                  value="listings" 
                  className="px-4 py-2 text-base font-medium data-[state=active]:border-b-2 data-[state=active]:border-[#F7996E] rounded-none"
                >
                  <Package className="w-4 h-4 mr-2" />
                  My Listings
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="listings" className="mt-4">
                {isLoading ? (
                  <div className="text-center py-12">
                    <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-[#F7996E] mx-auto mb-4"></div>
                    <p className="text-gray-600">Loading your listings...</p>
                  </div>
                ) : userItems.length > 0 ? (
                  <div>
                    <div className="flex justify-between items-center mb-6">
                      <h3 className="text-xl font-semibold text-gray-800">
                        Your Items ({userItems.length})
                      </h3>
                      <Button className="bg-[#F7996E] hover:bg-[#e8895f] text-white" asChild>
                        <Link to="/list-item">
                          <Package className="w-4 h-4 mr-2" />
                          List New Item
                        </Link>
                      </Button>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {userItems.map((item) => (
                        <Card key={item.id} className="overflow-hidden shadow-md relative">
                          {isVerified(item.verification_status) && (
                            <div className="absolute top-2 right-2 z-10">
                              <Badge className="bg-blue-500 text-white px-2 py-1 flex items-center">
                                <CheckCircle className="w-3 h-3 mr-1" />
                                Verified
                              </Badge>
                            </div>
                          )}
                          
                          <div className="aspect-square overflow-hidden">
                            <img 
                              src={getImageUrl(item.images)} 
                              alt={item.title} 
                              className="w-full h-full object-cover" 
                              loading="lazy"
                              onError={(e) => {
                                console.error(`Failed to load image for item: ${item.id}`);
                                (e.target as HTMLImageElement).src = 'https://placehold.co/400x400/f0f0f0/999999?text=No+Image';
                              }}
                            />
                          </div>
                          
                          <CardContent className="p-4">
                            <div className="flex justify-between mb-1">
                              <h3 className="font-semibold text-gray-800 line-clamp-1">{item.title}</h3>
                              <Badge className="bg-[#F7996E]">₹{item.price_per_day}/day</Badge>
                            </div>
                            
                            <p className="text-sm text-gray-500 mb-4">
                              {item.categories?.name || 'Uncategorized'}
                            </p>
                            
                            <div className="flex gap-2 mt-2">
                              <Button 
                                variant="outline" 
                                size="sm" 
                                className="flex-1"
                                asChild
                              >
                                <Link to={`/edit-item/${item.id}`}>
                                  <Edit className="w-3 h-3 mr-1" />
                                  Edit
                                </Link>
                              </Button>
                              <Button 
                                variant="outline" 
                                size="sm"
                                className="flex-1 text-red-500 border-red-200 hover:bg-red-50 hover:text-red-600"
                                onClick={() => confirmDelete(item.id)}
                              >
                                <Trash2 className="w-3 h-3 mr-1" />
                                Delete
                              </Button>
                              <Button 
                                variant="outline" 
                                size="sm"
                                className="flex-1"
                                asChild
                              >
                                <Link to={`/product/${item.id}`}>
                                  <ExternalLink className="w-3 h-3 mr-1" />
                                  View
                                </Link>
                              </Button>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-12 bg-gray-50 rounded-lg">
                    <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-gray-600 mb-2">No Items Listed Yet</h3>
                    <p className="text-gray-500 mb-6">Start listing your items to rent them out to others.</p>
                    <Button className="bg-[#F7996E] hover:bg-[#e8895f] text-white" asChild>
                      <Link to="/list-item">List Your First Item</Link>
                    </Button>
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
      
      {/* Delete Confirmation Dialog */}
      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this item? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDeleteDialog(false)}>Cancel</Button>
            <Button variant="destructive" onClick={handleDeleteItem}>Delete</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={showEditProfileDialog} onOpenChange={setShowEditProfileDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Profile</DialogTitle>
            <DialogDescription>
              Update your profile information
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="grid w-full items-center gap-1.5">
              <label htmlFor="whatsapp" className="text-sm font-medium leading-none">
                WhatsApp Number
              </label>
              <div className="relative">
                <Phone className="absolute left-2 top-2.5 h-4 w-4 text-gray-500" />
                <input
                  id="whatsapp"
                  placeholder="+91 1234567890"
                  className="flex h-10 w-full rounded-md border border-input bg-background pl-8 px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  value={whatsappNumber}
                  onChange={(e) => setWhatsappNumber(e.target.value)}
                />
              </div>
              <p className="text-xs text-gray-500">Include country code (e.g., +91 for India)</p>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowEditProfileDialog(false)}>Cancel</Button>
            <Button onClick={handleUpdateProfile}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={showGenderDialog} onOpenChange={setShowGenderDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Choose Your Avatar</DialogTitle>
            <DialogDescription>
              Select your gender to get a personalized avatar
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-center gap-4 py-4">
            <Button
              onClick={() => handleGenderSelect('male')}
              variant="outline"
              className="w-32 h-32 rounded-full p-0 overflow-hidden hover:border-[#F7996E]">
              <img
                src={getRandomAvatar('male')}
                alt="Male Avatar"
                className="w-full h-full object-cover"
              />
              <span className="sr-only">Male</span>
            </Button>
            <Button
              onClick={() => handleGenderSelect('female')}
              variant="outline"
              className="w-32 h-32 rounded-full p-0 overflow-hidden hover:border-[#F7996E]">
              <img
                src={getRandomAvatar('female')}
                alt="Female Avatar"
                className="w-full h-full object-cover"
              />
              <span className="sr-only">Female</span>
            </Button>
          </div>
        </DialogContent>
      </Dialog>
      <Footer />
    </div>
  );
};

export default Profile;
