import React, { memo } from 'react';
import { MapPin, Shield, Star } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { ExtendedItem, AverageRatingResponse } from '@/hooks/useProduct';

interface ProductDetailsProps {
  product: ExtendedItem;
  ratingData: AverageRatingResponse | undefined;
  renderRatingStars: (rating: number) => JSX.Element;
}

const ProductDetails: React.FC<ProductDetailsProps> = ({ 
  product, 
  ratingData,
  renderRatingStars
}) => {
  return (
    <div className="mb-6">
      <h1 className="text-3xl font-bold text-[#181A2A] mb-2">{product.title}</h1>
      
      <div className="flex items-center mb-4">
        <div className="flex items-center mr-4">
          {renderRatingStars(ratingData?.average_rating || 0)}
          <span className="ml-2 text-sm text-gray-600">
            {ratingData?.average_rating 
              ? `${ratingData.average_rating.toFixed(1)} (${ratingData.count} reviews)` 
              : 'No ratings yet'}
          </span>
        </div>
        
        <div className="flex items-center text-gray-600">
          <MapPin size={16} className="mr-1" />
          <span className="text-sm">{product.location || 'Location not specified'}</span>
        </div>
      </div>
      
      <div className="flex flex-wrap gap-2 mb-4">
        <Badge variant="outline" className="bg-blue-50">
          {product.categories?.name || 'Uncategorized'}
        </Badge>
        
        {product.is_available && (
          <Badge variant="outline" className="bg-green-50 text-green-700">
            Available Now
          </Badge>
        )}
        
        {product.verification_status === 'verified' && (
          <Badge variant="outline" className="bg-purple-50 flex items-center gap-1">
            <Shield size={12} className="text-purple-600" />
            <span className="text-purple-700">Verified</span>
          </Badge>
        )}
        
        {product.condition && (
          <Badge variant="outline" className="bg-gray-50">
            {product.condition}
          </Badge>
        )}
      </div>
      
      <div className="text-xl font-semibold text-[#181A2A] mb-4">
        ${product.price_per_day.toFixed(2)}<span className="text-sm font-normal"> / day</span>
        {product.security_deposit && (
          <span className="text-sm font-normal text-gray-600 ml-2">
            + ${product.security_deposit.toFixed(2)} security deposit
          </span>
        )}
      </div>
      
      <div className="mb-6">
        <h3 className="font-semibold mb-2">Description</h3>
        <p className="text-gray-700 whitespace-pre-line">{product.description}</p>
      </div>
      
      {/* Product Specifications */}
      <Card className="mb-6">
        <CardContent className="p-4">
          <h3 className="font-semibold mb-3">Specifications</h3>
          <div className="grid grid-cols-2 gap-y-2 gap-x-4 text-sm">
            {product.brand && (
              <>
                <div className="text-gray-600">Brand</div>
                <div>{product.brand}</div>
              </>
            )}
            
            {product.model && (
              <>
                <div className="text-gray-600">Model</div>
                <div>{product.model}</div>
              </>
            )}
            
            {product.year && (
              <>
                <div className="text-gray-600">Year</div>
                <div>{product.year}</div>
              </>
            )}
            
            {product.color && (
              <>
                <div className="text-gray-600">Color</div>
                <div>{product.color}</div>
              </>
            )}
            
            {product.dimensions && (
              <>
                <div className="text-gray-600">Dimensions</div>
                <div>{product.dimensions}</div>
              </>
            )}
          </div>
        </CardContent>
      </Card>
      
      {/* Owner Card */}
      <Card className="mb-6">
        <CardContent className="p-4">
          <h3 className="font-semibold mb-3">Owner</h3>
          
          <div className="flex items-center">
            <div className="w-12 h-12 rounded-full overflow-hidden bg-gray-200 mr-3">
              {product.profiles?.avatar_url ? (
                <img 
                  src={product.profiles.avatar_url} 
                  alt={product.profiles.username || 'Owner'} 
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-blue-100 text-blue-500">
                  {(product.profiles?.username || 'U').charAt(0).toUpperCase()}
                </div>
              )}
            </div>
            
            <div>
              <div className="font-medium">
                {/* Make sure to display owner's username correctly */}
                {product.profiles?.username ? product.profiles.username : 'User ' + product.owner_id.substring(0, 5)}
              </div>
              <div className="text-sm text-gray-600">
                Member since {product.profiles?.created_at 
                  ? new Date(product.profiles.created_at).toLocaleDateString() 
                  : 'Unknown'}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default memo(ProductDetails);
