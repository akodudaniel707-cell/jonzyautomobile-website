import React, { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ArrowLeft, Send, Camera, Image, Mic, Phone, Video, Smile, Plus, DollarSign, Calendar, MapPin, Archive } from 'lucide-react';
import { websocketService, ChatMessage, UserStatus } from '@/services/websocket';
import PriceNegotiation from './PriceNegotiation';
import ScheduleMeetup from './ScheduleMeetup';
import EmojiPicker from './EmojiPicker';
import MediaUploader from './MediaUploader';
import VoiceRecorder from './VoiceRecorder';
import MediaPreview from './MediaPreview';
import MediaViewer from './MediaViewer';
import AudioPlayer from './AudioPlayer';

interface RealTimeChatProps {
  onBack: () => void;
  selectedProduct?: {
    id: string;
    title: string;
    price: number;
    image: string;
    location: string;
    details: string;
  };
  currentUserId: string;
  receiverId: string;
}

const RealTimeChat: React.FC<RealTimeChatProps> = ({ 
  onBack, 
  selectedProduct, 
  currentUserId, 
  receiverId 
}) => {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [receiverStatus, setReceiverStatus] = useState<UserStatus | null>(null);
  const [showPriceNegotiation, setShowPriceNegotiation] = useState(false);
  const [showScheduleMeetup, setShowScheduleMeetup] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [showMediaUploader, setShowMediaUploader] = useState(false);
  const [showVoiceRecorder, setShowVoiceRecorder] = useState(false);
  const [mediaPreview, setMediaPreview] = useState<File | null>(null);
  const [selectedMedia, setSelectedMedia] = useState<{ url: string; type: 'image' | 'video' } | null>(null);
  
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const typingTimeoutRef = useRef<NodeJS.Timeout>();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);
  useEffect(() => {
    // Connect to WebSocket
    websocketService.connect(currentUserId);

    // Load chat history
    const history = websocketService.loadChatHistory(currentUserId, receiverId);
    setMessages(history);

    // Set up message handler
    const unsubscribeMessages = websocketService.onMessage((newMessage) => {
      setMessages(prev => {
        const existing = prev.find(m => m.id === newMessage.id);
        if (existing) {
          return prev.map(m => m.id === newMessage.id ? newMessage : m);
        }
        return [...prev, newMessage];
      });
    });

    // Set up status handler
    const unsubscribeStatus = websocketService.onStatusUpdate((status) => {
      if (status.userId === receiverId) {
        setReceiverStatus(status);
      }
    });

    // Set up typing handler
    const unsubscribeTyping = websocketService.onTyping((data) => {
      if (data.userId === receiverId) {
        setIsTyping(data.isTyping);
      }
    });

    return () => {
      unsubscribeMessages();
      unsubscribeStatus();
      unsubscribeTyping();
    };
  }, [currentUserId, receiverId]);

  const handleSend = (messageText?: string) => {
    const textToSend = messageText || message;
    if (textToSend.trim()) {
      websocketService.sendMessage({
        senderId: currentUserId,
        receiverId,
        content: textToSend,
        type: 'text',
        status: 'sent'
      });
      setMessage('');
    }
  };

  const handleTyping = (value: string) => {
    setMessage(value);
    
    // Send typing indicator
    websocketService.sendTypingStatus(receiverId, value.length > 0);
    
    // Clear previous timeout
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }
    
    // Set timeout to stop typing indicator
    if (value.length > 0) {
      typingTimeoutRef.current = setTimeout(() => {
        websocketService.sendTypingStatus(receiverId, false);
      }, 2000);
    }
  };

  const handleMakeOffer = (offer: number) => {
    const offerMessage = `I'd like to offer ₦${offer.toLocaleString()} for this ${selectedProduct?.title || 'item'}. What do you think?`;
    websocketService.sendMessage({
      senderId: currentUserId,
      receiverId,
      content: offerMessage,
      type: 'offer',
      status: 'sent',
      metadata: { offerAmount: offer, currency: 'NGN' }
    });
  };

  const handleScheduleMeetup = (details: { date: string; time: string; location: string }) => {
    const meetupMessage = `I'd like to schedule a meetup on ${details.date} at ${details.time} at ${details.location}`;
    websocketService.sendMessage({
      senderId: currentUserId,
      receiverId,
      content: meetupMessage,
      type: 'meetup',
      status: 'sent',
      metadata: details
    });
  };

  const getStatusIcon = (status?: string) => {
    switch (status) {
      case 'sent': return '✓';
      case 'delivered': return '✓✓';
      case 'seen': return <span className="text-blue-500">✓✓</span>;
      default: return '';
    }
  };

  return (
    <div className="flex flex-col h-screen bg-white max-w-full overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between p-3 sm:p-4 bg-white border-b border-gray-200 min-h-[60px]">
        <div className="flex items-center space-x-2 sm:space-x-3 flex-1 min-w-0">
          <Button variant="ghost" size="sm" onClick={onBack} className="flex-shrink-0">
            <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5" />
          </Button>
          <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full overflow-hidden flex-shrink-0 relative">
            <img 
              src="https://d64gsuwffb70l.cloudfront.net/68826c5b323dadd7e15cd62e_1753894670443_32f5d1ef.jpeg" 
              alt="Profile" 
              className="w-full h-full object-cover"
            />
            {receiverStatus?.isOnline && (
              <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
            )}
          </div>
          <div className="min-w-0 flex-1">
            <h2 className="font-semibold text-sm sm:text-lg truncate">JonzyAutomobile</h2>
            <p className="text-xs sm:text-sm text-gray-500 truncate">
              {isTyping ? 'typing...' : receiverStatus?.isOnline ? 'Active now' : 'Last seen recently'}
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
        </div>
      </div>

      {/* Dynamic Product Context */}
      {selectedProduct && (
        <div className="bg-blue-50 border-b border-blue-100 p-3 sm:p-4">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-lg overflow-hidden flex-shrink-0">
              <img 
                src={selectedProduct.image} 
                alt={selectedProduct.title} 
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-sm sm:text-base text-gray-900 truncate">
                {selectedProduct.title}
              </h3>
              <p className="text-xs sm:text-sm text-gray-600">
                ₦{selectedProduct.price.toLocaleString()} • {selectedProduct.details}
              </p>
              <p className="text-xs text-blue-600">
                {selectedProduct.location}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-3 sm:p-4 space-y-3 sm:space-y-4">
        {messages.map((msg) => (
          <div key={msg.id} className={`flex ${msg.senderId === currentUserId ? 'justify-end' : 'justify-start'}`}>
            {msg.senderId !== currentUserId && (
              <Avatar className="w-6 h-6 sm:w-8 sm:h-8 mr-2 flex-shrink-0">
                <AvatarImage src="https://d64gsuwffb70l.cloudfront.net/68826c5b323dadd7e15cd62e_1753894670443_32f5d1ef.jpeg" />
                <AvatarFallback>D</AvatarFallback>
              </Avatar>
            )}
            <div className="max-w-[280px] sm:max-w-xs">
              <div className={`px-3 sm:px-4 py-2 rounded-2xl break-words ${
                msg.senderId === currentUserId 
                  ? 'bg-blue-500 text-white' 
                  : 'bg-gray-200 text-gray-800'
              }`}>
                {msg.type === 'image' && msg.fileUrl && (
                  <img 
                    src={msg.fileUrl} 
                    alt="Shared image" 
                    className="max-w-full h-auto rounded-lg mb-1 cursor-pointer hover:opacity-90 transition-opacity"
                    onClick={() => setSelectedMedia({ url: msg.fileUrl!, type: 'image' })}
                  />
                )}
                {msg.type === 'voice' && msg.fileUrl && (
                  <div className="mb-1">
                    <AudioPlayer 
                      audioUrl={msg.fileUrl} 
                      fileName={`voice-message-${msg.id}`}
                      className="max-w-full"
                    />
                  </div>
                )}
                <p className="text-sm sm:text-base">{msg.content}</p>
              </div>
              {msg.senderId === currentUserId && (
                <div className="text-xs text-gray-500 mt-1 text-right">
                  {getStatusIcon(msg.status)} {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </div>
              )}
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Modals */}
      {showPriceNegotiation && selectedProduct && (
        <PriceNegotiation
          originalPrice={selectedProduct.price}
          onMakeOffer={handleMakeOffer}
          onClose={() => setShowPriceNegotiation(false)}
        />
      )}

      {showEmojiPicker && (
        <EmojiPicker
          onEmojiSelect={(emoji) => {
            setMessage(prev => prev + emoji);
            setShowEmojiPicker(false);
          }}
          onClose={() => setShowEmojiPicker(false)}
        />
      )}

      {showMediaUploader && (
        <MediaUploader
          onImageSelect={(file) => {
            setMediaPreview(file);
            const imageUrl = URL.createObjectURL(file);
            websocketService.sendMessage({
              senderId: currentUserId,
              receiverId,
              content: `Shared an image: ${file.name}`,
              type: 'image',
              status: 'sent',
              fileUrl: imageUrl
            });
            setShowMediaUploader(false);
          }}
          onCameraCapture={() => {
            // Simulate camera capture
            console.log('Camera capture initiated');
            setShowMediaUploader(false);
          }}
          onClose={() => setShowMediaUploader(false)}
        />
      )}

      {showVoiceRecorder && (
        <VoiceRecorder
          onVoiceMessage={(audioBlob) => {
            const audioUrl = URL.createObjectURL(audioBlob);
            websocketService.sendMessage({
              senderId: currentUserId,
              receiverId,
              content: 'Sent a voice message',
              type: 'voice',
              status: 'sent',
              fileUrl: audioUrl
            });
            setShowVoiceRecorder(false);
          }}
          onClose={() => setShowVoiceRecorder(false)}
        />
      )}

      {/* Media Viewer */}
      {selectedMedia && (
        <MediaViewer
          mediaUrl={selectedMedia.url}
          mediaType={selectedMedia.type}
          isOpen={true}
          onClose={() => setSelectedMedia(null)}
          fileName="shared-media"
        />
      )}

      {/* Input Area */}
      <div className="p-3 sm:p-4 bg-white border-t border-gray-200">
        <div className="flex items-center space-x-1 sm:space-x-2">
          {/* Media and Voice Buttons */}
          <div className="flex items-center space-x-1">
            <Button 
              variant="ghost" 
              size="sm" 
              className="p-2 flex-shrink-0"
              onClick={() => setShowMediaUploader(true)}
            >
              <Image className="w-4 h-4 sm:w-5 sm:h-5 text-gray-500" />
            </Button>
            <Button 
              variant="ghost" 
              size="sm" 
              className="p-2 flex-shrink-0"
              onClick={() => setShowVoiceRecorder(true)}
            >
              <Mic className="w-4 h-4 sm:w-5 sm:h-5 text-gray-500" />
            </Button>
          </div>
          
          <div className="flex-1 relative min-w-0">
            <Input
              value={message}
              onChange={(e) => handleTyping(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Type a message..."
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

export default RealTimeChat;