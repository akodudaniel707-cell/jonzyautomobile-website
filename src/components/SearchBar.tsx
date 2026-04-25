import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, Bookmark, X } from 'lucide-react';

interface SearchBarProps {
  onSearch: (query: string, category?: string) => void;
  onSaveSearch: (query: string, category?: string) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ onSearch, onSaveSearch }) => {
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState<string>('All Categories');

  const categories = [
    'All Categories',
    'Vehicles', 
    'Electronics', 
    'Apartments for rent', 
    'Houses for sale',
    'Fashion', 
    'Home & Garden'
  ];

  const handleSearch = () => {
    onSearch(query, category === 'All Categories' ? undefined : category);
  };

  const handleSaveSearch = () => {
    if (query.trim()) {
      onSaveSearch(query, category === 'All Categories' ? undefined : category);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const clearSearch = () => {
    setQuery('');
    onSearch('', undefined);
  };

  return (
    <div className="flex-1 max-w-xs sm:max-w-md lg:max-w-lg relative">
      <div className="flex items-center bg-white/95 backdrop-blur-sm rounded-lg sm:rounded-xl shadow-lg border border-white/20 overflow-hidden">
        {/* Category Selector - Hidden on mobile */}
        <div className="hidden sm:block border-r border-gray-200">
          <Select value={category} onValueChange={setCategory}>
            <SelectTrigger className="w-24 sm:w-32 lg:w-40 border-0 bg-transparent focus:ring-0 text-xs sm:text-sm">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {categories.map(cat => (
                <SelectItem key={cat} value={cat}>
                  {cat === 'All Categories' ? 'All' : cat}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Search Input */}
        <div className="flex-1 relative">
          <Input
            type="text"
            placeholder="Search items..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyPress={handleKeyPress}
            className="border-0 bg-transparent focus:ring-0 text-gray-800 placeholder-gray-500 px-2 sm:px-4 py-2 sm:py-3 text-sm"
          />
          
          {query && (
            <Button
              variant="ghost"
              size="sm"
              onClick={clearSearch}
              className="absolute right-1 top-1/2 transform -translate-y-1/2 h-6 w-6 p-0 hover:bg-gray-100"
            >
              <X className="w-3 h-3 sm:w-4 sm:h-4 text-gray-400" />
            </Button>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex items-center px-1 sm:px-2">
          {query.trim() && (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleSaveSearch}
              className="text-blue-600 hover:bg-blue-50 mr-1 p-1 sm:p-2 hidden sm:flex"
              title="Save search"
            >
              <Bookmark className="w-3 h-3 sm:w-4 sm:h-4" />
            </Button>
          )}
          
          <Button
            onClick={handleSearch}
            size="sm"
            className="bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white px-2 sm:px-4 py-1 sm:py-2 rounded-md sm:rounded-lg shadow-md transition-all duration-200 text-xs sm:text-sm"
          >
            <Search className="w-3 h-3 sm:w-4 sm:h-4 sm:mr-1" />
            <span className="hidden sm:inline">Search</span>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default SearchBar;