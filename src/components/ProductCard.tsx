import React, { useState } from 'react';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Product } from '@/types';
import { MapPin, ShoppingCart, MessageCircle, Star, Eye, CreditCard } from 'lucide-react';
import ImageGallery from './ImageGallery';
import PaymentModal from './PaymentModal';


interface ProductCardProps {
  product: Product;
  onAddToCart: (productId: string) => void;
  onMessage: (productId: string) => void;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, onAddToCart, onMessage }) => {
  const [showImageGallery, setShowImageGallery] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);

  const handlePaymentSuccess = () => {
    alert('Payment successful! Your order has been confirmed.');
  };
  return (
    <Card className="group hover:shadow-xl transition-all duration-300 hover:-translate-y-1 sm:hover:-translate-y-2 border-0 shadow-md bg-gradient-to-br from-white to-slate-50 h-full flex flex-col">
      <div className="relative overflow-hidden rounded-t-lg cursor-pointer" onClick={() => setShowImageGallery(true)}>
        <img 
          src={product.images[0]} 
          alt={product.title}
          loading="lazy"
          decoding="async"
          className="w-full h-32 sm:h-40 lg:h-48 object-cover group-hover:scale-110 transition-transform duration-500"
        />

        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        
        {/* View Images Button */}
        <div className="absolute bottom-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <div className="bg-black/70 text-white px-2 py-1 rounded-full text-xs flex items-center">
            <Eye className="w-3 h-3 mr-1" />
            {product.images.length} photos
          </div>
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        <Badge 
          className={`absolute top-2 right-2 text-xs px-2 py-1 ${
            product.condition === 'new' 
              ? 'bg-blue-500 hover:bg-blue-600 text-white' 
              : 'bg-amber-500 hover:bg-amber-600 text-white'
          }`}
        >
          {product.condition}
        </Badge>
        {product.isSold && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
            <Badge className="bg-red-600 text-white text-lg px-4 py-2">
              SOLD OUT
            </Badge>
          </div>
        )}
        <div className="absolute top-2 left-2">
          <div className="flex items-center bg-white/90 rounded-full px-2 py-1 text-xs">
            <Star className="w-3 h-3 text-yellow-500 mr-1 fill-current" />
            <span className="font-medium">4.8</span>
          </div>
        </div>
      </div>
      
      <CardContent className="p-3 sm:p-4 flex-1 flex flex-col">
        <h3 className="font-bold text-sm sm:text-base lg:text-lg mb-2 line-clamp-2 text-slate-800 group-hover:text-blue-700 transition-colors leading-tight">
          {product.title}
        </h3>
        <p className="text-slate-600 text-xs sm:text-sm mb-2 sm:mb-3 line-clamp-2 leading-relaxed flex-1">
          {product.description}
        </p>
        
        <div className="flex items-center text-xs sm:text-sm text-slate-500 mb-2 sm:mb-3">
          <MapPin className="w-3 h-3 sm:w-4 sm:h-4 mr-1 text-indigo-500 flex-shrink-0" />
          <span className="font-medium truncate">{product.location}</span>
        </div>
        
        <Badge variant="outline" className="mb-2 sm:mb-3 border-blue-200 text-blue-700 bg-blue-50 text-xs w-fit">
          {product.category}
        </Badge>
        
        <div className="flex items-baseline justify-between mt-auto">
          <div className="text-lg sm:text-xl lg:text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
            ₦{product.price.toLocaleString()}
          </div>
          <div className="text-xs text-slate-500 hidden sm:block">
            Free delivery
          </div>
        </div>
      </CardContent>
      
      <CardFooter className="p-3 sm:p-4 pt-0 flex flex-col gap-2">
        <div className="flex flex-col sm:flex-row gap-2 w-full">
          <Button 
            onClick={() => onAddToCart(product.id)}
            disabled={product.isSold}
            className="w-full sm:flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 text-xs sm:text-sm py-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ShoppingCart className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
            <span className="hidden sm:inline">{product.isSold ? 'Sold Out' : 'Add to Cart'}</span>
            <span className="sm:hidden">{product.isSold ? 'Sold' : 'Add'}</span>
          </Button>
          <Button 
            variant="outline" 
            onClick={() => onMessage(product.id)}
            className="w-full sm:flex-1 border-blue-200 text-blue-700 hover:bg-blue-50 hover:border-blue-300 transition-all duration-300 text-xs sm:text-sm py-2"
          >
            <MessageCircle className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
            <span className="hidden sm:inline">Message</span>
            <span className="sm:hidden">Chat</span>
          </Button>
        </div>
        <Button 
          onClick={() => setShowPaymentModal(true)}
          disabled={product.isSold}
          className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 text-xs sm:text-sm py-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <CreditCard className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
          <span className="hidden sm:inline">{product.isSold ? 'Sold Out' : 'Buy Now - Pay Online'}</span>
          <span className="sm:hidden">{product.isSold ? 'Sold' : 'Buy Now'}</span>
        </Button>
        
        {/* Social Media Share Section */}
        <div className="mt-2 pt-2 border-t border-gray-100">
          <div className="flex flex-wrap gap-1 justify-center">
            <button
              onClick={() => {
                const message = `Check out this ${product.title} for ₦${product.price.toLocaleString()}!\n\n${window.location.href}`;
                const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(message)}`;
                window.open(whatsappUrl, '_blank');
              }}
              className="bg-green-500 hover:bg-green-600 text-white px-2 py-1 rounded text-xs flex items-center gap-1 transition-colors"
            >
              <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488"/>
              </svg>
              WhatsApp
            </button>
            
            <button
              onClick={() => {
                const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}`;
                window.open(facebookUrl, '_blank', 'width=600,height=400');
              }}
              className="bg-blue-600 hover:bg-blue-700 text-white px-2 py-1 rounded text-xs flex items-center gap-1 transition-colors"
            >
              <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
              </svg>
              Facebook
            </button>
          </div>
        </div>
      </CardFooter>

      {/* Payment Modal */}
      <PaymentModal
        isOpen={showPaymentModal}
        onClose={() => setShowPaymentModal(false)}
        amount={product.price}
        productTitle={product.title}
        onPaymentSuccess={handlePaymentSuccess}
      />

      {/* Image Gallery Modal */}
      <ImageGallery
        images={product.images}
        productTitle={product.title}
        isOpen={showImageGallery}
        onClose={() => setShowImageGallery(false)}
      />
    </Card>
  );
};

export default ProductCard;