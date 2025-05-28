import React, { memo } from 'react';
import OptimizedImage from '@/components/ui/OptimizedImage';

interface ProductImageGalleryProps {
  images: string[];
  activeImage: string;
  setActiveImage: (url: string) => void;
  getImageUrl: (path: string | null) => string;
}

const ProductImageGallery: React.FC<ProductImageGalleryProps> = ({
  images,
  activeImage,
  setActiveImage,
  getImageUrl
}) => {
  return (
    <div className="max-w-md mx-auto lg:mx-0">
      <div className="mb-4">
        <div className="rounded-lg overflow-hidden bg-gray-50 aspect-square max-h-[400px] border border-gray-200">
          {activeImage && (
            <OptimizedImage
              src={activeImage}
              alt="Product"
              className="w-full h-full"
              objectFit="contain"
            />
          )}
        </div>
      </div>
      
      {/* Thumbnail Gallery */}
      <div className="grid grid-cols-5 gap-2">
        {images && images.length > 0 ? (
          images.map((img, idx) => (
            <div
              key={idx}
              className={`aspect-square rounded-md overflow-hidden cursor-pointer border-2 ${
                activeImage === getImageUrl(img) ? 'border-blue-500' : 'border-transparent'
              }`}
              onClick={() => setActiveImage(getImageUrl(img))}
            >
              <OptimizedImage
                src={getImageUrl(img)}
                alt={`Thumbnail ${idx + 1}`}
                className="w-full h-full"
                objectFit="cover"
              />
            </div>
          ))
        ) : (
          <div className="col-span-5 text-center py-2 text-gray-500">
            No images available
          </div>
        )}
      </div>
    </div>
  );
};

export default memo(ProductImageGallery);
