import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Send, Camera, Image, Mic, Smile, Plus, MapPin } from 'lucide-react';

interface ChatMessage {
  id: string;
  senderId: string;
  content: string;
  timestamp: Date;
  isOwn: boolean;
  type?: 'text' | 'image' | 'voice' | 'offer' | 'meetup';
  status?: 'sent' | 'delivered' | 'seen';
  metadata?: any;
  fileUrl?: string;
}

interface ChatMessagesProps {
  messages: ChatMessage[];
  getStatusIcon: (status?: string) => string;
}

export const ChatMessages: React.FC<ChatMessagesProps> = ({ messages, getStatusIcon }) => {
  return (
    <div className="flex-1 overflow-y-auto p-3 sm:p-4 space-y-3 sm:space-y-4">
      {messages.map((msg) => (
        <div key={msg.id} className={`flex ${msg.isOwn ? 'justify-end' : 'justify-start'}`}>
          {!msg.isOwn && (
            <Avatar className="w-6 h-6 sm:w-8 sm:h-8 mr-2 flex-shrink-0">
              <AvatarImage src="https://d64gsuwffb70l.cloudfront.net/68826c5b323dadd7e15cd62e_1753894670443_32f5d1ef.jpeg" />
              <AvatarFallback>D</AvatarFallback>
            </Avatar>
          )}
          <div className="max-w-[280px] sm:max-w-xs">
            <div className={`px-3 sm:px-4 py-2 rounded-2xl break-words ${
              msg.isOwn 
                ? 'bg-blue-500 text-white' 
                : 'bg-gray-200 text-gray-800'
            }`}>
              {msg.type === 'image' && msg.fileUrl && (
                <img 
                  src={msg.fileUrl} 
                  alt="Shared image" 
                  className="max-w-full h-auto rounded-lg mb-1"
                />
              )}
              {msg.type === 'voice' && msg.fileUrl && (
                <audio controls className="max-w-full">
                  <source src={msg.fileUrl} type="audio/wav" />
                </audio>
              )}
              <p className="text-sm sm:text-base">{msg.content}</p>
            </div>
            {msg.isOwn && (
              <div className="text-xs text-gray-500 mt-1 text-right">
                {getStatusIcon(msg.status)} {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

interface ChatInputProps {
  message: string;
  setMessage: (msg: string) => void;
  handleSend: () => void;
  showQuickReplies: boolean;
  setShowQuickReplies: (show: boolean) => void;
  setShowMediaUploader: (show: boolean) => void;
  setShowEmojiPicker: (show: boolean) => void;
  setShowVoiceRecorder: (show: boolean) => void;
}

export const ChatInput: React.FC<ChatInputProps> = ({
  message,
  setMessage,
  handleSend,
  showQuickReplies,
  setShowQuickReplies,
  setShowMediaUploader,
  setShowEmojiPicker,
  setShowVoiceRecorder
}) => {
  return (
    <div className="p-3 sm:p-4 bg-white border-t border-gray-200">
      <div className="flex items-center space-x-1 sm:space-x-2">
        <Button 
          variant="ghost" 
          size="sm" 
          className="text-blue-500 flex-shrink-0 p-1 sm:p-2"
          onClick={() => setShowQuickReplies(!showQuickReplies)}
        >
          <Plus className="w-5 h-5 sm:w-6 sm:h-6" />
        </Button>
        <Button 
          variant="ghost" 
          size="sm" 
          className="text-blue-500 flex-shrink-0 p-1 sm:p-2"
          onClick={() => setShowMediaUploader(true)}
        >
          <Camera className="w-5 h-5 sm:w-6 sm:h-6" />
        </Button>
        <Button 
          variant="ghost" 
          size="sm" 
          className="text-blue-500 flex-shrink-0 p-1 sm:p-2"
          onClick={() => setShowMediaUploader(true)}
        >
          <Image className="w-5 h-5 sm:w-6 sm:h-6" />
        </Button>
        <Button 
          variant="ghost" 
          size="sm" 
          className="text-blue-500 flex-shrink-0 p-1 sm:p-2"
        >
          <MapPin className="w-5 h-5 sm:w-6 sm:h-6" />
        </Button>
        <div className="flex-1 relative min-w-0">
          <Input
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Aa"
            className="rounded-full border-gray-300 pr-10 sm:pr-12 bg-gray-100 text-sm sm:text-base"
          />
          <Button 
            variant="ghost" 
            size="sm" 
            className="absolute right-1 top-1/2 transform -translate-y-1/2 p-1"
            onClick={() => setShowEmojiPicker(true)}
          >
            <Smile className="w-4 h-4 sm:w-5 sm:h-5 text-gray-500" />
          </Button>
        </div>
        <Button 
          variant="ghost" 
          size="sm" 
          className="text-blue-500 flex-shrink-0 p-1 sm:p-2"
          onClick={() => setShowVoiceRecorder(true)}
        >
          <Mic className="w-5 h-5 sm:w-6 sm:h-6" />
        </Button>
        {message.trim() && (
          <Button 
            onClick={handleSend}
            className="bg-blue-500 hover:bg-blue-600 text-white rounded-full p-2 flex-shrink-0"
            size="sm"
          >
            <Send className="w-4 h-4 sm:w-5 sm:h-5" />
          </Button>
        )}
      </div>
    </div>
  );
};