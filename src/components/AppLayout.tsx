import React, { useState } from 'react';
import Header from './Header';
import Sidebar from './Sidebar';
import ProductGrid from './ProductGrid';
import Cart from './Cart';
import EnhancedMessages from './EnhancedMessages';
import { useAppContext } from '@/contexts/AppContext';
import { toast } from '@/components/ui/use-toast';

const AppLayout: React.FC = () => {
  const { 
    filteredProducts, 
    cart, 
    currentUser, 
    messages, 
    addToCart, 
    removeFromCart, 
    updateCartQuantity,
    sendMessage 
  } = useAppContext();
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedLocation, setSelectedLocation] = useState('All Locations');
  const [cartOpen, setCartOpen] = useState(false);
  const [messagesOpen, setMessagesOpen] = useState(false);
  const [selectedProductForChat, setSelectedProductForChat] = useState<any>(null);

  const handleAddToCart = (productId: string) => {
    addToCart(productId);
    toast({ title: 'Added to cart', description: 'Product added successfully!' });
  };

  const handleMessage = (productId: string) => {
    const product = filteredProducts.find(p => p.id === productId);
    if (product) {
      setSelectedProductForChat({
        id: product.id,
        title: product.title,
        price: product.price,
        image: product.images[0],
        location: product.location,
        details: product.condition === 'new' ? 'Brand New' : product.description.substring(0, 50) + '...'
      });
    }
    setMessagesOpen(true);
    toast({ title: 'Opening messages', description: 'Start a conversation with JonzyAutomobile!' });
  };

  const handleCheckout = () => {
    toast({ title: 'Checkout', description: 'Processing your premium order...' });
    setCartOpen(false);
  };

  const cartCount = cart.reduce((total, item) => total + item.quantity, 0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/50">
      <Header
        cartCount={cartCount}
        onCartClick={() => setCartOpen(true)}
        onMessagesClick={() => setMessagesOpen(true)}
      />
      
      <div className="flex flex-col lg:flex-row">
        <Sidebar
          selectedCategory={selectedCategory}
          onCategoryChange={setSelectedCategory}
          selectedLocation={selectedLocation}
          onLocationChange={setSelectedLocation}
        />
        
        <main className="flex-1 p-3 sm:p-4 lg:p-6">
          <div className="max-w-7xl mx-auto">
            <div className="mb-6 lg:mb-8">
              <div className="bg-white/80 backdrop-blur-sm rounded-xl lg:rounded-2xl p-4 sm:p-6 shadow-lg border border-blue-100">
                <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold mb-2 bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                  {selectedCategory === 'All' ? 'JonzyAutomobile Premium Marketplace' : selectedCategory}
                </h2>
                <p className="text-slate-600 text-sm sm:text-base lg:text-lg">
                  {filteredProducts.length} premium products available
                  {selectedLocation !== 'All Locations' && ` in ${selectedLocation}`}
                </p>
                <div className="mt-3 sm:mt-4 flex flex-wrap gap-2 sm:gap-4 text-xs sm:text-sm text-blue-600">
                  <span className="bg-gradient-to-r from-blue-100 to-indigo-100 px-2 sm:px-3 py-1 rounded-full whitespace-nowrap">✓ Admin Curated</span>
                  <span className="bg-gradient-to-r from-blue-100 to-indigo-100 px-2 sm:px-3 py-1 rounded-full whitespace-nowrap">✓ Search & Save</span>
                  <span className="bg-gradient-to-r from-blue-100 to-indigo-100 px-2 sm:px-3 py-1 rounded-full whitespace-nowrap">✓ Quality Guaranteed</span>
                  <span className="bg-gradient-to-r from-blue-100 to-indigo-100 px-2 sm:px-3 py-1 rounded-full whitespace-nowrap">✓ Instant Chat</span>
                </div>
              </div>
            </div>
            
            {/* Social Media Integration Section */}
            <div className="mb-6 lg:mb-8">
              <div className="bg-white/80 backdrop-blur-sm rounded-xl lg:rounded-2xl p-4 sm:p-6 shadow-lg border border-blue-100">
                <h3 className="text-lg sm:text-xl font-semibold mb-3 text-gray-800">Share JonzyAutomobile</h3>
                <p className="text-sm sm:text-base text-gray-600 mb-4">Connect with us on social media and share our premium marketplace with friends!</p>
                <div className="flex flex-wrap gap-3 justify-center sm:justify-start">
                  <a 
                    href="https://wa.me/2348012345678" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 text-sm transition-colors"
                  >
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488"/>
                    </svg>
                    WhatsApp
                  </a>
                  
                  <a 
                    href="https://facebook.com/jonzyautomobile" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 text-sm transition-colors"
                  >
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                    </svg>
                    Facebook
                  </a>
                  
                  <a 
                    href="https://instagram.com/jonzyautomobile" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 text-sm transition-colors"
                  >
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                    </svg>
                    Instagram
                  </a>
                  
                  <a 
                    href="https://tiktok.com/@jonzyautomobile" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="bg-black hover:bg-gray-800 text-white px-4 py-2 rounded-lg flex items-center gap-2 text-sm transition-colors"
                  >
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/>
                    </svg>
                    TikTok
                  </a>
                </div>
              </div>
            </div>
            
            <ProductGrid
              products={filteredProducts}
              onAddToCart={handleAddToCart}
              onMessage={handleMessage}
            />
          </div>
        </main>
      </div>

      <Cart
        isOpen={cartOpen}
        onClose={() => setCartOpen(false)}
        cartItems={cart}
        products={filteredProducts}
        onUpdateQuantity={updateCartQuantity}
        onRemoveItem={removeFromCart}
        onCheckout={handleCheckout}
      />

      <EnhancedMessages
        isOpen={messagesOpen}
        onClose={() => setMessagesOpen(false)}
        messages={messages}
        currentUser={currentUser}
        selectedProduct={selectedProductForChat}
      />
    </div>
  );
};

export default AppLayout;