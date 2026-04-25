import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { X, Plus, Minus, ShoppingBag, CreditCard } from 'lucide-react';
import { Product, CartItem } from '@/types';
import Checkout from './Checkout';

interface CartProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: CartItem[];
  products: Product[];
  onUpdateQuantity: (productId: string, quantity: number) => void;
  onRemoveItem: (productId: string) => void;
  onCheckout?: () => void;
}

const Cart: React.FC<CartProps> = ({ isOpen, onClose, cartItems, products, onUpdateQuantity, onRemoveItem }) => {
  const [checkoutOpen, setCheckoutOpen] = useState(false);

  const getProduct = (productId: string) => products.find(p => p.id === productId);
  const total = cartItems.reduce((sum, item) => {
    const p = getProduct(item.productId);
    return sum + (p?.price || 0) * item.quantity;
  }, 0);

  if (!isOpen && !checkoutOpen) return null;

  return (
    <>
      {isOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex justify-end">
          <div className="bg-white w-full sm:max-w-md h-full overflow-y-auto shadow-2xl flex flex-col">
            <div className="p-4 sm:p-6 border-b bg-gradient-to-r from-blue-600 to-indigo-600 text-white sticky top-0 z-10">
              <div className="flex items-center justify-between">
                <h2 className="text-lg sm:text-xl font-bold flex items-center">
                  <ShoppingBag className="w-5 h-5 mr-2" /> Your Cart
                </h2>
                <Button variant="ghost" size="sm" onClick={onClose} className="text-white hover:bg-white/20 h-10 w-10 p-0">
                  <X className="w-5 h-5" />
                </Button>
              </div>
              <p className="text-blue-100 text-xs sm:text-sm mt-1">{cartItems.length} item{cartItems.length !== 1 ? 's' : ''}</p>
            </div>

            <div className="p-4 sm:p-6 flex-1">
              {cartItems.length === 0 ? (
                <div className="text-center py-12">
                  <div className="bg-slate-100 rounded-full w-20 h-20 mx-auto mb-4 flex items-center justify-center">
                    <ShoppingBag className="w-10 h-10 text-slate-400" />
                  </div>
                  <h3 className="text-base font-semibold text-gray-700 mb-1">Your cart is empty</h3>
                  <p className="text-sm text-gray-500">Add some premium items to get started</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {cartItems.map(item => {
                    const product = getProduct(item.productId);
                    if (!product) return null;
                    return (
                      <Card key={item.productId} className="shadow-sm">
                        <CardContent className="p-3">
                          <div className="flex items-start gap-3">
                            <img src={product.images[0]} alt={product.title}
                              className="w-16 h-16 object-cover rounded-lg flex-shrink-0" loading="lazy" />
                            <div className="flex-1 min-w-0">
                              <h4 className="font-semibold text-sm leading-tight line-clamp-2">{product.title}</h4>
                              <p className="text-blue-600 font-bold text-sm mt-1">₦{product.price.toLocaleString()}</p>
                              <Badge variant="secondary" className="text-xs mt-1">{product.category}</Badge>
                            </div>
                            <Button variant="ghost" size="sm"
                              onClick={() => onRemoveItem(product.id)}
                              className="h-8 w-8 p-0 text-red-500 hover:bg-red-50 flex-shrink-0">
                              <X className="w-4 h-4" />
                            </Button>
                          </div>
                          <div className="flex items-center justify-between mt-3">
                            <div className="flex items-center gap-1 bg-slate-100 rounded-lg p-1">
                              <Button variant="ghost" size="sm"
                                onClick={() => onUpdateQuantity(product.id, Math.max(0, item.quantity - 1))}
                                className="h-8 w-8 p-0">
                                <Minus className="w-3 h-3" />
                              </Button>
                              <span className="w-8 text-center font-medium text-sm">{item.quantity}</span>
                              <Button variant="ghost" size="sm"
                                onClick={() => onUpdateQuantity(product.id, item.quantity + 1)}
                                className="h-8 w-8 p-0">
                                <Plus className="w-3 h-3" />
                              </Button>
                            </div>
                            <div className="font-bold text-blue-600 text-base">
                              ₦{(product.price * item.quantity).toLocaleString()}
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              )}
            </div>

            {cartItems.length > 0 && (
              <div className="border-t p-4 sm:p-6 bg-slate-50 sticky bottom-0">
                <div className="flex justify-between items-center mb-4">
                  <span className="text-base font-semibold text-gray-700">Total:</span>
                  <span className="text-2xl font-bold text-blue-600">₦{total.toLocaleString()}</span>
                </div>
                <Button
                  onClick={() => setCheckoutOpen(true)}
                  className="w-full h-12 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold text-base">
                  <CreditCard className="w-5 h-5 mr-2" /> Checkout as Guest
                </Button>
                <p className="text-xs text-center text-slate-500 mt-2">No account required · Secure payment</p>
              </div>
            )}
          </div>
        </div>
      )}

      <Checkout
        isOpen={checkoutOpen}
        onClose={() => { setCheckoutOpen(false); onClose(); }}
        cartItems={cartItems}
        products={products}
      />
    </>
  );
};

export default Cart;
