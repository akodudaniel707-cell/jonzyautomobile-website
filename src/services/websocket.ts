interface ChatMessage {
  id: string;
  senderId: string;
  receiverId: string;
  content: string;
  timestamp: Date;
  type?: 'text' | 'image' | 'voice' | 'offer' | 'meetup';
  status?: 'sent' | 'delivered' | 'seen';
  metadata?: any;
  fileUrl?: string;
}

interface UserStatus {
  userId: string;
  isOnline: boolean;
  lastSeen: Date;
  isTyping: boolean;
}

type MessageHandler = (message: ChatMessage) => void;
type StatusHandler = (status: UserStatus) => void;
type TypingHandler = (data: { userId: string; isTyping: boolean }) => void;

class WebSocketService {
  private ws: WebSocket | null = null;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  private reconnectDelay = 1000;
  private messageHandlers: MessageHandler[] = [];
  private statusHandlers: StatusHandler[] = [];
  private typingHandlers: TypingHandler[] = [];
  private currentUserId: string | null = null;
  private isConnecting = false;

  connect(userId: string) {
    if (this.isConnecting || (this.ws && this.ws.readyState === WebSocket.OPEN)) {
      return;
    }

    this.isConnecting = true;
    this.currentUserId = userId;
    
    // For demo purposes, we'll simulate WebSocket with a mock implementation
    this.simulateWebSocket();
  }

  private simulateWebSocket() {
    // Simulate connection delay
    setTimeout(() => {
      this.isConnecting = false;
      console.log('WebSocket connected (simulated)');
      
      // Simulate receiving online status updates
      this.simulateStatusUpdates();
    }, 1000);
  }

  private simulateStatusUpdates() {
    // Simulate other users being online
    const mockUsers = ['seller-1', 'buyer-1', 'admin-1'];
    
    mockUsers.forEach(userId => {
      if (userId !== this.currentUserId) {
        const status: UserStatus = {
          userId,
          isOnline: Math.random() > 0.3,
          lastSeen: new Date(),
          isTyping: false
        };
        this.statusHandlers.forEach(handler => handler(status));
      }
    });
  }
  sendMessage(message: Omit<ChatMessage, 'id' | 'timestamp'>) {
    const fullMessage: ChatMessage = {
      ...message,
      id: Date.now().toString(),
      timestamp: new Date()
    };

    // Store message for persistence
    this.storeMessage(fullMessage);

    // Simulate message delivery
    setTimeout(() => {
      this.messageHandlers.forEach(handler => handler(fullMessage));
    }, 100);

    // Simulate delivery status updates
    setTimeout(() => {
      const deliveredMessage = { ...fullMessage, status: 'delivered' as const };
      this.messageHandlers.forEach(handler => handler(deliveredMessage));
    }, 1000);

    setTimeout(() => {
      const seenMessage = { ...fullMessage, status: 'seen' as const };
      this.messageHandlers.forEach(handler => handler(seenMessage));
    }, 2000);

    return fullMessage;
  }

  private storeMessage(message: ChatMessage) {
    // Store in localStorage for persistence
    const chatKey = `chat_${message.senderId}_${message.receiverId}`;
    const existingMessages = JSON.parse(localStorage.getItem(chatKey) || '[]');
    existingMessages.push({
      ...message,
      timestamp: message.timestamp.toISOString()
    });
    localStorage.setItem(chatKey, JSON.stringify(existingMessages));
  }

  loadChatHistory(userId1: string, userId2: string): ChatMessage[] {
    const chatKey1 = `chat_${userId1}_${userId2}`;
    const chatKey2 = `chat_${userId2}_${userId1}`;
    
    const messages1 = JSON.parse(localStorage.getItem(chatKey1) || '[]');
    const messages2 = JSON.parse(localStorage.getItem(chatKey2) || '[]');
    
    const allMessages = [...messages1, ...messages2].map(msg => ({
      ...msg,
      timestamp: new Date(msg.timestamp)
    }));
    
    return allMessages.sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime());
  }

  sendTypingStatus(receiverId: string, isTyping: boolean) {
    // Simulate typing indicator
    this.typingHandlers.forEach(handler => 
      handler({ userId: this.currentUserId!, isTyping })
    );
  }

  onMessage(handler: MessageHandler) {
    this.messageHandlers.push(handler);
    return () => {
      this.messageHandlers = this.messageHandlers.filter(h => h !== handler);
    };
  }

  onStatusUpdate(handler: StatusHandler) {
    this.statusHandlers.push(handler);
    return () => {
      this.statusHandlers = this.statusHandlers.filter(h => h !== handler);
    };
  }

  onTyping(handler: TypingHandler) {
    this.typingHandlers.push(handler);
    return () => {
      this.typingHandlers = this.typingHandlers.filter(h => h !== handler);
    };
  }

  disconnect() {
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
    this.currentUserId = null;
    this.isConnecting = false;
  }

  getConnectionStatus() {
    return this.ws?.readyState === WebSocket.OPEN ? 'connected' : 'disconnected';
  }
}

export const websocketService = new WebSocketService();
export type { ChatMessage, UserStatus };