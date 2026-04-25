import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Search, MessageCircle } from 'lucide-react';
import ResponsiveChatPage from './ResponsiveChatPage';
import { X } from 'lucide-react';

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

interface MessagesProps {
  isOpen: boolean;
  onClose: () => void;
  messages: Message[];
  currentUser: User;
}

const Messages: React.FC<MessagesProps> = ({
  isOpen,
  onClose,
  messages,
  currentUser
}) => {
  const [showChatPage, setShowChatPage] = useState(false);

  if (!isOpen) return null;

  if (showChatPage) {
    return (
      <div className="fixed inset-0 bg-white z-50">
        <ResponsiveChatPage onBack={() => setShowChatPage(false)} />
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
              <p className="text-gray-500">No conversations</p>
              <Button 
                onClick={() => setShowChatPage(true)}
                className="mt-4 bg-blue-500 hover:bg-blue-600"
              >
                Start Demo Chat
              </Button>
            </div>
          ) : (
            conversationList.map((userId) => {
              const lastMessage = conversations[userId][conversations[userId].length - 1];
              return (
                <div
                  key={userId}
                  className="p-4 border-b cursor-pointer hover:bg-gray-50"
                  onClick={() => setShowChatPage(true)}
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 rounded-full bg-gray-300 flex items-center justify-center">
                      <span className="text-sm font-semibold">U</span>
                    </div>
                    <div className="flex-1">
                      <p className="font-semibold">User {userId}</p>
                      <p className="text-sm text-gray-600 truncate">{lastMessage.content}</p>
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

export default Messages;