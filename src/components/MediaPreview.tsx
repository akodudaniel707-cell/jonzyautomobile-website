import React from 'react';
import { Button } from '@/components/ui/button';
import { X, Send } from 'lucide-react';

interface MediaPreviewProps {
  file: File;
  onSend: (file: File) => void;
  onCancel: () => void;
}

const MediaPreview: React.FC<MediaPreviewProps> = ({ file, onSend, onCancel }) => {
  const isImage = file.type.startsWith('image/');
  const isVideo = file.type.startsWith('video/');
  const fileUrl = URL.createObjectURL(file);

  const handleSend = () => {
    onSend(file);
    URL.revokeObjectURL(fileUrl);
  };

  const handleCancel = () => {
    onCancel();
    URL.revokeObjectURL(fileUrl);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-4 max-w-md w-full mx-4">
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-semibold">Send Media</h3>
          <Button variant="ghost" size="sm" onClick={handleCancel}>
            <X className="w-4 h-4" />
          </Button>
        </div>

        <div className="mb-4">
          {isImage && (
            <img 
              src={fileUrl} 
              alt="Preview" 
              className="w-full h-64 object-contain rounded-lg bg-gray-100"
            />
          )}
          {isVideo && (
            <video 
              src={fileUrl} 
              controls 
              className="w-full h-64 object-contain rounded-lg bg-gray-100"
            />
          )}
        </div>

        <div className="flex justify-end space-x-2">
          <Button variant="outline" onClick={handleCancel}>
            Cancel
          </Button>
          <Button onClick={handleSend} className="bg-blue-500 hover:bg-blue-600 text-white">
            <Send className="w-4 h-4 mr-2" />
            Send
          </Button>
        </div>
      </div>
    </div>
  );
};

export default MediaPreview;