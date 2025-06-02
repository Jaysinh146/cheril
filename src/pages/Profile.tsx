
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ProfileItemCard from '@/components/ProfileItemCard';
import { Edit, Camera, MapPin, Phone, MessageSquare } from 'lucide-react';

interface UserItem {
  id: string;
  title: string;
  price_per_day: number;
  images: string[];
  is_available: boolean;
  verification_status: string;
  created_at: string;
  categories?: {
    name: string;
  };
}

interface ProfileData {
  full_name?: string;
  avatar_url?: string;
  phone?: string;
  whatsapp_number?: string;
}

const Profile = () => {
  const { user, signOut } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [profileData, setProfileData] = useState<ProfileData>({});
  const [userItems, setUserItems] = useState<UserItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState<ProfileData>({});

  useEffect(() => {
    if (!user) {
      navigate('/auth');
      return;
    }
    fetchProfileData();
    fetchUserItems();
  }, [user, navigate]);

  const fetchProfileData = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (error && error.code !== 'PGRST116') {
        throw error;
      }

      if (data) {
        setProfileData(data);
        setEditData(data);
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
      toast({
        title: 'Error',
        description: 'Failed to load profile data',
        variant: 'destructive',
      });
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
          categories(name)
        `)
        .eq('owner_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;

      setUserItems(data || []);
    } catch (error) {
      console.error('Error fetching user items:', error);
      toast({
        title: 'Error',
        description: 'Failed to load your items',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveProfile = async () => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('profiles')
        .upsert({
          id: user.id,
          ...editData,
          updated_at: new Date().toISOString(),
        });

      if (error) throw error;

      setProfileData(editData);
      setIsEditing(false);
      toast({
        title: 'Success',
        description: 'Profile updated successfully',
      });
    } catch (error) {
      console.error('Error updating profile:', error);
      toast({
        title: 'Error',
        description: 'Failed to update profile',
        variant: 'destructive',
      });
    }
  };

  const handleEditItem = (itemId: string) => {
    navigate(`/edit-item/${itemId}`);
  };

  const handleDeleteItem = async (itemId: string) => {
    if (!confirm('Are you sure you want to delete this item?')) return;

    try {
      const { error } = await supabase
        .from('items')
        .delete()
        .eq('id', itemId);

      if (error) throw error;

      setUserItems(prev => prev.filter(item => item.id !== itemId));
      toast({
        title: 'Success',
        description: 'Item deleted successfully',
      });
    } catch (error) {
      console.error('Error deleting item:', error);
      toast({
        title: 'Error',
        description: 'Failed to delete item',
        variant: 'destructive',
      });
    }
  };

  const getImageUrl = (path: string): string => {
    if (!path) return 'https://placehold.co/400x400/e2e8f0/64748b?text=No+Image';
    if (path.startsWith('http')) return path;

    const { data } = supabase.storage
      .from('item-images')
      .getPublicUrl(path);

    return data.publicUrl;
  };

  const handleSignOut = async () => {
    try {
      await signOut();
      navigate('/');
      toast({
        title: 'Signed out',
        description: 'You have been successfully signed out',
      });
    } catch (error) {
      console.error('Error signing out:', error);
      toast({
        title: 'Error',
        description: 'Failed to sign out',
        variant: 'destructive',
      });
    }
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#ffebe3] to-white">
      <Header />
      
      <div className="container mx-auto px-4 py-8 mt-6">
        <div className="max-w-6xl mx-auto space-y-6">
          {/* Profile Header */}
          <Card>
            <CardHeader className="pb-4">
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                <div className="relative">
                  <Avatar className="w-20 h-20">
                    <AvatarImage src={profileData.avatar_url} />
                    <AvatarFallback className="text-lg">
                      {profileData.full_name?.charAt(0) || user.email?.charAt(0) || 'U'}
                    </AvatarFallback>
                  </Avatar>
                  <Button
                    size="sm"
                    variant="outline"
                    className="absolute -bottom-2 -right-2 h-8 w-8 rounded-full p-0"
                    onClick={() => setIsEditing(true)}
                  >
                    <Camera className="h-4 w-4" />
                  </Button>
                </div>
                
                <div className="flex-1">
                  <h1 className="text-2xl font-bold text-gray-900">
                    {profileData.full_name || 'Your Name'}
                  </h1>
                  <p className="text-gray-600">{user.email}</p>
                  
                  <div className="flex flex-wrap gap-4 mt-2 text-sm text-gray-600">
                    {profileData.phone && (
                      <div className="flex items-center gap-1">
                        <Phone className="h-4 w-4" />
                        <span>{profileData.phone}</span>
                      </div>
                    )}
                    {profileData.whatsapp_number && (
                      <div className="flex items-center gap-1">
                        <MessageSquare className="h-4 w-4" />
                        <span>{profileData.whatsapp_number}</span>
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    onClick={() => setIsEditing(true)}
                  >
                    <Edit className="h-4 w-4 mr-2" />
                    Edit Profile
                  </Button>
                  <Button
                    variant="outline"
                    onClick={handleSignOut}
                  >
                    Sign Out
                  </Button>
                </div>
              </div>
            </CardHeader>
          </Card>

          {/* Edit Profile Modal */}
          {isEditing && (
            <Card>
              <CardHeader>
                <CardTitle>Edit Profile</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="full_name">Full Name</Label>
                  <Input
                    id="full_name"
                    value={editData.full_name || ''}
                    onChange={(e) => setEditData({...editData, full_name: e.target.value})}
                    placeholder="Enter your full name"
                  />
                </div>
                
                <div>
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input
                    id="phone"
                    value={editData.phone || ''}
                    onChange={(e) => setEditData({...editData, phone: e.target.value})}
                    placeholder="Enter your phone number"
                  />
                </div>
                
                <div>
                  <Label htmlFor="whatsapp_number">WhatsApp Number</Label>
                  <Input
                    id="whatsapp_number"
                    value={editData.whatsapp_number || ''}
                    onChange={(e) => setEditData({...editData, whatsapp_number: e.target.value})}
                    placeholder="Enter your WhatsApp number"
                  />
                </div>
                
                <div className="flex gap-2">
                  <Button onClick={handleSaveProfile}>Save Changes</Button>
                  <Button variant="outline" onClick={() => setIsEditing(false)}>
                    Cancel
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Profile Content */}
          <Tabs defaultValue="items" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="items">My Items ({userItems.length})</TabsTrigger>
              <TabsTrigger value="analytics">Analytics</TabsTrigger>
              <TabsTrigger value="settings">Settings</TabsTrigger>
            </TabsList>

            <TabsContent value="items" className="space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold">Your Items</h2>
                <Button onClick={() => navigate('/list-item')}>
                  Add New Item
                </Button>
              </div>

              {isLoading ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {[...Array(8)].map((_, i) => (
                    <Card key={i} className="animate-pulse">
                      <div className="aspect-square bg-gray-200"></div>
                      <CardContent className="p-3 space-y-2">
                        <div className="h-4 bg-gray-200 rounded"></div>
                        <div className="h-3 bg-gray-200 rounded w-2/3"></div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : userItems.length === 0 ? (
                <Card className="text-center py-12">
                  <CardContent>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      No items listed yet
                    </h3>
                    <p className="text-gray-600 mb-4">
                      Start earning by listing your first item
                    </p>
                    <Button onClick={() => navigate('/list-item')}>
                      List Your First Item
                    </Button>
                  </CardContent>
                </Card>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                  {userItems.map((item) => (
                    <ProfileItemCard
                      key={item.id}
                      item={item}
                      onEdit={handleEditItem}
                      onDelete={handleDeleteItem}
                      getImageUrl={getImageUrl}
                    />
                  ))}
                </div>
              )}
            </TabsContent>

            <TabsContent value="analytics">
              <Card>
                <CardHeader>
                  <CardTitle>Analytics</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">Analytics dashboard coming soon...</p>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="settings">
              <Card>
                <CardHeader>
                  <CardTitle>Account Settings</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">Account settings coming soon...</p>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Profile;
