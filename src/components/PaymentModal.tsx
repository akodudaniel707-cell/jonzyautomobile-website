import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { CreditCard, Smartphone, X, Shield, CheckCircle } from 'lucide-react';

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  amount: number;
  productTitle: string;
  onPaymentSuccess: () => void;
}

const PaymentModal: React.FC<PaymentModalProps> = ({
  isOpen,
  onClose,
  amount,
  productTitle,
  onPaymentSuccess
}) => {
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'transfer'>('card');
  const [isProcessing, setIsProcessing] = useState(false);
  const [cardDetails, setCardDetails] = useState({
    number: '',
    expiry: '',
    cvv: '',
    name: ''
  });
  const [transferDetails, setTransferDetails] = useState({
    phone: '',
    bank: ''
  });

  const handleCardPayment = async () => {
    setIsProcessing(true);
    // Simulate payment processing
    setTimeout(() => {
      setIsProcessing(false);
      onPaymentSuccess();
      onClose();
    }, 3000);
  };

  const handleTransferPayment = async () => {
    setIsProcessing(true);
    // Simulate transfer processing
    setTimeout(() => {
      setIsProcessing(false);
      onPaymentSuccess();
      onClose();
    }, 2500);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <span>Complete Payment</span>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="w-4 h-4" />
            </Button>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Order Summary */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="font-semibold text-sm mb-2">Order Summary</h3>
            <p className="text-sm text-gray-600 mb-2">{productTitle}</p>
            <div className="flex justify-between items-center">
              <span className="font-bold text-lg">Total: ₦{amount.toLocaleString()}</span>
            </div>
          </div>

          {/* Payment Method Selection */}
          <div className="space-y-3">
            <Label className="text-sm font-medium">Choose Payment Method</Label>
            <div className="grid grid-cols-2 gap-3">
              <Button
                variant={paymentMethod === 'card' ? 'default' : 'outline'}
                onClick={() => setPaymentMethod('card')}
                className="flex items-center justify-center p-3 h-auto"
              >
                <CreditCard className="w-4 h-4 mr-2" />
                <span className="text-sm">Card</span>
              </Button>
              <Button
                variant={paymentMethod === 'transfer' ? 'default' : 'outline'}
                onClick={() => setPaymentMethod('transfer')}
                className="flex items-center justify-center p-3 h-auto"
              >
                <Smartphone className="w-4 h-4 mr-2" />
                <span className="text-sm">Transfer</span>
              </Button>
            </div>
          </div>

          <Separator />

          {/* Card Payment Form */}
          {paymentMethod === 'card' && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="cardName">Cardholder Name</Label>
                <Input
                  id="cardName"
                  placeholder="John Doe"
                  value={cardDetails.name}
                  onChange={(e) => setCardDetails(prev => ({ ...prev, name: e.target.value }))}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="cardNumber">Card Number</Label>
                <Input
                  id="cardNumber"
                  placeholder="1234 5678 9012 3456"
                  value={cardDetails.number}
                  onChange={(e) => setCardDetails(prev => ({ ...prev, number: e.target.value }))}
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2">
                  <Label htmlFor="expiry">Expiry</Label>
                  <Input
                    id="expiry"
                    placeholder="MM/YY"
                    value={cardDetails.expiry}
                    onChange={(e) => setCardDetails(prev => ({ ...prev, expiry: e.target.value }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="cvv">CVV</Label>
                  <Input
                    id="cvv"
                    placeholder="123"
                    value={cardDetails.cvv}
                    onChange={(e) => setCardDetails(prev => ({ ...prev, cvv: e.target.value }))}
                  />
                </div>
              </div>
              <Button 
                onClick={handleCardPayment} 
                disabled={isProcessing}
                className="w-full"
              >
                {isProcessing ? 'Processing...' : `Pay ₦${amount.toLocaleString()}`}
              </Button>
            </div>
          )}

          {/* Mobile Transfer Form */}
          {paymentMethod === 'transfer' && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number</Label>
                <Input
                  id="phone"
                  placeholder="08012345678"
                  value={transferDetails.phone}
                  onChange={(e) => setTransferDetails(prev => ({ ...prev, phone: e.target.value }))}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="bank">Select Bank</Label>
                <select
                  id="bank"
                  className="w-full p-2 border rounded-md"
                  value={transferDetails.bank}
                  onChange={(e) => setTransferDetails(prev => ({ ...prev, bank: e.target.value }))}
                >
                  <option value="">Choose your bank</option>
                  <option value="gtbank">GTBank</option>
                  <option value="firstbank">First Bank</option>
                  <option value="zenith">Zenith Bank</option>
                  <option value="uba">UBA</option>
                  <option value="access">Access Bank</option>
                </select>
              </div>
              <Button 
                onClick={handleTransferPayment} 
                disabled={isProcessing}
                className="w-full"
              >
                {isProcessing ? 'Processing...' : `Transfer ₦${amount.toLocaleString()}`}
              </Button>
            </div>
          )}

          {/* Security Info */}
          <div className="flex items-center justify-center space-x-2 text-xs text-gray-500 mt-4">
            <Shield className="w-3 h-3" />
            <span>Secured by 256-bit SSL encryption</span>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PaymentModal;