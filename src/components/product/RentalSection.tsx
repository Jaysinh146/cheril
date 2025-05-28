import React, { memo, useCallback } from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { ExtendedItem } from '@/hooks/useProduct';

interface RentalSectionProps {
  product: ExtendedItem;
  rentalDays: number;
  setRentalDays: (days: number) => void;
  calculateTotalCost: (days: number, pricePerDay: number, deposit: number) => number;
}

const RentalSection: React.FC<RentalSectionProps> = ({
  product,
  rentalDays,
  setRentalDays,
  calculateTotalCost
}) => {
  const handleDaysChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value, 10);
    if (!isNaN(value) && value > 0) {
      setRentalDays(value);
    }
  }, [setRentalDays]);

  return (
    <div className="mb-6 border border-gray-200 rounded-lg p-4">
      <h3 className="font-semibold mb-3">Rental Details</h3>
      
      <div className="mb-4">
        <Label htmlFor="rental-days">Number of Days</Label>
        <Input
          id="rental-days"
          type="number"
          min="1"
          value={rentalDays}
          onChange={handleDaysChange}
          className="mt-1"
        />
      </div>
      
      <div className="space-y-2">
        <div className="flex justify-between">
          <span>Price per day</span>
          <span>${product.price_per_day.toFixed(2)}</span>
        </div>
        
        <div className="flex justify-between">
          <span>Rental period</span>
          <span>{rentalDays} day{rentalDays > 1 ? 's' : ''}</span>
        </div>
        
        <div className="flex justify-between">
          <span>Subtotal</span>
          <span>${(rentalDays * product.price_per_day).toFixed(2)}</span>
        </div>
        
        {product.security_deposit && (
          <div className="flex justify-between">
            <span>Security deposit</span>
            <span>${product.security_deposit.toFixed(2)}</span>
          </div>
        )}
        
        <div className="flex justify-between font-semibold pt-2 border-t border-gray-200">
          <span>Total cost</span>
          <span>
            ${calculateTotalCost(
              rentalDays, 
              product.price_per_day, 
              product.security_deposit || 0
            ).toFixed(2)}
          </span>
        </div>
      </div>
    </div>
  );
};

export default memo(RentalSection);
