import React, { memo, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Phone, MessageSquare, Heart, Share } from 'lucide-react';
import { ExtendedItem } from '@/hooks/useProduct';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/components/ui/use-toast';
import { useNavigate } from 'react-router-dom';

interface ProductActionsProps {
  product: ExtendedItem;
  rentalDays: number;
  isItemSaved: boolean;
  onSaveToWishlist: () => void;
  generateWhatsAppMessage: (item: ExtendedItem) => string;
}

const ProductActions: React.FC<ProductActionsProps> = ({
  product,
  rentalDays,
  isItemSaved,
  onSaveToWishlist,
  generateWhatsAppMessage
}) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleContactOwner = useCallback(() => {
    if (!user) {
      toast({
        title: 'Authentication Required',
        description: 'Please sign in to contact the owner',
        variant: 'destructive',
      });
      navigate('/auth');
      return;
    }

    if (user.id === product.owner_id) {
      toast({
        title: 'Error',
        description: 'This is your own listing',
        variant: 'destructive',
      });
      return;
    }

    // Check if owner has WhatsApp number
    if (!product.profiles?.whatsapp_number) {
      toast({
        title: 'Contact Information Missing',
        description: 'The owner has not provided contact information',
        variant: 'destructive',
      });
      return;
    }

    // Format the number and open WhatsApp
    const whatsappNumber = product.profiles.whatsapp_number.replace(/\D/g, '');
    const message = generateWhatsAppMessage(product);
    window.open(`https://wa.me/${whatsappNumber}?text=${message}`, '_blank');
  }, [user, product, toast, navigate, generateWhatsAppMessage]);

  const handleShareItem = useCallback(async () => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: product.title,
          text: `Check out this rental: ${product.title}`,
          url: window.location.href,
        });
      } else {
        // Fallback to copying to clipboard
        await navigator.clipboard.writeText(window.location.href);
        toast({
          title: 'Link Copied',
          description: 'Item link copied to clipboard',
        });
      }
    } catch (error) {
      console.error('Error sharing:', error);
      toast({
        title: 'Error',
        description: 'Failed to share item',
        variant: 'destructive',
      });
    }
  }, [product, toast]);

  return (
    <div className="flex flex-wrap gap-3 mb-6">
      <Button 
        className="flex-1 bg-green-600 hover:bg-green-700 text-white"
        onClick={handleContactOwner}
      >
        {product.profiles?.whatsapp_number ? (
          <>
            <Phone size={18} className="mr-2" />
            Contact via WhatsApp
          </>
        ) : (
          <>
            <MessageSquare size={18} className="mr-2" />
            Contact Owner
          </>
        )}
      </Button>
      
      <Button
        variant="outline"
        className={`${isItemSaved ? 'text-red-500 border-red-200' : ''}`}
        onClick={() => {
          if (!user) {
            toast({
              title: 'Authentication Required',
              description: 'Please sign in to save items',
              variant: 'destructive',
            });
            navigate('/auth');
            return;
          }
          onSaveToWishlist();
        }}
      >
        <Heart size={18} className={`${isItemSaved ? 'fill-red-500' : ''}`} />
      </Button>
      
      <Button
        variant="outline"
        onClick={handleShareItem}
      >
        <Share size={18} />
      </Button>
    </div>
  );
};

export default memo(ProductActions);
