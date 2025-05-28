import { supabase } from '@/integrations/supabase/client';

export const uploadItemImages = async (
  files: File[],
  userId: string,
  itemId: string
): Promise<string[]> => {
  const uploadedUrls: string[] = [];

  // Verify user authentication first
  const { data: userData, error: authError } = await supabase.auth.getUser();
  if (authError || !userData?.user) {
    console.error('Authentication error:', authError);
    throw new Error('You must be authenticated to upload images');
  }

  for (const file of files) {
    try {
      // Create a safe filename
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}_${Math.random().toString(36).substring(2, 8)}.${fileExt}`;
      
      // Use proper folder structure: userId/itemId/fileName
      const filePath = `${userId}/${itemId}/${fileName}`;
      
      // Upload the file to the item-images bucket
      const { error, data: uploadData } = await supabase.storage
        .from('item-images')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: true
        });

      if (error) {
        console.error('Upload error:', error.message);
        if (error.message.includes('storage bucket')) {
          throw new Error('Storage bucket not configured correctly. Please contact support.');
        }
        continue;
      }
      
      // Get the public URL
      const { data: urlData } = supabase.storage
        .from('item-images')
        .getPublicUrl(filePath);

      if (urlData && urlData.publicUrl) {
        uploadedUrls.push(urlData.publicUrl);
      }
    } catch (error: any) {
      console.error('Unexpected error during upload:', error);
      throw new Error(`Image upload failed: ${error.message || 'Unknown error'}`);
    }
  }

  return uploadedUrls;
};

export const deleteImageFromStorage = async (
  imageUrl: string
): Promise<void> => {
  try {
    // First verify user authentication
    const { data: userData, error: authError } = await supabase.auth.getUser();
    if (authError || !userData?.user) {
      console.error('Authentication error:', authError);
      throw new Error('You must be authenticated to delete images');
    }
    
    // Extract the path from the public URL
    const url = new URL(imageUrl);
    const pathMatch = url.pathname.match(/\/storage\/v1\/object\/public\/item-images\/(.*)/);
    
    if (!pathMatch || !pathMatch[1]) {
      throw new Error('Invalid image URL format');
    }
    
    const filePath = decodeURIComponent(pathMatch[1]);

    // Delete the file
    const { error } = await supabase.storage
      .from('item-images')
      .remove([filePath]);

    if (error) {
      console.error('Delete error:', error);
      throw new Error(`Failed to delete image: ${error.message}`);
    }
  } catch (error: any) {
    console.error('Error deleting image:', error);
    throw new Error(error.message || 'Failed to delete image');
  }
};
