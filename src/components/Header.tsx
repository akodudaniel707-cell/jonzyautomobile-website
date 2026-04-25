import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ShoppingCart, MessageCircle, User, Menu, MapPin, Bookmark, Bell, Plus, BookOpen, Shield } from 'lucide-react';
import { useAppContext } from '@/contexts/AppContext';
import SearchBar from './SearchBar';
import SavedSearches from './SavedSearches';
import AdminPanel from './AdminPanel';
import AdminLogin from './AdminLogin';
import BlogSection from './BlogSection';

interface HeaderProps {
  cartCount: number;
  onCartClick: () => void;
  onMessagesClick: () => void;
}

const Header: React.FC<HeaderProps> = ({ cartCount, onCartClick, onMessagesClick }) => {
  const { toggleSidebar, searchProducts, saveSearch, savedSearches, isAdminAuthenticated } = useAppContext();
  const [showSavedSearches, setShowSavedSearches] = useState(false);
  const [showAdminPanel, setShowAdminPanel] = useState(false);
  const [showAdminLogin, setShowAdminLogin] = useState(false);
  const [showBlog, setShowBlog] = useState(false);

  const activeNotifications = savedSearches.filter(s => s.notificationsEnabled).length;

  const handleAdminClick = () => {
    if (isAdminAuthenticated) {
      setShowAdminPanel(true);
    } else {
      setShowAdminLogin(true);
    }
  };

  return (
    <>
      <header className="bg-gradient-to-r from-slate-800 via-blue-900 to-indigo-900 shadow-2xl border-b sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-6">
          <div className="flex items-center justify-between h-14 sm:h-16 lg:h-20 gap-2">
            {/* Logo */}
            <div className="flex items-center gap-2 flex-shrink-0">
              <Button variant="ghost" size="sm" onClick={toggleSidebar}
                className="lg:hidden text-white hover:bg-white/20 rounded-lg h-10 w-10 p-0">
                <Menu className="w-5 h-5" />
              </Button>
              <div className="flex items-center gap-2">
                <div className="bg-white/20 backdrop-blur-sm p-1.5 sm:p-2 rounded-lg">
                  <img src="https://d64gsuwffb70l.cloudfront.net/68826c5b323dadd7e15cd62e_1757472214071_c3a56cc0.png"
                    alt="JonzyAutomobile" className="w-6 h-6 sm:w-7 sm:h-7 object-contain" loading="eager" />
                </div>
                <div className="hidden sm:block">
                  <h1 className="text-sm sm:text-lg lg:text-xl font-bold text-white">JonzyAutomobile</h1>
                  <div className="flex items-center text-blue-100 text-xs">
                    <MapPin className="w-3 h-3 mr-1" />
                    <span className="hidden md:inline">Lagos, Nigeria</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Search */}
            <div className="flex-1 max-w-xs sm:max-w-md lg:max-w-lg">
              <SearchBar onSearch={searchProducts} onSaveSearch={saveSearch} />
            </div>

            {/* Actions */}
            <div className="flex items-center gap-0.5 sm:gap-1 flex-shrink-0">
              {isAdminAuthenticated && (
                <Button variant="ghost" size="sm" onClick={handleAdminClick}
                  className="text-white hover:bg-white/20 rounded-lg h-10 w-10 sm:w-auto sm:px-3 p-0 bg-orange-500/20 border border-orange-300/30"
                  title="Admin Dashboard">
                  <Plus className="w-5 h-5" />
                  <span className="hidden lg:inline ml-2">Admin</span>
                </Button>
              )}

              <Button variant="ghost" size="sm" onClick={() => setShowBlog(true)}
                className="text-white hover:bg-white/20 rounded-lg h-10 w-10 sm:w-auto sm:px-3 p-0"
                title="Blog & Videos">
                <BookOpen className="w-5 h-5" />
                <span className="hidden lg:inline ml-2">Blog</span>
              </Button>

              <Button variant="ghost" size="sm" onClick={() => setShowSavedSearches(true)}
                className="text-white hover:bg-white/20 rounded-lg h-10 w-10 sm:w-auto sm:px-3 p-0 relative"
                title="Saved Searches">
                <Bookmark className="w-5 h-5" />
                {activeNotifications > 0 && (
                  <Badge className="absolute -top-1 -right-1 h-4 w-4 p-0 text-[10px] bg-orange-500">{activeNotifications}</Badge>
                )}
              </Button>

              <Button variant="ghost" size="sm" onClick={onMessagesClick}
                className="text-white hover:bg-white/20 rounded-lg h-10 w-10 sm:w-auto sm:px-3 p-0"
                title="Messages">
                <MessageCircle className="w-5 h-5" />
              </Button>

              <Button variant="ghost" size="sm" onClick={onCartClick}
                className="relative text-white hover:bg-white/20 rounded-lg h-10 w-10 sm:w-auto sm:px-3 p-0"
                title="Cart">
                <ShoppingCart className="w-5 h-5" />
                {cartCount > 0 && (
                  <Badge className="absolute -top-1 -right-1 h-5 w-5 p-0 text-[10px] bg-pink-500">{cartCount}</Badge>
                )}
              </Button>

              {!isAdminAuthenticated && (
                <Button variant="ghost" size="sm" onClick={handleAdminClick}
                  className="text-white hover:bg-white/20 rounded-lg h-10 w-10 sm:w-auto sm:px-3 p-0"
                  title="Admin Login">
                  <Shield className="w-5 h-5" />
                </Button>
              )}

              <Button variant="ghost" size="sm"
                className="text-white hover:bg-white/20 rounded-lg h-10 w-10 sm:w-auto sm:px-3 p-0 hidden sm:inline-flex"
                title="Profile">
                <User className="w-5 h-5" />
              </Button>
            </div>
          </div>
        </div>
        <div className="h-1 bg-gradient-to-r from-yellow-400 via-orange-400 to-red-400"></div>
      </header>

      <SavedSearches isOpen={showSavedSearches} onClose={() => setShowSavedSearches(false)} />
      <BlogSection isOpen={showBlog} onClose={() => setShowBlog(false)} />
      <AdminLogin isOpen={showAdminLogin} onClose={() => setShowAdminLogin(false)}
        onSuccess={() => { setShowAdminLogin(false); setShowAdminPanel(true); }} />
      <AdminPanel isOpen={showAdminPanel} onClose={() => setShowAdminPanel(false)} />
    </>
  );
};

export default Header;
