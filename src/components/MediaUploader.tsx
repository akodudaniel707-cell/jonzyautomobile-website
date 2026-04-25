import React, { useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Camera, Image, X } from 'lucide-react';

interface MediaUploaderProps {
  onImageSelect: (file: File) => void;
  onCameraCapture: () => void;
  onClose: () => void;
}

const MediaUploader: React.FC<MediaUploaderProps> = ({ 
  onImageSelect, 
  onCameraCapture, 
  onClose 
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      onImageSelect(file);
      onClose();
    }
  };

  const handleCameraClick = () => {
    onCameraCapture();
    onClose();
  };

  return (
    <div className="absolute bottom-16 left-4 bg-white border border-gray-200 rounded-lg shadow-lg p-4 w-64 z-50">
      <div className="flex justify-between items-center mb-3">
        <h3 className="font-semibold text-sm">Add Media</h3>
        <Button variant="ghost" size="sm" onClick={onClose}>
          <X className="w-4 h-4" />
        </Button>
      </div>
      
      <div className="space-y-2">
        <Button
          variant="ghost"
          className="w-full justify-start text-left p-3 hover:bg-gray-50"
          onClick={() => fileInputRef.current?.click()}
        >
          <Image className="w-5 h-5 mr-3 text-blue-500" />
          <span>Choose from Gallery</span>
        </Button>
        
        <Button
          variant="ghost"
          className="w-full justify-start text-left p-3 hover:bg-gray-50"
          onClick={handleCameraClick}
        >
          <Camera className="w-5 h-5 mr-3 text-blue-500" />
          <span>Take Photo</span>
        </Button>
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*,video/*"
        onChange={handleImageUpload}
        className="hidden"
      />
    </div>
  );
};

export default MediaUploader;