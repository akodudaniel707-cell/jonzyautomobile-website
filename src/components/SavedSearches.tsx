import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { X, Search, Bell, Trash2, Star, Eye } from 'lucide-react';
import { useAppContext } from '@/contexts/AppContext';
import { useToast } from '@/hooks/use-toast';

interface SavedSearchesProps {
  isOpen: boolean;
  onClose: () => void;
}

const SavedSearches: React.FC<SavedSearchesProps> = ({ isOpen, onClose }) => {
  const { savedSearches, toggleSearchNotifications, deleteSavedSearch, searchProducts } = useAppContext();
  const { toast } = useToast();

  const handleToggleNotifications = (searchId: string, enabled: boolean) => {
    toggleSearchNotifications(searchId, enabled);
    toast({
      title: enabled ? "Notifications enabled" : "Notifications disabled",
      description: enabled 
        ? "You'll receive alerts for new matching listings" 
        : "No more notifications for this search",
      duration: 2000
    });
  };

  const handleDeleteSearch = (searchId: string, query: string) => {
    deleteSavedSearch(searchId);
    toast({
      title: "Search deleted",
      description: `Removed "${query}" from saved searches`,
      duration: 2000
    });
  };

  const handleRunSearch = (query: string, category?: string) => {
    searchProducts(query, category);
    onClose();
    toast({
      title: "Search executed",
      description: `Showing results for "${query}"${category ? ` in ${category}` : ''}`,
      duration: 2000
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-gradient-to-br from-white via-emerald-50 to-teal-50 w-full max-w-2xl max-h-[80vh] overflow-hidden rounded-2xl shadow-2xl border border-emerald-200">
        <div className="p-6 border-b border-emerald-200 bg-gradient-to-r from-emerald-600 to-teal-600 text-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="bg-white/20 p-2 rounded-lg">
                <Star className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-xl font-bold">Saved Searches</h2>
                <p className="text-emerald-100 text-sm">Manage your search alerts</p>
              </div>
            </div>
            <Button variant="ghost" size="sm" onClick={onClose} className="text-white hover:bg-white/20">
              <X className="w-5 h-5" />
            </Button>
          </div>
        </div>

        <div className="p-6 overflow-y-auto max-h-[60vh]">
          {savedSearches.length === 0 ? (
            <div className="text-center py-12">
              <div className="bg-gradient-to-br from-emerald-100 to-teal-100 rounded-full w-20 h-20 mx-auto mb-6 flex items-center justify-center">
                <Search className="w-10 h-10 text-emerald-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-700 mb-2">No saved searches yet</h3>
              <p className="text-gray-500 mb-4">Save searches to get notified about new matching listings</p>
              <Button onClick={onClose} className="bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600">
                Start Searching
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center justify-between mb-4">
                <p className="text-sm text-gray-600">
                  {savedSearches.length} saved search{savedSearches.length !== 1 ? 'es' : ''}
                </p>
                <Badge variant="secondary" className="bg-emerald-100 text-emerald-700">
                  {savedSearches.filter(s => s.notificationsEnabled).length} with alerts
                </Badge>
              </div>
              
              {savedSearches.map((search) => (
                <Card key={search.id} className="border-emerald-200 hover:shadow-lg transition-shadow duration-200">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <div className="bg-gradient-to-r from-emerald-500 to-teal-500 text-white p-1.5 rounded-lg">
                            <Search className="w-4 h-4" />
                          </div>
                          <div>
                            <h4 className="font-semibold text-gray-800">"{search.query}"</h4>
                            {search.category && (
                              <Badge variant="outline" className="text-xs mt-1 border-emerald-300 text-emerald-700">
                                {search.category}
                              </Badge>
                            )}
                          </div>
                        </div>
                        
                        <div className="flex items-center space-x-4 text-sm text-gray-500">
                          <span>Saved {search.createdAt.toLocaleDateString()}</span>
                          <span>•</span>
                          <span className="flex items-center">
                            <Bell className="w-3 h-3 mr-1" />
                            {search.notificationsEnabled ? 'Alerts on' : 'Alerts off'}
                          </span>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-2 ml-4">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleRunSearch(search.query, search.category)}
                          className="border-emerald-300 text-emerald-600 hover:bg-emerald-50"
                        >
                          <Eye className="w-4 h-4 mr-1" />
                          View
                        </Button>
                        
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDeleteSearch(search.id, search.query)}
                          className="border-red-300 text-red-600 hover:bg-red-50"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between mt-4 pt-3 border-t border-emerald-100">
                      <div className="flex items-center space-x-3">
                        <Bell className={`w-4 h-4 ${
                          search.notificationsEnabled ? 'text-emerald-600' : 'text-gray-400'
                        }`} />
                        <span className="text-sm font-medium text-gray-700">
                          Email notifications
                        </span>
                      </div>
                      <Switch
                        checked={search.notificationsEnabled}
                        onCheckedChange={(checked) => handleToggleNotifications(search.id, checked)}
                        className="data-[state=checked]:bg-emerald-600"
                      />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
        
        {savedSearches.length > 0 && (
          <div className="p-6 border-t border-emerald-200 bg-gradient-to-r from-emerald-50 to-teal-50">
            <div className="flex items-center justify-between">
              <p className="text-sm text-gray-600">
                Get instant notifications when new items match your searches
              </p>
              <Button onClick={onClose} variant="outline" className="border-emerald-300 text-emerald-600 hover:bg-emerald-50">
                Done
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SavedSearches;