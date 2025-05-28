import React, { useState, useEffect, memo } from 'react';
import { Loader2 } from 'lucide-react';

interface OptimizedImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src: string;
  alt: string;
  objectFit?: 'contain' | 'cover' | 'fill' | 'none' | 'scale-down';
  fallbackSrc?: string;
}

const OptimizedImage: React.FC<OptimizedImageProps> = ({
  src,
  alt,
  className = '',
  objectFit = 'cover',
  fallbackSrc = 'https://placehold.co/600x400/e2e8f0/64748b?text=No+Image',
  ...props
}) => {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(false);
  const [imageSrc, setImageSrc] = useState(src);
  
  // Effect to handle src changes
  useEffect(() => {
    setImageSrc(src);
    setIsLoading(true);
    setError(false);
  }, [src]);

  const handleLoad = () => {
    setIsLoading(false);
  };

  const handleError = () => {
    setIsLoading(false);
    setError(true);
    
    // Enhanced error handling for Supabase images
    if (src && typeof src === 'string') {
      // Case 1: Handle paths with item-images that need a full URL
      if (src.includes('item-images') && !src.includes('/storage/v1/object/public/')) {
        const supabaseUrl = 'https://zpjjtajbsnnphszojggs.supabase.co';
        // Extract the file path portion after 'item-images/'
        let filePath = src;
        if (src.includes('item-images/')) {
          filePath = src.split('item-images/')[1];
        } else {
          filePath = src.split('/').pop() || '';
        }
        const newSrc = `${supabaseUrl}/storage/v1/object/public/item-images/${filePath}`;
        console.log('Trying alternative URL format 1:', newSrc);
        setImageSrc(newSrc);
        return;
      }
      
      // Case 2: Try with a different domain structure
      if (src.includes('supabase') && !src.includes('object/public')) {
        const fileName = src.split('/').pop() || '';
        const newSrc = `https://zpjjtajbsnnphszojggs.supabase.co/storage/v1/object/public/item-images/${fileName}`;
        console.log('Trying alternative URL format 2:', newSrc);
        setImageSrc(newSrc);
        return;
      }
      
      // Case 3: For URLs that failed after all retries
      if (error) {
        console.log('All image load attempts failed for:', src);
        setImageSrc(fallbackSrc);
      }
    } else {
      // Invalid source, use fallback
      console.log('Invalid image source');
      setImageSrc(fallbackSrc);
    }
  };

  return (
    <div className={`relative ${className}`}>
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
          <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
        </div>
      )}
      <img
        src={error ? fallbackSrc : imageSrc}
        alt={alt}
        className={`w-full h-full object-${objectFit} ${isLoading ? 'opacity-0' : 'opacity-100'} transition-opacity duration-300`}
        loading="lazy"
        onLoad={handleLoad}
        onError={handleError}
        {...props}
      />
    </div>
  );
};

export default memo(OptimizedImage);
