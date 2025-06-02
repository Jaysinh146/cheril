
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Edit, Trash2, Eye } from 'lucide-react';
import OptimizedImage from '@/components/ui/OptimizedImage';
import { useNavigate } from 'react-router-dom';

interface ProfileItemCardProps {
  item: {
    id: string;
    title: string;
    price_per_day: number;
    images: string[];
    is_available: boolean;
    verification_status: string;
    categories?: {
      name: string;
    };
  };
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
  getImageUrl: (path: string) => string;
}

const ProfileItemCard: React.FC<ProfileItemCardProps> = ({
  item,
  onEdit,
  onDelete,
  getImageUrl
}) => {
  const navigate = useNavigate();

  const handleView = () => {
    navigate(`/product/${item.id}`);
  };

  return (
    <Card className="group hover:shadow-lg transition-all duration-200 overflow-hidden">
      <div className="relative aspect-square overflow-hidden bg-gray-50">
        <OptimizedImage
          src={getImageUrl(item.images?.[0] || '')}
          alt={item.title}
          className="w-full h-full group-hover:scale-105 transition-transform duration-200"
          objectFit="cover"
        />
        
        {/* Status badges */}
        <div className="absolute top-2 left-2 flex flex-col gap-1">
          <Badge 
            variant={item.is_available ? "default" : "secondary"}
            className={`text-xs ${item.is_available ? 'bg-green-500' : 'bg-red-500'}`}
          >
            {item.is_available ? 'Available' : 'Unavailable'}
          </Badge>
          <Badge 
            variant="outline" 
            className={`text-xs ${
              item.verification_status === 'verified' ? 'bg-blue-50 text-blue-700' :
              item.verification_status === 'pending' ? 'bg-yellow-50 text-yellow-700' :
              'bg-red-50 text-red-700'
            }`}
          >
            {item.verification_status === 'verified' ? 'Verified' :
             item.verification_status === 'pending' ? 'Pending' : 'Rejected'}
          </Badge>
        </div>
      </div>
      
      <CardContent className="p-3">
        <div className="space-y-2">
          <div>
            <p className="text-xs text-gray-500 uppercase tracking-wide">
              {item.categories?.name || 'Category'}
            </p>
            <h3 className="font-medium text-sm line-clamp-2 text-gray-900">
              {item.title}
            </h3>
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold text-gray-900">
                ₹{item.price_per_day}
              </p>
              <p className="text-xs text-gray-500">per day</p>
            </div>
          </div>
          
          {/* Action buttons */}
          <div className="grid grid-cols-3 gap-1 pt-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleView}
              className="h-8 text-xs"
            >
              <Eye className="w-3 h-3 mr-1" />
              View
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onEdit(item.id)}
              className="h-8 text-xs"
            >
              <Edit className="w-3 h-3 mr-1" />
              Edit
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onDelete(item.id)}
              className="h-8 text-xs text-red-600 hover:text-red-700 hover:border-red-200"
            >
              <Trash2 className="w-3 h-3 mr-1" />
              Delete
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProfileItemCard;
