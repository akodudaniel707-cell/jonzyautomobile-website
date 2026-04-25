import React from 'react';
import { Button } from '@/components/ui/button';

interface AutomatedMessagesProps {
  onSelectMessage: (message: string) => void;
}

const AutomatedMessages: React.FC<AutomatedMessagesProps> = ({ onSelectMessage }) => {
  const quickReplies = [
    "Is this still available?",
    "What's your best price?",
    "Can I see more photos?",
    "When can I pick it up?",
    "Is the price negotiable?",
    "What's the condition?",
    "Can you deliver?",
    "I'm interested!"
  ];

  return (
    <div className="p-3 bg-gray-50 border-t border-gray-200">
      <p className="text-sm text-gray-600 mb-2">Quick replies:</p>
      <div className="flex flex-wrap gap-2">
        {quickReplies.map((reply, index) => (
          <Button
            key={index}
            variant="outline"
            size="sm"
            className="text-xs rounded-full"
            onClick={() => onSelectMessage(reply)}
          >
            {reply}
          </Button>
        ))}
      </div>
    </div>
  );
};

export default AutomatedMessages;