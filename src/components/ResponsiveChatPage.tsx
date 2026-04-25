import React, { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ArrowLeft, Send, Camera, Image, Mic, Phone, Video, Smile, Plus, DollarSign, Calendar, MapPin, Archive } from 'lucide-react';
import AutomatedMessages from './AutomatedMessages';
import PriceNegotiation from './PriceNegotiation';
import ScheduleMeetup from './ScheduleMeetup';
import EmojiPicker from './EmojiPicker';
import MediaUploader from './MediaUploader';
import VoiceRecorder from './VoiceRecorder';
import MediaPreview from './MediaPreview';

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

interface ResponsiveChatPageProps {
  onBack: () => void;
  selectedProduct?: {
    id: string;
    title: string;
    price: number;
    image: string;
    location: string;
    details: string;
  };
}

const ResponsiveChatPage: React.FC<ResponsiveChatPageProps> = ({ onBack, selectedProduct }) => {
  const [message, setMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [showQuickReplies, setShowQuickReplies] = useState(false);
  const [showPriceNegotiation, setShowPriceNegotiation] = useState(false);
  const [showScheduleMeetup, setShowScheduleMeetup] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [showMediaUploader, setShowMediaUploader] = useState(false);
  const [showVoiceRecorder, setShowVoiceRecorder] = useState(false);
  const [mediaPreview, setMediaPreview] = useState<File | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const carPrice = 15000;

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (message.length > 0) {
      setIsTyping(true);
      const timer = setTimeout(() => setIsTyping(false), 1000);
      return () => clearTimeout(timer);
    }
  }, [message]);

  const handleSend = (messageText?: string) => {
    const textToSend = messageText || message;
    if (textToSend.trim()) {
      const newMessage: ChatMessage = {
        id: Date.now().toString(),
        senderId: 'user',
        content: textToSend,
        timestamp: new Date(),
        isOwn: true,
        status: 'sent'
      };
      setMessages(prev => [...prev, newMessage]);
      setMessage('');
      
      setTimeout(() => {
        setMessages(prev => prev.map(msg => 
          msg.id === newMessage.id ? { ...msg, status: 'delivered' } : msg
        ));
      }, 1000);
      
      setTimeout(() => {
        setMessages(prev => prev.map(msg => 
          msg.id === newMessage.id ? { ...msg, status: 'seen' } : msg
        ));
      }, 2000);
    }
  };

  const handleEmojiSelect = (emoji: string) => {
    setMessage(prev => prev + emoji);
  };

  const handleImageSelect = (file: File) => {
    setMediaPreview(file);
  };

  const handleCameraCapture = () => {
    alert('Camera functionality would open device camera');
  };

  const handleSendMedia = (file: File) => {
    const fileUrl = URL.createObjectURL(file);
    const newMessage: ChatMessage = {
      id: Date.now().toString(),
      senderId: 'user',
      content: file.type.startsWith('image/') ? 'Photo' : 'Video',
      timestamp: new Date(),
      isOwn: true,
      type: 'image',
      status: 'sent',
      fileUrl
    };
    setMessages(prev => [...prev, newMessage]);
    setMediaPreview(null);
  };

  const handleVoiceMessage = (audioBlob: Blob) => {
    const audioUrl = URL.createObjectURL(audioBlob);
    const newMessage: ChatMessage = {
      id: Date.now().toString(),
      senderId: 'user',
      content: 'Voice message',
      timestamp: new Date(),
      isOwn: true,
      type: 'voice',
      status: 'sent',
      fileUrl: audioUrl
    };
    setMessages(prev => [...prev, newMessage]);
  };

  const handleMakeOffer = (offer: number) => {
    const offerMessage: ChatMessage = {
      id: Date.now().toString(),
      senderId: 'user',
      content: `I'd like to offer $${offer.toLocaleString()} for this car. What do you think?`,
      timestamp: new Date(),
      isOwn: true,
      type: 'offer',
      status: 'sent',
      metadata: { offerAmount: offer }
    };
    setMessages(prev => [...prev, offerMessage]);
  };

  const handleScheduleMeetup = (details: { date: string; time: string; location: string }) => {
    const meetupMessage: ChatMessage = {
      id: Date.now().toString(),
      senderId: 'user',
      content: `I'd like to schedule a meetup on ${details.date} at ${details.time} at ${details.location}`,
      timestamp: new Date(),
      isOwn: true,
      type: 'meetup',
      status: 'sent',
      metadata: details
    };
    setMessages(prev => [...prev, meetupMessage]);
  };

  const getStatusIcon = (status?: string) => {
    switch (status) {
      case 'sent': return '✓';
      case 'delivered': return '✓✓';
      case 'seen': return '✓✓';
      default: return '';
    }
  };

  return (
    <div className="flex flex-col h-screen bg-white max-w-full overflow-hidden">
      {/* Header - Responsive */}
      <div className="flex items-center justify-between p-3 sm:p-4 bg-white border-b border-gray-200 min-h-[60px]">
        <div className="flex items-center space-x-2 sm:space-x-3 flex-1 min-w-0">
          <Button variant="ghost" size="sm" onClick={onBack} className="flex-shrink-0">
            <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5" />
          </Button>
          <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full overflow-hidden flex-shrink-0">
            <img 
              src="https://d64gsuwffb70l.cloudfront.net/68826c5b323dadd7e15cd62e_1753894670443_32f5d1ef.jpeg" 
              alt="Profile" 
              className="w-full h-full object-cover"
            />
          </div>
          <div className="min-w-0 flex-1">
            <h2 className="font-semibold text-sm sm:text-lg truncate">JonzyAutomobile</h2>
            <p className="text-xs sm:text-sm text-gray-500 truncate">
              {isTyping ? 'typing...' : '99% response rate • Active now'}
            </p>
          </div>
        </div>
        <div className="flex items-center space-x-1 sm:space-x-2 flex-shrink-0">
          <Button 
            size="sm" 
            className="bg-green-500 hover:bg-green-600 text-white text-xs px-2 py-1"
            onClick={() => setShowPriceNegotiation(true)}
          >
            <DollarSign className="w-3 h-3 mr-1" />
            Offer
          </Button>
          <Button 
            size="sm" 
            variant="outline" 
            className="text-xs px-2 py-1"
            onClick={() => setShowScheduleMeetup(true)}
          >
            <Calendar className="w-3 h-3 mr-1" />
            Meet
          </Button>
          <Button variant="ghost" size="sm" className="hidden sm:flex">
            <Phone className="w-4 h-4 sm:w-5 sm:h-5" />
          </Button>
          <Button variant="ghost" size="sm" className="hidden sm:flex">
            <Video className="w-4 h-4 sm:w-5 sm:h-5" />
          </Button>
          <Button variant="ghost" size="sm">
            <Archive className="w-4 h-4 sm:w-5 sm:h-5" />
          </Button>
        </div>
      </div>
      {/* Car Info Context Section */}
      <div className="bg-blue-50 border-b border-blue-100 p-3 sm:p-4">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-lg overflow-hidden flex-shrink-0">
            <img 
              src={selectedProduct?.image || "https://d64gsuwffb70l.cloudfront.net/68826c5b323dadd7e15cd62e_1753894670443_32f5d1ef.jpeg"} 
              alt={selectedProduct?.title || "Product"} 
              className="w-full h-full object-cover"
            />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-sm sm:text-base text-gray-900 truncate">
              {selectedProduct?.title || "Toyota Camry 2008"}
            </h3>
            <p className="text-xs sm:text-sm text-gray-600">
              {selectedProduct ? `₦${selectedProduct.price.toLocaleString()} • ${selectedProduct.details}` : "₦2,500,000 • Automatic • 120,000 km"}
            </p>
            <p className="text-xs text-blue-600">
              {selectedProduct?.location || "Lagos, Nigeria"}
            </p>
          </div>
        </div>
      </div>


      {/* Modals */}
      {showPriceNegotiation && (
        <PriceNegotiation
          originalPrice={carPrice}
          onMakeOffer={handleMakeOffer}
          onClose={() => setShowPriceNegotiation(false)}
        />
      )}

      {showScheduleMeetup && (
        <ScheduleMeetup
          onSchedule={handleScheduleMeetup}
          onClose={() => setShowScheduleMeetup(false)}
        />
      )}

      {showEmojiPicker && (
        <EmojiPicker
          onEmojiSelect={handleEmojiSelect}
          onClose={() => setShowEmojiPicker(false)}
        />
      )}

      {showMediaUploader && (
        <MediaUploader
          onImageSelect={handleImageSelect}
          onCameraCapture={handleCameraCapture}
          onClose={() => setShowMediaUploader(false)}
        />
      )}

      {showVoiceRecorder && (
        <VoiceRecorder
          onVoiceMessage={handleVoiceMessage}
          onClose={() => setShowVoiceRecorder(false)}
        />
      )}

      {mediaPreview && (
        <MediaPreview
          file={mediaPreview}
          onSend={handleSendMedia}
          onCancel={() => setMediaPreview(null)}
        />
      )}

      {/* Messages - Responsive */}
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
        <div ref={messagesEndRef} />
      </div>

      {/* Quick Replies */}
      {showQuickReplies && (
        <AutomatedMessages 
          onSelectMessage={(msg) => {
            handleSend(msg);
            setShowQuickReplies(false);
          }} 
        />
      )}

      {/* Input Area - Responsive */}
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
              onClick={() => handleSend()}
              className="bg-blue-500 hover:bg-blue-600 text-white rounded-full p-2 flex-shrink-0"
              size="sm"
            >
              <Send className="w-4 h-4 sm:w-5 sm:h-5" />
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ResponsiveChatPage;