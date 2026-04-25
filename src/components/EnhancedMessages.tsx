import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { MessageCircle, X } from 'lucide-react';
import RealTimeChat from './RealTimeChat';
import { useAppContext } from '@/contexts/AppContext';

interface Message {
  id: string;
  senderId: string;
  receiverId: string;
  content: string;
  timestamp: Date;
}

interface User {
  id: string;
  name: string;
}

interface EnhancedMessagesProps {
  isOpen: boolean;
  onClose: () => void;
  messages: Message[];
  currentUser: User;
  selectedProduct?: {
    id: string;
    title: string;
    price: number;
    image: string;
    location: string;
    details: string;
  };
}

const EnhancedMessages: React.FC<EnhancedMessagesProps> = ({
  isOpen,
  onClose,
  messages,
  currentUser,
  selectedProduct
}) => {
  const [showChatPage, setShowChatPage] = useState(false);
  const [selectedReceiver, setSelectedReceiver] = useState<string>('seller-1');

  if (!isOpen) return null;

  if (showChatPage) {
    return (
      <div className="fixed inset-0 bg-white z-50">
        <RealTimeChat 
          onBack={() => setShowChatPage(false)} 
          selectedProduct={selectedProduct}
          currentUserId={currentUser.id}
          receiverId={selectedReceiver}
        />
      </div>
    );
  }

  const conversations = messages.reduce((acc, message) => {
    const otherUserId = message.senderId === currentUser.id ? message.receiverId : message.senderId;
    if (!acc[otherUserId]) {
      acc[otherUserId] = [];
    }
    acc[otherUserId].push(message);
    return acc;
  }, {} as Record<string, Message[]>);

  const conversationList = Object.keys(conversations);

  const startChat = (receiverId?: string) => {
    setSelectedReceiver(receiverId || 'seller-1');
    setShowChatPage(true);
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex justify-end">
      <div className="bg-white w-full max-w-md h-full flex flex-col shadow-2xl">
        <div className="p-4 border-b border-gray-200 bg-blue-600 text-white">
          <div className="flex items-center justify-between">
            <h2 className="font-bold text-lg">Messages</h2>
            <Button variant="ghost" size="sm" onClick={onClose} className="text-white">
              <X className="w-5 h-5" />
            </Button>
          </div>
        </div>
        
        <div className="flex-1 overflow-y-auto">
          {conversationList.length === 0 ? (
            <div className="p-6 text-center">
              <MessageCircle className="w-12 h-12 mx-auto mb-4 text-gray-400" />
              <p className="text-gray-500 mb-2">No conversations yet</p>
              <p className="text-sm text-gray-400 mb-4">Start chatting about products you're interested in!</p>
              <Button 
                onClick={() => startChat()}
                className="mt-4 bg-blue-500 hover:bg-blue-600"
              >
                Start Chat with Seller
              </Button>
            </div>
          ) : (
            conversationList.map((userId) => {
              const lastMessage = conversations[userId][conversations[userId].length - 1];
              return (
                <div
                  key={userId}
                  className="p-4 border-b cursor-pointer hover:bg-gray-50 transition-colors"
                  onClick={() => startChat(userId)}
                >
                  <div className="flex items-center space-x-3">
                    <div className="relative">
                      <Avatar className="w-12 h-12">
                        <AvatarImage src="https://d64gsuwffb70l.cloudfront.net/68826c5b323dadd7e15cd62e_1753894670443_32f5d1ef.jpeg" />
                        <AvatarFallback>S</AvatarFallback>
                      </Avatar>
                      <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <p className="font-semibold text-gray-900">JonzyAutomobile</p>
                        <p className="text-xs text-gray-500">
                          {lastMessage.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </p>
                      </div>
                      <p className="text-sm text-gray-600 truncate">{lastMessage.content}</p>
                      <div className="flex items-center mt-1">
                        <span className="text-xs text-green-600 mr-2">● Online</span>
                        <span className="text-xs text-gray-400">Usually replies instantly</span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};

export default EnhancedMessages;