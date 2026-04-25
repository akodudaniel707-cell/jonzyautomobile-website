export interface Product {
  id: string;
  title: string;
  description: string;
  price: number;
  category: string;
  images: string[];
  location: string;
  condition: 'new' | 'used' | 'refurbished';
  createdAt: Date;
  adminId: string;
  isSold?: boolean;
}

export interface User {
  id: string;
  name: string;
  email: string;
  isAdmin: boolean;
  rating: number;
  avatar?: string;
}

export interface CartItem {
  id: string;
  productId: string;
  quantity: number;
  addedAt: Date;
}

export interface MediaAttachment {
  id: string;
  type: 'image' | 'video' | 'audio' | 'file';
  url: string;
  filename: string;
  size: number;
  duration?: number; // for audio/video files
}

export interface Message {
  id: string;
  senderId: string;
  receiverId: string;
  productId?: string;
  content: string;
  timestamp: Date;
  media?: MediaAttachment[];
  messageType: 'text' | 'voice' | 'media';
}

export interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  totalOrders: number;
  totalSpent: number;
  lastPurchase: Date;
  createdAt: Date;
}

export interface Order {
  id: string;
  customerId: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  customerAddress: string;
  items: { productId: string; productTitle: string; quantity: number; price: number }[];
  total: number;
  status: 'pending' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled';
  paymentMethod: string;
  paymentReference: string;
  createdAt: Date;
}

export interface BlogPost {
  id: string;
  title: string;
  content: string;
  type: 'article' | 'video';
  mediaUrl?: string;
  thumbnail?: string;
  author: string;
  createdAt: Date;
  views: number;
}

export const CATEGORIES = [
  'Vehicles',
  'Housing Property Rentals', 
  'Apartments for rent',
  'Electronics'
] as const;

export type Category = typeof CATEGORIES[number];
