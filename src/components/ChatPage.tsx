import React, { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ArrowLeft, Send, Camera, Image, Mic, Phone, Video, Smile } from 'lucide-react';
import RealTimeChat from './RealTimeChat';
interface ChatMessage {
  id: string;
  senderId: string;
  content: string;
  timestamp: Date;
  isOwn: boolean;
}
interface ChatPageProps {
  onBack: () => void;
}

const ChatPage: React.FC<ChatPageProps> = ({ onBack }) => {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      senderId: 'seller',
      content: 'Good evening, is this still available?',
      timestamp: new Date('2024-01-15T17:40:00'),
      isOwn: true
    },
    {
      id: '2', 
      senderId: 'buyer',
      content: 'Yes, are you still interested?',
      timestamp: new Date('2024-01-15T17:42:00'),
      isOwn: false
    }
  ]);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = () => {
    if (message.trim()) {
      const newMessage: ChatMessage = {
        id: Date.now().toString(),
        senderId: 'user',
        content: message,
        timestamp: new Date(),
        isOwn: true
      };
      setMessages(prev => [...prev, newMessage]);
      setMessage('');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSend();
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
              src="https://d64gsuwffb70l.cloudfront.net/68826c5b323dadd7e15cd62e_1753894195671_61ed9ebc.png" 
              alt="Profile" 
              className="w-full h-full object-cover"
            />
          </div>
          <div>
            <h2 className="font-semibold text-lg">Daniel • Awoof 2008 registered To...</h2>
            <p className="text-sm text-gray-500">99% response rate</p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="ghost" size="sm">
            <Phone className="w-5 h-5" />
          </Button>
          <Button variant="ghost" size="sm">
            <Video className="w-5 h-5" />
          </Button>
        </div>
      </div>

      {/* Car Info */}
      <div className="p-4 bg-gray-50 border-b border-gray-200">
        <div className="flex flex-col items-center">
          <div className="w-20 h-20 rounded-full overflow-hidden mb-3">
            <img 
              src="https://d64gsuwffb70l.cloudfront.net/68826c5b323dadd7e15cd62e_1753894195671_61ed9ebc.png" 
              alt="Toyota Camry" 
              className="w-full h-full object-cover"
            />
          </div>
          <h3 className="font-bold text-xl text-center">Daniel • Awoof 2008 registered Toyota Camry</h3>
          <p className="text-sm text-gray-600 mt-1">You started this chat. <span className="text-blue-600 cursor-pointer">View seller profile</span></p>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg) => (
          <div key={msg.id} className={`flex ${msg.isOwn ? 'justify-end' : 'justify-start'}`}>
            {!msg.isOwn && (
              <Avatar className="w-8 h-8 mr-2">
                <AvatarImage src="https://d64gsuwffb70l.cloudfront.net/68826c5b323dadd7e15cd62e_1753894195671_61ed9ebc.png" />
                <AvatarFallback>D</AvatarFallback>
              </Avatar>
            )}
            <div className={`max-w-xs px-4 py-2 rounded-2xl ${
              msg.isOwn 
                ? 'bg-blue-500 text-white' 
                : 'bg-gray-200 text-gray-800'
            }`}>
              <p>{msg.content}</p>
            </div>
            {msg.isOwn && (
              <Avatar className="w-8 h-8 ml-2">
                <AvatarFallback>You</AvatarFallback>
              </Avatar>
            )}
          </div>
        ))}
        <div ref={messagesEndRef} />
        
        {/* Unread messages separator */}
        <div className="flex items-center my-4">
          <div className="flex-1 h-px bg-gray-300"></div>
          <span className="px-4 text-sm text-gray-500">Unread messages</span>
          <div className="flex-1 h-px bg-gray-300"></div>
        </div>
      </div>

      {/* Input Area */}
      <div className="p-4 bg-white border-t border-gray-200">
        <div className="flex items-center space-x-2">
          <Button variant="ghost" size="sm" className="text-blue-500">
            <Camera className="w-6 h-6" />
          </Button>
          <Button variant="ghost" size="sm" className="text-blue-500">
            <Image className="w-6 h-6" />
          </Button>
          <div className="flex-1 relative">
            <Input
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Aa"
              className="rounded-full border-gray-300 pr-12"
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
          <Button 
            onClick={handleSend}
            disabled={!message.trim()}
            className="bg-blue-500 hover:bg-blue-600 text-white rounded-full p-2"
          >
            <Send className="w-5 h-5" />
          </Button>
        </div>
        
        {/* Meta warning */}
        <p className="text-xs text-gray-500 text-center mt-2">
          To help identify and reduce scams and fraud, Meta may use technology to review Marketplace messages.
        </p>
      </div>
    </div>
  );
};

export default ChatPage;