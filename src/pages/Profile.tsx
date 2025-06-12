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
import { Edit, Camera, MapPin, Phone, MessageSquare, Trash2 } from 'lucide-react';
import Analytics from './Analytics';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';

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
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [deleteItemId, setDeleteItemId] = useState<string | null>(null);
  const [showLogoutDialog, setShowLogoutDialog] = useState(false);
  const [isUploadingImage, setIsUploadingImage] = useState(false);

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

  const handleImageUpload = async (file: File) => {
    if (!user) return;

    try {
      setIsUploadingImage(true);
      
      // Delete old image if exists
      if (profileData.avatar_url) {
        const oldPath = profileData.avatar_url.split('/').pop();
        if (oldPath) {
          await supabase.storage
            .from('profile-images')
            .remove([`${user.id}/${oldPath}`]);
        }
      }

      // Upload new image
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}.${fileExt}`;
      const filePath = `${user.id}/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('profile-images')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      // Get public URL
      const { data: urlData } = supabase.storage
        .from('profile-images')
        .getPublicUrl(filePath);

      const newAvatarUrl = urlData.publicUrl;

      // Update profile
      const { error: updateError } = await supabase
        .from('profiles')
        .upsert({
          id: user.id,
          ...profileData,
          avatar_url: newAvatarUrl,
          updated_at: new Date().toISOString(),
        });

      if (updateError) throw updateError;

      setProfileData({ ...profileData, avatar_url: newAvatarUrl });
      setEditData({ ...editData, avatar_url: newAvatarUrl });

      toast({
        title: 'Success',
        description: 'Profile picture updated successfully',
      });
    } catch (error) {
      console.error('Error uploading image:', error);
      toast({
        title: 'Error',
        description: 'Failed to upload profile picture',
        variant: 'destructive',
      });
    } finally {
      setIsUploadingImage(false);
    }
  };

  const handleRemoveProfilePicture = async () => {
    if (!user || !profileData.avatar_url) return;

    try {
      // Delete from storage
      const oldPath = profileData.avatar_url.split('/').pop();
      if (oldPath) {
        await supabase.storage
          .from('profile-images')
          .remove([`${user.id}/${oldPath}`]);
      }

      // Update profile
      const { error } = await supabase
        .from('profiles')
        .update({ avatar_url: null })
        .eq('id', user.id);

      if (error) throw error;

      setProfileData({ ...profileData, avatar_url: undefined });
      setEditData({ ...editData, avatar_url: undefined });

      toast({
        title: 'Success',
        description: 'Profile picture removed successfully',
      });
    } catch (error) {
      console.error('Error removing profile picture:', error);
      toast({
        title: 'Error',
        description: 'Failed to remove profile picture',
        variant: 'destructive',
      });
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
    setDeleteItemId(itemId);
    setShowDeleteDialog(true);
  };

  const confirmDeleteItem = async () => {
    if (!deleteItemId) return;
    try {
      const { error } = await supabase
        .from('items')
        .delete()
        .eq('id', deleteItemId);
      if (error) throw error;
      setUserItems(prev => prev.filter(item => item.id !== deleteItemId));
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
    } finally {
      setShowDeleteDialog(false);
      setDeleteItemId(null);
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
    setShowLogoutDialog(true);
  };

  const confirmSignOut = async () => {
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
    } finally {
      setShowLogoutDialog(false);
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
                <div className="relative flex flex-col items-center">
                  <Avatar className="w-24 h-24 mb-2">
                    <AvatarImage 
                      src={profileData.avatar_url} 
                      alt="Profile" 
                      className="object-cover"
                    />
                    <AvatarFallback className="text-3xl font-bold">
                      {profileData.full_name?.charAt(0) || user.email?.charAt(0) || 'U'}
                    </AvatarFallback>
                  </Avatar>
                  
                  <div className="flex gap-2">
                    <Button
                      size="icon"
                      variant="outline"
                      className="h-10 w-10 rounded-full p-0 flex items-center justify-center"
                      onClick={() => document.getElementById('profile-photo-upload')?.click()}
                      title={profileData.avatar_url ? 'Replace Photo' : 'Add Photo'}
                      disabled={isUploadingImage}
                    >
                      <Camera className="w-5 h-5" />
                    </Button>
                    {profileData.avatar_url && (
                      <Button
                        size="icon"
                        variant="destructive"
                        className="h-10 w-10 rounded-full p-0 flex items-center justify-center"
                        onClick={handleRemoveProfilePicture}
                        title="Remove Photo"
                        disabled={isUploadingImage}
                      >
                        <Trash2 className="w-5 h-5" />
                      </Button>
                    )}
                  </div>
                  <input
                    type="file"
                    accept="image/*"
                    id="profile-photo-upload"
                    style={{ display: 'none' }}
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) handleImageUpload(file);
                    }}
                  />
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
              <Analytics />
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

      {/* Dialog for delete confirmation */}
      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Item</DialogTitle>
          </DialogHeader>
          <p>Are you sure you want to delete this item? This action cannot be undone.</p>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDeleteDialog(false)}>Cancel</Button>
            <Button variant="destructive" onClick={confirmDeleteItem}>Delete</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      {/* Dialog for logout confirmation */}
      <Dialog open={showLogoutDialog} onOpenChange={setShowLogoutDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Sign Out</DialogTitle>
          </DialogHeader>
          <p>Are you sure you want to sign out?</p>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowLogoutDialog(false)}>Cancel</Button>
            <Button variant="destructive" onClick={confirmSignOut}>Sign Out</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Profile;
