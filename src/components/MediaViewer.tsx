import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { X, ZoomIn, ZoomOut, Download } from 'lucide-react';

interface MediaViewerProps {
  mediaUrl: string;
  mediaType: 'image' | 'video';
  isOpen: boolean;
  onClose: () => void;
  fileName?: string;
}

const MediaViewer: React.FC<MediaViewerProps> = ({ 
  mediaUrl, 
  mediaType, 
  isOpen, 
  onClose,
  fileName = 'media'
}) => {
  const [isZoomed, setIsZoomed] = useState(false);

  if (!isOpen) return null;

  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = mediaUrl;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="fixed inset-0 bg-black/95 z-50 flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-4 text-white">
        <h2 className="text-lg font-semibold truncate flex-1 mr-4">
          {mediaType === 'image' ? 'Shared Image' : 'Shared Video'}
        </h2>
        <div className="flex items-center space-x-2">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={handleDownload}
            className="text-white hover:bg-white/20"
          >
            <Download className="w-5 h-5" />
          </Button>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={onClose} 
            className="text-white hover:bg-white/20"
          >
            <X className="w-5 h-5" />
          </Button>
        </div>
      </div>

      {/* Media Content */}
      <div className="flex-1 flex items-center justify-center relative p-4">
        {mediaType === 'image' ? (
          <div className="relative">
            <img 
              src={mediaUrl} 
              alt="Shared media"
              className={`max-w-full max-h-full object-contain transition-transform duration-300 cursor-pointer ${
                isZoomed ? 'scale-150' : 'scale-100'
              }`}
              onClick={() => setIsZoomed(!isZoomed)}
            />
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsZoomed(!isZoomed)}
              className="absolute bottom-4 right-4 text-white hover:bg-white/20 bg-black/50"
            >
              {isZoomed ? <ZoomOut className="w-5 h-5" /> : <ZoomIn className="w-5 h-5" />}
            </Button>
          </div>
        ) : (
          <video 
            src={mediaUrl} 
            controls 
            className="max-w-full max-h-full"
            autoPlay={false}
          />
        )}
      </div>
    </div>
  );
};

export default MediaViewer;