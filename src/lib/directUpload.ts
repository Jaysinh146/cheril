import { supabase } from '@/integrations/supabase/client';

/**
 * Simple direct upload function that bypasses common issues
 */
export const directUpload = async (file: File): Promise<string | null> => {
  try {
    // Generate a unique file path
    const fileExt = file.name.split('.').pop() || 'jpg';
    const fileName = `upload_${Date.now()}_${Math.random().toString(36).substring(2, 10)}.${fileExt}`;
    
    // Upload the file directly to the public bucket
    // Note: public bucket must exist and have proper policies
    const { data, error } = await supabase
      .storage
      .from('public')
      .upload(fileName, file, {
        cacheControl: '3600',
        upsert: false
      });
    
    if (error) {
      console.error('Upload error:', error);
      return null;
    }
    
    // Get the public URL
    const { data: { publicUrl } } = supabase
      .storage
      .from('public')
      .getPublicUrl(fileName);
    
    return publicUrl;
  } catch (error) {
    console.error('Error in direct upload:', error);
    return null;
  }
};
