import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { CATEGORIES, Category } from '@/types';
import { X, Filter, MapPin, Car, Home, Smartphone, Package } from 'lucide-react';
import { useAppContext } from '@/contexts/AppContext';

interface SidebarProps {
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
  selectedLocation: string;
  onLocationChange: (location: string) => void;
}

const nigerianLocations = [
  'All Locations',
  'Lagos, Nigeria',
  'Abuja, Nigeria', 
  'Kano, Nigeria',
  'Ibadan, Nigeria',
  'Port Harcourt, Nigeria',
  'Benin City, Nigeria',
  'Kaduna, Nigeria'
];

const categoryIcons = {
  'Vehicles': Car,
  'Housing Property Rentals': Home,
  'Apartments for rent': Home,
  'Electronics': Smartphone
};

const Sidebar: React.FC<SidebarProps> = ({
  selectedCategory,
  onCategoryChange,
  selectedLocation,
  onLocationChange
}) => {
  const { sidebarOpen, toggleSidebar } = useAppContext();

  return (
    <>
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={toggleSidebar}
        />
      )}
      
      {/* Sidebar */}
      <div className={`
        fixed lg:static inset-y-0 left-0 z-50 w-64 sm:w-72 lg:w-64 bg-gradient-to-b from-slate-50 to-white shadow-xl transform transition-transform duration-300 ease-in-out
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        lg:shadow-lg lg:border-r border-blue-100 h-screen lg:h-auto overflow-y-auto
      `}>
        <div className="flex items-center justify-between p-3 sm:p-4 border-b border-blue-100 lg:hidden bg-blue-50">
          <h2 className="font-semibold text-base sm:text-lg text-blue-800">Filters</h2>
          <Button variant="ghost" size="sm" onClick={toggleSidebar} className="text-blue-600 hover:bg-blue-100 p-2">
            <X className="w-4 h-4" />
          </Button>
        </div>
        
        <div className="p-3 sm:p-4 space-y-4 sm:space-y-6">
          {/* Categories */}
          <div>
            <div className="flex items-center mb-3">
              <Filter className="w-4 h-4 mr-2 text-blue-600" />
              <h3 className="font-semibold text-sm sm:text-base text-blue-800">Categories</h3>
            </div>
            <div className="space-y-1 sm:space-y-2">
              <Button
                variant={selectedCategory === 'All' ? 'default' : 'ghost'}
                className={`w-full justify-start text-xs sm:text-sm px-2 sm:px-3 py-2 ${
                  selectedCategory === 'All' 
                    ? 'bg-blue-600 hover:bg-blue-700 text-white' 
                    : 'hover:bg-blue-50 text-slate-700'
                }`}
                onClick={() => onCategoryChange('All')}
              >
                <Package className="w-3 h-3 sm:w-4 sm:h-4 mr-2 flex-shrink-0" />
                <span className="truncate">All Categories</span>
              </Button>
              {CATEGORIES.map((category) => {
                const IconComponent = categoryIcons[category as keyof typeof categoryIcons] || Package;
                return (
                  <Button
                    key={category}
                    variant={selectedCategory === category ? 'default' : 'ghost'}
                    className={`w-full justify-start text-xs sm:text-sm px-2 sm:px-3 py-2 ${
                      selectedCategory === category 
                        ? 'bg-blue-600 hover:bg-blue-700 text-white' 
                        : 'hover:bg-blue-50 text-slate-700'
                    }`}
                    onClick={() => onCategoryChange(category)}
                  >
                    <IconComponent className="w-3 h-3 sm:w-4 sm:h-4 mr-2 flex-shrink-0" />
                    <span className="truncate">{category}</span>
                  </Button>
                );
              })}
            </div>
          </div>
          
          <Separator className="bg-blue-100" />
          
          {/* Locations */}
          <div>
            <div className="flex items-center mb-3">
              <MapPin className="w-4 h-4 mr-2 text-blue-600" />
              <h3 className="font-semibold text-sm sm:text-base text-blue-800">Location in Nigeria</h3>
            </div>
            <div className="space-y-1 sm:space-y-2">
              {nigerianLocations.map((location) => (
                <Button
                  key={location}
                  variant={selectedLocation === location ? 'default' : 'ghost'}
                  className={`w-full justify-start text-xs sm:text-sm px-2 sm:px-3 py-2 ${
                    selectedLocation === location 
                      ? 'bg-indigo-600 hover:bg-indigo-700 text-white' 
                      : 'hover:bg-indigo-50 text-slate-700'
                  }`}
                  onClick={() => onLocationChange(location)}
                >
                  <MapPin className="w-3 h-3 sm:w-4 sm:h-4 mr-2 flex-shrink-0" />
                  <span className="truncate">{location}</span>
                </Button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Sidebar;