import { supabase } from '@/integrations/supabase/client';

/**
 * This is a fallback solution that uses base64 encoding to store images in the database
 * instead of using Supabase Storage buckets.
 */
export const fallbackUpload = async (file: File): Promise<string> => {
  try {
    // Convert the file to base64
    const base64 = await fileToBase64(file);
    
    // Generate a unique ID for the image
    const imageId = `img_${Date.now()}_${Math.random().toString(36).substring(2, 10)}`;
    
    // Store the image reference in the items table
    // This is a simpler approach that doesn't require a new table
    // For a complete solution, you would use this data URL directly
    // as the image source in your application
    console.log('Created data URL with length:', base64.length);
    
    // We're skipping database insertion since we're using data URLs directly
    // For production, you would want to store this in a proper storage solution
    
    // Return a virtual URL that can be used to retrieve the image
    return `data:${file.type};base64,${base64}`;
  } catch (error) {
    console.error('Fallback upload error:', error);
    throw error;
  }
};

/**
 * Convert a file to base64 string
 */
const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        // Remove the data URL prefix (e.g., "data:image/jpeg;base64,")
        const base64 = reader.result.split(',')[1];
        resolve(base64);
      } else {
        reject(new Error('Failed to convert file to base64'));
      }
    };
    reader.onerror = reject;
  });
};
