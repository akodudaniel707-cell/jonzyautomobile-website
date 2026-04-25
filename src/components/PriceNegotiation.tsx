import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { DollarSign } from 'lucide-react';

interface PriceNegotiationProps {
  originalPrice: number;
  onMakeOffer: (offer: number) => void;
  onClose: () => void;
}

const PriceNegotiation: React.FC<PriceNegotiationProps> = ({ 
  originalPrice, 
  onMakeOffer, 
  onClose 
}) => {
  const [offerAmount, setOfferAmount] = useState('');

  const handleSubmitOffer = () => {
    const amount = parseFloat(offerAmount);
    if (amount > 0 && amount < originalPrice) {
      onMakeOffer(amount);
      onClose();
    }
  };

  const suggestedOffers = [
    Math.round(originalPrice * 0.8),
    Math.round(originalPrice * 0.85),
    Math.round(originalPrice * 0.9)
  ];

  return (
    <Card className="p-4 m-4 bg-blue-50 border-blue-200">
      <div className="flex items-center mb-3">
        <DollarSign className="w-5 h-5 text-blue-600 mr-2" />
        <h3 className="font-semibold text-blue-800">Make an Offer</h3>
      </div>
      
      <p className="text-sm text-gray-600 mb-3">
        Listed price: ₦{originalPrice.toLocaleString()}
      </p>
      
      <div className="space-y-3">
        <div>
          <Input
            type="number"
            placeholder="Enter your offer"
            value={offerAmount}
            onChange={(e) => setOfferAmount(e.target.value)}
            className="mb-2"
          />
        </div>
        
        <div>
          <p className="text-xs text-gray-500 mb-2">Quick offers:</p>
          <div className="flex gap-2">
            {suggestedOffers.map((offer, index) => (
              <Button
                key={index}
                variant="outline"
                size="sm"
                onClick={() => setOfferAmount(offer.toString())}
                className="text-xs"
              >
                ₦{offer.toLocaleString()}
              </Button>
            ))}
          </div>
        </div>
        
        <div className="flex gap-2">
          <Button 
            onClick={handleSubmitOffer}
            className="flex-1 bg-blue-600 hover:bg-blue-700"
            disabled={!offerAmount || parseFloat(offerAmount) <= 0}
          >
            Send Offer
          </Button>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
        </div>
      </div>
    </Card>
  );
};

export default PriceNegotiation;