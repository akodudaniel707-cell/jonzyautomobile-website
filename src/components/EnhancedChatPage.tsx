import React, { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ArrowLeft, Send, Camera, Image, Mic, Phone, Video, Smile, Plus, DollarSign, Calendar, MapPin, Archive } from 'lucide-react';
import AutomatedMessages from './AutomatedMessages';
import PriceNegotiation from './PriceNegotiation';
import ScheduleMeetup from './ScheduleMeetup';

interface ChatMessage {
  id: string;
  senderId: string;
  content: string;
  timestamp: Date;
  isOwn: boolean;
  type?: 'text' | 'image' | 'voice' | 'offer' | 'meetup';
  status?: 'sent' | 'delivered' | 'seen';
  metadata?: any;
}

interface EnhancedChatPageProps {
  onBack: () => void;
}

const EnhancedChatPage: React.FC<EnhancedChatPageProps> = ({ onBack }) => {
  const [message, setMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [showQuickReplies, setShowQuickReplies] = useState(false);
  const [showPriceNegotiation, setShowPriceNegotiation] = useState(false);
  const [showScheduleMeetup, setShowScheduleMeetup] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      senderId: 'seller',
      content: 'Good evening, is this still available?',
      timestamp: new Date('2024-01-15T17:40:00'),
      isOwn: true,
      status: 'seen'
    },
    {
      id: '2', 
      senderId: 'buyer',
      content: 'Yes, are you still interested?',
      timestamp: new Date('2024-01-15T17:42:00'),
      isOwn: false,
      status: 'delivered'
    }
  ]);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const carPrice = 15000;

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Simulate typing indicator
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
      
      // Simulate message status updates
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
    <div className="flex flex-col h-screen bg-white">
      {/* Header */}
      <div className="flex items-center justify-between p-4 bg-white border-b border-gray-200">
        <div className="flex items-center space-x-3">
          <Button variant="ghost" size="sm" onClick={onBack}>
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div className="w-10 h-10 rounded-full overflow-hidden">
            <img 
              src="https://d64gsuwffb70l.cloudfront.net/68826c5b323dadd7e15cd62e_1753894670443_32f5d1ef.jpeg" 
              alt="Profile" 
              className="w-full h-full object-cover"
            />
          </div>
          <div>
            <h2 className="font-semibold text-lg">Daniel • Toyota Camry 2008</h2>
            <p className="text-sm text-gray-500">
              {isTyping ? 'typing...' : '99% response rate • Active now'}
            </p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="ghost" size="sm">
            <Phone className="w-5 h-5" />
          </Button>
          <Button variant="ghost" size="sm">
            <Video className="w-5 h-5" />
          </Button>
          <Button variant="ghost" size="sm">
            <Archive className="w-5 h-5" />
          </Button>
        </div>
      </div>

      {/* Car Info Context */}
      <div className="p-4 bg-gray-50 border-b border-gray-200">
        <div className="flex items-center space-x-3">
          <div className="w-16 h-16 rounded-lg overflow-hidden">
            <img 
              src="https://d64gsuwffb70l.cloudfront.net/68826c5b323dadd7e15cd62e_1753894670443_32f5d1ef.jpeg" 
              alt="Toyota Camry" 
              className="w-full h-full object-cover"
            />
          </div>
          <div className="flex-1">
            <h3 className="font-bold text-lg">Toyota Camry 2008</h3>
            <p className="text-xl font-semibold text-green-600">${carPrice.toLocaleString()}</p>
            <p className="text-sm text-gray-600">Registered • Good condition</p>
          </div>
          <div className="flex flex-col space-y-1">
            <Button 
              size="sm" 
              variant="outline"
              onClick={() => setShowPriceNegotiation(true)}
              className="text-xs"
            >
              <DollarSign className="w-4 h-4 mr-1" />
              Make Offer
            </Button>
            <Button 
              size="sm" 
              variant="outline"
              onClick={() => setShowScheduleMeetup(true)}
              className="text-xs"
            >
              <Calendar className="w-4 h-4 mr-1" />
              Schedule
            </Button>
          </div>
        </div>
      </div>

      {/* Price Negotiation Modal */}
      {showPriceNegotiation && (
        <PriceNegotiation
          originalPrice={carPrice}
          onMakeOffer={handleMakeOffer}
          onClose={() => setShowPriceNegotiation(false)}
        />
      )}

      {/* Schedule Meetup Modal */}
      {showScheduleMeetup && (
        <ScheduleMeetup
          onSchedule={handleScheduleMeetup}
          onClose={() => setShowScheduleMeetup(false)}
        />
      )}

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg) => (
          <div key={msg.id} className={`flex ${msg.isOwn ? 'justify-end' : 'justify-start'}`}>
            {!msg.isOwn && (
              <Avatar className="w-8 h-8 mr-2">
                <AvatarImage src="https://d64gsuwffb70l.cloudfront.net/68826c5b323dadd7e15cd62e_1753894670443_32f5d1ef.jpeg" />
                <AvatarFallback>D</AvatarFallback>
              </Avatar>
            )}
            <div className="max-w-xs">
              <div className={`px-4 py-2 rounded-2xl ${
                msg.isOwn 
                  ? 'bg-blue-500 text-white' 
                  : 'bg-gray-200 text-gray-800'
              }`}>
                <p>{msg.content}</p>
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

      {/* Input Area */}
      <div className="p-4 bg-white border-t border-gray-200">
        <div className="flex items-center space-x-2">
          <Button 
            variant="ghost" 
            size="sm" 
            className="text-blue-500"
            onClick={() => setShowQuickReplies(!showQuickReplies)}
          >
            <Plus className="w-6 h-6" />
          </Button>
          <Button variant="ghost" size="sm" className="text-blue-500">
            <Camera className="w-6 h-6" />
          </Button>
          <Button variant="ghost" size="sm" className="text-blue-500">
            <Image className="w-6 h-6" />
          </Button>
          <Button variant="ghost" size="sm" className="text-blue-500">
            <MapPin className="w-6 h-6" />
          </Button>
          <div className="flex-1 relative">
            <Input
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Aa"
              className="rounded-full border-gray-300 pr-12 bg-gray-100"
            />
            <Button 
              variant="ghost" 
              size="sm" 
              className="absolute right-1 top-1/2 transform -translate-y-1/2"
            >
              <Smile className="w-5 h-5 text-gray-500" />
            </Button>
          </div>
          <Button variant="ghost" size="sm" className="text-blue-500">
            <Mic className="w-6 h-6" />
          </Button>
          {message.trim() && (
            <Button 
              onClick={() => handleSend()}
              className="bg-blue-500 hover:bg-blue-600 text-white rounded-full p-2"
            >
              <Send className="w-5 h-5" />
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default EnhancedChatPage;