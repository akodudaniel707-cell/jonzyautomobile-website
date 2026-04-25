import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { X, ChevronLeft, ChevronRight, ZoomIn } from 'lucide-react';

interface ImageGalleryProps {
  images: string[];
  productTitle: string;
  isOpen: boolean;
  onClose: () => void;
  initialIndex?: number;
}

const ImageGallery: React.FC<ImageGalleryProps> = ({ 
  images, 
  productTitle, 
  isOpen, 
  onClose, 
  initialIndex = 0 
}) => {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [isZoomed, setIsZoomed] = useState(false);

  if (!isOpen) return null;

  const goToPrevious = () => {
    setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const goToNext = () => {
    setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  const goToImage = (index: number) => {
    setCurrentIndex(index);
  };

  return (
    <div className="fixed inset-0 bg-black/90 z-50 flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-4 text-white">
        <h2 className="text-lg font-semibold truncate flex-1 mr-4">{productTitle}</h2>
        <div className="flex items-center space-x-2">
          <span className="text-sm">
            {currentIndex + 1} / {images.length}
          </span>
          <Button variant="ghost" size="sm" onClick={onClose} className="text-white hover:bg-white/20">
            <X className="w-5 h-5" />
          </Button>
        </div>
      </div>

      {/* Main Image */}
      <div className="flex-1 flex items-center justify-center relative">
        <div className={`relative ${isZoomed ? 'cursor-zoom-out' : 'cursor-zoom-in'}`}>
          <img 
            src={images[currentIndex]} 
            alt={`${productTitle} - Image ${currentIndex + 1}`}
            className={`max-w-full max-h-full object-contain transition-transform duration-300 ${
              isZoomed ? 'scale-150' : 'scale-100'
            }`}
            onClick={() => setIsZoomed(!isZoomed)}
          />
        </div>

        {/* Navigation Arrows */}
        {images.length > 1 && (
          <>
            <Button
              variant="ghost"
              size="sm"
              onClick={goToPrevious}
              className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white hover:bg-white/20 bg-black/30"
            >
              <ChevronLeft className="w-6 h-6" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={goToNext}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 text-white hover:bg-white/20 bg-black/30"
            >
              <ChevronRight className="w-6 h-6" />
            </Button>
          </>
        )}

        {/* Zoom Button */}
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setIsZoomed(!isZoomed)}
          className="absolute bottom-4 right-4 text-white hover:bg-white/20 bg-black/30"
        >
          <ZoomIn className="w-5 h-5" />
        </Button>
      </div>

      {/* Thumbnail Strip */}
      {images.length > 1 && (
        <div className="p-4 bg-black/50">
          <div className="flex justify-center space-x-2 overflow-x-auto">
            {images.map((image, index) => (
              <button
                key={index}
                onClick={() => goToImage(index)}
                className={`flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 transition-all ${
                  index === currentIndex 
                    ? 'border-blue-500 opacity-100' 
                    : 'border-white/30 opacity-60 hover:opacity-80'
                }`}
              >
                <img 
                  src={image} 
                  alt={`Thumbnail ${index + 1}`}
                  className="w-full h-full object-cover"
                />
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ImageGallery;