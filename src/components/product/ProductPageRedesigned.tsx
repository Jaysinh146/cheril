import React, { useState, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar } from '@/components/ui/calendar';
import { format } from 'date-fns';
import { Heart, Calendar as CalendarIcon } from 'lucide-react';
import OptimizedImage from '@/components/ui/OptimizedImage';
import { ExtendedItem } from '@/hooks/useProduct';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';

interface ProductPageRedesignedProps {
  product: ExtendedItem;
  activeImage: string;
  setActiveImage: (url: string) => void;
  getImageUrl: (path: string | null) => string;
  rentalDays: number;
  setRentalDays: (days: number) => void;
  calculateTotalCost: (days: number, pricePerDay: number, deposit: number) => number;
  isItemSaved: boolean;
  onSaveToWishlist: () => void;
  onRentNow: () => void;
}

const ProductPageRedesigned: React.FC<ProductPageRedesignedProps> = ({
  product,
  activeImage,
  setActiveImage,
  getImageUrl,
  rentalDays,
  setRentalDays,
  calculateTotalCost,
  isItemSaved,
  onSaveToWishlist,
  onRentNow
}) => {
  // Available rental durations
  const rentalOptions = [
    { days: 1, label: '1 day' },
    { days: 3, label: '3 days' },
    { days: 7, label: '7 days' },
    { days: 14, label: '14 days' },
    { days: 30, label: '30 days' }
  ];
  
  // Custom rental duration
  const [customDays, setCustomDays] = useState<string>('');
  
  // Handle custom days input
  const handleCustomDaysChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/[^0-9]/g, '');
    setCustomDays(value);
  };
  
  // Apply custom days
  const applyCustomDays = () => {
    const days = parseInt(customDays, 10);
    if (!isNaN(days) && days > 0 && days <= 365) {
      setRentalDays(days);
      setCustomDays('');
    }
  };

  // Calculate total cost
  const totalCost = calculateTotalCost(
    rentalDays, 
    product.price_per_day, 
    product.security_deposit || 0
  );

  // Check if contact information is available
  const hasContactInfo = product.profiles?.phone || product.profiles?.whatsapp_number;
  
  console.log('Contact info check:', {
    phone: product.profiles?.phone,
    whatsapp: product.profiles?.whatsapp_number,
    hasContactInfo
  });

  return (
    <div className="bg-white rounded-lg p-4 md:p-6 shadow-md">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
        {/* Left column - Product Images */}
        <div className="mb-6 md:mb-0">
          {/* Main image */}
          <div className="mb-4 aspect-square overflow-hidden bg-gray-50 rounded-lg border border-gray-200">
            <OptimizedImage
              src={activeImage}
              alt={product.title}
              className="w-full h-full"
              objectFit="contain"
            />
          </div>

          {/* Thumbnail images */}
          {product.images && product.images.length > 1 && (
            <div className="grid grid-cols-5 xs:grid-cols-6 sm:grid-cols-8 md:grid-cols-4 gap-1 sm:gap-2">
              {product.images.slice(0, 4).map((image, index) => (
                <div
                  key={index}
                  onClick={() => setActiveImage(getImageUrl(image))}
                  className={`cursor-pointer aspect-square rounded overflow-hidden border ${activeImage === getImageUrl(image) ? 'border-[#F7996E] ring-1 ring-[#F7996E]' : 'border-gray-200'}`}
                >
                  <OptimizedImage
                    src={getImageUrl(image)}
                    alt={`${product.title} - Image ${index + 1}`}
                    className="w-full h-full"
                  />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right column - Product Details */}
        <div>
          <div className="space-y-4 md:space-y-6">
            {/* Category and product name */}
            <div>
              <h1 className="uppercase text-sm md:text-xl text-gray-500 mb-1">
                {product.categories?.name || 'Category'}
              </h1>
              <h2 className="text-2xl md:text-3xl font-bold break-words">
                {product.title}
              </h2>
            </div>

            {/* Price information */}
            <div>
              <p className="text-lg">
                Rent ₹{product.price_per_day.toFixed(2)} per day
              </p>
              <p className="text-sm text-gray-500">
                From ₹{(product.price_per_day * 4).toFixed(2)} for 4+ days
              </p>
            </div>

            {/* Condition if available */}
            {product.condition && (
              <div>
                <h3 className="text-sm font-medium mb-2">Condition:</h3>
                <div className="flex space-x-2">
                  <Badge variant="outline" className="bg-gray-50">
                    {product.condition}
                  </Badge>
                </div>
              </div>
            )}

            {/* Size */}
            <div>
              <h3 className="text-sm font-medium mb-2">Size:</h3>
              <p>{product.dimensions || 'One size'}</p>
            </div>

            {/* Rental duration */}
            <div>
              <h3 className="text-sm font-medium mb-2">Rental duration:</h3>
              <div className="flex flex-wrap gap-2 mb-4">
                {rentalOptions.map(option => (
                  <Button
                    key={option.days}
                    variant={rentalDays === option.days ? "default" : "outline"}
                    className={`text-sm md:text-base px-3 md:px-4 ${rentalDays === option.days ? "bg-[#F7996E] hover:bg-[#e8895f] text-white" : ""}`}
                    onClick={() => setRentalDays(option.days)}
                  >
                    {option.label}
                  </Button>
                ))}
              </div>
              
              {/* Custom Duration Input */}
              <div className="flex items-center gap-2 mt-2">
                <div className="relative flex-grow">
                  <input
                    type="text"
                    value={customDays}
                    onChange={handleCustomDaysChange}
                    placeholder="Custom days"
                    className="w-full p-2 border rounded-md"
                  />
                </div>
                <Button 
                  onClick={applyCustomDays}
                  disabled={!customDays || parseInt(customDays, 10) <= 0}
                  className="bg-[#F7996E] hover:bg-[#e8895f] text-white"
                >
                  Apply
                </Button>
              </div>
            </div>

            {/* Total cost */}
            <div className="pt-4 border-t border-gray-200">
              <div className="flex justify-between text-lg font-semibold">
                <span>Total:</span>
                <span>₹{totalCost.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm text-gray-500 mt-1">
                <span>Rent for {rentalDays} day{rentalDays > 1 ? 's' : ''}:</span>
                <span>₹{(product.price_per_day * rentalDays).toFixed(2)}</span>
              </div>
              {product.security_deposit > 0 && (
                <div className="flex justify-between text-sm text-gray-500 mt-1">
                  <span>Security deposit (refundable):</span>
                  <span>₹{product.security_deposit.toFixed(2)}</span>
                </div>
              )}
            </div>

            {/* Contact Information Warning */}
            {!hasContactInfo && (
              <div className="mt-4 p-3 bg-red-100 text-red-700 rounded-md">
                <p className="font-semibold">Contact Information Missing</p>
                <p className="text-sm">The owner has not provided contact information</p>
              </div>
            )}
            
            {/* Action buttons */}
            <div className="flex space-x-2 mt-4">
              <Button 
                className="bg-[#F7996E] hover:bg-[#e8895f] text-white flex-grow h-10 md:h-12"
                onClick={onRentNow}
                disabled={!hasContactInfo}
              >
                Send Message on WhatsApp
              </Button>
              <Button 
                variant="outline"
                className={`h-10 md:h-12 w-10 md:w-12 flex-shrink-0 ${isItemSaved ? 'text-red-500 border-red-200' : ''}`}
                onClick={onSaveToWishlist}
              >
                <Heart className={isItemSaved ? 'fill-current' : ''} size={18} />
              </Button>
            </div>

            {/* Item details section */}
            <div className="pt-4 md:pt-6 mt-4 md:mt-6 border-t border-gray-200">
              <h3 className="font-semibold text-base md:text-lg mb-2">Description:</h3>
              <p className="text-gray-600 text-sm md:text-base whitespace-pre-line">{product.description}</p>
            </div>

            {/* Specifications if available */}
            {(product.brand || product.model || product.condition) && (
              <div className="mt-4">
                <h3 className="font-semibold text-base md:text-lg mb-2">Specifications:</h3>
                <div className="grid grid-cols-2 gap-x-2 md:gap-x-4 gap-y-2 text-xs md:text-sm">
                  {product.brand && (
                    <>
                      <span className="text-gray-500 font-medium">Brand:</span>
                      <span>{product.brand}</span>
                    </>
                  )}
                  {product.model && (
                    <>
                      <span className="text-gray-500 font-medium">Model:</span>
                      <span>{product.model}</span>
                    </>
                  )}
                  {product.condition && (
                    <>
                      <span className="text-gray-500 font-medium">Condition:</span>
                      <span>{product.condition}</span>
                    </>
                  )}
                </div>
              </div>
            )}

            {/* Owner information */}
            <div className="mt-4 pt-4 border-t border-gray-200">
              <div className="flex items-center">
                <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center mr-3">
                  {product.profiles?.avatar_url ? (
                    <OptimizedImage
                      src={product.profiles.avatar_url}
                      alt={product.profiles.username}
                      className="w-full h-full rounded-full"
                      objectFit="cover"
                    />
                  ) : (
                    <span className="text-gray-500 font-medium">
                      {product.profiles?.username?.charAt(0) || 'U'}
                    </span>
                  )}
                </div>
                <div>
                  <p className="font-medium">{product.profiles?.username}</p>
                  <p className="text-sm text-gray-500">Owner</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductPageRedesigned;
